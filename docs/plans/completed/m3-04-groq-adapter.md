# Integrate the fixed Groq generation adapter

> Privacy note: Personal directory prefixes in this archived plan have been replaced with `C:/projects/a11y-evidence-lab` and `C:/Users/developer` (or their backslash equivalents). These are illustrative aliases, including in recorded commands and errors. Artifact names, hashes and outcomes are unchanged; the aliases must not be used to authenticate original path-bound evidence or replay historical operations. For current setup, use the [local startup guide](../../DEVELOPMENT.md).

This ExecPlan is a living document. Maintain `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` as work proceeds. This document must be maintained in accordance with `PLANS.md`.

## Current state

- **Task:** [M3-04](../../DEVELOPMENT_ROADMAP.md#m3-04--integrate-groq-generation), Complete. The owner accepted M304-FIT-AMENDMENT-01 on 2026-09-11, resolving the original G2 decision stop. Actual Groq/Local calls, probes, acquisitions, later tasks and Git publication remain excluded.
- **Accepted entry and authority:** M304-ENTRY-02 preserves the existing Local implementation, ignored secret and frozen inputs. M304-FIT-ACCEPT-01 records the coordinated requirement, ADR and evaluation amendment. Local capacity remains separately Blocked in M3-03.
- **Remaining gates:** None for M3-04. G1–G4, A0/A/B, complete regression, independent strict/build, different final critical review and documentation closure pass.
- **Ownership and allowance:** No active lease. A and B each passed their sole S3 correction loop. B Red attempts 1–3 and Green attempts 1–2 close compliant; the narrow primary test exception is recorded and accepted. All 132 focused tests and independent strict pass. No agent replacement resets budgets.
- **Next action:** None within M3-04. M3-05 remains separately selectable; M3-03 capacity remains Blocked on its recorded prerequisites.

## Progress

- [x] (2026-09-11 20:48Z) Reviewed current roadmap, authority routes, M3-02/M3-03 handoffs, source/test seams and package baseline; accepted M304-ENTRY-01.
- [x] (2026-09-11 20:48Z) Passed independent strict TypeScript, 149 focused tests and thirteen frozen-reference hash checks without model calls.
- [x] (2026-09-11 21:00Z) Passed complete corrected planning-readiness review and documentation validation; M304-PLAN-REVIEW-01 records the evidence and limits.
- [x] (2026-09-11) Received exact-task execution authorization and passed refreshed strict/149-test/frozen-reference entry checks.
- [x] (2026-09-11) Completed both bounded critical reports and mandatory OWNER DIRECTION synthesis; primary accepted the precise G2 stop and corrected report discrepancies.
- [x] (2026-09-11) Accepted G1–G4 after corrected synthesis, fresh pre-draft and different final R3 PASS.
- [x] (2026-09-11) Accepted the reviewed Groq byte policy and applied its coordinated authority/evaluation amendments.
- [x] (2026-09-11) Accepted A0 shared byte admission after separate-owner Red/Green, independent strict and fresh S3 PASS.
- [x] (2026-09-11) Accepted A credential and exact-body preparation after 22 tests, independent strict and corrected S3 PASS.
- [x] (2026-09-12 UTC) Accepted B after 132 focused tests, independent strict and corrected S3 PASS; separate implementation ownership preserved.
- [x] (2026-09-12 UTC) Passed complete verification, different final integrated critical review and documentation closure; task Complete and plan archived.

## Surprises & Discoveries

- The current Local adapter is implemented but no real Qwen generation has occurred. [M303-C-BLOCK-01](m3-03-qwen-adapter-and-capacity-screen.md#m303-c-block-01--exact-remaining-capacity-prerequisites) identifies authentic supported retrieval and the reviewer interface as unresolved capacity prerequisites. Groq must not be treated as a workaround for either.
- `.gitignore` already contains `/.env`, and read-only checks confirm `.env` is ignored and untracked. This is not a selected loader, configured credential, or proof that any existing secret contents are safe; none were read.
- Shared Groq configuration and fit types exist, but fixture token limits/default identities are synthetic. Neither those values nor M3-03's Ollama-specific framing bound prove Groq input fit.

## Decision Log

- Decision: Plan only M3-04, preserving M3-03's Blocked state and all existing completion requirements. Rationale: M3-04 depends on completed M3-02, while M3-05 separately owns real eligible provider calls and the Generate interface. Date/Author: 2026-09-11 / primary.
- Decision: Reuse shared input, fit admission, execution, proposal validation and durable continuation; do not create a provider registry or refactor Local transport into a generic client. Rationale: the missing responsibility is one fixed external adapter, and the current Local transport has provider-specific semantics. Date/Author: 2026-09-11 / primary.
- Decision: Leave credential-parser, Groq accounting and native wire/lifetime literals unresolved at G rather than transferring synthetic or Local-only values. Rationale: workers must implement a reviewed contract, not choose security or identity semantics during Green. Date/Author: 2026-09-11 / primary.

## Outcomes & Retrospective

Authorized execution has completed bounded research and accepted the owner-approved Groq byte-admission amendment. G1–G4, A0, A and B are accepted. A credential and exact-body preparation pass 22 controlled tests, independent strict and corrected S3 re-review. B transport and service integration now pass 132 focused tests, independent strict and corrected S3 re-review. All 22 authoritative suites, independent strict, client build, different final critical review and documentation closure pass. No actual credential configuration or provider call is verified. Controlled adapter verification remains separate from M3-05's real integration and M6-02's six fixed evaluations.

A bounded read-only explorer supplied local code-seam facts during planning. Its assignment incorrectly used R0, whose repository route is primary-only. No decision or literal was delegated or accepted from that report; subsequent R0 inspection stays with primary. G retains its correctly routed future research budget rather than retrospectively reclassifying that dispatch.

## Purpose / Big Picture

Implement the one accepted Groq path for `openai/gpt-oss-20b` behind the existing application-owned generation boundary. An explicit eligible selected-Finding operation must produce either a candidate subsequently accepted by the shared proposal validator, or a bounded pre-call/attempted-call failure with truthful non-secret provenance. Missing credentials must not block scanning or create an invocation. Neither failure nor an ambiguous outcome may call Local, change model, or resubmit.

A reviewer will exercise deterministic credential, exact-envelope, transport, validation and actual service/repository boundaries using test-only doubles and owned local resources. This proves implementation mechanics, not that Groq produced a real proposal. The roadmap assigns the real eligible Local/Groq call and user interface to M3-05; no controlled result may be presented as that proof.

## Context and Orientation

### Authority and readiness

The [requirements index](../../PROJECT_REQUIREMENTS.md), [OD-025](../../requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-025--development-authorization-and-roadmap-governance), [roadmap authority key](../../DEVELOPMENT_ROADMAP.md#authority-location-key), [PLANS.md](../../../PLANS.md) and [agent workflow](../../../.codex/README.md) control selection and procedure. Read these exact task authorities before execution:

- [Generation provider execution](../../requirements/generation-provider-and-model-lifecycle/GENERATION_PROVIDER_EXECUTION.md): REQ-LLM-003–005, 007, 009, 015, 016, 019 and 021; retain shared REQ-LLM-008 context fit.
- [Privacy and security](../../requirements/quality-security-and-operations/PRIVACY_AND_SECURITY.md): REQ-SEC-005 and 013–016; retain 004, 021 and 027 for local embeddings, safe evidence and renderer isolation.
- [Installation and model lifecycle](../../requirements/generation-provider-and-model-lifecycle/INSTALLATION_AND_MODEL_LIFECYCLE.md): REQ-INST-017. No application-managed acquisition or provider-readiness subsystem.
- [ADR-0014](../../architecture/decisions/ADR-0014-groq-as-mvp-external-generation-provider.md), [ADR-0020](../../architecture/decisions/ADR-0020-manual-developer-managed-local-model-setup.md), [ADR-0023](../../architecture/decisions/ADR-0023-local-mode-data-boundary.md), [SPEC-004](../../specs/SPEC.feature) and [HS-009](../../specs/HARD_SPEC.feature): all named provider-mode, missing-prerequisite and attempted-failure scenarios.
- [M3-02 contract and closure](m3-02-shared-generation-stage.md), [M3-03 current implementation](m3-03-qwen-adapter-and-capacity-screen.md#m303-b-accept-01--accepted-internal-local-integration), [evaluation freeze](../../requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md#freeze-boundary), and its [controlled-input exception](../../requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md#controlled-generation-input-exception).

Applicable Must requirements and decisions have Accepted or explicit Deferred dispositions. No Proposed product choice is adopted here. M3-01 is Complete and its original manifest plus referenced inputs match at entry. The exception permits independently assembled support-complete inputs only for the six fixed generation executions; it cannot fabricate production retrieval or supply an extra M3-04 live smoke. M3-05 and M4-01 scheduling amendments remain unchanged and select neither task.

### Current implementation and terms

`src/server/generation/generation-contract.ts` defines `GenerationAdapter`, immutable configuration, prepared request and normalized outcomes. `generation-input.ts` assembles the canonical one-Finding package; `generation-artifacts.ts` owns production instructions, schema and fixed parameters. `generation-fit.ts` admits a reported fit but does not prove token accounting. `generation-stage.ts` owns the 120000-ms whole operation, exact request/configuration identity, a single-use `AttemptTransport` capability and shared proposal validation. An invocation begins only when that capability enters the actual transport-start thunk, including a synchronous transport failure; preparation is not an invocation.

`src/server/local-service/generation-operation.ts` and `LocalService.generateFinding` in `src/server/service.ts` already own live retrieval-to-generation continuation and selected-only durable publication. A saved `supported` record cannot reconstruct the required live owner after restart. Preserve [BUG-0001](../../bugs/bug-0001-generation-metadata-read-escape.md)'s accepted metadata/attempt regression coverage.

M3-03 added `ollama-generation.ts`, `ollama-generation-model.ts`, `ollama-generation-fit.ts` and `ollama-generation-http.ts`, plus three focused suites. Their provider-specific parser, metadata queries and framing proof are not Groq implementation literals. No Groq credential loader or transport is implemented. An OpenAI SDK is installed transitively but is not selected for this adapter. Normal startup has no Generate HTTP route or UI. Browser-reachable pure validators must not acquire privileged provider imports.

### M304-ENTRY-01 — planning evidence

Entry HEAD was clean `9c1581c536aa80b1616a9e86af7ce5520dc4f84a`, with 250 tracked paths. Fourteen roadmap tasks are Complete, M3-03 is Blocked and thirteen are Not started before this planning activation. This document activates only M3-04 planning, leaving twelve Not started. The prior M3-03 handoff records 550 passing tests across nineteen suites, independent strict/build and critical reviews; those are prior evidence, not newly run full-suite results.

Fresh primary execution used the unchanged README preparation and `Invoke-M105Command`, Node v24.20.0, independent `tsc --project tsconfig.json`, and the six existing suites in the current entry command below: all 149 tests passed. Original `evaluation/m301-generation-v1.json` SHA-256 is `63770583A97E1D0517337474DADC706C1047D78E026E22C7A745CE7674ED9E6B`; all thirteen recursively referenced path/SHA-256 pairs match. No frozen bytes were repaired or rewritten. `.env` ignore/untracked checks passed without reading or creating it.

The planning commit is historical evidence, not a future executable HEAD constant. On resumption record the then-current intentional HEAD, index, dirty-path inventory, active-lease state and source/test/package/input/environment fingerprints. Classify intervening edits and preserve unrelated work. A later documentation commit neither requires a dirty plan nor invalidates unchanged behavior automatically; each new lease and receipt must use its own exact baseline.

### M304-ENTRY-02 — execution authorization and preserved baseline

The owner explicitly authorizes exact M3-04 bounded research, primary-owned literal decisions, delegated A/B implementation, verification, existing-budget corrections and documentation closure. This supersedes planning-only authority without authorizing actual Groq/Local generation, provider probes, other tasks, commits, publication or pushing. The developer owns any real key; no value or secret digest is requested or read here.

Current HEAD is `9c1581c536aa80b1616a9e86af7ce5520dc4f84a`; staging is empty. The three modified planning-registration documents and the two untracked M3-04 plan/progress documents are the intentional owner-requested planning work and are preserved. No active lease exists. Primary reran the complete prepared entry caller: pinned Node v24.20.0, independent strict and all 149 focused tests pass. The original manifest and all thirteen referenced path/SHA pairs match. Package, lock and compiler configuration retain their accepted identities. Existing Local source/tests are unchanged. The 42-file sorted path/SHA fingerprint for `src/server/generation/**/*.ts` and `tests/**/*.ts` is `886791fa5411ea4e0ad3fe2a0f305f5e8091f971e490099b267c450819ba39c1`; Node binary SHA-256 is `5c976096e04e5c2c1f091938926234cc9fbebfe9787ddd149351b3b0ecc707b5`. No M303 fixture leaf remains. The ignored/untracked `.env` and its ancestors pass ordinary topology/single-link checks without opening its contents; no configured-key or loader-conformance claim follows. Entry fixtures remain bounded to the already accepted M303 ownership procedure.

### M304-G-DISCOVERY-01 — frozen research dimensions

One public non-ranking discovery pass found the current Groq model, strict Structured Outputs, reasoning and API-reference pages plus pinned Node documentation as primary evidence entry points. It contacted no provider API and acquired no runtime/tokenizer/dependency artifact. The fixed model and strict mode remain listed; discovery does not establish whole-request accounting or account availability.

The frozen comparison is: (1) selected-only bounded parsing of repository-root `.env`/`GROQ_API_KEY` versus native Node parsing applied only to bounded data from that same source; (2) exact local model/Harmony accounting with demonstrated Groq applicability versus a verified complete-request upper bound; (3) direct fixed native HTTPS versus only an already installed dependency demonstrated to satisfy the identical one-attempt/secret/cleanup contract. No additional secret file, provider, model, package or generic platform is selected. Primary will retain the smallest supported choice after evidence and reviews.

M304-G-R1 is one critical_researcher report on secret, egress, exact wire/error and lifecycle semantics. M304-G-R2 is one critical_researcher report on complete accounting and exposed configuration. They may run independently, each at most 1000 words plus necessary tables and one targeted follow-up. Reports distinguish confirmed facts, supported proposals, inferences and unavailable evidence; hard-gate failure and exact reversal evidence end that option's expansion. Both project I1-I7 and G1-G4 into the existing R3 contract. No file writes, secret reads, generation/probes, package/tokenizer acquisition or environment mutation is authorized. Public source/documentation reads and bounded no-write local inspection are allowed. Primary then synchronizes reports for mandatory decision_analyst synthesis; no A/B preflight or lease precedes accepted G.

### M304-G-R2 — accounting evidence and primary triage

The accounting researcher completed its initial bounded investigation and reported BLOCKED at G2/I4. Primary accepts this as a precise evidence gap for synchronization, not a provider impossibility claim or permission to narrow fit. The unaffected G1/G3 report continues; mandatory analyst synthesis may assess the complete stop/owner-direction outcome after both reports arrive, rather than draft an unsupported G contract. No targeted follow-up is spent without new evidence capable of reversing the gap.

Current [Groq model documentation](https://console.groq.com/docs/model/openai/gpt-oss-20b) and [catalog](https://console.groq.com/docs/models) list 131072 context and 65536 completion tokens; [Structured Outputs](https://console.groq.com/docs/structured-outputs) lists strict support. Thus a proven complete input count or upper bound N would require N + 4096 <= 131072. Those facts establish limits, not a method for calculating N. The inspected [API reference](https://console.groq.com/docs/api-reference) and targeted official-documentation search do not establish a complete tokenizer/rendering/schema/prefix accounting contract or counting endpoint. This finding is limited to the inspected sources.

The two frozen candidates fail the same applicability boundary: OpenAI's public [gpt-oss tokenizer](https://github.com/openai/gpt-oss/blob/main/gpt_oss/tokenizer.py) and [Harmony renderer](https://github.com/openai/harmony) specify local open-weight behavior, not Groq's deployed transformation; a byte bound on transmitted JSON does not bound unspecified provider-added input. Reverse exact counting with authoritative Groq-applicable rendering/counting semantics for every component; reverse an upper bound with an authoritative finite bound over the admitted input domain. Installing a tokenizer or observing one live output cannot alone supply either proof. No new package or provider call is proposed.

The [reasoning documentation](https://console.groq.com/docs/reasoning) distinguishes hidden returned reasoning from disabling reasoning. Low effort is not a numeric budget or guaranteed final-answer allocation. [OpenAI compatibility](https://console.groq.com/docs/openai) documents conversion of wire temperature 0 to 1e-8; future exposed-default identity must report that transformation while preserving frozen wire controls. Unknown private server revision may remain null under M302, but cannot fill the independent counting gap. G2 is unaccepted; no A/B preflight or write lease is open. This report consumes the first accounting report only, preserving its single targeted follow-up and all implementation allowances.

### M304-G-R1 — credential and wire evidence

The initial secret/wire researcher returned RESEARCH COMPLETE on 2026-09-11. Its evidence supports bounded selected-only parsing rather than bare Node `parseEnv`, and describes a fixed native HTTPS candidate. These are proposals awaiting complete G acceptance, not an implemented loader or transport. Analyst inspection corrected the report's client-dependency absence claim: the lockfile and installed package both contain transitive OpenAI SDK 7.10.0. Its default two retries conflict with the fixed single-attempt boundary, but configurable behavior leaves suitability unresolved; presence and suitability must be assessed separately before a future transport selection. No transport candidate is accepted on the basis of the incorrect absence claim. The remaining targeted follow-up is unused.

Pinned [Node v24.20.0 util](https://raw.githubusercontent.com/nodejs/node/v24.20.0/doc/api/util.md) documentation and synthetic in-memory probes establish that native parsing alone accepts duplicate selected keys and syntax outside the proposed strict boundary. The proposed parser reads only the root `.env` selected key, imports no environment, applies bounded UTF-8 and syntax checks, and separates missing prerequisites from unsafe or invalid configuration. Ordinary path, single-link and descriptor checks require a trusted local filesystem assumption; they do not prove race-free rejection of hostile replacement or every Windows reparse form. No real secret was read, and no configured-key claim follows.

Pinned [HTTP client](https://raw.githubusercontent.com/nodejs/node/v24.20.0/lib/_http_client.js), [agent](https://raw.githubusercontent.com/nodejs/node/v24.20.0/lib/_http_agent.js), [HTTPS](https://raw.githubusercontent.com/nodejs/node/v24.20.0/lib/https.js) and [HTTP lifecycle](https://raw.githubusercontent.com/nodejs/node/v24.20.0/doc/api/http.md) sources support a fresh `agent:false` fixed-destination request without environment proxy configuration. Debug logging needs an explicit secret-exposure guard. Request destruction and timeout events do not prove resource close or remote cancellation; future controlled tests must observe request, response and assigned sockets, and reject uncertain cleanup before publication.

The [Groq API](https://console.groq.com/docs/api-reference), [Structured Outputs](https://console.groq.com/docs/structured-outputs) and [errors](https://console.groq.com/docs/errors) sources support the proposed closed request and bounded response categories. [Spend limits](https://console.groq.com/docs/spend-limits) specifically identifies HTTP 400 with `error.code` equal to `blocked_api_access`; it does not establish a broader quota-code vocabulary. Authentication 401 and rate limit 429 remain distinct; error prose must not be retained or used to guess a category. Primary corrected the report's proposed schema-name typo against accepted M302 L2: the unchanged wire schema name is `m301_proposal_v1`, not the report's `m302_proposal`. This is authority reconciliation, not a contract change.

G1/G3 have useful evidence, while their implementation proof and G4's complete commands/effects remain pending. G2's complete-accounting gap still prevents the combined G contract from passing. No A/B preflight, implementation, package acquisition or provider call follows this report.

### M304-G-STOP-01 — complete accounting evidence required

Primary accepts the initial mandatory decision_analyst result OWNER DIRECTION on 2026-09-11. Both frozen accounting candidates lack decisive provider applicability: public local-tokenizer behavior is not evidence of Groq's deployed rendering, and transmitted JSON size does not bound unspecified provider-added input. The inspected sources do not establish the needed complete method. This is an evidence gap, not proof that Groq cannot supply one. Rejecting every request would preserve zero-call safety but would not deliver the requested usable adapter.

The exact stop follows G's instruction: "If no defensible method is established within the budget, stop that branch for direction" and its decide-now rule that a missing fit method cannot be deferred as runtime proof. Accepted REQ-LLM-008/019 and M302 L3 remain unchanged. A key, provider-reported usage after dispatch, an arbitrary margin or a successful sample cannot supply the missing pre-call guarantee. No additional live call or tokenizer acquisition is proposed.

| Invariant | Stop disposition |
| --- | --- |
| I1 completeness/authority | G is unaccepted; no partial contract, implementation or task-completion claim. |
| I2 freeze/identity | Entry identities remain preserved; accounting identity/applicability and drift semantics remain unresolved. |
| I3 secret/egress | G1/G3 proposals retain trusted-local-filesystem and string-erasure limits; no secret read or accepted loader. |
| I4 complete fit | Blocked on authoritative complete counting semantics or a verified finite bound for all admitted components plus the 4096 reserve. |
| I5 attempts/recovery | Shared contract remains authoritative; exact Groq mechanics and controlled resource-close proof are pending. |
| I6 durable isolation | Existing service ownership remains intact; Groq-specific controlled persistence proof is pending. |
| I7 evidence/ownership | No write lease or A/B preflight; command/effect freeze, separate owners and implementation reviews remain pending. |

G1/G3 research is retained as provisional evidence. The analyst corrected the installed-dependency absence claim and primary corrected the schema-name typo, as recorded above. Transport ranking still needs a complete comparison if G resumes; neither the native client nor the transitive SDK is selected. G4 cannot be finalized as an executable caller until the missing mechanism is known. No remaining in-scope implementation can pass the explicit combined-G-before-A/B barrier.

**Concrete information request, not sent:** For Groq Chat Completions using `openai/gpt-oss-20b` with strict JSON Schema response format, what supported pre-request counting procedure, or guaranteed finite upper bound, covers the complete model input: both messages, system instructions, the response schema, chat framing, assistant prefix and any provider-added tokens? Please identify tokenizer/rendering versions or an equivalent applicability guarantee, treatment of Unicode and escaping, and how changes are signaled so a client can reserve 4096 completion tokens within the documented 131072-token context without truncation. A post-request usage total alone does not satisfy this pre-call requirement.

The smallest external input is authoritative Groq documentation or support confirmation answering that question. Sending it to another party requires explicit owner authorization; no message has been sent. The owner can supply the evidence directly or authorize a named contact route. At this stop no fit-contract amendment had been drafted or accepted. The subsequently authorized M304-FIT-AMENDMENT-01 below is Proposed and does not yet change this governing boundary. Once decisive new evidence arrives, primary checks source/version applicability and uses the existing targeted follow-up and analyst correction before any DRAFT READY/pre-draft checkpoint. This does not renew budgets automatically.

Both initial critical reports and one analyst report are consumed. The two individual targeted follow-ups and one analyst correction remain available; no useful new reversal query was identified in the current sources. The fresh final R3 stop-answer review below covers this handoff only, with at most one supported stop-answer correction. It is not a G pre-draft or final-literal approval and cannot consume or stand in for future G or implementation reviews. No A/B allowance has been used.

Documentation impact: Updated the owning plan, roadmap, plan index and progress record/index to record the evidence boundary. Existing setup/API/command instructions, requirements, ADRs, source, tests, dependencies, original evaluation inputs and other task states remain unchanged. Fresh entry strict/149 tests are the available execution evidence; the complete suite/build and implementation reviews were not rerun because no implementation exists. Final stop review and proportional documentation/preservation checks passed as recorded below; this closes the stop handoff only, not the task.

### M304-G-STOP-REVIEW-01 — accepted stop handoff

Fresh `critical_research_reviewer` returned PASS with no Blocker, Major or Minor for the complete five-document stop packet and proposed owner handoff. The reviewed plan SHA-256 is `60da62ccc3d396f64bcf0e1db078b2abec142c90040d0c819962ed2bbb3583c6`; this receipt and review-pending pointer reconciliation are non-normative additions, not a replacement candidate identity. Primary accepts the stop review only. G2 and M3-04 remain Blocked; no G literal, implementation, requirement amendment or future review is accepted by this verdict.

All I1-I7 were reviewed, with I4 explicitly unresolved rather than scored as passing implementation. The reviewer independently reproduced all five artifact identities, the original manifest and thirteen referenced hashes, unchanged Verification text, protected source/test/configuration preservation, HEAD, empty staging, absent active lease, ignored/untracked secret status and `git diff --check`. It independently rechecked the cited Groq model/API/strict documentation and confirmed the transitive SDK correction. It reused primary's strict/149-test entry and documentation evidence; no additional test, fixture, provider call or secret read occurred. No overlooked in-scope route to passing G2 was found.

Primary's candidate checks passed five UTF-8/final-newline/whitespace inspections, 213 local links/anchors, one PowerShell fence parse, the 29 pre-existing lines containing Verification, and the exact three tracked registration changes plus two task documents. The review consumes one initial final stop checkpoint and no correction; both research follow-ups, the analyst correction, future G contract reviews and A/B allowances remain as recorded. The primary reconciliation retains the unsent information request, provisional G1/G3 evidence and no-call boundary. Documentation impact is limited to these five task/status documents.

### M304-FIT-PROPOSAL-01 — owner-authorized requirement review

The owner authorizes review of the Groq token-fit requirement and preparation of a concrete alternative for approval. This authorizes a Proposed amendment only, not acceptance, application code, provider contact/calls, credentials, acquisition, changed evaluation inputs or resumed A/B implementation. M3-04 and the existing G2 remain Blocked. This is a newly authorized question about changing the contract; it does not reset the original G research or implementation budgets.

**Decision Review Contract:** Target a Proposed Groq-only fit-policy amendment in this existing plan, with exact candidate semantics, requirement wording, affected-owner/source/test map, tradeoffs, verification, migration and approval boundary. R3 applies because pre-call admission, accounting identity, durable failure truth and a previously Accepted guarantee are material. Existing reports and stop review remain evidence for the current guarantee's unresolved applicability; repeat no broad search for the same missing proof.

Frozen candidates: retain the guaranteed complete-count contract and wait for authoritative provider evidence; introduce a clearly labeled local tokenizer estimate with an explicit margin and provider rejection; or introduce a deterministic serialized-request byte budget with honest non-token semantics and provider rejection. No candidate may call an estimate or byte budget a verified complete input bound. Compare applicability, clarity of the accepted risk, bounded complexity/dependencies, full-payload preservation, failure/provenance behavior, and ability to implement a usable fixed-model adapter. No numerical score is required.

Hard gates P1-P7: (P1) Proposed only until owner accepts precise changes, Local and frozen evaluation bytes unchanged; (P2) all current minimized evidence, instructions and schema stay intact, no silent truncation; (P3) fixed model/strict schema/4096 completion controls and no added provider call/probe/retry/fallback remain; (P4) check remains deterministic before dispatch with honest dimensions, version and limits, without claiming complete provider accounting; (P5) actual provider rejection is one attempted failure, safe bounded category and no raw error retention; (P6) mode/configuration/fit identity and durable validity cannot conflate Local proof with Groq policy; (P7) exact authority and implementation/test impact, residual uncertainty, approval and later-proof boundaries are explicit.

Budget: primary maps current authorities and code; one critical_researcher report (at most 1100 words plus evidence table) covers hosted-admission alternatives, provider overflow semantics and risk, with one targeted follow-up. One mandatory decision_analyst synthesis plus one bounded correction; after DRAFT READY, one fresh critical_research_reviewer pre-draft checkpoint plus one supported outline correction; primary drafts, then a different fresh critical_research_reviewer final review, maximum two supported correction cycles. No drafter or implementation worker. All roles are read-only; public primary-source access and ordinary repository inspection are allowed, no secret contents/digests, dependency acquisition, model calls, test fixtures or mutations. Repeated decisive gaps or expanded scope return to primary/owner, with no automatic budget reset.

Primary may use deterministic no-write inspection of public controlled input/artifact sizes solely to select an explicit application policy bound. Such size evidence is not a provider token guarantee or observed generation result. Unknown provider-added input remains an acknowledged residual risk under either relaxed candidate. The full accepted authorities remain effective until an owner-approved coordinated amendment.

### M304-FIT-EVIDENCE-01 — synchronized proposal evidence

The single critical report returned RESEARCH COMPLETE. It provisionally favors a whole serialized-body byte budget over a tokenizer estimate: the former measures an application-owned quantity without a tokenizer dependency or unsupported token guarantee. Keeping the original guarantee remains the strongest protection but retains the current evidence stop. The report's public sources, checked 2026-09-11, are the [Groq model page](https://console.groq.com/docs/model/openai/gpt-oss-20b), [Structured Outputs](https://console.groq.com/docs/structured-outputs), [API reference](https://console.groq.com/docs/api-reference), [errors](https://console.groq.com/docs/errors) and [Responses guide](https://console.groq.com/docs/responses-api). Chat request fields inspected do not establish a complete accounting formula or truncation control. Responses documentation cannot supply a Chat field. Generic HTTP 400/413 documentation does not establish a context-overflow discriminator; unknown attempted rejections remain bounded `provider` failures, without error-prose inference.

Primary performed one no-write size inspection using pinned Node v24.20.0 with compile caching disabled, current shared instructions/schema/Groq controls, the unchanged three controlled input JSON files, exact two-message assembly and a proposed closed Chat body with `m301_proposal_v1`. One outer `JSON.stringify` produced 15266, 16659 and 17321 UTF-8 bytes respectively for informative-image-alt, form-input-label and text-contrast. The original manifest and all thirteen referenced hashes match. These aggregate sizes establish only that a candidate 65536-byte application envelope accommodates the controlled packages without changing them. They are neither model observations nor a context-fit guarantee, and select no real request or new fixture file.

Primary authority/code mapping identifies a coordinated requirement change, not an adapter-only workaround. REQ-LLM-008 needs distinct Local proof and Groq policy semantics; REQ-LLM-019 must reference that distinction; ADR-0020 requires a dated normative amendment, not a clarification. BHV-03 in the evaluation requirements, SPEC-003's universal pre-call fit scenario and HS-008's gate must distinguish a local budget rejection from an attempted provider rejection. M302 L3 remains historical accepted behavior; a later accepted amendment would add a dated cross-reference and own the forward change in M3-04 rather than rewrite prior evidence or reopen completed M3-02. M3-04 G/I4, path permissions and verification must then be reconciled. The frozen evaluation manifest does not contain the accounting method literal; accepted implementation configuration must identify the byte policy before any model output, preserving original bytes, the six cases and failed-case interpretation. Any material later change remains subject to REQ-EVAL-005/007.

Only `generation-contract.ts` and `generation-fit.ts` currently own shared accounting/report types and validation. `generation-stage.ts` already rechecks configuration and fit identity immediately before its single native-entry capability. `domain/run-contract/generation-validation.ts` intentionally rejects an attempted `input-fit` failure; mapping an actual context/body-size rejection to existing `provider` / validation `not-run` preserves this truth without a durable-schema change. Existing compact invocation adapter/version identity can bind the future fixed byte policy without persisting request contents, counts or a new configuration record. The fixed Groq adapter must measure the exact private serialized string it dispatches; a valid shared report alone cannot establish this correspondence.

The researcher's 65536-byte literal is explicitly an application-policy choice, not a Groq limit or a conversion from 131072 context tokens. Its risk is both occasional rejection and unverified hosted transformation: the application can preserve its complete payload, but schema-valid output cannot prove the server consumed every input token. Owner approval must accept that narrower guarantee explicitly. P1-P7 remain the analyst and fresh review packet. No proposal is accepted or application code changed.

### M304-FIT-SYNTHESIS-01 — frozen amendment outline

The initial mandatory analyst returned DRAFT READY for a Proposed amendment only. Primary accepts synthesis readiness with the following complete outline for fresh pre-draft review; this does not approve a requirement or pass G. The researcher's targeted follow-up and analyst correction remain unused.

- Recommend C: exact complete serialized-body measurement under a 65536-byte inclusive application cap, with no token-fit guarantee. A retains the unavailable guarantee; B adds estimation/tooling without a demonstrated hosted-accounting advantage. Residual risk includes rejection and unobservable hosted transformation/truncation, even when output is schema-valid.
- Serialize the closed Chat body once from the exact shared two messages, schema, name `m301_proposal_v1`, routing and fixed controls; measure that private string's UTF-8 bytes, excluding transport headers, and dispatch it unchanged. No trimming, repair, extra field, reserialization or requested provider truncation.
- Groq-only accounting branch: method `serialized-byte-budget`, implementationVersion `m304-groq-request-bytes-v1`, tokenizerIdentity null, maxRequestBytes 65536, contextTokenLimit 131072 and outputTokenLimit 65536. The token limits are sourced metadata, not byte-cap arithmetic. Factory fixes this profile; no user knob or automatic adjustment.
- Byte fit report: `{accounting,serializedRequestBytes,requestedOutputTokens:4096,contextTokenLimit,outputTokenLimit}`. Keep token reports and their `reservedOutputTokens` unchanged. Require positive safe integer bytes <=65536, exact accounting reference/limits, separate output-capacity check >=4096, closed mutually exclusive shapes and no negative zero. Never compare byte counts with token limits. Local rejects the byte method.
- Preserve configuration/reference error precedence, with invalid/missing byte accounting or overflowing cap failing `input-fit` before invocation. An otherwise unclassified attempted 400/413 remains `provider` / invocation `provider` / validation `not-run`; retain established auth/rate/exact-quota mappings. No error-prose interpretation, raw body retention, new durable field or attempted `input-fit`.
- Draft exact coordinated wording for REQ-LLM-008/019, a dated normative ADR-0020 amendment, BHV-03, Local-qualified SPEC-003 plus Groq budget/provider-rejection cases, and mode-specific HS-008. No separate ADR is needed for this bounded validation change. Preserve M302's history with a forward amendment link only after approval; reconcile M304 G/I4 and protected path/command permissions before implementation.
- If accepted, add one shared compatibility slice before Groq A/B: shared contract/fit types and validation plus tests; preserve Local runtime behavior, permitting only necessary type narrowing in its model/fit modules. Separate test/code owners and fresh S3 review apply. Exact lease packet/commands/budget must be prepared before preflight, and complete accepted G remains prerequisite. No stage/domain rewrite is justified. Existing A/B budgets do not increase automatically.
- Verification must cover whole-body correspondence, 65536/65537 boundaries, Unicode/escaping, wrong/mixed methods, identity drift, zero-call rejections, one-attempt provider failure/persistence and unchanged Local regressions. Preserve original frozen inputs/schema/controls/six cases/failure interpretation; bind policy in configuration before output inspection. Update README capability wording after implementation and apply proportional documentation closure. Later changes follow REQ-EVAL-005/007.

P1-P7 and existing I1-I7 remain the full review packet. Current owner authorization ends at preparation of the reviewable proposal; acceptance, coordinated authority edits and shared/adapter implementation require the subsequent concrete owner decision.

### M304-FIT-PREDRAFT-01 — accepted drafting checkpoint

Fresh `critical_research_reviewer` returned PASS without findings for the complete frozen outline at plan SHA-256 `4891f34ec021a304cfdde2126db914d4c83afc810139d609b00746d38ea69aee`. All P1-P7 and cumulative I1-I7 pass for drafting readiness. The reviewer reproduced Git/status/lease and source-contract facts, independently checked the cited provider limits/error semantics, and reused controlled-size/frozen-input evidence. It ran no tests, fixtures or provider call and read no secret. Primary accepts this checkpoint only; the following amendment remains Proposed and requires a different fresh final review and owner acceptance.

### M304-FIT-AMENDMENT-01 — proposed Groq request admission

**Status: Accepted by the owner on 2026-09-11 after final independent review PASS.** This accepted amendment changes Groq's input-admission guarantee. Combined G must still pass before implementation. Local's proven context-fit behavior, fixed provider/model, output contract, generation controls and six evaluation cases remain unchanged.

#### Accepted decision

Adopt a fixed **65536-byte (64 KiB) UTF-8 limit on the complete Groq JSON request body**. An otherwise eligible request at or below that inclusive limit may make its one actual provider attempt. A larger body fails locally without a call. The application sends the full admitted content and never shortens it to pass this policy.

This is an application request-size policy, **not a token count, estimated token count, verified token bound or Groq service limit**. The 65536-byte choice is an explicit engineering envelope. The three unchanged controlled bodies measure 15266, 16659 and 17321 bytes; their inclusion establishes practical room for those cases only. A request that passes may still be rejected by Groq. The policy may also reject a request Groq could have handled.

The owner accepts that the application cannot prove Groq's internal transformation or consumption of every supplied input. Schema-valid output does not prove absence of provider-side truncation. The application neither truncates its body nor asks the provider to truncate it, but it makes no guarantee about unobservable hosted processing. Existing semantic review and output validation remain necessary and do not remove this limitation.

Keeping the existing complete-proof requirement is the stronger alternative and retains the present evidence stop. A local tokenizer estimate with a margin adds tooling and another approximation without demonstrating a stronger guarantee for Groq's deployed processing. These are the reasons for recommending the direct byte policy; no provider comparison or generalized support claim follows.

#### Exact policy and shared contract

| Field or boundary | Accepted value or rule |
| --- | --- |
| Accounting method | `serialized-byte-budget`, permitted only with the fixed Groq context; existing exact/verified token methods remain supported |
| Policy identity | `implementationVersion: m304-groq-request-bytes-v1`; `tokenizerIdentity: null` |
| Application body limit | `maxRequestBytes: 65536`, inclusive, fixed by the Groq factory with no user setting or automatic adjustment |
| Provider metadata | `contextTokenLimit: 131072`, `outputTokenLimit: 65536`, from the cited model documentation; these token values never enter byte-cap arithmetic |
| Requested output | Existing `max_completion_tokens: 4096` and all other frozen controls remain; this is neither guaranteed context reservation nor final-answer allocation |
| New closed fit report | `{accounting, serializedRequestBytes, requestedOutputTokens:4096, contextTokenLimit, outputTokenLimit}` |
| Existing token report | Unchanged `{accounting, inputTokens, reservedOutputTokens:4096, contextTokenLimit, outputTokenLimit}` |

The new accounting object has exactly `method`, `implementationVersion`, `tokenizerIdentity`, `maxRequestBytes`, `contextTokenLimit` and `outputTokenLimit`, with the fixed values above. It and the fit report are immutable. Byte reports require a positive safe integer byte count <=65536, reject negative zero, and bind the exact configuration accounting reference and token metadata. Check that the documented output capacity accommodates 4096 separately. Reject mixed/extra/missing fields, copied accounting, invalid limits and a byte method in Local mode. Existing configuration/reference-error precedence remains; byte accounting/report failure is `input-fit`. No byte value is stored in `inputTokens`, and no byte report claims `reservedOutputTokens`.

Construct the closed Chat body using the unchanged model routing, exact shared system/user messages, strict `response_format` with schema name `m301_proposal_v1`, full shared schema and all fixed controls. Serialize once; measure that exact private string in UTF-8, excluding transport headers. The same string must reach native dispatch without reserialization, added fields, normalization, repair or trimming. The body and credential remain operation-private. Existing configuration/reference checks run immediately before the single transport entry. Controlled adapter tests must prove measured-versus-sent correspondence; a valid shared report alone cannot prove it.

No raw body, byte count or new policy record is added to durable invocation data. The fixed adapter version identifies its bound policy; the non-secret evaluation configuration records that policy before outputs are inspected. A changed policy, body mapping or material defaults needs a new bound configuration/version and the existing affected-evidence disposition. Unknown hosted changes remain unobservable; no automatic discovery or adjustment is introduced.

#### Failure and preservation behavior

Missing/invalid byte accounting, an invalid fit report or a body over 65536 bytes fails before transport as `input-fit`, with no ProviderInvocation and no abstention. Configuration/reference errors retain their existing precedence. Credential handling and other eligibility checks remain independent gates.

An actual request rejected with an otherwise unclassified HTTP 400 or 413 is a bounded `provider` failure, with invocation outcome `provider` and validation `not-run`. Do not infer a context-overflow subtype from error prose or label every 400/413 a token failure. Preserve authentication 401, rate limit 429 and the narrowly supported HTTP 400 plus exact `blocked_api_access` quota mapping. Existing timeout, cancellation, cleanup and persistence precedence remain. No raw provider error material is retained.

This uses the existing durable contract: an attempted request must not become a no-invocation `input-fit` failure. Completed scan, minimized evidence and sibling Findings remain intact. There is no retry, fallback, model switch, extra probe or added evaluation execution. A later user attempt still requires an ordinary new PageAnalysisRun.

#### Exact coordinated authority changes after acceptance

These reviewed replacement texts were applied to their canonical owners on 2026-09-11; M304-FIT-ACCEPT-01 records the acceptance.

**REQ-LLM-008 replacement** (retain its ID and Must priority; record the dated owner amendment and update planned verification to mode-specific admission boundaries, preservation, attempted-failure and no-retry checks):

> Before each eligible selected-Finding generation request, the application must apply the selected mode's deterministic input-admission check. Local must establish complete context fit for the full messages, instructions, output schema and protocol/template overhead, including the required output reservation. Groq must enforce its fixed, versioned UTF-8 serialized-request-body byte policy before dispatch; passing that policy does not establish complete provider token accounting, guaranteed context fit or provider consumption of every supplied input. The application must preserve all admitted required evidence, guidance, citations, instructions, schema and controls without silently truncating or removing content to pass a check. A failed pre-call check must fail the selected FindingWorkflow with a content-safe limiting-capability reason and no provider invocation; it is not evidence-sufficiency abstention. An actual provider rejection is an attempted bounded failure. Completed scan, sibling Findings and retained minimized evidence remain available. Any later attempt uses the ordinary new-PageAnalysisRun flow.

**REQ-LLM-019 final-sentence replacement** (all preceding attempt-time/no-probe requirements remain):

> The mode-specific deterministic input-admission protection in REQ-LLM-008 still runs before the actual request.

**ADR-0020 dated normative amendment** (append after owner acceptance, preserving the original decision and subsequent history):

> The deterministic pre-request check is now mode-specific under amended REQ-LLM-008. Local retains complete context-fit proof. Groq enforces a fixed, versioned complete-request-body byte policy while preserving the admitted application payload; it does not claim complete hosted token accounting, guaranteed context fit or verified consumption of every input. The owner accepts the possibility of explicit provider rejection and unobservable hosted transformation or truncation. Actual rejections retain attempted provenance and bounded failure handling. No setup, probe, retry, provider-selection, disclosure, credential, output-validation or Local-mode boundary changes follow.

**BHV-03 final-clause replacement** in the evaluation requirements (preserve the rest of the row and references):

> Required Local input that cannot fit its full token budget, or Groq input that fails its fixed byte-admission policy, fails before invocation without abstention. An admitted Groq request can still fail at the provider and then retains attempted-call provenance.

**SPEC-003 change:** qualify the existing pre-call non-fitting-input scenario as Local. Add two Groq scenarios: a complete otherwise eligible body above the byte cap fails `input-fit` before invocation while preserving scan/evidence/siblings; a complete otherwise eligible admitted body rejected after the one actual request fails with bounded attempted provenance and no retry/fallback. Both use the same accepted schema, model, payload and per-Finding eligibility. A local boundary test additionally proves exactly 65536 admitted and 65537 rejected.

**HS-008 change:** title the rule "Evidence sufficiency and mode-specific input admission gate every model call" and replace its universal fit clause with:

> And required Local input that fails complete context fit or Groq input that fails its fixed serialized-request byte policy fails before invocation with a content-safe reason and is not recorded as abstention
> And admitted Groq input has no guaranteed hosted token fit or verified complete consumption, and an actual provider rejection remains an attempted bounded failure

No new requirement ID or separate ADR is needed for this bounded validation amendment. Update requirement traceability/navigation where materially affected. Add a dated forward-amendment link at completed M302 L3 after acceptance, preserving every original contract/evidence claim as history and retaining M3-02 Complete. Reconcile the M3-04 G2/I4 contract, source/test permissions, command slots and current-state references before implementation; proposal acceptance alone does not pass combined G.

#### Accepted forward disposition of the frozen evaluation definition

**This is part of the accepted owner amendment; Groq fit semantics change.** The canonical authority now contains a dated normative "Groq admission amendment to the frozen generation definition" in `EVALUATION_AND_ACCEPTANCE.md`, linking this decision. It governs future Groq evaluation together with the original `evaluation/m301-generation-v1.json`, SHA-256 `63770583a97e1d0517337474dadc706c1047d78e026e22c7a745ce7674ed9e6b`. Preserve that original file and all thirteen referenced inputs byte-for-byte. The explicit forward disposition is:

| Original manifest field | Groq-only forward meaning after owner acceptance |
| --- | --- |
| `controls.groq.omittedControls` | Replace only its obligation to bind "context-fit evidence" with binding evidence for the fixed `m304-groq-request-bytes-v1` serialized-byte policy, complete measured-versus-sent body correspondence and its disclosed lack of hosted token-fit/consumption proof. All actual explicit/omitted generation controls and other provenance obligations remain unchanged. |
| `failures.prerequisiteOrFit` | Missing selected-mode prerequisites still fail before a request. For Groq, invalid byte-policy admission or a body over 65536 bytes fails before request without truncation; a body admitted by that policy may reach Groq and be rejected there. That rejection follows unchanged `failures.attemptedCall`, retains bounded attempted provenance and fails the case. The original Local complete-fit/output-reservation meaning remains unchanged. |
| `downstreamProofs` entry with `task: M3-04`, `proof` | Replace Groq "context fit" proof with proof of this exact application byte-admission policy and unchanged complete body at native dispatch. Keep fixed adapter/API configuration, documented exposed defaults, current exact-model availability and honest unknown server internals. No hosted fit or complete-consumption proof is claimed. |
| `downstreamProofs` entry with `task: M3-02`, `proof` | Preserve its original shared-stage verification as history; future Groq byte compatibility is the new M3-04 A0 proof, not a claim that the old M3-02 tests established byte admission. Local's existing token-fit proof stays unchanged. |

The dated evaluation-authority amendment must explicitly state that these forward Groq meanings take precedence over the corresponding original fit phrases for future evaluation only. All unaffected manifest fields continue to govern. Record the original manifest identity, accepted amendment reference and fixed policy identity together in the task/evaluation configuration before any affected model output is inspected; do not add them to durable invocation fields or retrospectively relabel evidence.

This forward amendment is appropriate to the recorded current state: no Local or Groq model output has been inspected for these six executions. Verify that condition before acceptance is applied. If affected output has already been inspected, stop and follow the existing successor-manifest/new-evidence rule instead of applying this disposition retrospectively. The proposal changes the Groq pre-call fit guarantee and the timing/category of a possible rejection; it preserves original file bytes, controlled case definitions, model/schema/generation controls, exactly six executions, no-call abstention/prerequisite rules, and the rule that any failed or invalid actual response fails its case. No request, retry, cap adjustment or input rewrite is authorized by this disposition.

#### Implementation, verification and acceptance boundary

After owner acceptance and complete G, introduce **A0 — shared admission compatibility** before existing A/B. The source owner may change `generation-contract.ts` and `generation-fit.ts`; only necessary type narrowing is permitted in `ollama-generation-model.ts` and `ollama-generation-fit.ts`, with unchanged Local runtime behavior. The test owner adds the new admission/identity/mode cases in `generation-stage.test.ts`, and only necessary type narrowing in `ollama-generation-contract.test.ts`. Any further path needs primary contract reconciliation before a lease. Existing stage sequencing, durable validators, invocation schema, prompt/schema artifacts and Local transport behavior need no redesign.

A0 uses separate test/code owners, one preflight, applicable Red-Green-Refactor, the existing maximum three write attempts per unchanged role/phase chain with the conditional third-attempt rule, and a fresh S3 review with one supported review-correction loop. G4 must bind its exact callers, paths, protected tests, evidence identities and fixture effects before preflight; this proposal grants no executable lease. Existing A/B and final integrated-review budgets remain unchanged. Original G report/follow-up budgets also remain distinct from this proposal route.

Acceptance tests must establish: exact cap/cap-plus-one behavior; whole-body schema/control inclusion; UTF-8/escaping and valid Unicode measurement; malformed/mixed token-byte reports and Local byte-method rejection; copied/mutated configuration and fit rejection before native entry; unchanged measured-versus-sent body; zero-call local failures; one attempted provider failure with truthful persistence; no raw error/credential retention; and unchanged Local token-fit and service regressions. A0 and adapter slices each receive their required focused/strict checks and independent reviews. The complete authoritative suite, independent strict TypeScript and build remain task-closure obligations after implementation.

Original manifest/reference bytes, case inputs, output schema, generation controls, six-case count and failure-as-failed-case interpretation remain unchanged. The original Groq fit obligations are superseded for future use only by the explicit owner-approved forward disposition above; they are not described as unchanged. Bind the original manifest, accepted amendment and byte-policy configuration before inspecting any model output. REQ-EVAL-005/007 governs subsequent material changes and new evidence; this amendment authorizes no actual Groq/Local call. Current body sizes are feasibility evidence for an application limit only. If later evidence or fixed-case failure makes the policy unsuitable, stop for a recorded decision instead of silently increasing the cap or changing input.

**Accepted scope:** The owner approved this exact policy, disclosed risks, coordinated amendments and bounded A0 scope. Existing M3-04 execution authorization continues through reconciled G and guarded A0/A/B. No actual provider call or later task is included. The historical proposal and review receipts below retain their original checkpoint claims.

### M304-FIT-FINAL-01 — reviewed proposal ready for owner decision

The different fresh `critical_research_reviewer` returned PASS on complete correction-cycle-1 re-review at plan SHA-256 `7cb368ca3b57a572ee0d2a4e9d61a5dc0276aa81c8716cbf42c98b0bcaa406f6`. No Blocker, Major or Minor remains. The initial Major M304-FIT-FINAL-M1 required explicit forward disposition of the original manifest fit clauses; primary supplied that disposition, and all P1-P7/I1-I7 were re-reviewed. The reviewer confirmed that the conditional pre-output route respects the evaluation freeze; affected outputs already inspected would instead require the existing successor-manifest/new-evidence route.

Primary accepts readiness to present the Proposed decision only. The 65536-byte policy, requirements, dated ADR/evaluation amendments and A0 scope remain unaccepted until the owner decides. G and M3-04 remain Blocked, and no lease or application change follows this receipt. The risk of provider rejection and unobservable hosted transformation/consumption remains explicit.

The final reviewer reproduced both corrected artifact hashes, three unchanged companion hashes, exact Git inventory, empty staging, absent lease and `git diff --check`; it reused the independently verified original manifest/thirteen references, source-boundary inspection, public-source checks and controlled-size evidence. Primary checks pass five UTF-8/final-newline/whitespace inspections, 216 local links/anchors and one preserved PowerShell command fence. Accepted requirements, source, tests, dependencies, frozen bytes and the ignored/untracked secret remain unchanged; no new test, fixture or provider call is claimed.

This proposal route consumed one critical report, one analyst synthesis, one fresh pre-draft checkpoint and a different final review with one supported correction cycle. Research follow-up and analyst correction were unused; one final correction cycle remains only if needed under the existing scope. Original G and implementation allowances remain separately recorded. Receipt/current-pointer/status-summary edits are non-normative reconciliation of the reviewed candidate, not a replacement for its recorded identity. Documentation impact: Updated this plan, its progress record, roadmap and navigation summary; no canonical requirement, ADR, evaluation file or application code was edited.

## Scope and Non-Goals

Included: fixed Groq configuration; one service-only ignored secret source; complete non-truncating byte-admission proof; exact strict-output request mapping; bounded HTTPS exchange and response/error mapping; internal shared-stage/service consumption; non-secret evaluation configuration and developer instructions; task verification and closure.

Excluded: new providers/models, generic endpoints/headers/protocols, SDK or schema framework by default, framework migration, shared HTTP platform, configurable model selection, startup probes, model-list API discovery, readiness reports, retries/backoff/fallback, streaming, tools, batch/chat, hosted embeddings/tracing, credential UI/vault/rotation system, actual provider calls, Generate HTTP/UI, proposal review, retrieval changes, Qwen capacity, six-case execution and release claims. No new package is presumed necessary. Any evidenced package need must return to G with exact version, necessity, install/restore effects and approval boundary before setup, not appear in a worker's Green patch.

## Plan of Work

### G — freeze only the missing Groq contract

Primary-owned decision work; TDD not applicable. Use the Decision Review Contract below. The smallest proof is the existing strict schema and shared validators plus focused credential/wire/fit/transport/service tests. Compare a direct fixed native request against an existing dependency only if it actually satisfies the same boundary; do not evaluate additional providers or build custom proof infrastructure before checking a bounded direct/offline procedure.

Freeze G1–G4 in this plan before A/B preflight. Unknown decision semantics block the dependent slice; testable implementation proof follows Green, not the other way around.

| Literal | Decide before implementation | Prove afterward |
| --- | --- | --- |
| G1 secret | Exact local source/path and variable, ordinary-path rules, encoding/parser/duplicate/empty/control-character handling, read timing, absence/read-error mapping, maximum bound, no environment-wide import or secret logging, shortest official setup instruction | Synthetic sentinel only: exact ignored/untracked source, no browser/request-body/run/log exposure, no invocation on missing/invalid/read failure; pre-existing developer material untouched |
| G2 configuration and fit | Fixed Groq model/base/completion path, adapter/default identities, exposed revision policy, unchanged M302 parameter/schema versions; accepted exact-body byte accounting including messages, instructions, schema and controls; separate context/output metadata and drift rejection | Non-ASCII/escape/body boundary cases, separate 4096-output capacity, exact-reference binding; invalid/overflowing byte accounting fails before transport without truncation |
| G3 wire and lifetime | Exact closed request/header envelope and JSON serialization point, strict schema name, fixed HTTPS destination/TLS, redirect/proxy behavior, bounded response handling, exact request-entry/abort/deadline/settlement semantics and status/envelope/error mapping | Native-boundary tests, single attempted entry, no redirects/retries/fallback, observed terminal resource cleanup, late-result rejection and bounded durable failure categories |
| G4 commands and closure | Exact A/B exports/files, complete callers and test fixture ownership, all expected mutations/cleanup, evidence fingerprint and final command inventory; implementation versus later real-provider evidence | Actual diff and cohesion, independently strict checks, protected inputs/tests, compliant leases, current complete suite/build, explicit limitations and documentation closure |

Do not assume a byte heuristic proves Groq framing, copy Ollama's bound, use provider-reported usage after dispatch as pre-call proof, or block forever merely because Groq does not expose private server revisions. Resolve the complete supported accounting method and documented exposed limits using primary sources. If no defensible method is established within the budget, stop that branch for direction; do not introduce tokenizer acquisition or a new custom evaluator silently.

The existing ignored `.env` is a candidate, not a loader selection. Once G1 is selected, primary confirms exact ignore/untracked and ordinary-path status before any real credential is configured. A developer configures their own key only after that barrier under execution authorization; never request its value in chat or place it in commands, receipts or tracked examples. Implementation/negative verification can proceed using synthetic credentials without a real key. Ignore-control changes, if genuinely needed, belong to primary between leases; worker leases cannot modify ignore controls.

### A — admit a service-owned Groq request safely

TDD applicable; S3 for secret handling, serialization and accounting identity. Preflight by `test_worker` classifies the concrete missing exports after G. It owns `tests/groq-generation-contract.test.ts` and, only if needed, `tests/helpers/m304-groq-fixture.ts`. Separate `code_worker` owns the proposed production paths below. Both path sets are finalized at G, before lease opening.

| Production path under `src/server/generation/` | Responsibility and fit | Direction and disposition |
| --- | --- | --- |
| `groq-credential.ts` | Read only the selected service-side secret source, returning private transport credential or a closed setup failure; distinct filesystem/security responsibility | Native filesystem to adapter only; bounded creation, no browser or domain imports back into it |
| `groq-generation-configuration.ts` | Fixed admitted non-secret model, adapter, parameters and accounting identity | Reuse shared types/constants; bounded Groq configuration, not a registry |
| `groq-generation-fit.ts` | Admit and serialize the shared request with the complete reviewed byte policy | Shared request/configuration to inert body/fit; bounded pure creation, no I/O or token service |

Observable result: only an admitted unchanged minimized request can yield an inert strict-output body with proven application byte admission; missing/invalid credentials/configuration, unknown/overflowing fit or identity drift make zero transport attempts. The secret never enters that body or public configuration. Preserve required guidance and the application schema rather than repairing inputs. Test sentinel leakage, Unicode and escaping, context edges, immutable controls and strict schema fields.

Permitted refactor is local helper organization inside these declared responsibilities only. A cannot change shared contracts or Local modules; only A0 has the explicit compatibility scope. Corpus, evaluation bytes, service and client remain protected. Advance only after accepted unchanged-test Green, independent strict checking, cohesion/test-surface audit, compliant terminal receipts and fresh critical review.

### B — execute once and integrate the real adapter boundary

TDD applicable; S3 for external egress, request ownership, cleanup and publication. Reuse A evidence while identity remains unchanged. `test_worker` owns `tests/groq-generation.test.ts`, `tests/groq-generation-service.test.ts` and the same optional task fixture helper. Existing A tests remain protected; a needed correction returns to the test owner and invalidates affected evidence.

`code_worker` owns `src/server/generation/groq-generation-http.ts` for the fixed native HTTPS exchange, transport-only authentication, response admission and resource settlement, and `src/server/generation/groq-generation.ts` for thin `GenerationAdapter` composition using A. The factory supplies inert preparation/dispatch to the existing shared stage; the stage retains attempt and proposal authority. Dependency direction is service caller → Groq factory → A preparation/native transport → fixed Groq origin. Pure domain/browser code never imports this branch. No generic transport extraction, duplicate validator or production service change is presumed necessary; the existing explicit `generateFinding(input, adapter)` seam is sufficient. A demonstrated missing service edge returns to primary for exact-contract reconciliation before any edit.

Tests must cover exactly one response candidate and strict returned-value validation; malformed/missing/multiple/truncated/refused/tool/reasoning-only output; authentication, quota, rate limit, network, provider and response-validation failures; synchronous request-start throws, abort/deadline at preparation/dispatch/response/settlement, incomplete cleanup and late success. Freeze exact mappings at G rather than guessing them in tests. Provider bodies, error messages, headers or echoed credentials cannot become diagnostics/provenance. No automatic Local call or second HTTP request occurs, even after 429/5xx or ambiguous completion.

Controlled service tests use actual service/repository behavior with test-owned supported retrieval and fake native provider responses. Prove live-owner requirements, persisted running and terminal states, attempted versus pre-call provenance, sibling/scan preservation, failure-to-persist behavior and closed admission on uncertain cleanup. Test doubles remain test-only; do not write these outcomes into developer runs or label them actual retrieval/Groq observations. Nonvisual internal integration adds no client route, Generate control or disclosure UI; those remain M3-05.

Permitted refactor is local helper organization in the two B modules. Advance after focused A+B regressions, independent strict/build where affected, test/fixture and cohesion audit, compliant receipts and fresh critical review. Primary then updates maintained instructions and performs complete authoritative verification and different final integrated critical review.

### Agent workflow and budgets

Apply [worker-first workflow](../../../.codex/execplan-implementation-workflow.md), [ADR-0024](../../architecture/decisions/ADR-0024-milestone-slice-tdd-with-independent-ownership.md) and [write leases](../../../.codex/write-lease-guard.md). Every preflight/write receives Milestone Assignment Packet v2 with this responsibility contract and exact current identities. One lease per worktree; separate sequential test and code owners. Primary opens/closes leases, inspects actual diff and evidence, and writes documentation only between leases. Workers are not alone, must preserve peer/user edits and use Git read-only. Role TOMLs retain their model/effort pins.

Each A0/A/B slice permits one preflight, one coherent Red or passing characterization, one Green/optional behavior-preserving Refactor, and the workflow's maximum three write attempts per unchanged role/phase chain (initial, ordinary correction, conditional final correction). Attempt three requires the recorded progress/new-evidence justification; no agent replacement resets it. One review-correction loop per slice. Stop after the same decisive failure twice without new evidence, two no-diff handoffs, binding-field drift or exhausted allowance. A fresh critical reviewer covers each S3 slice; a different fresh critical reviewer covers final integration. Do not repeat unchanged complete suites at every handoff.

For genuinely absent first exports, ADR-0024's first-module Red exception requires verified environment, exact missing-callable failure and complete bounded behavioral tests; report assertions not executed. Green must execute every accepted test unchanged and pass independent strict checking. Planning/secret-path inspection and final documentation have no fabricated Red. No setup worker is required unless G establishes an actual non-behavioral setup need with its own bounded packet.

## Decision Review Contract

Identity `M304-G`; target is G1–G4 in this plan, not a new ADR or architecture selection. R3 is triggered by credential isolation, custom request accounting/serialization, identity and native request recovery. One non-ranking discovery pass may identify primary sources and viable local mechanisms; no candidate is ranked or adopted before this contract's candidate/evidence fields are frozen. The original exact-counting and verified-bound candidates are historical stopped options. The current comparison retains the selected-only root `.env` parser versus native parsing, and fixed native HTTPS versus the installed SDK under the same boundary. G2 now binds the explicitly accepted serialized-byte-budget policy and A0 compatibility; it does not reopen the original token-proof requirement or add an alternative provider/package.

Hard gates: preserve all named Accepted requirements, M301/M302 contracts and current Local behavior; exclude secrets from model-visible and retained data; no generation/probes/acquisition during research; prove accepted mode-specific pre-call admission without application truncation; one fixed destination/model/attempt; bounded categories and terminal ownership; no synthetic real-provider claim or extra evaluation call. Common criteria are contract completeness, source/version applicability, adverse-case proof, present-scope implementation effort and reuse. Hard-gate failure disqualifies an option rather than being traded against convenience. No ranking score or public support claim is needed.

Budget: at most two `critical_researcher` reports, one for secret/egress/wire/error/lifetime semantics and one for complete input accounting/exposed configuration. Each capsule allows one targeted follow-up and at most 1000 words plus necessary evidence tables. Primary synchronizes evidence; mandatory `decision_analyst` gets one synthesis and one bounded correction. After `DRAFT READY`, use fresh `critical_research_reviewer` for the pre-draft contract checkpoint with one supported outline correction; primary authors the literals, then a different fresh instance reviews the complete artifact. No drafter is needed. Final decision-artifact correction ceiling is two cycles with the whole invariant packet repeated. Repeated decisive gaps, changed scope or exhausted budgets return to primary/owner; they do not authorize more research or tools automatically.

Decide now: G1–G4 semantics, candidate disposition, source applicability, complete commands/effects and adverse-case expected results. Prove later: actual implementation, native controlled transport behavior, credential non-leakage, service persistence and required real provider evidence at its roadmap owner. A private server revision may remain unavailable with honest non-secret provenance; a missing fit method or unknown cleanup semantics may not be deferred as runtime proof. Required artifact outputs are the selected literals, rejected alternatives with concise reasons, exact evidence references, unresolved owner decisions, full command bindings, invariant disposition and next barrier. Research/review reports never accept an ADR or expand authorization.

| Invariant | Trigger and expected result | Current evidence / responsible review |
| --- | --- | --- |
| I1 completeness/authority | G1–G4 and all task Verification clauses covered; planning/implementation/evaluation remain distinct | Authority map above; G analyst and both research checkpoints, final implementation reviewer |
| I2 freeze/identity | Changed manifest, request/config references or adapter defaults cannot reuse old proof | Entry hashes; G accounting review then A/B critical reviewers |
| I3 secret/egress | Missing/invalid source, sentinel echo, redirected destination or extra metadata never leaks or silently proceeds | Accepted G1/G3; A/B negative/native tests and critical reviews pass; README documents selected ignored setup |
| I4 mode-specific admission | Groq measures and sends the identical full body under its accepted 65536-byte policy; output capacity is checked separately; Local complete token fit is preserved | Accepted M304-FIT-AMENDMENT-01; A0/A byte/reference tests and critical reviewers; hosted fit/consumption remains unproved |
| I5 attempts/recovery | At most one native start; abort/error/late success cannot invent no-call or successful cleanup/publication | Shared M302 boundary; B adversarial tests and critical review |
| I6 durable isolation | Exact live owner, selected-only transition; failed persistence and uncertain cleanup preserve truth | Shared service/BUG-0001 regression plus B tests; critical reviewers |
| I7 evidence/ownership | Exact commands, compliant leases, test/source separation, preserved developer resources and honest controlled/live labels | G4, primary actual-diff review and different final critical reviewer |

A0/A/B implementation proofs and corrected critical reviews pass; the complete 22-suite regression, independent strict and build pass. Different final critical review and documentation closure pass. Re-run every affected invariant after a material contract or implementation correction. A reviewer PASS covers its exact artifact and evidence, not implementation permission or roadmap completion.

## Concrete Steps

Working directory for every command is `C:/projects/a11y-evidence-lab`. In each PowerShell caller load only the complete definitions block under [README development command preparation](../../../README.md#development-command-preparation), unchanged, and execute the selected Node command inside `Invoke-M105Command`. Do not replay adjacent install, restore, cleanup or historical task commands. Propagate every native exit before dependent work.

Current entry validation commands (the Git/ignore checks are read-only; the focused service suite has the controlled effects described below):

```powershell
git status --short
if ($LASTEXITCODE -ne 0) { throw 'M304 Git status failed' }
git rev-parse HEAD
if ($LASTEXITCODE -ne 0) { throw 'M304 HEAD read failed' }
git check-ignore -- .env
if ($LASTEXITCODE -ne 0) { throw 'M304 candidate secret path is not ignored' }
$m304TrackedSecret = @(git ls-files -- .env)
if ($LASTEXITCODE -ne 0 -or $m304TrackedSecret.Count -ne 0) { throw 'M304 secret path tracking check failed' }
# After loading the maintained preparation in this same caller:
Invoke-M105Command {
  & $m105Node --version
  if ($LASTEXITCODE -ne 0) { throw 'M304 runtime check failed' }
  & $m105Node node_modules/typescript/bin/tsc --project tsconfig.json
  if ($LASTEXITCODE -ne 0) { throw 'M304 strict TypeScript failed' }
  & $m105Node --test --test-reporter=dot --test-timeout=120000 tests/run-contract.test.ts tests/generation-contract.test.ts tests/generation-stage.test.ts tests/ollama-generation-contract.test.ts tests/ollama-generation.test.ts tests/ollama-generation-service.test.ts
  if ($LASTEXITCODE -ne 0) { throw 'M304 entry tests failed' }
}
```

Expected now: ignored `.env`, no tracked `.env`, pinned Node v24.20.0, strict PASS and 149 passing tests. The existing `tests/ollama-generation-service.test.ts` creates unique ordinary `temp/m303-generation-*` leaves, writes synthetic run aggregates, starts owned ephemeral loopback services and probes their ports after stop. Its `withBox` cleanup settles services, checks refused connections and ordinary contained paths, then removes only its own leaf; uncertain cleanup preserves that leaf and fails. Entry execution left no matching leaf. These are bounded test effects, not mutation-free inspection or real runtime/provider requests. Read-only worker preflight reuses fresh accepted evidence or runs only safe inspection; it must not replay this fixture-creating suite under a no-write assignment.

A clean future tree is allowed; intentional documentation dirt is allowed only after classification, never as a hard-coded required path list. Check `logs/agent-flow-leases/v2/active.json` existence read-only; an existing pointer requires guard reconciliation before edits. It was absent at planning entry. Never print a secret's value or digest. Compare the original manifest identity and all referenced path/hash pairs; missing or changed inputs stop dependent work rather than triggering automatic recovery.

Future commands below are deliberately unresolved until G freezes the complete actual caller, exports and fixture effects. They are not execution permission or commands to run against missing files:

| Command slot | Required binding before its first effect |
| --- | --- |
| Secret prerequisite | Exact selected source and ignore/tracking/topology checks; developer-only creation procedure, no real key in command text; whether any ignore change is needed; preserve existing file; no automated overwrite/deletion |
| Offline accounting | Exact read-only source/artifact proof caller, version/hash, domain and expected result; any required acquisition or generated output needs separately resolved permission, location, mutation/retention and cleanup before use |
| A focused | Prepared Node `--test --test-timeout=120000 tests/groq-generation-contract.test.ts`; independent strict command above; synthetic secret/transport fixtures with exact owned temporary leaves and teardown |
| B focused | Prepared Node `--test --test-timeout=120000 tests/groq-generation-contract.test.ts tests/groq-generation.test.ts tests/groq-generation-service.test.ts`; affected existing generation/service/Local regressions; independent strict and build |
| Complete verification | Maintained README's full current suite inventory, adding actual new suites, sequential scratch/browser ownership and explicit native failure propagation; exact client-build preparation and owned output replacement/cleanup |
| Closure | `git diff --check`, current endpoint preservation, links/anchors, UTF-8/final newline/trailing whitespace, PowerShell parsing, role/lease/test/source consistency and documentation reconciliation |

Tests use synthetic credentials and injected native boundaries or exclusively owned ephemeral local fixture endpoints, never api.groq.com or Ollama port 11434. No TLS bypass or configurable endpoint enters production to accommodate tests. Proposed test-created ordinary leaves are under `temp/m304-groq-*`; G binds the actual creation, containment, finally cleanup and failure-preservation procedure before leases. Stop/settle owned service/socket resources before removing only owned leaf data. Build and existing browser suites use maintained README instructions, not a new runner. No bootstrap or restore is needed for the current installed baseline; if G establishes a necessary dependency, freeze exact bootstrap/lock mutations, clean-restore preparation, dependency location and cleanup before a separate setup lease.

## Validation and Acceptance

Map every M3-04 Verification item to A/B tests, secret-path evidence or current documentation inspection. Missing credential means zero native start and no invocation plus content-safe official setup guidance; an attempted authentication/quota/rate-limit/network/provider/validation failure has exactly one bounded invocation. Preserve the exact model context, one-Finding payload, required strict schema, shared proposal validation and no Local fallback. Include explicit negative inspection of outbound body/auth boundary and retained records, not merely type compatibility.

Before each handoff inspect the actual diff, responsibility cohesion, accepted-test hashes, fixtures/mocks/skips/focused markers, exact command and environment identity, cleanup and terminal compliant lease receipt. Reuse only complete fresh command/working-directory/relevant-tree/environment/no-drift identities; mutable filesystem/native evidence is non-reusable unless its isolated run state is pinned. Passing tests or a worker report alone are insufficient. Risk-critical native reproduction remains required during S3 review.

The complete authoritative suite and independent strict/build run at task closure, with all nineteen current suites plus actual M3-04 suites. No real key or actual provider call is required to exercise synthetic failure branches. Current fixed-model availability, strict support and deprecation documentation must be checked before evaluation, with account limits confirmed by the developer without sharing credentials. A catalog page is not proof of account access. M3-04 closes on its mapped implementation Verification and documentation gate; M3-05 owns the real eligible calls, whose absence must remain explicit in M3-04's implementation-only capability claim. The [real-integration rule](../../DEVELOPMENT_ROADMAP.md#temporary-substitutes-and-real-integration-rule) forbids reporting controlled tests as proof that Groq actually works. No additional M3-04 live call is required or authorized by this plan; do not invent a synthetic model probe or borrow the six-case exception.

Primary applies the [documentation closure gate](../../README.md#task-closure-documentation-gate), updating only materially affected owners: this plan, roadmap, plan/progress indexes, task progress, maintained README setup/API/commands and capability summaries where implementation changes them. Requirements/ADRs change only for a separately accepted decision. No task Complete or archive until its Verification and documentation gate pass; no automatic M3-05 activation.

## Idempotence and Recovery

Read-only Git, hashes and syntax checks can repeat without changing state. Focused tests may repeat only with unchanged accepted commands and their isolated cleanup contract; never repeat a real provider request automatically. Fresh evidence invalidates only the affected boundary, not unrelated accepted tasks. An intentional commit requires baseline reconciliation, not replacement of every historical hash.

On lease violation, unexpected path, secret exposure risk, failed cleanup or changed binding contract, stop the affected writer, terminally reconcile its lease and preserve work. Primary triages between leases; no reset, checkout, broad deletion or automatic restoration. Never delete or overwrite an existing developer `.env`, model/runtime, run store or another task's artifacts. Ignored resources are outside guard containment and require the explicit ownership checks above. Secret exposure would require owner-led revocation/rotation; do not reproduce the value in a defect report.

Unavailable Groq, schema incompatibility or unproved accounting is a bounded failure or decision stop, not permission to change model, widen egress, weaken the schema, truncate or add retries. Research/implementation allowance exhaustion follows the existing workflow and does not renew on resumption. M3-03's real capacity and M3-05's live eligibility/interface blockers remain their owners' responsibilities.

## Artifacts and Notes

Planning artifacts are this plan and its [progress record](../../progress/m3-04-groq-adapter.md), with roadmap/index registration. Preserve G decisions, source dates, concise command outcomes, exact assignment/terminal-lease identities and evidence fingerprints here; never copy raw payloads, credentials, ignored inputs, transcripts or telemetry into tracked files.

### M304-PLAN-REVIEW-01 — accepted planning readiness

The fresh `critical_reviewer` returned PASS for the complete corrected plan SHA-256 `545F38A58DD477D0DAE17D173218CF2AA8F5E4E7994B055948AD78BD46ABD67E` and four companion activation/index/progress documents. I1–I7 and proposed responsibility placement pass with no remaining Blocker, Major or Minor. One supported correction made the existing entry suite's temporary filesystem/service effects explicit and barred its use in mutation-free worker preflight. The same bounded review also confirmed M3-04's implementation-only completion and M3-05's real-call ownership; no extra model call or requirement change was introduced.

The reviewer independently reproduced the original manifest and all thirteen referenced hashes, protected source/test/package/configuration preservation, absent active lease, zero retained entry fixture leaves, PowerShell syntax and `git diff --check`. Primary's fresh strict/149-test results were reused. Primary documentation checks passed five files, 211 local links/anchors and one PowerShell fence before this receipt; final receipt reconciliation passed 213 local links/anchors and the same remaining checks. All 247 non-target tracked paths retain their entry hashes, and all 29 roadmap Verification lines remain unchanged. Only the roadmap, two indexes and two new task documents changed; no production, test, dependency, secret or frozen-input change occurred.

Primary accepts planning readiness only. G remains unresolved and execution is not authorized by this review. Documentation impact: Updated this plan, its progress record, roadmap and plan/progress indexes; no requirement, ADR or other task status changed. The receipt and current-state/progress reconciliation are non-normative and do not replace the reviewed candidate hash or invalidate its unchanged planning contract.

Public non-ranking discovery on 2026-09-11 found that Groq's [Structured Outputs documentation](https://console.groq.com/docs/structured-outputs) still lists `openai/gpt-oss-20b` for strict mode and requires all properties and closed objects. The [model page](https://console.groq.com/docs/model/openai/gpt-oss-20b) and [error reference](https://console.groq.com/docs/errors) are G evidence entry points, not frozen transport/accounting decisions. Before evaluation also check [models](https://console.groq.com/docs/models), [deprecations](https://console.groq.com/docs/deprecations), [rate limits](https://console.groq.com/docs/rate-limits) and [data handling](https://console.groq.com/docs/your-data). This web documentation access sent no project evidence or credential to a model and creates no runtime availability, price or retention guarantee.

## Interfaces and Dependencies

The completed adapter implements the existing `GenerationAdapter` contract and is supplied explicitly to `LocalService.generateFinding`. Production requests consume the shared application-owned messages/schema and fixed `GROQ_PARAMETERS`: temperature 0, top-p 1, maximum completion 4096, low reasoning, omitted reasoning, nonstreaming and one response. The exact API model is `openai/gpt-oss-20b`; accepted base is `https://api.groq.com/openai/v1`. G freezes the completion envelope and complete accounting without modifying this product selection.

Existing pinned TypeScript/Node and LangChain composition remain in place. The G-approved source modules and tests above are implemented with distinct credential, configuration, request-admission, native-transport and adapter-composition responsibilities. No browser module receives provider/credential authority, no new app-wide schema/HTTP/tokenizer framework is selected, and no current shared contract or dependency pin is reopened implicitly.

## Revision note

2026-09-11: Created the owner-requested M3-04 planning-only ExecPlan from current shared/Local implementation, preserving M3-03's blocked capacity and later real-call ownership. Added the missing secret/fit/wire decision barrier, two cohesive guarded TDD slices, exact-command slots, evidence limits and documentation closure route. No implementation or provider call performed.

2026-09-11: Accepted independent planning-readiness PASS after explicitly documenting entry-test effects and firm task-specific completion ownership. Recorded the bounded R0 dispatch deviation, corrected current-state/progress and completed documentation/preservation checks without changing G or implementation authority.

2026-09-11 / primary: Recorded exact execution authorization, fresh preserved entry and the non-ranking discovery/frozen research dimensions. Activated only the existing bounded G research route; no implementation lease, secret read or provider call occurred.

2026-09-11 / primary: Accepted mandatory OWNER DIRECTION synthesis for the complete-accounting evidence gap, preserved provisional research with two factual corrections, and reconciled the Blocked status without accepting G or opening implementation.

2026-09-11 / primary: Accepted fresh final R3 stop-review PASS, reconciled review pointers and completed the documentation-only handoff. G2 and M3-04 remain Blocked pending the named authoritative evidence.

2026-09-11 / primary: Recorded owner-authorized review and Proposed alternative preparation under a separate bounded research contract; no accepted requirement or implementation authority changed.

2026-09-11 / primary: Accepted DRAFT READY and fresh pre-draft PASS, then authored the concrete Proposed byte-admission amendment with exact semantics, authority replacements, risk and A0 scope. Final review and owner acceptance remain pending.

2026-09-11 / primary: Applied the sole initial final-review Major, M304-FIT-FINAL-M1, by explicitly dispositioning the retained manifest fit clauses for owner-approved forward use. Original bytes and failed-case semantics remain preserved; Groq fit obligations are no longer described as unchanged. Complete re-review is required.

2026-09-11 / primary: Accepted complete final re-review PASS after the manifest-disposition correction and reconciled the proposal handoff. The concrete policy is ready for owner decision; G and M3-04 remain Blocked until the required acceptance and gates.

### M304-FIT-ACCEPT-01 — owner acceptance and canonical reconciliation

On 2026-09-11 the owner accepted the complete independently reviewed amendment, disclosed hosted-processing/rejection limits, explicit frozen-definition forward disposition and bounded A0 scope. Primary applied the reviewed texts to REQ-LLM-008/019, ADR-0020, BHV-03 and its dated evaluation amendment, SPEC-003 and HS-008; completed M302 L3 links forward without changing its historical acceptance. No Local or Groq output from the six frozen executions exists in the recorded current state. The original manifest SHA-256 `63770583a97e1d0517337474dadc706c1047d78e026e22c7a745ce7674ed9e6b` and all thirteen referenced input identities still match; none was rewritten. Future evaluation binds that manifest, the dated amendment and `m304-groq-request-bytes-v1` before output inspection. This resolves the original G2 requirement stop, not the remaining combined G review. Source, tests, dependency pins and real secret contents are untouched. Documentation impact: canonical admission semantics and scenarios amended; M3-04 current status returns to In progress with A0 added; M3-03 remains Blocked.

### M304-G-OUTLINE-02 — synchronized contract for corrected synthesis

The synchronized outline reconciled the owner-accepted byte amendment with original R1's sole targeted follow-up, now consumed. Mandatory corrected synthesis returned DRAFT READY and the fresh pre-draft checkpoint passed; the primary-authored contract below now requires different final review. R2's original complete-accounting gap is resolved by the explicit changed guarantee, not new tokenizer proof. Native Node HTTPS and a selected-variable parser are selected candidates. Native dotenv parsing permits duplicate/looser syntax; the installed transitive OpenAI SDK can disable retries but needs a custom native bridge to match the same closed headers and resource observation, adding a wrapper without present benefit. Neither alternative is intrinsically impossible; neither adds useful proof here. Node sources and Groq references in M304-G-R1/R2 remain the primary evidence, checked 2026-09-11. A read-only local seam inventory confirms the existing stage has no prepared-dispose hook and no credential I/O helper; it supplied no new architectural authority.

### M304-G-CONTRACT-01 — authored Groq adapter contract

Primary authors the following complete G1–G4 literals from M304-G-OUTLINE-02 after M304-G-SYNTHESIS-02 and fresh pre-draft PASS WITH FOLLOW-UPS. The sole follow-up corrected a stale pending-analyst pointer; no behavioral literal changed. These task-owned decisions implement the Accepted authority/amendment and remain pending different final G review before any implementation preflight or lease. The candidate rationale and source provenance immediately above govern these literals; G4's complete callers below are part of this same contract.

#### G1 — selected credential grammar and lifecycle

The exact developer setup wording for maintained README closure is: "Create your own API key using the [Groq quickstart](https://console.groq.com/docs/quickstart), then set the single `GROQ_API_KEY=` entry in the existing repository-root `.env`. Confirm that `.env` is Git-ignored and untracked before adding the key. Preserve other local content and never paste the key into chat or tracked files." The official quickstart/key-creation route was checked on 2026-09-11; this repository uses its selected file loader rather than the quickstart's process-environment setup. Missing-key outcome remains the existing `missing-prerequisite` code; no new UI/API text surface is added in M3-04, and no real key is required for its tests.

The sole source is repository-root `.env`, resolved from `new URL('../../../', import.meta.url)` in `src/server/generation/groq-credential.ts`, independent of current working directory. Only `GROQ_API_KEY` is selected; never load the process environment or accept a configurable path. Existing ignore/untracked and ordinary-path evidence is retained; all implementation tests inject synthetic I/O, never read or hash the real file.

Read at most 65537 bytes to detect a file over the 65536-byte inclusive limit. Fatal UTF-8 decoding permits one initial BOM. Lines use LF or CRLF; reject remaining CR, NUL and control characters other than horizontal tab. Ignore blank lines, full comments and unrelated variable names. After leading spaces/tabs, permit optional `export` followed by spaces/tabs, then read an identifier `[A-Za-z_][A-Za-z0-9_]*`. Exact `GROQ_API_KEY` must be followed by optional horizontal whitespace, `=`, optional horizontal whitespace and its value; a recognized identifier with malformed assignment fails. Prefix names such as `GROQ_API_KEY_EXTRA` are unrelated. Count every recognized selected assignment before value validation; duplicates fail even if identical or empty.

Values are unquoted, single-quoted or double-quoted on one physical line. Quoted values require the matching closing quote; trailing content is only horizontal whitespace and an optional `#` comment. In an unquoted value `#` starts a comment and outer horizontal whitespace is removed. No escape processing, interpolation or continuation occurs; `$` is literal. A nonempty selected value contains at most 4096 visible ASCII characters U+0021–U+007E excluding either quote and backslash, and no embedded whitespace. A quoted `#` is literal. Missing file/key or an empty selected value is `missing-prerequisite`; malformed, oversized, unsafe or unreadable material is `configuration`. Never retain parser excerpts.

Check every root-to-leaf ancestor for ordinary canonical directory topology, and the leaf for ordinary canonical regular-file topology and single link. Open read-only; compare descriptor identity (`dev`, `ino`), regular type, link count and size with the checked path before and after the bounded read, and recheck path topology. Rejected initial topology performs zero content reads; detected replacement fails. Close in finally. Trusted local filesystem ownership remains an assumption; these checks do not guarantee race-free detection of every Windows reparse mechanism. Missing selected leaf is the missing-file case; missing/unsafe ancestors are configuration failures.

Use asynchronous native filesystem operations and check the abort signal before open and around each await. An abort during pending work returns a bounded configuration preparation failure with uncertain cleanup when closure is not yet observed; a late open is closed and any late buffer is cleared. Complete cleanup requires observed successful descriptor close; failed/pending close is uncertain. The shared stage retains authoritative timeout/shutdown precedence and its 120000-ms deadline. Preparation must not hang waiting indefinitely for a close before reporting cancellation.

Check actual startup debug state `debuglog('http').enabled || debuglog('https').enabled` before any credential read and again before transport; changing `process.env.NODE_DEBUG` is not the guard. This covers known native debug paths, not hostile instrumentation. Keep the credential in operation-private mutable ownership, clear references on abort and dispatch termination, and zero owned byte buffers. Successful prepare abandoned before dispatch is released with the stage references and eventually collected: the existing interface has no dispose hook, and JavaScript/native header strings cannot be promised zeroization. Late callbacks must not capture the credential. Test this honest scope rather than claiming process-memory erasure.

After admitted-body serialization, load the key and scan every decoded outbound JSON string and property name for the exact selected key substring before transport. Collision is `configuration` with no invocation. Scan all decoded inbound envelope and parsed candidate strings/property names before publication, including Unicode-escaped echoes. For HTTP 200, collision is `incomplete-output`. For non-200, the bounded status classification below takes precedence, including a complete qualifying 400 quota response; discard every echoed value without changing that attempted failure into response/failed provenance. The comparison result carries no sensitive diagnostic. The parser and I/O result remain server-internal, not a public API.

#### G2 — immutable exact-body byte admission

Apply M304-FIT-AMENDMENT-01 exactly, including the new closed branch, inclusive 65536 bytes, separate 4096 output-capacity test, unchanged Local token branches and no hosted-fit/full-consumption claim. `GROQ_CONFIGURATION` is recursively frozen with fixed Groq provider context; `adapterId: groq-generation`, `adapterVersion: m304-groq-v1`, `endpoint: groq-chat-completions`, existing prompt/schema/output-contract versions and `GROQ_PARAMETERS`. Binding is `{kind:'groq',exposedDefaultsIdentity:'groq-gpt-oss-20b-2026-09-11-v1',serverRevision:null}`. Accounting is the accepted six-field `m304-groq-request-bytes-v1` object. This exact configuration, request controls and shared schema references are bound; invalid configuration takes existing precedence over byte failure.

The exposed-default identity binds the documented fixed model/limits and explicit low reasoning, omitted reasoning output, nonstreaming and single response. Wire temperature remains 0; the documented provider transformation to 1e-8 is disclosed. No seed, stop, tools, streaming options, token estimate, truncation field or model-list probe is added. Unknown private server revision remains null. Material policy/default/body mapping changes require a new version and affected-evidence disposition.

Build one closed object with exactly `model`, `messages`, `response_format`, and every unchanged Groq control (`temperature`, `top_p`, `max_completion_tokens`, `reasoning_effort`, `include_reasoning`, `stream`, `n`). Preserve the two shared system/user strings, including pretty JSON and its final LF. `response_format` is `{type:'json_schema',json_schema:{name:'m301_proposal_v1',strict:true,schema:request.schema}}`. Serialize once with JSON.stringify, measure its UTF-8 bytes, return the same private string for dispatch. No normalization, trimming, repair, added data or reserialization follows measurement. No body, byte count, credential or new metadata enters durable invocation fields.

#### G3 — fixed native transport and observed settlement

Use Node HTTPS POST to hostname `api.groq.com`, port 443, path `/openai/v1/chat/completions`, `agent:false`, `maxHeaderSize:16384`, `rejectUnauthorized:true`, normal CA and hostname verification. Application headers are only bearer authorization, `content-type: application/json` and exact byte `content-length`; native Host/Connection headers are permitted. No custom agent, proxy configuration, redirect following, retry or fallback. Construct the native request exactly once inside the supplied `AttemptTransport` thunk. A startup-debug refusal or outbound collision occurs before this thunk and has no invocation; the existing stage conservatively reports uncertain cleanup for a dispatch-time pre-entry exception. Normal preparation detects the same guard first.

Accumulate at most 1048576 response bytes, decode fatal UTF-8 and require complete HTTP. Success requires status 200; object `chat.completion`; exact model `openai/gpt-oss-20b`; exactly one choice of index 0; assistant role; finish reason `stop`; string content parsing to an object candidate. Reject nonempty refusal or reasoning, any tool/function call field, malformed/truncated/non-stop output and non-object candidates. Absent or null refusal and absent/null/empty reasoning convey no returned extension; any other reasoning value rejects. The shared proposal validator remains authoritative for candidate content. Unrelated usage/metadata is ignored only after the private credential-echo scan.

401 is authentication, 429 rate-limit; complete, bounded, valid JSON HTTP 400 with exact `error.code:'blocked_api_access'` is quota. All other non-200 responses, including unknown 400, 413 and redirects, are provider failures. Malformed/truncated 400 cannot be quota. Observed non-200 classification survives subsequent network failure; otherwise native error is network and invalid completed 200 output is incomplete-output. Never inspect error prose for a category or retain it. An actual attempted provider rejection has invocation provider/not-run, not input-fit.

Track request, response and every assigned socket independently. A complete candidate is published only after body end/completeness and all observed close events. Destruction/end/destroyed flags alone do not prove close or remote cancellation. Abort/deadline wins while active, destroys owned resources and never publishes late success. The stage's whole-operation deadline is authoritative; dispatch may use its same 120000-ms upper timer and native timeout as additional bounds, never extend the stage deadline. Failure initiates destruction and uses a queued microtask settlement as in Local: if complete closure is not observed, return uncertain cleanup, not a timed grace assumption. Error paths may conservatively retain uncertainty even after synchronous close; success cannot. Late response/socket callbacks destroy and absorb errors until close without retaining credential references or restarting work. No active request may survive silently as successful cleanup.

#### G4 — exact seams, ownership and commands

A0 owns only the previously accepted shared compatibility paths. A owns `groq-credential.ts`, `groq-generation-configuration.ts`, `groq-generation-fit.ts`; B owns `groq-generation-http.ts` and `groq-generation.ts`, all under `src/server/generation/`. Creation is purpose-bound: credential filesystem/parser, immutable profile, pure wire admission, native transport, and thin composition respectively. No generic HTTP extraction or shared stage/domain/service change is authorized. Pure shared types/validators never import the Groq I/O branch.

Freeze these server-internal exports: `GROQ_CONFIGURATION`; `prepareGroqGenerationWire(request:GenerationRequest)` returning `{ok:true,body:string,fit:GenerationFit}` or `{ok:false,error:'configuration'|'input-fit'}`; `parseGroqCredential(bytes:Uint8Array)` returning the closed credential result; `readGroqCredential(signal:AbortSignal,io?:GroqCredentialIO)` returning its Promise; `dispatchGroqGeneration(body:string,credential:string,signal:AbortSignal,attemptTransport:AttemptTransport,requestImplementation?:GroqNativeRequest)` returning the shared-compatible dispatch envelope; and `createGroqGenerationAdapter(options?:{credentialIO?:GroqCredentialIO,requestImplementation?:GroqNativeRequest}):GenerationAdapter`. Optional arguments are internal test seams, never HTTP/user controls. `GroqNativeRequest` uses Node HTTPS RequestOptions, IncomingMessage callback and ClientRequest return. No endpoint, source path, model, header or real key option is exposed on the factory.

`GroqCredentialResult` is `{ok:true,credential:string,cleanup:'complete'}` or `{ok:false,error:'configuration'|'missing-prerequisite',cleanup:'complete'|'uncertain'}`. `GroqCredentialStat` picks native Stats `dev`, `ino`, `nlink`, `size`, `isDirectory`, `isFile`, `isSymbolicLink`. `GroqCredentialIO` supplies `lstat(path):Promise<GroqCredentialStat>`, `realpath(path):Promise<string>`, `open(path,flags:'r'):Promise<GroqCredentialHandle>` and `debugEnabled():boolean`. The handle supplies `stat():Promise<GroqCredentialStat>`, `read(buffer:Uint8Array,offset:number,length:number,position:number):Promise<{bytesRead:number}>`, and `close():Promise<void>`. Default wrappers adapt native fs/promises and util.debuglog. All paths are computed internally; tests model them in memory. Small private parsing/comparison/lifetime helpers are allowed inside their responsibility owner. No public secret logger, resolver registry or disposal API is added.

A0 tests: `tests/generation-stage.test.ts`, optional type-only narrowing in `tests/ollama-generation-contract.test.ts`. A tests: `tests/groq-generation-contract.test.ts` and `tests/helpers/m304-groq-fixture.ts`; B adds `tests/groq-generation.test.ts`, `tests/groq-generation-service.test.ts` and extends that same test-only helper. Existing M302 fixture exports may be reused for input and live-owner setup. Synthetic I/O must fail on any unexpected path and never fall through to native credentials. Native doubles observe exact options, body bytes, request/response/socket lifetimes and counters; no request reaches Groq, Ollama or an unowned endpoint. Real service tests use owned `temp/m304-groq-*` leaves, synthetic run aggregates, actual LocalService/repository and controlled supported retrieval; ephemeral loopback service/probe effects match M303's existing finally settlement and ordinary contained single-leaf cleanup. Inspect absolute containment/topology before recursive deletion; uncertain resources preserve their leaf and fail. No other file, model store, runtime or developer run is disposable.

Every caller runs at `C:/projects/a11y-evidence-lab` in PowerShell with pinned Node v24.20.0. Load only README lines 80–173 (the complete unchanged preparation definitions) using `$m304Readme = Get-Content -LiteralPath README.md; . ([scriptblock]::Create(($m304Readme[79..172] -join "`n")))`; verify this exact block still applies before a later README change. Then execute the following command body inside `Invoke-M105Command`, propagating native exits. No install, restore, browser acquisition or cache is needed. Preflight is read-only and uses fresh entry evidence, not fixture-producing commands.

- A0 focused: `& $m105Node --test --test-timeout=120000 tests/generation-stage.test.ts tests/ollama-generation-contract.test.ts`; fail on nonzero exit. Red runs tests before strict to expose the behavioral failure. Green runs this then independent `& $m105Node node_modules/typescript/bin/tsc --project tsconfig.json`, failing on nonzero exit.
- A focused: same prepared caller, `& $m105Node --test --test-timeout=120000 tests/groq-generation-contract.test.ts`; then independent strict during Green. The initial absent-module Red exception may apply only after preflight/environment evidence and bounded complete behavioral tests.
- B focused: same caller, sequentially execute `groq-generation-contract`, `groq-generation`, `groq-generation-service`, `generation-stage`, `generation-service`, `ollama-generation-contract`, `ollama-generation`, `ollama-generation-service` via `foreach ($m304Test in @(...)) { & $m105Node --test --test-timeout=120000 ("tests/" + $m304Test + ".test.ts"); if ($LASTEXITCODE -ne 0) { throw 'M304 focused suite failed' } }`; Green ends with independent strict. The packet expands the exact eight-name array; no missing-file execution is allowed except accepted first-module Red.
- Full closure: README's complete sequential nineteen-suite caller gains the three new Groq suites in its browser-free array, totaling twenty-two suites. Keep the existing scanner/integration and UI loops, scratch prerequisites and final empty checks. Existing client output is inspected before any rebuild; primary may replace only verified generated `dist/client` with ordinary contained topology and no unexpected files, then run independent strict and `& $m105Node node_modules/vite/bin/vite.js build --configLoader native` with fail-fast exit checks. Exact current inventory and output disposition are recorded before that effect; no broad deletion or new runner is authorized.

Each lease packet records exact focused caller, relevant source/test hashes, accepted-test boundary, environment identity and fresh terminal guard/no-drift evidence. Native/FS evidence is Non-reusable except the exact isolated run identity/state. No test duplicates Red merely because ownership changes. S3 review requires risk-critical controlled reproduction; complete authoritative tests and separate strict/build occur at closure. Documentation closure includes diff/UTF-8/newline/links/anchors/PowerShell parsing, canonical amendment consistency, current claims and command inventory. The thirteen frozen reference hashes, original manifest and exclusion of real secret reads remain task invariants.

#### G4 complete focused callers

The exact prepared callers below supersede the illustrative command-slot placeholders earlier in this plan. A0 and A Green add the independent strict command after the focused test; Red does not hide the expected behavioral/import failure behind a typecheck. B runs the listed eight suites sequentially. Every native failure stops the caller before the next step.

```powershell
$m304Readme = Get-Content -LiteralPath README.md
. ([scriptblock]::Create(($m304Readme[79..172] -join "`n")))
Invoke-M105Command {
  & $m105Node --test --test-timeout=120000 tests/generation-stage.test.ts tests/ollama-generation-contract.test.ts
  if ($LASTEXITCODE -ne 0) { throw 'M304 A0 focused tests failed' }
  & $m105Node node_modules/typescript/bin/tsc --project tsconfig.json
  if ($LASTEXITCODE -ne 0) { throw 'M304 strict TypeScript failed' }
}
```

```powershell
$m304Readme = Get-Content -LiteralPath README.md
. ([scriptblock]::Create(($m304Readme[79..172] -join "`n")))
Invoke-M105Command {
  & $m105Node --test --test-timeout=120000 tests/groq-generation-contract.test.ts
  if ($LASTEXITCODE -ne 0) { throw 'M304 A focused tests failed' }
  & $m105Node node_modules/typescript/bin/tsc --project tsconfig.json
  if ($LASTEXITCODE -ne 0) { throw 'M304 strict TypeScript failed' }
}
```

```powershell
$m304Readme = Get-Content -LiteralPath README.md
. ([scriptblock]::Create(($m304Readme[79..172] -join "`n")))
Invoke-M105Command {
  foreach ($m304Test in @('groq-generation-contract','groq-generation','groq-generation-service','generation-stage','generation-service','ollama-generation-contract','ollama-generation','ollama-generation-service')) {
    & $m105Node --test --test-timeout=120000 ("tests/" + $m304Test + ".test.ts")
    if ($LASTEXITCODE -ne 0) { throw 'M304 B focused suite failed' }
  }
  & $m105Node node_modules/typescript/bin/tsc --project tsconfig.json
  if ($LASTEXITCODE -ne 0) { throw 'M304 strict TypeScript failed' }
}
```

Closure uses the unchanged complete README caller, not selected snippets. Its browser-free array is exactly `run-contract`, `run-repository`, `local-service`, `scan-normalization`, `retrieval-contract`, `embedding-retrieval`, `retrieval-service`, `finding-sufficiency`, `finding-guidance-api`, `generation-contract`, `generation-stage`, `generation-service`, `ollama-generation-contract`, `ollama-generation`, `ollama-generation-service`, `groq-generation-contract`, `groq-generation`, `groq-generation-service`. The remaining arrays remain `scan-page`, `walking-skeleton` and `target-results-ui`, `finding-guidance-ui`. Primary owns that maintained README update after implementation, including its exact caller parsing/preflight and generated-output inventory checks before any closure effect. A worker may not infer build-deletion authority from the focused commands.

### M304-G-SYNTHESIS-02 — corrected complete synthesis accepted

The original mandatory analyst's sole correction returns DRAFT READY for the complete G1–G4 outline, with I1–I7 covered and no remaining decide-now blocker. Primary resolved non-200 status precedence over discarded credential echoes, updated the live candidate contract and bound the exact official setup wording/full focused callers during that same correction. Remaining implementation proofs and disclosed filesystem, memory and hosted-processing limitations are explicit. The fresh combined G pre-draft review is now active; the separate proposal reviews do not substitute for it. No lease or application change follows synthesis alone. Documentation checks pass 306 local links/anchors, eleven UTF-8/newline/whitespace inspections, four PowerShell fence parses and git diff --check; original manifest and thirteen references still match. Source/tests/packages and ignored credential contents remain untouched.

### M304-G-PREDRAFT-01 — accepted drafting checkpoint

Fresh critical research review returns PASS WITH FOLLOW-UPS at plan SHA-256 `090ad24bf17440879576157a15d57e1153712cc6c8bab2f05fd9ab9e7a6c5a27`, with no Blocker or Major and I1–I7 passed. Primary resolved the sole non-semantic Minor M304-G-PRE-M1 by removing the already-completed analyst correction from Current state. The independent reviewer reproduced original manifest/thirteen references, source/package preservation, exact prepared callers, four fence parses, absent lease, ignored/untracked secret status and git diff --check, while reusing unchanged entry strict/149-test evidence. No test, fixture, secret read or provider call occurred. Primary authored M304-G-CONTRACT-01 from that reviewed outline without changing its behavior or scope. Different fresh final G review remains required; no implementation acceptance is claimed.

### M304-G-FINAL-01 — accepted complete contract

The different fresh final R3 reviewer returns PASS without findings for the complete primary-authored contract at plan SHA-256 `bc4406dc374a6d8301e1a89919ac1f8cdd2d73027efaed9c2a1801ef3e52e222`. I1–I7 pass; no final correction cycle was consumed. Primary accepts G1–G4 and the exact A0/A/B route. The reviewer reproduced frozen/input identities, unchanged source/test/package state, empty staging, absent lease, ignored/untracked secret status, caller bindings and documentation checks; entry strict/149 tests remain reusable only for unchanged covered behavior. No implementation or actual provider conformance is claimed. A0 read-only test preflight is now authorized within the recorded packet; all write turns still require their own guard lease.

### M304-A0-PACKET — shared admission compatibility

The following initial packet is the complete semantic preflight assignment. Later Red/Green packets retain this contract and record their exact phase, lease, owner, accepted test/evidence identity and scope projection before dispatch.

```text
Milestone Assignment Packet v2

Identity
- Workflow ID: M304-20260911-01
- Roadmap task ID: M3-04
- Work-slice ID: M304-20260911-01-A0
- Assignment ID: M304-A0-preflight-01
- Lease ID: None for preflight
- Phase: preflight
- Attempt: 1
- Correction parent lease ID: None
- Worker role: test_worker
- Lease owner: groq_a0_test
- Guard contract digest: None for preflight

Work-slice capsule
- Owning ExecPlan: docs/plans/m3-04-groq-adapter.md, M304-G-CONTRACT-01 and accepted M304-FIT-AMENDMENT-01.
- Observable acceptance contract: Add ONLY accepted Groq serialized-byte-budget compatibility to existing immutable configuration and prepared-fit validators/stage. Fixed accounting six fields/method serialized-byte-budget/version m304-groq-request-bytes-v1/tokenizer null/cap65536/context131072/output65536. Closed immutable byte fit accounting same reference, serializedRequestBytes positive safe integer<=65536 (reject -0), requestedOutputTokens4096, matching context/output; separate output capacity. Reject Local byte method, copied/malformed/mixed/extra fields/invalid limits; configuration precedence and zero native invocation on admission failure; accepted byte report permits same single stage attempt. Preserve all existing exact-tokenizer/verified-upper-bound reports and Local runtime semantics.
- Exact requirement / ADR / roadmap Verification / BHV / SPEC / HS anchors: REQ-LLM-008/019 in docs/requirements/generation-provider-and-model-lifecycle/GENERATION_PROVIDER_EXECUTION.md; ADR-0020 Groq admission amendment--2026-09-11; docs/DEVELOPMENT_ROADMAP.md M3-04 Verification; EVALUATION_AND_ACCEPTANCE.md BHV-03 and Groq admission amendment to frozen definition; SPEC-003 Groq byte/rejection scenarios; HS-008; ADR-0024 and .codex/execplan-implementation-workflow.md.
- Readiness and evaluation-freeze evidence: Owner-approved exact task and amendment; M302 Complete; M304 ENTRY02 and FIT-ACCEPT01; M304-G-FINAL-01 accepts final R3 PASS at contract artifact bc4406dc374a6d8301e1a89919ac1f8cdd2d73027efaed9c2a1801ef3e52e222. Original manifest63770583a97e1d0517337474dadc706c1047d78e026e22c7a745ce7674ed9e6b and13refs match; no outputs/calls; .env not read.
- TDD applicability: Applicable, new executable byte admission.
- Current-state and preflight evidence IDs: Entry strict/149 tests accepted, current production token-only; classify actual missing branch read-only. Preflight evidence None until return.
- Accepted test boundary and current test owner: None until Red accepted; groq_a0_test.
- Relevant boundaries and paths: Existing generation-contract.ts and generation-fit.ts; shared generation-stage.ts is read-only consumer. tests/generation-stage.test.ts and Local contract regression.
- Production responsibility placement and fit: generation-contract.ts owns tagged accounting/fit shapes; generation-fit.ts owns closed mode/configuration/fit admission. Necessary type-only narrowing in ollama-generation-model.ts and ollama-generation-fit.ts permitted at Green to retain Local result types; no Local runtime changes.
- Dependency, runtime-call, or interface-edge changes: Extend existing pure accounting/fit unions, existing stage consumes unchanged validators. No external I/O or new import direction.
- Reuse, justified separation, bounded creation, or local-extraction disposition: Extend current pure responsibility owners; reuse existing stage test fixtures; no new production module or abstraction.
- Permitted local structural refactor: Private validation helpers only inside generation-fit.ts preserving existing token behavior. Local modules type-only edits.
- Non-goals: Groq credentials/body/native transport; provider calls/probes; shared stage/domain/service behavior changes; frozen manifest or test fixture inputs; deps; client/UI; Git writes.
- Named uncertainties: Preflight determines exact missing behavior and necessary test type narrowing; no unresolved authority decision.
- Risk tier: S3 (identity/admission/attempt provenance).
- Review and escalation triggers: Binding/path/authority drift, unknown classification, changed Local behavior, unexpected state; fresh critical review after accepted Green.

Write scope
- Allowed files: None during preflight. Prospective Red: tests/generation-stage.test.ts and tests/ollama-generation-contract.test.ts (latter type-only if needed).
- Allowed directory roots: None.
- Forbidden files: All production/configuration/frozen inputs and existing accepted tests except prospective declared test paths.
- Forbidden directory roots: src, docs, evaluation, corpus, .codex, .agents, data; preflight forbids all writes everywhere.

Validation
- Working directory: C:/projects/a11y-evidence-lab
- Focused command: Read-only preflight; do not run fixture-creating tests. Exact prospective Red/Green caller is G4 complete A0 caller: load README[79..172] definitions unchanged, Invoke-M105Command { & $m105Node --test --test-timeout=120000 tests/generation-stage.test.ts tests/ollama-generation-contract.test.ts; if ($LASTEXITCODE -ne 0) { throw 'M304 A0 focused tests failed' }; & $m105Node node_modules/typescript/bin/tsc --project tsconfig.json; if ($LASTEXITCODE -ne 0) { throw 'M304 strict TypeScript failed' } }. Red omits strict after expected behavioral failure.
- Task-level command: G4 complete22-suite closure with independent strict/build; primary owns later effect.
- Expected decisive result and reusable evidence IDs: One supported preflight classification with exact production/test locations. Missing branch should lead to behavioral Red through existing callable; no first-module exception anticipated.
- Relevant-tree fingerprint: 42 generation/test files JSON sorted path/sha256 fingerprint4ba6c2441f8c13675e6784bcaf32a777db115ebd4866f9107d1767ad8862c3c6; no code changes since entry. Primary supplies refreshed identity before writes.
- Environment fingerprint or Non-reusable: Pinned Node24.20.0 SHA5c976096e04e5c2c1f091938926234cc9fbebfe9787ddd149351b3b0ecc707b5; package01c0b39bd9141588543bd520dbb7a160eac2d95414eef54d36f394fe0fb7ba5c lock38ce94019310a5efdba9bb5565abe6eb13f678fa18fcd9d87b1c5dc21b30748d tsconfig3957f80af41b23dc4ccefaa6b24823c367e6984980420b596275b8692df5abde unchanged. Preflight read-only; no mutable external evidence created.
- Known external side effects and cleanup: None during preflight. Future A0 focused tests are in-memory and controlled timers, no real credentials/provider/runtime/fixture leaves. Compilation cache disabled by maintained wrapper.

Budget and stopping
- Maximum worker turns: One preflight; future writes separately leased, max3 per unchanged role/phase chain.
- Maximum corrections: One ordinary plus conditional final correction with primary evidence justification; one S3 review correction loop.
- Maximum repeated identical failure: Two without new evidence stops.
- Maximum no-diff outcomes: Two stops.
- Validation cadence: Read-only source/test inspection for preflight; focused Red once after coherent tests; focused Green and independent strict; proportional primary review. Do not repeat unchanged full suite.
- Stop and escalate when: Any write needed now, conflicting/unknown classification, changed binding, undeclared path, authority gap, real key/provider boundary or budget exhausted.

Handoff
- Report identity/authority, one classification, exact source/test references, safe command/evidence, missing behavior, necessary future paths, outcome/unexpected state/risks/documentation impact. No writes now. You are not alone in this codebase; preserve owner/peer edits. Git is read-only; do not invoke guard or mutate Git metadata.

```


### M304-A0-PREFLIGHT-01 — accepted missing byte branch

The test owner returns MISSING from existing types/validators and stage/test inspection: accounting and fit are token-only; existing stage gates are sufficient and require no source redesign. Primary accepts the isolated missing byte branch. No files or fixtures changed and no test was run. The exact existing-callable behavioral Red follows; the first-module exception does not apply.

### M304-A0-RED-01 — initial test assignment

```text
Milestone Assignment Packet v2

Identity
- Workflow ID: M304-20260911-01
- Roadmap task ID: M3-04
- Work-slice ID: M304-20260911-01-A0
- Assignment ID: M304-A0-red-01
- Lease ID: M304-A0-red-01
- Phase: red
- Attempt: 1
- Correction parent lease ID: None
- Worker role: test_worker
- Lease owner: groq_a0_test
- Guard contract digest: Pending primary guard start; exact returned digest will accompany dispatch

Work-slice capsule
- Owning ExecPlan: docs/plans/m3-04-groq-adapter.md, M304-G-CONTRACT-01 and accepted M304-FIT-AMENDMENT-01.
- Observable acceptance contract: Add ONLY accepted Groq serialized-byte-budget compatibility to existing immutable configuration and prepared-fit validators/stage. Fixed accounting six fields/method serialized-byte-budget/version m304-groq-request-bytes-v1/tokenizer null/cap65536/context131072/output65536. Closed immutable byte fit accounting same reference, serializedRequestBytes positive safe integer<=65536 (reject -0), requestedOutputTokens4096, matching context/output; separate output capacity. Reject Local byte method, copied/malformed/mixed/extra fields/invalid limits; configuration precedence and zero native invocation on admission failure; accepted byte report permits same single stage attempt. Preserve all existing exact-tokenizer/verified-upper-bound reports and Local runtime semantics.
- Exact requirement / ADR / roadmap Verification / BHV / SPEC / HS anchors: REQ-LLM-008/019 in docs/requirements/generation-provider-and-model-lifecycle/GENERATION_PROVIDER_EXECUTION.md; ADR-0020 Groq admission amendment--2026-09-11; docs/DEVELOPMENT_ROADMAP.md M3-04 Verification; EVALUATION_AND_ACCEPTANCE.md BHV-03 and Groq admission amendment to frozen definition; SPEC-003 Groq byte/rejection scenarios; HS-008; ADR-0024 and .codex/execplan-implementation-workflow.md.
- Readiness and evaluation-freeze evidence: Owner-approved exact task and amendment; M302 Complete; M304 ENTRY02 and FIT-ACCEPT01; M304-G-FINAL-01 accepts final R3 PASS at contract artifact bc4406dc374a6d8301e1a89919ac1f8cdd2d73027efaed9c2a1801ef3e52e222. Original manifest63770583a97e1d0517337474dadc706c1047d78e026e22c7a745ce7674ed9e6b and13refs match; no outputs/calls; .env not read.
- TDD applicability: Applicable, new executable byte admission.
- Current-state and preflight evidence IDs: Entry strict/149 tests accepted, current production token-only; classify actual missing branch read-only. M304-A0-PREFLIGHT-01 accepted MISSING: existing callable validators reject the byte branch; no first-module exception.
- Accepted test boundary and current test owner: None until this Red is accepted; groq_a0_test owns the two allowed test files.
- Relevant boundaries and paths: Existing generation-contract.ts and generation-fit.ts; shared generation-stage.ts is read-only consumer. tests/generation-stage.test.ts and Local contract regression.
- Production responsibility placement and fit: generation-contract.ts owns tagged accounting/fit shapes; generation-fit.ts owns closed mode/configuration/fit admission. Necessary type-only narrowing in ollama-generation-model.ts and ollama-generation-fit.ts permitted at Green to retain Local result types; no Local runtime changes.
- Dependency, runtime-call, or interface-edge changes: Extend existing pure accounting/fit unions, existing stage consumes unchanged validators. No external I/O or new import direction.
- Reuse, justified separation, bounded creation, or local-extraction disposition: Extend current pure responsibility owners; reuse existing stage test fixtures; no new production module or abstraction.
- Permitted local structural refactor: Private validation helpers only inside generation-fit.ts preserving existing token behavior. Local modules type-only edits.
- Non-goals: Groq credentials/body/native transport; provider calls/probes; shared stage/domain/service behavior changes; frozen manifest or test fixture inputs; deps; client/UI; Git writes.
- Named uncertainties: None; MISSING is accepted. Add byte fixtures locally in generation-stage.test.ts; protected shared fixture helper cannot change.
- Risk tier: S3 (identity/admission/attempt provenance).
- Review and escalation triggers: Binding/path/authority drift, unknown classification, changed Local behavior, unexpected state; fresh critical review after accepted Green.

Write scope
- Allowed files: tests/generation-stage.test.ts; tests/ollama-generation-contract.test.ts (only necessary type narrowing, unchanged assertions/runtime).
- Allowed directory roots: None.
- Forbidden files: README.md, package.json, package-lock.json, tsconfig.json, AGENTS.md, PLANS.md.
- Forbidden directory roots: src, docs, evaluation, corpus, .codex, .agents, data. All unlisted paths remain outside this lease.

Validation
- Working directory: C:/projects/a11y-evidence-lab
- Focused command: Load README[79..172] complete preparation unchanged, then Invoke-M105Command { & $m105Node --test --test-timeout=120000 tests/generation-stage.test.ts tests/ollama-generation-contract.test.ts; if ($LASTEXITCODE -ne 0) { throw 'M304 A0 focused tests failed' } }. Expected native test exit1 plus propagated shell failure for meaningful new byte behavior; record exact runner output. Do not run strict to mask behavioral Red.
- Task-level command: G4 complete22-suite closure with independent strict/build; primary owns later effect.
- Expected decisive result and reusable evidence IDs: Complete coherent byte-admission tests fail on expected missing acceptance through existing callables. Assert boundary65536/65537, Unicode independent arithmetic where relevant at report level, wrong byte profiles/limits/modes, mixed fields, immutable/copy-reference drift, error precedence and zero native calls on rejection; preserve old token tests. No first-module exception, skipped assertions, production stub or conditional tests.
- Relevant-tree fingerprint: 42 generation/test files JSON sorted path/sha256 fingerprint4ba6c2441f8c13675e6784bcaf32a777db115ebd4866f9107d1767ad8862c3c6; no code changes since entry. Primary supplies refreshed identity before writes.
- Environment fingerprint or Non-reusable: Pinned Node24.20.0 SHA5c976096e04e5c2c1f091938926234cc9fbebfe9787ddd149351b3b0ecc707b5; package01c0b39bd9141588543bd520dbb7a160eac2d95414eef54d36f394fe0fb7ba5c lock38ce94019310a5efdba9bb5565abe6eb13f678fa18fcd9d87b1c5dc21b30748d tsconfig3957f80af41b23dc4ccefaa6b24823c367e6984980420b596275b8692df5abde unchanged. Controlled A0 in-memory run; capture exact command/tree/environment result. Existing source fingerprint still matches preflight; new test identity is produced by this lease.
- Known external side effects and cleanup: A0 focused tests are in-memory and controlled timers, no real credentials/provider/runtime/fixture leaves. Compilation cache disabled by maintained wrapper.

Budget and stopping
- Maximum worker turns: One active write turn, attempt1 of maximum3 per unchanged Red chain; corrections require primary authorization and fresh lease.
- Maximum corrections: One ordinary plus conditional final correction with primary evidence justification; one S3 review correction loop.
- Maximum repeated identical failure: Two without new evidence stops.
- Maximum no-diff outcomes: Two stops.
- Validation cadence: Write one coherent test boundary, run focused Red once, inspect failures; no Green or full suite. Stop and return for primary acceptance.
- Stop and escalate when: Wrong Red failure, changed binding, undeclared path, authority gap, real key/provider boundary or budget exhausted.

Handoff
- Report assignment/digest, touched paths, exact focused caller and exit, decisive expected behavioral failures, unchanged Local coverage, test hashes and reusable evidence identity, risks and documentation impact; cohesion None. Stop writing at handoff. You are not alone; preserve owner/peer edits. Git is read-only; do not invoke guard or mutate Git metadata. Never read/hash the real .env or call a provider.
```


### M304-A0-RED-ACCEPT-01 — accepted behavioral failure

Primary terminally closed M304-A0-red-01 as closed-compliant, receipt 040137547ee923feeae9c4c43eed375c92a67b307c9b7bc94fec2ae9c8214868, contract19d776821e6380c8834a26d395b0f54d5f285c508585b174b3063be9360f0e87. Actual diff adds four byte-admission tests and a bounded optional fit seam in the existing test harness; Local tests and production are unchanged. Primary independently reproduced the exact prepared focused caller:61 tests,58 pass,3 expected failures,0 skips, exit1. Valid byte configuration is rejected before preparation, preventing cap/fit/copy cases from reaching their expected stages. This proves the missing branch through existing exports. Remaining assertions execute during Green. Accepted test identities and exact relevant-tree identity are in the Green packet below; no evidence from provider calls is claimed.

### M304-A0-GREEN-01 — initial implementation assignment

```text
Milestone Assignment Packet v2

Identity
- Workflow ID: M304-20260911-01
- Roadmap task ID: M3-04
- Work-slice ID: M304-20260911-01-A0
- Assignment ID: M304-A0-green-01
- Lease ID: M304-A0-green-01
- Phase: green
- Attempt: 1
- Correction parent lease ID: None
- Worker role: code_worker
- Lease owner: groq_a0_code
- Guard contract digest: Pending primary guard start; exact returned digest will accompany dispatch

Work-slice capsule
- Owning ExecPlan: docs/plans/m3-04-groq-adapter.md, M304-G-CONTRACT-01 and accepted M304-FIT-AMENDMENT-01.
- Observable acceptance contract: Add ONLY accepted Groq serialized-byte-budget compatibility to existing immutable configuration and prepared-fit validators/stage. Fixed accounting six fields/method serialized-byte-budget/version m304-groq-request-bytes-v1/tokenizer null/cap65536/context131072/output65536. Closed immutable byte fit accounting same reference, serializedRequestBytes positive safe integer<=65536 (reject -0), requestedOutputTokens4096, matching context/output; separate output capacity. Reject Local byte method, copied/malformed/mixed/extra fields/invalid limits; configuration precedence and zero native invocation on admission failure; accepted byte report permits same single stage attempt. Preserve all existing exact-tokenizer/verified-upper-bound reports and Local runtime semantics.
- Exact requirement / ADR / roadmap Verification / BHV / SPEC / HS anchors: REQ-LLM-008/019 in docs/requirements/generation-provider-and-model-lifecycle/GENERATION_PROVIDER_EXECUTION.md; ADR-0020 Groq admission amendment--2026-09-11; docs/DEVELOPMENT_ROADMAP.md M3-04 Verification; EVALUATION_AND_ACCEPTANCE.md BHV-03 and Groq admission amendment to frozen definition; SPEC-003 Groq byte/rejection scenarios; HS-008; ADR-0024 and .codex/execplan-implementation-workflow.md.
- Readiness and evaluation-freeze evidence: Owner-approved exact task and amendment; M302 Complete; M304 ENTRY02 and FIT-ACCEPT01; M304-G-FINAL-01 accepts final R3 PASS at contract artifact bc4406dc374a6d8301e1a89919ac1f8cdd2d73027efaed9c2a1801ef3e52e222. Original manifest63770583a97e1d0517337474dadc706c1047d78e026e22c7a745ce7674ed9e6b and13refs match; no outputs/calls; .env not read.
- TDD applicability: Applicable, new executable byte admission.
- Current-state and preflight evidence IDs: Entry strict/149 tests accepted, current production token-only; classify actual missing branch read-only. M304-A0-PREFLIGHT-01 accepted MISSING: existing callable validators reject the byte branch; no first-module exception.
- Accepted test boundary and current test owner: M304-A0-RED-ACCEPT-01; groq_a0_test owns tests/generation-stage.test.ts SHA256 d8e02da263a88777b82c68e663039afb9f41b9b1474d79b7ab00bc8fae4eecdf and tests/ollama-generation-contract.test.ts SHA256 3f7a34969fe01f589ebb9c5c1737ea82cc15b5718a29a0b8a9f589618fee7fba. Both remain unchanged during Green.
- Relevant boundaries and paths: Existing generation-contract.ts and generation-fit.ts; shared generation-stage.ts is read-only consumer. tests/generation-stage.test.ts and Local contract regression.
- Production responsibility placement and fit: generation-contract.ts owns tagged accounting/fit shapes; generation-fit.ts owns closed mode/configuration/fit admission. Necessary type-only narrowing in ollama-generation-model.ts and ollama-generation-fit.ts permitted at Green to retain Local result types; no Local runtime changes.
- Dependency, runtime-call, or interface-edge changes: Extend existing pure accounting/fit unions, existing stage consumes unchanged validators. No external I/O or new import direction.
- Reuse, justified separation, bounded creation, or local-extraction disposition: Extend current pure responsibility owners; reuse existing stage test fixtures; no new production module or abstraction.
- Permitted local structural refactor: Private validation helpers only inside generation-fit.ts preserving existing token behavior. Local modules type-only edits.
- Non-goals: Groq credentials/body/native transport; provider calls/probes; shared stage/domain/service behavior changes; frozen manifest or test fixture inputs; deps; client/UI; Git writes.
- Named uncertainties: None; accepted Red covers the new byte branch. Existing Local return types may need only declared type narrowing; return TEST CONTRACT CONFLICT if accepted tests need edits.
- Risk tier: S3 (identity/admission/attempt provenance).
- Review and escalation triggers: Binding/path/authority drift, unknown classification, changed Local behavior, unexpected state; fresh critical review after accepted Green.

Write scope
- Allowed files: src/server/generation/generation-contract.ts; src/server/generation/generation-fit.ts; src/server/generation/ollama-generation-model.ts; src/server/generation/ollama-generation-fit.ts. The two Local files permit only necessary type narrowing, unchanged runtime behavior.
- Allowed directory roots: None.
- Forbidden files: README.md, package.json, package-lock.json, tsconfig.json, AGENTS.md, PLANS.md, src/server/generation/generation-stage.ts.
- Forbidden directory roots: tests, docs, evaluation, corpus, .codex, .agents, data. All unlisted paths remain outside this lease.

Validation
- Working directory: C:/projects/a11y-evidence-lab
- Focused command: Exact G4 complete A0 Green caller: load README[79..172] preparation unchanged; Invoke-M105Command { & $m105Node --test --test-timeout=120000 tests/generation-stage.test.ts tests/ollama-generation-contract.test.ts; if ($LASTEXITCODE -ne 0) { throw 'M304 A0 focused tests failed' }; & $m105Node node_modules/typescript/bin/tsc --project tsconfig.json; if ($LASTEXITCODE -ne 0) { throw 'M304 strict TypeScript failed' } }.
- Task-level command: G4 complete22-suite closure with independent strict/build; primary owns later effect.
- Expected decisive result and reusable evidence IDs: All61 focused tests execute unchanged and pass, independent strict exit0, old Local behavior retained. M304-A0-RED-ACCEPT-01 reproduced58pass/3expectedfail by primary after closed-compliant test lease, no skips. Do not rerun unchanged Red if full identity still matches; implement full accepted byte contract.
- Relevant-tree fingerprint: Sorted path/sha256 JSON compact fingerprint 96b675e5d86e98205fec713ce8c0bd1f6efe2b7390c6db6b8226c89609630991 over42 generation/test files. Relevant source/test unchanged since primary reproduced Red; only primary docs/lease metadata changed. Refresh handoff source/test identities.
- Environment fingerprint or Non-reusable: Pinned Node24.20.0 SHA5c976096e04e5c2c1f091938926234cc9fbebfe9787ddd149351b3b0ecc707b5; package01c0b39bd9141588543bd520dbb7a160eac2d95414eef54d36f394fe0fb7ba5c lock38ce94019310a5efdba9bb5565abe6eb13f678fa18fcd9d87b1c5dc21b30748d tsconfig3957f80af41b23dc4ccefaa6b24823c367e6984980420b596275b8692df5abde unchanged. Controlled A0 in-memory run; capture exact command/tree/environment result. Existing source fingerprint still matches preflight; new test identity is produced by this lease.
- Known external side effects and cleanup: A0 focused tests are in-memory and controlled timers, no real credentials/provider/runtime/fixture leaves. Compilation cache disabled by maintained wrapper.

Budget and stopping
- Maximum worker turns: One active write turn, attempt1 of maximum3 per unchanged Green chain; corrections require primary authorization and fresh lease.
- Maximum corrections: One ordinary plus conditional final correction with primary evidence justification; one S3 review correction loop.
- Maximum repeated identical failure: Two without new evidence stops.
- Maximum no-diff outcomes: Two stops.
- Validation cadence: Implement full accepted branch, run exact focused Green and independent strict, then inspect actual structural fit; RETAINED or bounded REFACTORED (fresh focused only if refactored) or RECONCILE. No full suite.
- Stop and escalate when: Accepted test conflict, stale Red, changed binding, undeclared path, authority gap, real key/provider boundary or budget exhausted.

Handoff
- Report assignment/digest, touched paths, exact focused/strict caller and exits, all61 passing/no skips, unchanged test hashes, source hashes, and explicit RETAINED/REFACTORED/RECONCILE cohesion disposition with symbols. Stop writing at handoff. You are not alone; preserve owner/peer changes. Git is read-only; never invoke guard/Git writes, edit tests/docs, read/hash real.env or call providers.
```


### M304-A0-GREEN-EVIDENCE-01 — implementation ready for S3 review

M304-A0-green-01 closed-compliant with contract481641a75b5ebde061100beac1b9feb7f2fbb744ea5038c024fbda7c57be9e1a and receipt 124388ead81874291fe787ad9a58a02b95b277985a00882cf92a383d8cf41779. Primary inspected all four source diffs: separate token/byte types and pure validator branches; both Local changes are type-only. Accepted tests retain their exact hashes. The worker's exact prepared caller reports61 passing,0 failures/skips and strict exit0; primary independently reran strict successfully and reproduced the42-file fingerprint cbf9f30b8fcec2ea263b890798145c44a31406b0a1cd53558c449ad1babe168c. Cohesion RETAINED is accepted for these existing responsibility owners. No stage/service/domain, dependency or frozen-input change occurred. Fresh S3 review with controlled risk reproduction remains before A0 acceptance or A preflight. No actual provider call or credential read occurred.


### M304-A0-ACCEPT-01 — shared byte admission accepted

Fresh critical review returns PASS with no remaining findings. It independently reproduced all 61 focused tests with no skips and verified the exact source/test/runtime/configuration identities. Additional in-memory risk probes cover byte-fit reentry, abort, configuration swap, throwing inspection and truthful attempted provider rejection. Primary accepts A0 behavior, RETAINED cohesion and compliant separate-owner leases. The shared stage now supports the fixed Groq byte branch; both Local edits are type-only. No full-body/native Groq conformance or actual provider call is claimed. A0 used one preflight, Red attempt 1, Green attempt 1 and one fresh S3 review, with no correction consumed. Its workers have no further write authority. A credential/request-preparation preflight may now start.

### M304-A-PACKET — credential and request preparation

```text
Milestone Assignment Packet v2

Identity
- Workflow ID: M304-20260911-01
- Roadmap task ID: M3-04
- Work-slice ID: M304-20260911-01-A
- Assignment ID: M304-A-preflight-01
- Lease ID: None for preflight
- Phase: preflight
- Attempt: 1
- Correction parent lease ID: None
- Worker role: test_worker
- Lease owner: groq_a_test
- Guard contract digest: None for preflight

Work-slice capsule
- Owning ExecPlan: docs/plans/m3-04-groq-adapter.md, M304-G-CONTRACT-01 and accepted M304-FIT-AMENDMENT-01.
- Observable acceptance contract: Implement only accepted G1 credential parser/async fixed-root loader and G2 immutable Groq configuration/exact-body preparation. Sole root .env key GROQ_API_KEY; 65536 file bytes / 4096 visible ASCII key bounds; exact grammar/duplicates/UTF8; ordinary canonical ancestors, single-link leaf, descriptor identity before/after bounded read and close; abort and late-close uncertainty; actual startup debug state before reads; safe closed errors. Wire configuration is fixed m304-groq-v1, exposed defaults and policy from G1/G2; complete closed Chat body with strict m301_proposal_v1 plus all unchanged controls and two shared messages; serialize once, measure UTF-8 with 65536 inclusive, unchanged body and private fit; identity and byte errors before credentials/provider. Follow exact G1-G2 literals, no invented token proof.
- Exact requirement / ADR / roadmap Verification / BHV / SPEC / HS anchors: REQ-LLM-008/019 in docs/requirements/generation-provider-and-model-lifecycle/GENERATION_PROVIDER_EXECUTION.md; ADR-0020 Groq admission amendment--2026-09-11; docs/DEVELOPMENT_ROADMAP.md M3-04 Verification; EVALUATION_AND_ACCEPTANCE.md BHV-03 and Groq admission amendment to frozen definition; SPEC-003 Groq byte/rejection scenarios; HS-008; ADR-0024 and .codex/execplan-implementation-workflow.md.
- Readiness and evaluation-freeze evidence: Exact task, accepted amendment and G final PASS; M304-A0-ACCEPT-01: fresh S3 PASS,61 focused tests and independent strict passed. Original manifest63770583a97e1d0517337474dadc706c1047d78e026e22c7a745ce7674ed9e6b+13referencesunchanged; no outputs, calls or real .env reads. M3-03 capacity remains blocked independently.
- TDD applicability: Applicable, missing credential/configuration/wire modules; first-module Red exception only if preflight establishes exact missing callables/environment.
- Current-state and preflight evidence IDs: G accepted; A0 accepted 61 focused tests and independent strict; exact A preflight classification pending.
- Accepted test boundary and current test owner: None until Red accepted; groq_a_test.
- Relevant boundaries and paths: New src/server/generation/groq-credential.ts, groq-generation-configuration.ts, groq-generation-fit.ts. Read-only shared contracts/artifacts/stage and Local analogues. New tests/groq-generation-contract.test.ts and tests/helpers/m304-groq-fixture.ts.
- Production responsibility placement and fit: groq-credential.ts owns selected credential grammar and async filesystem/lifetime with injected synthetic I/O; groq-generation-configuration.ts owns one immutable versioned fixed profile; groq-generation-fit.ts owns pure schema/message/body serialization and byteadmission. No I/O in profile or mapper.
- Dependency, runtime-call, or interface-edge changes: Native fs/promises/util→credentialloader; shared pure types, artifacts and validators→Groq profile and mapper; later B factory consumes these modules. No browser/domain/renderer import, SDK or new dependency.
- Reuse, justified separation, bounded creation, or local-extraction disposition: Reuse existing shared artifacts/closed readers/byteadmission types. Create exactly three cohesiveGroq module owners and one task-only testhelper; no genericclient/parserregistry/configplatform.
- Permitted local structural refactor: Small private parsing/comparison/lifetime helpers within declared owners preserving Gcontract; no source outside the3newmodules.
- Non-goals: NativeHTTPS/factory/service integration (B), shared/Local implementation changes, actual.envread/hash/overwrite, provider/probe/model/runtimeoperations, new packages, frozeninputs, UI/routes or Gitmutations.
- Named uncertainties: Preflight confirms exact missing exports, fixture cohesion and safe independent runner; no unresolved security or policy choice may be delegated.
- Risk tier: S3 (secretfilesystem/lifetime and exactserialization/identity).
- Review and escalation triggers: Binding/path/authority drift, unknown classification, changed Local behavior, unexpected state; fresh critical review after accepted Green.

Write scope
- Allowed files: None during preflight. Prospective Red/evidence: tests/groq-generation-contract.test.ts and tests/helpers/m304-groq-fixture.ts.
- Allowed directory roots: None.
- Forbidden files: All production/configuration/frozen inputs and existing accepted tests except prospective declared test paths.
- Forbidden directory roots: src, docs, evaluation, corpus, .codex, .agents, data; preflight forbids all writes everywhere.

Validation
- Working directory: C:/projects/a11y-evidence-lab
- Focused command: Read-only preflight; use recorded A0 runner and environment evidence, no fixture-producing commands now. Prospective exact G4 A caller loads README[79..172] definitions and invokes Node --test --test-timeout=120000 tests/groq-generation-contract.test.ts with native exit propagation; Green then independent strict. First-module Red only for the exact missing-callable failure and complete behavioral tests, no skips or stubs.
- Task-level command: G4 complete22-suite closure with independent strict/build; primary owns later effect.
- Expected decisive result and reusable evidence IDs: One supported classification with exact missing callables per G4: parseGroqCredential/readGroqCredential/GroqCredentialIO types; GROQ_CONFIGURATION; prepareGroqGenerationWire. No B factory or transport tests yet. Prove all G1/G2 modules coherently; no actual .env reads.
- Relevant-tree fingerprint: 42-file sorted path/sha256 compact JSON fingerprint cbf9f30b8fcec2ea263b890798145c44a31406b0a1cd53558c449ad1babe168c; A0 source boundary remains protected during A.
- Environment fingerprint or Non-reusable: Pinned Node24.20.0 SHA5c976096e04e5c2c1f091938926234cc9fbebfe9787ddd149351b3b0ecc707b5; package01c0b39bd9141588543bd520dbb7a160eac2d95414eef54d36f394fe0fb7ba5c lock38ce94019310a5efdba9bb5565abe6eb13f678fa18fcd9d87b1c5dc21b30748d tsconfig3957f80af41b23dc4ccefaa6b24823c367e6984980420b596275b8692df5abde unchanged. Preflight read-only; no mutable external evidence created.
- Known external side effects and cleanup: None during preflight. A tests use only virtual synthetic CredentialIO and in-memory wire fixtures; never create/read real.env or actualsecretfiles. Bound await and abort tests use owned controllable promises/timers; late handles and buffers settle. No nativeprovider request. B alone may add owned temp/m304-groq-* service fixtures.

Budget and stopping
- Maximum worker turns: One preflight; future writes separately leased, max3 per unchanged role/phase chain.
- Maximum corrections: One ordinary plus conditional final correction with primary evidence justification; one S3 review correction loop.
- Maximum repeated identical failure: Two without new evidence stops.
- Maximum no-diff outcomes: Two stops.
- Validation cadence: Read-only source/test inspection for preflight; focused Red once after coherent tests; focused Green and independent strict; proportional primary review. Do not repeat unchanged full suite.
- Stop and escalate when: Any write needed now, conflicting/unknown classification, changed binding, undeclared path, authority gap, real key/provider boundary or budget exhausted.

Handoff
- Report complete assignment identity and one classification, exact source, test and runner facts, missing callables, scoped fixture plan, outcome, risks and documentation impact. No writes or tests now. You are not alone; preserve owner and peer changes. Git is read-only; no guard invocation, metadata mutations, real .env reads/hashes or provider operations.
```


### M304-A-PREFLIGHT-01 — accepted missing preparation modules

Read-only preflight returns MISSING: none of the three agreed credential/configuration/wire modules or exports exists, and shared byte support is not an equivalent adapter implementation. Exact source/test/runtime inspection and the 42-file fingerprint match accepted A0 evidence. Primary accepts the scoped virtual-I/O fixture plan and first-module Red exception. No tests, files or fixtures changed during preflight.

### M304-A-RED-01 — initial preparation test assignment

```text
Milestone Assignment Packet v2

Identity
- Workflow ID: M304-20260911-01
- Roadmap task ID: M3-04
- Work-slice ID: M304-20260911-01-A
- Assignment ID: M304-A-red-01
- Lease ID: M304-A-red-01
- Phase: red
- Attempt: 1
- Correction parent lease ID: None
- Worker role: test_worker
- Lease owner: groq_a_test
- Guard contract digest: Pending primary guard start; exact digest supplied at dispatch

Work-slice capsule
- Owning ExecPlan: docs/plans/m3-04-groq-adapter.md, M304-G-CONTRACT-01 and accepted M304-FIT-AMENDMENT-01.
- Observable acceptance contract: Implement only accepted G1 credential parser/async fixed-root loader and G2 immutable Groq configuration/exact-body preparation. Sole root .env key GROQ_API_KEY; 65536 file bytes / 4096 visible ASCII key bounds; exact grammar/duplicates/UTF8; ordinary canonical ancestors, single-link leaf, descriptor identity before/after bounded read and close; abort and late-close uncertainty; actual startup debug state before reads; safe closed errors. Wire configuration is fixed m304-groq-v1, exposed defaults and policy from G1/G2; complete closed Chat body with strict m301_proposal_v1 plus all unchanged controls and two shared messages; serialize once, measure UTF-8 with 65536 inclusive, unchanged body and private fit; identity and byte errors before credentials/provider. Follow exact G1-G2 literals, no invented token proof.
- Exact requirement / ADR / roadmap Verification / BHV / SPEC / HS anchors: REQ-LLM-008/019 in docs/requirements/generation-provider-and-model-lifecycle/GENERATION_PROVIDER_EXECUTION.md; ADR-0020 Groq admission amendment--2026-09-11; docs/DEVELOPMENT_ROADMAP.md M3-04 Verification; EVALUATION_AND_ACCEPTANCE.md BHV-03 and Groq admission amendment to frozen definition; SPEC-003 Groq byte/rejection scenarios; HS-008; ADR-0024 and .codex/execplan-implementation-workflow.md.
- Readiness and evaluation-freeze evidence: Exact task, accepted amendment and G final PASS; M304-A0-ACCEPT-01: fresh S3 PASS,61 focused tests and independent strict passed. Original manifest63770583a97e1d0517337474dadc706c1047d78e026e22c7a745ce7674ed9e6b+13referencesunchanged; no outputs, calls or real .env reads. M3-03 capacity remains blocked independently.
- TDD applicability: Applicable, missing credential/configuration/wire modules; first-module Red exception only if preflight establishes exact missing callables/environment.
- Current-state and preflight evidence IDs: M304-A-PREFLIGHT-01 accepted MISSING for the exact three G4 modules/exports. A0 runner/environment evidence matches; first-module Red exception is authorized for complete behavioral tests.
- Accepted test boundary and current test owner: None until Red accepted; groq_a_test.
- Relevant boundaries and paths: New src/server/generation/groq-credential.ts, groq-generation-configuration.ts, groq-generation-fit.ts. Read-only shared contracts/artifacts/stage and Local analogues. New tests/groq-generation-contract.test.ts and tests/helpers/m304-groq-fixture.ts.
- Production responsibility placement and fit: groq-credential.ts owns selected credential grammar and async filesystem/lifetime with injected synthetic I/O; groq-generation-configuration.ts owns one immutable versioned fixed profile; groq-generation-fit.ts owns pure schema/message/body serialization and byteadmission. No I/O in profile or mapper.
- Dependency, runtime-call, or interface-edge changes: Native fs/promises/util→credentialloader; shared pure types, artifacts and validators→Groq profile and mapper; later B factory consumes these modules. No browser/domain/renderer import, SDK or new dependency.
- Reuse, justified separation, bounded creation, or local-extraction disposition: Reuse existing shared artifacts/closed readers/byteadmission types. Create exactly three cohesiveGroq module owners and one task-only testhelper; no genericclient/parserregistry/configplatform.
- Permitted local structural refactor: Small private parsing/comparison/lifetime helpers within declared owners preserving Gcontract; no source outside the3newmodules.
- Non-goals: NativeHTTPS/factory/service integration (B), shared/Local implementation changes, actual.envread/hash/overwrite, provider/probe/model/runtimeoperations, new packages, frozeninputs, UI/routes or Gitmutations.
- Named uncertainties: None at the decision boundary. Exact behavior follows G1/G2. Return for primary reconciliation if a material missing semantic or path is discovered.
- Risk tier: S3 (secretfilesystem/lifetime and exactserialization/identity).
- Review and escalation triggers: Binding/path/authority drift, unknown classification, changed Local behavior, unexpected state; fresh critical review after accepted Green.

Write scope
- Allowed files: tests/groq-generation-contract.test.ts; tests/helpers/m304-groq-fixture.ts.
- Allowed directory roots: None.
- Forbidden files: README.md, package.json, package-lock.json, tsconfig.json, AGENTS.md, PLANS.md.
- Forbidden directory roots: src, docs, evaluation, corpus, .codex, .agents, data. All other paths remain outside lease.

Validation
- Working directory: C:/projects/a11y-evidence-lab
- Focused command: Exact G4 A Red caller: $m304Readme = Get-Content -LiteralPath README.md; . ([scriptblock]::Create(($m304Readme[79..172] -join "`n"))); Invoke-M105Command { & $m105Node --test --test-timeout=120000 tests/groq-generation-contract.test.ts; if ($LASTEXITCODE -ne 0) { throw 'M304 A focused tests failed' } }. No strict command masks expected first-module Red.
- Task-level command: G4 complete22-suite closure with independent strict/build; primary owns later effect.
- Expected decisive result and reusable evidence IDs: Complete G1/G2 behavioral tests at frozen exports; expected initial ERR_MODULE_NOT_FOUND or missing-export failure naming one of groq-credential.ts/groq-generation-configuration.ts/groq-generation-fit.ts. Record that behavioral assertions remain unexecuted. No production stubs, skips, conditional import/assertions or existence-only tests. Tests cover grammar/UTF8/duplicates/size, unsafe topology/identity/close and abort/late work/debug, fixed configuration/reference/closed exact body/cap/Unicode preservation. Do not include B factory/native transport behavior.
- Relevant-tree fingerprint: 42-file sorted path/sha256 compact JSON fingerprint cbf9f30b8fcec2ea263b890798145c44a31406b0a1cd53558c449ad1babe168c; A0 source boundary remains protected during A.
- Environment fingerprint or Non-reusable: Node24.20.0 SHA5c976096e04e5c2c1f091938926234cc9fbebfe9787ddd149351b3b0ecc707b5; package01c0b39bd9141588543bd520dbb7a160eac2d95414eef54d36f394fe0fb7ba5c; lock38ce94019310a5efdba9bb5565abe6eb13f678fa18fcd9d87b1c5dc21b30748d; tsconfig3957f80af41b23dc4ccefaa6b24823c367e6984980420b596275b8692df5abde. Pinned virtual-only run identity; no mutable external boundary.
- Known external side effects and cleanup: Only the two leased test files are written. Test runtime uses virtual synthetic CredentialIO and in-memory request fixtures; no filesystem fallback, real .env read/hash, fixture files, provider or process acquisition. Own/settle manual promises and timers. Compilation cache disabled by maintained wrapper.

Budget and stopping
- Maximum worker turns: One active write turn, Red attempt1 of maximum3 per unchanged chain; correction requires primary authorization and new lease.
- Maximum corrections: One ordinary plus conditional final correction with primary evidence justification; one S3 review correction loop.
- Maximum repeated identical failure: Two without new evidence stops.
- Maximum no-diff outcomes: Two stops.
- Validation cadence: Add all bounded behavioral tests, run exact focused Red once, report expected missing-callable failure and unexecuted assertions, then stop. No full suite or Green.
- Stop and escalate when: Wrong Red failure, binding/path/authority drift, need for production code, actual secret/provider boundary, unexpected state or exhausted budget.

Handoff
- Report assignment/digest, touched paths, exact caller/exit and expected missing-callable result, complete test matrix, unexecuted assertions, test hashes/evidence identity, residual risks and documentation impact; cohesion None. Stop writing at handoff. You are not alone; preserve owner/peer work. Git is read-only; no guard/metadata mutation or real .env read/hash.
```


### M304-A-RED-CORRECTION-01 — same-contract test correction

M304-A-red-01 closed-compliant, contract `4ca96b429dc9ba68bb2890a4b8eace7327353960ef6643523cfcb5b01974ec01`, receipt `a254e2bb78392746f55c625cb614861b578b28e7d863eed23f131bd406b5acf2`. Primary inspected both complete new files. The reported first-module failure names the agreed absent credential module, but the test boundary is not accepted: its `OTHER value` row incorrectly requires configuration failure even though G1 ignores unrelated variables. Primary also identified missing controlled proof for bounded reads during file growth, read failure/late rejected I/O, and exact copied-control identity. These are existing G1/G2 obligations, not new behavior. Attempt 2 corrects this coherent test boundary within the identical files/role/phase/slice. The README status wording was primary maintenance before lease start and is included in its baseline; the guard reports no unexpected change. No Green lease has opened.

### M304-A-RED-02 — corrected preparation test assignment

```text
Milestone Assignment Packet v2

Identity
- Workflow ID: M304-20260911-01
- Roadmap task ID: M3-04
- Work-slice ID: M304-20260911-01-A
- Assignment ID: M304-A-red-02
- Lease ID: M304-A-red-02
- Phase: red
- Attempt: 2
- Correction parent lease ID: M304-A-red-01
- Worker role: test_worker
- Lease owner: groq_a_test
- Guard contract digest: Pending primary guard start; exact digest supplied at dispatch

Work-slice capsule
- Owning ExecPlan: docs/plans/m3-04-groq-adapter.md, M304-G-CONTRACT-01 and accepted M304-FIT-AMENDMENT-01.
- Observable acceptance contract: Implement only accepted G1 credential parser/async fixed-root loader and G2 immutable Groq configuration/exact-body preparation. Sole root .env key GROQ_API_KEY; 65536 file bytes / 4096 visible ASCII key bounds; exact grammar/duplicates/UTF8; ordinary canonical ancestors, single-link leaf, descriptor identity before/after bounded read and close; abort and late-close uncertainty; actual startup debug state before reads; safe closed errors. Wire configuration is fixed m304-groq-v1, exposed defaults and policy from G1/G2; complete closed Chat body with strict m301_proposal_v1 plus all unchanged controls and two shared messages; serialize once, measure UTF-8 with 65536 inclusive, unchanged body and private fit; identity and byte errors before credentials/provider. Follow exact G1-G2 literals, no invented token proof.
- Exact requirement / ADR / roadmap Verification / BHV / SPEC / HS anchors: REQ-LLM-008/019 in docs/requirements/generation-provider-and-model-lifecycle/GENERATION_PROVIDER_EXECUTION.md; ADR-0020 Groq admission amendment--2026-09-11; docs/DEVELOPMENT_ROADMAP.md M3-04 Verification; EVALUATION_AND_ACCEPTANCE.md BHV-03 and Groq admission amendment to frozen definition; SPEC-003 Groq byte/rejection scenarios; HS-008; ADR-0024 and .codex/execplan-implementation-workflow.md.
- Readiness and evaluation-freeze evidence: Exact task, accepted amendment and G final PASS; M304-A0-ACCEPT-01: fresh S3 PASS,61 focused tests and independent strict passed. Original manifest63770583a97e1d0517337474dadc706c1047d78e026e22c7a745ce7674ed9e6b+13referencesunchanged; no outputs, calls or real .env reads. M3-03 capacity remains blocked independently.
- TDD applicability: Applicable, missing credential/configuration/wire modules; first-module Red exception only if preflight establishes exact missing callables/environment.
- Current-state and preflight evidence IDs: M304-A-PREFLIGHT-01 MISSING retained. Initial Red lease closed compliant but its test boundary is not accepted: one unrelated-variable expectation contradicts G1 and bounded read/late-error cases need completion. This same-contract correction replaces that evidence; production remains absent.
- Accepted test boundary and current test owner: None until Red accepted; groq_a_test.
- Relevant boundaries and paths: New src/server/generation/groq-credential.ts, groq-generation-configuration.ts, groq-generation-fit.ts. Read-only shared contracts/artifacts/stage and Local analogues. New tests/groq-generation-contract.test.ts and tests/helpers/m304-groq-fixture.ts.
- Production responsibility placement and fit: groq-credential.ts owns selected credential grammar and async filesystem/lifetime with injected synthetic I/O; groq-generation-configuration.ts owns one immutable versioned fixed profile; groq-generation-fit.ts owns pure schema/message/body serialization and byteadmission. No I/O in profile or mapper.
- Dependency, runtime-call, or interface-edge changes: Native fs/promises/util→credentialloader; shared pure types, artifacts and validators→Groq profile and mapper; later B factory consumes these modules. No browser/domain/renderer import, SDK or new dependency.
- Reuse, justified separation, bounded creation, or local-extraction disposition: Reuse existing shared artifacts/closed readers/byteadmission types. Create exactly three cohesiveGroq module owners and one task-only testhelper; no genericclient/parserregistry/configplatform.
- Permitted local structural refactor: Small private parsing/comparison/lifetime helpers within declared owners preserving Gcontract; no source outside the3newmodules.
- Non-goals: NativeHTTPS/factory/service integration (B), shared/Local implementation changes, actual.envread/hash/overwrite, provider/probe/model/runtimeoperations, new packages, frozeninputs, UI/routes or Gitmutations.
- Named uncertainties: None. G1 ignores unrelated variable names, including malformed unrelated assignments except global UTF-8/control rules. G2 binds exact controls/schema/configuration references. Finish the specified lifecycle coverage without changing production contract.
- Risk tier: S3 (secretfilesystem/lifetime and exactserialization/identity).
- Review and escalation triggers: Binding/path/authority drift, unknown classification, changed Local behavior, unexpected state; fresh critical review after accepted Green.

Write scope
- Allowed files: tests/groq-generation-contract.test.ts; tests/helpers/m304-groq-fixture.ts.
- Allowed directory roots: None.
- Forbidden files: README.md, package.json, package-lock.json, tsconfig.json, AGENTS.md, PLANS.md.
- Forbidden directory roots: src, docs, evaluation, corpus, .codex, .agents, data. All other paths remain outside lease.

Validation
- Working directory: C:/projects/a11y-evidence-lab
- Focused command: Exact G4 A Red caller: $m304Readme = Get-Content -LiteralPath README.md; . ([scriptblock]::Create(($m304Readme[79..172] -join "`n"))); Invoke-M105Command { & $m105Node --test --test-timeout=120000 tests/groq-generation-contract.test.ts; if ($LASTEXITCODE -ne 0) { throw 'M304 A focused tests failed' } }. No strict command masks expected first-module Red.
- Task-level command: G4 complete22-suite closure with independent strict/build; primary owns later effect.
- Expected decisive result and reusable evidence IDs: Same exact missing groq-credential.ts module/export failure with complete corrected G1/G2 tests; no assertions executed yet. Move OTHER value plus valid selected key from invalid table into accepted-ignore cases. Add bounded loader growth/overflow read (at most65537 bytes) with zeroed buffers/closed descriptor; read failure cleanup; late rejected open/read/close promises after abort remain bounded without unhandled errors. Add copied-equivalent controls rejection to exact-reference cases. Keep helper controls virtual only; no B behavior or real files. Syntax-check both tests with pinned Node; no production stubs/skips.
- Relevant-tree fingerprint: 42-file sorted path/sha256 compact JSON fingerprint cbf9f30b8fcec2ea263b890798145c44a31406b0a1cd53558c449ad1babe168c; A0 source boundary remains protected during A.
- Environment fingerprint or Non-reusable: Node24.20.0 SHA5c976096e04e5c2c1f091938926234cc9fbebfe9787ddd149351b3b0ecc707b5; package01c0b39bd9141588543bd520dbb7a160eac2d95414eef54d36f394fe0fb7ba5c; lock38ce94019310a5efdba9bb5565abe6eb13f678fa18fcd9d87b1c5dc21b30748d; tsconfig3957f80af41b23dc4ccefaa6b24823c367e6984980420b596275b8692df5abde. Pinned virtual-only run identity; no mutable external boundary.
- Known external side effects and cleanup: Only the two leased test files are written. Test runtime uses virtual synthetic CredentialIO and in-memory request fixtures; no filesystem fallback, real .env read/hash, fixture files, provider or process acquisition. Own/settle manual promises and timers. Compilation cache disabled by maintained wrapper.

Budget and stopping
- Maximum worker turns: One active write turn, Red attempt2 of maximum3 per unchanged chain; correction requires primary authorization and new lease.
- Maximum corrections: One ordinary plus conditional final correction with primary evidence justification; one S3 review correction loop.
- Maximum repeated identical failure: Two without new evidence stops.
- Maximum no-diff outcomes: Two stops.
- Validation cadence: Apply this one coherent test correction, rerun exact focused first-module Red, report updated declaration count/unexecuted assertions and identities, then stop. No broader suite or Green.
- Stop and escalate when: Wrong Red failure, binding/path/authority drift, need for production code, actual secret/provider boundary, unexpected state or exhausted budget.

Handoff
- Report assignment/digest, touched paths, exact caller/exit and expected missing-callable result, complete test matrix, unexecuted assertions, test hashes/evidence identity, residual risks and documentation impact; cohesion None. Stop writing at handoff. You are not alone; preserve owner/peer work. Git is read-only; no guard/metadata mutation or real .env read/hash.
```

### M304-A-RED-ACCEPT-01 — corrected preparation tests accepted

M304-A-red-02 closed-compliant, contract `687fd3e46deb9db127cf2db2939833fc28559d0ac521404a8d3b5b3db5a6d445`, receipt `a0d3b253537155939bf719aac570fdefef0b78fc9696e336abebd391ae272f90`. Primary inspected the corrected tests and helper and reproduced the exact absent `groq-credential.ts` import failure with the pinned caller. The 21 behavioral declarations remain unexecuted under the approved first-module exception. Corrected Red supersedes initial Red evidence. Both accepted test hashes and the 44-file tree identity are pinned in the following Green packet.

### M304-A-GREEN-01 — preparation implementation assignment

```text
Milestone Assignment Packet v2

Identity
- Workflow ID: M304-20260911-01
- Roadmap task ID: M3-04
- Work-slice ID: M304-20260911-01-A
- Assignment ID: M304-A-green-01
- Lease ID: M304-A-green-01
- Phase: green
- Attempt: 1
- Correction parent lease ID: None
- Worker role: code_worker
- Lease owner: groq_a_code
- Guard contract digest: Pending primary guard start; exact digest supplied at dispatch

Work-slice capsule
- Owning ExecPlan: docs/plans/m3-04-groq-adapter.md, M304-G-CONTRACT-01 and accepted M304-FIT-AMENDMENT-01.
- Observable acceptance contract: Implement only accepted G1 credential parser/async fixed-root loader and G2 immutable Groq configuration/exact-body preparation. Sole root .env key GROQ_API_KEY; 65536 file bytes / 4096 visible ASCII key bounds; exact grammar/duplicates/UTF8; ordinary canonical ancestors, single-link leaf, descriptor identity before/after bounded read and close; abort and late-close uncertainty; actual startup debug state before reads; safe closed errors. Wire configuration is fixed m304-groq-v1, exposed defaults and policy from G1/G2; complete closed Chat body with strict m301_proposal_v1 plus all unchanged controls and two shared messages; serialize once, measure UTF-8 with 65536 inclusive, unchanged body and private fit; identity and byte errors before credentials/provider. Follow exact G1-G2 literals, no invented token proof.
- Exact requirement / ADR / roadmap Verification / BHV / SPEC / HS anchors: REQ-LLM-008/019 in docs/requirements/generation-provider-and-model-lifecycle/GENERATION_PROVIDER_EXECUTION.md; ADR-0020 Groq admission amendment--2026-09-11; docs/DEVELOPMENT_ROADMAP.md M3-04 Verification; EVALUATION_AND_ACCEPTANCE.md BHV-03 and Groq admission amendment to frozen definition; SPEC-003 Groq byte/rejection scenarios; HS-008; ADR-0024 and .codex/execplan-implementation-workflow.md.
- Readiness and evaluation-freeze evidence: Exact task, accepted amendment and G final PASS; M304-A0-ACCEPT-01: fresh S3 PASS,61 focused tests and independent strict passed. Original manifest63770583a97e1d0517337474dadc706c1047d78e026e22c7a745ce7674ed9e6b+13referencesunchanged; no outputs, calls or real .env reads. M3-03 capacity remains blocked independently.
- TDD applicability: Applicable, missing credential/configuration/wire modules; first-module Red exception only if preflight establishes exact missing callables/environment.
- Current-state and preflight evidence IDs: M304-A-PREFLIGHT-01 MISSING; M304-A-RED-ACCEPT-01 accepts corrected Red 02, replacing initial evidence. Primary reproduced exact ERR_MODULE_NOT_FOUND groq-credential.ts; 21 behavioral declarations remain unexecuted under the first-module exception.
- Accepted test boundary and current test owner: groq_a_test; tests/groq-generation-contract.test.ts SHA256 0d3af70e40601e476e331ceacea4ff1cdba2d8e2120c51f20e06d9d8bb48914c and tests/helpers/m304-groq-fixture.ts SHA256 d6177b2229c3820fe18f9bd7512ba5378f28e40f0f339cbcc30c86fded5a27d1. Both unchanged throughout Green.
- Relevant boundaries and paths: New src/server/generation/groq-credential.ts, groq-generation-configuration.ts, groq-generation-fit.ts. Read-only shared contracts/artifacts/stage and Local analogues. New tests/groq-generation-contract.test.ts and tests/helpers/m304-groq-fixture.ts.
- Production responsibility placement and fit: groq-credential.ts owns selected credential grammar and async filesystem/lifetime with injected synthetic I/O; groq-generation-configuration.ts owns one immutable versioned fixed profile; groq-generation-fit.ts owns pure schema/message/body serialization and byteadmission. No I/O in profile or mapper.
- Dependency, runtime-call, or interface-edge changes: Native fs/promises/util→credentialloader; shared pure types, artifacts and validators→Groq profile and mapper; later B factory consumes these modules. No browser/domain/renderer import, SDK or new dependency.
- Reuse, justified separation, bounded creation, or local-extraction disposition: Reuse existing shared artifacts/closed readers/byteadmission types. Create exactly three cohesiveGroq module owners and one task-only testhelper; no genericclient/parserregistry/configplatform.
- Permitted local structural refactor: Small private parsing/comparison/lifetime helpers within declared owners preserving Gcontract; no source outside the3newmodules.
- Non-goals: NativeHTTPS/factory/service integration (B), shared/Local implementation changes, actual.envread/hash/overwrite, provider/probe/model/runtimeoperations, new packages, frozeninputs, UI/routes or Gitmutations.
- Named uncertainties: None. G1 ignores unrelated variable names, including malformed unrelated assignments except global UTF-8/control rules. G2 binds exact controls/schema/configuration references. Finish the specified lifecycle coverage without changing production contract.
- Risk tier: S3 (secretfilesystem/lifetime and exactserialization/identity).
- Review and escalation triggers: Binding/path/authority drift, unknown classification, changed Local behavior, unexpected state; fresh critical review after accepted Green.

Write scope
- Allowed files: src/server/generation/groq-credential.ts; src/server/generation/groq-generation-configuration.ts; src/server/generation/groq-generation-fit.ts.
- Allowed directory roots: None.
- Forbidden files: README.md, package.json, package-lock.json, tsconfig.json, AGENTS.md, PLANS.md.
- Forbidden directory roots: tests, docs, evaluation, corpus, .codex, .agents, data. All other paths remain outside lease.

Validation
- Working directory: C:/projects/a11y-evidence-lab
- Focused command: Load README[79..172] preparation definitions, then Invoke-M105Command { & $m105Node --test --test-timeout=120000 tests/groq-generation-contract.test.ts; if ($LASTEXITCODE -ne 0) { throw 'M304 A focused tests failed' }; & $m105Node node_modules/typescript/bin/tsc --project tsconfig.json; if ($LASTEXITCODE -ne 0) { throw 'M304 strict TypeScript failed' } }. Preserve independent strict exit.
- Task-level command: G4 complete22-suite closure with independent strict/build; primary owns later effect.
- Expected decisive result and reusable evidence IDs: All 21 accepted G1/G2 tests execute and pass; independent strict TypeScript passes. Implement complete authored contract, not only visible examples. No test changes. Return for primary triage if accepted tests conflict with authority.
- Relevant-tree fingerprint: 44-file sorted path/sha256 compact JSON fingerprint 092e07cf57ea17b7be1fa6a51a5e4cb06fe27426506c9675c3286853bef6f398. A0 production and all tests remain protected.
- Environment fingerprint or Non-reusable: Node24.20.0 SHA5c976096e04e5c2c1f091938926234cc9fbebfe9787ddd149351b3b0ecc707b5; package01c0b39bd9141588543bd520dbb7a160eac2d95414eef54d36f394fe0fb7ba5c; lock38ce94019310a5efdba9bb5565abe6eb13f678fa18fcd9d87b1c5dc21b30748d; tsconfig3957f80af41b23dc4ccefaa6b24823c367e6984980420b596275b8692df5abde. Pinned virtual-only run identity; no mutable external boundary.
- Known external side effects and cleanup: Only three leased production modules written. Runtime verification uses virtual synthetic CredentialIO and in-memory request fixtures only; never read/hash actual .env or create fixture files. No provider, acquisition, native request, Git mutations or dependency changes.

Budget and stopping
- Maximum worker turns: One active Green write turn, attempt 1 of maximum 3 in this unchanged role/phase chain.
- Maximum corrections: One ordinary plus conditional final correction with primary evidence justification; one S3 review correction loop.
- Maximum repeated identical failure: Two without new evidence stops.
- Maximum no-diff outcomes: Two stops.
- Validation cadence: Implement cohesive three-module contract, then focused 21 tests and independent strict. Optional same-turn structural refactor only within owners, preserving accepted tests. Stop at handoff.
- Stop and escalate when: Contract/test conflict, binding or authority drift, undeclared path needed, actual secret/provider boundary, unexpected state, or exhausted budget.

Handoff
- Report assignment/digest, touched paths, exact commands/results, source and protected test hashes, tree/environment identity, responsibility placement and dependency inspection, residual risks and documentation impact. Stop writing at handoff. You are not alone; preserve owner/peer work. Git is read-only; no guard/metadata mutations or actual .env read/hash.
```

### M304-A-GREEN-EVIDENCE-01 — preparation ready for S3 review

M304-A-green-01 closed-compliant under contract `51a4424951cd6a4001fb36e9d17ffc78c884e53879be363748f2f1161eb97438`, receipt `e74f92df193999db178d6f600183d3a4ab7ecf01d45cc6f5bec877ef1cbd4dda`. Primary inspected all three complete source modules and confirmed protected test hashes. The worker's exact focused caller passed all 21 tests; primary independently reran strict TypeScript successfully. The 47-file tree fingerprint is `7ae63fabd945e7b80a614f9457773e72608323b0877044f395197dfbbc346c25`; source hashes are credential `140241df98b63441e656befa4d06cd2cd37ebd7ad439b5f173ff1005c7c26cf7`, configuration `fd33fa791261c695e7640b63f4171f31d1e27bc29c8245c9cd4d5893e3c4f2b0`, and wire fit `c3750415963d68cb45e8206392ca80088d35c5c80367ed94ead0a2942fce76c9`. Responsibility placement is retained: credential grammar/filesystem lifetime, immutable profile, and pure body preparation have distinct owners. No actual secret or provider boundary was touched. Fresh S3 review must independently reproduce risk-critical cancellation, bounded reading and exact-body cases before acceptance.


### M304-A-REVIEW-01 — physical-line parser correction

Fresh S3 review returns REVISE with one Major, M304-A-R1, and no other findings. U+2028/U+2029 prevent the selected-line remainder regex from matching; malformed selected values can be skipped, duplicates accepted in either order, and permitted trailing comments hidden. Primary independently reproduced both separators. The 21 original tests and ten additional synthetic topology/lifetime/body checks pass; a 14-case separator matrix demonstrates ten mismatches. This is an existing G1 contract defect. No separate bug record is needed for this contained task correction.

The compliant Green receipt remains valid for its terminal endpoint. Its later plan-only drift is primary maintenance recorded after closure; source/test/environment fingerprints remain unchanged and the reviewer reran fresh focused evidence. The original manifest and all thirteen references also match. A remains unaccepted. Its one S3 correction loop now covers conditional Red attempt 3, Green attempt 2, and proportional re-review. The packet below records the required new-evidence and progress justification; neither scope nor budget is reset.

### M304-A-RED-03 — Unicode physical-line regression assignment

```text
Milestone Assignment Packet v2

Identity
- Workflow ID: M304-20260911-01
- Roadmap task ID: M3-04
- Work-slice ID: M304-20260911-01-A
- Assignment ID: M304-A-red-03
- Lease ID: M304-A-red-03
- Phase: red
- Attempt: 3
- Correction parent lease ID: M304-A-red-02
- Worker role: test_worker
- Lease owner: groq_a_test
- Guard contract digest: Pending primary guard start; exact digest supplied at dispatch

Work-slice capsule
- Owning ExecPlan: docs/plans/m3-04-groq-adapter.md, M304-G-CONTRACT-01 and accepted M304-FIT-AMENDMENT-01.
- Observable acceptance contract: Implement only accepted G1 credential parser/async fixed-root loader and G2 immutable Groq configuration/exact-body preparation. Sole root .env key GROQ_API_KEY; 65536 file bytes / 4096 visible ASCII key bounds; exact grammar/duplicates/UTF8; ordinary canonical ancestors, single-link leaf, descriptor identity before/after bounded read and close; abort and late-close uncertainty; actual startup debug state before reads; safe closed errors. Wire configuration is fixed m304-groq-v1, exposed defaults and policy from G1/G2; complete closed Chat body with strict m301_proposal_v1 plus all unchanged controls and two shared messages; serialize once, measure UTF-8 with 65536 inclusive, unchanged body and private fit; identity and byte errors before credentials/provider. Follow exact G1-G2 literals, no invented token proof.
- Exact requirement / ADR / roadmap Verification / BHV / SPEC / HS anchors: REQ-LLM-008/019 in docs/requirements/generation-provider-and-model-lifecycle/GENERATION_PROVIDER_EXECUTION.md; ADR-0020 Groq admission amendment--2026-09-11; docs/DEVELOPMENT_ROADMAP.md M3-04 Verification; EVALUATION_AND_ACCEPTANCE.md BHV-03 and Groq admission amendment to frozen definition; SPEC-003 Groq byte/rejection scenarios; HS-008; ADR-0024 and .codex/execplan-implementation-workflow.md.
- Readiness and evaluation-freeze evidence: Exact task, accepted amendment and G final PASS; M304-A0-ACCEPT-01: fresh S3 PASS,61 focused tests and independent strict passed. Original manifest63770583a97e1d0517337474dadc706c1047d78e026e22c7a745ce7674ed9e6b+13referencesunchanged; no outputs, calls or real .env reads. M3-03 capacity remains blocked independently.
- TDD applicability: Applicable behavioral Red; production modules now exist. Missing-module exception no longer applies.
- Current-state and preflight evidence IDs: A Green 01 ran all 21 tests and strict. Fresh S3 review M304-A-R1 independently found the physical-line Unicode separator bypass; primary reproduced it. A acceptance is withheld, prior passing test evidence is invalid for the corrected boundary.
- Accepted test boundary and current test owner: groq_a_test; preserve all existing assertions and add only G1 separator regression cases. Existing helper remains semantically unchanged.
- Relevant boundaries and paths: New src/server/generation/groq-credential.ts, groq-generation-configuration.ts, groq-generation-fit.ts. Read-only shared contracts/artifacts/stage and Local analogues. New tests/groq-generation-contract.test.ts and tests/helpers/m304-groq-fixture.ts.
- Production responsibility placement and fit: groq-credential.ts owns selected credential grammar and async filesystem/lifetime with injected synthetic I/O; groq-generation-configuration.ts owns one immutable versioned fixed profile; groq-generation-fit.ts owns pure schema/message/body serialization and byteadmission. No I/O in profile or mapper.
- Dependency, runtime-call, or interface-edge changes: Native fs/promises/util→credentialloader; shared pure types, artifacts and validators→Groq profile and mapper; later B factory consumes these modules. No browser/domain/renderer import, SDK or new dependency.
- Reuse, justified separation, bounded creation, or local-extraction disposition: Reuse existing shared artifacts/closed readers/byteadmission types. Create exactly three cohesiveGroq module owners and one task-only testhelper; no genericclient/parserregistry/configplatform.
- Permitted local structural refactor: Small private parsing/comparison/lifetime helpers within declared owners preserving Gcontract; no source outside the3newmodules.
- Non-goals: NativeHTTPS/factory/service integration (B), shared/Local implementation changes, actual.envread/hash/overwrite, provider/probe/model/runtimeoperations, new packages, frozeninputs, UI/routes or Gitmutations.
- Named uncertainties: None. U+2028/U+2029 are not LF/CRLF physical-line delimiters; selected non-ASCII values fail, duplicate assignments fail in either order, permitted quoted/unquoted comments and unrelated names remain allowed.
- Risk tier: S3 (secretfilesystem/lifetime and exactserialization/identity).
- Review and escalation triggers: Binding/path/authority drift, unknown classification, changed Local behavior, unexpected state; fresh critical review after accepted Green.

Write scope
- Allowed files: tests/groq-generation-contract.test.ts; tests/helpers/m304-groq-fixture.ts.
- Allowed directory roots: None.
- Forbidden files: README.md, package.json, package-lock.json, tsconfig.json, AGENTS.md, PLANS.md.
- Forbidden directory roots: src, docs, evaluation, corpus, .codex, .agents, data. All other paths remain outside lease.

Validation
- Working directory: C:/projects/a11y-evidence-lab
- Focused command: Exact G4 A Red caller: $m304Readme = Get-Content -LiteralPath README.md; . ([scriptblock]::Create(($m304Readme[79..172] -join "`n"))); Invoke-M105Command { & $m105Node --test --test-timeout=120000 tests/groq-generation-contract.test.ts; if ($LASTEXITCODE -ne 0) { throw 'M304 A focused tests failed' } }. No strict command masks expected first-module Red.
- Task-level command: G4 complete22-suite closure with independent strict/build; primary owns later effect.
- Expected decisive result and reusable evidence IDs: Behavioral failures for both U+2028/U+2029: sole malformed selected value; malformed selected assignment before/after a valid duplicate; valid quoted/unquoted selected key with separator in trailing comment. Positive unrelated values/full comments preserve selected key. Add a coherent matrix, no production change or test weakening. Exact focused caller must execute the other accepted tests and report named assertion mismatches, not module failure.
- Relevant-tree fingerprint: 47-file source/test tree 7ae63fabd945e7b80a614f9457773e72608323b0877044f395197dfbbc346c25 before this correction. Source remains unchanged during Red.
- Environment fingerprint or Non-reusable: Node24.20.0 SHA5c976096e04e5c2c1f091938926234cc9fbebfe9787ddd149351b3b0ecc707b5; package01c0b39bd9141588543bd520dbb7a160eac2d95414eef54d36f394fe0fb7ba5c; lock38ce94019310a5efdba9bb5565abe6eb13f678fa18fcd9d87b1c5dc21b30748d; tsconfig3957f80af41b23dc4ccefaa6b24823c367e6984980420b596275b8692df5abde. Pinned virtual-only run identity; no mutable external boundary.
- Known external side effects and cleanup: Only the two leased test files are written. Test runtime uses virtual synthetic CredentialIO and in-memory request fixtures; no filesystem fallback, real .env read/hash, fixture files, provider or process acquisition. Own/settle manual promises and timers. Compilation cache disabled by maintained wrapper.

Budget and stopping
- Maximum worker turns: Conditional final Red attempt 3, parent Red02; no fourth attempt. Red02 corrected unrelated-variable behavior and added bounded-read/late-error coverage, all subsequently executed successfully in Green01. Fresh independent 14-case separator matrix now provides material new evidence of an uncovered existing G1 semantic, with primary reproduction. Different bounded action: add separator regression matrix. This is likely to resolve the remaining test gap because it directly exercises the demonstrated physical-line recognition failure. Authorized under the existing one S3 correction loop; no budget reset.
- Maximum corrections: One ordinary plus conditional final correction with primary evidence justification; one S3 review correction loop.
- Maximum repeated identical failure: Two without new evidence stops.
- Maximum no-diff outcomes: Two stops.
- Validation cadence: Add the single coherent matrix, execute exact A focused caller once, report behavioral Red and protected source hashes, then stop. No strict/full suite or Green.
- Stop and escalate when: Wrong failure, production edit needed, another unresolved semantic, repeated decisive failure without new evidence, or unsuccessful final attempt. No additional test attempt authorized.

Handoff
- Report assignment/digest, touched paths, exact caller/exit and expected missing-callable result, complete test matrix, unexecuted assertions, test hashes/evidence identity, residual risks and documentation impact; cohesion None. Stop writing at handoff. You are not alone; preserve owner/peer work. Git is read-only; no guard/metadata mutation or real .env read/hash.
```


### M304-A-RED-ACCEPT-02 — separator regression accepted

M304-A-red-03 closed-compliant, contract `ddec3ffccb7987d8ce6fa362a958977fad7692f6e666af0746b31f6fc84da106`, receipt `52f63c3713617d06efd2161f15aa93f10cb4f464a9cb761ed52620f20933df27`. Primary inspected the added 14-case matrix; all 21 prior tests and helper/source bytes remain unchanged. Exact focused execution reports 22 tests, 21 pass and one expected behavioral failure: the sole U+2028 selected value incorrectly returns missing-prerequisite. Remaining matrix assertions are present but await Green after the first failure. This accepted regression and fresh 47-file identity supersede earlier A test evidence. Red attempt 3 succeeded; no further test write attempt is available.

### M304-A-GREEN-02 — same-contract parser correction

```text
Milestone Assignment Packet v2

Identity
- Workflow ID: M304-20260911-01
- Roadmap task ID: M3-04
- Work-slice ID: M304-20260911-01-A
- Assignment ID: M304-A-green-02
- Lease ID: M304-A-green-02
- Phase: green
- Attempt: 2
- Correction parent lease ID: M304-A-green-01
- Worker role: code_worker
- Lease owner: groq_a_code
- Guard contract digest: Pending primary guard start; exact digest supplied at dispatch

Work-slice capsule
- Owning ExecPlan: docs/plans/m3-04-groq-adapter.md, M304-G-CONTRACT-01 and accepted M304-FIT-AMENDMENT-01.
- Observable acceptance contract: Implement only accepted G1 credential parser/async fixed-root loader and G2 immutable Groq configuration/exact-body preparation. Sole root .env key GROQ_API_KEY; 65536 file bytes / 4096 visible ASCII key bounds; exact grammar/duplicates/UTF8; ordinary canonical ancestors, single-link leaf, descriptor identity before/after bounded read and close; abort and late-close uncertainty; actual startup debug state before reads; safe closed errors. Wire configuration is fixed m304-groq-v1, exposed defaults and policy from G1/G2; complete closed Chat body with strict m301_proposal_v1 plus all unchanged controls and two shared messages; serialize once, measure UTF-8 with 65536 inclusive, unchanged body and private fit; identity and byte errors before credentials/provider. Follow exact G1-G2 literals, no invented token proof.
- Exact requirement / ADR / roadmap Verification / BHV / SPEC / HS anchors: REQ-LLM-008/019 in docs/requirements/generation-provider-and-model-lifecycle/GENERATION_PROVIDER_EXECUTION.md; ADR-0020 Groq admission amendment--2026-09-11; docs/DEVELOPMENT_ROADMAP.md M3-04 Verification; EVALUATION_AND_ACCEPTANCE.md BHV-03 and Groq admission amendment to frozen definition; SPEC-003 Groq byte/rejection scenarios; HS-008; ADR-0024 and .codex/execplan-implementation-workflow.md.
- Readiness and evaluation-freeze evidence: Exact task, accepted amendment and G final PASS; M304-A0-ACCEPT-01: fresh S3 PASS,61 focused tests and independent strict passed. Original manifest63770583a97e1d0517337474dadc706c1047d78e026e22c7a745ce7674ed9e6b+13referencesunchanged; no outputs, calls or real .env reads. M3-03 capacity remains blocked independently.
- TDD applicability: Applicable behavioral Red03 accepted; production exists, no missing-module exception.
- Current-state and preflight evidence IDs: M304-A-R1 confirmed; conditional Red03 closed compliant and new test fails behaviorally (22 tests:21 pass,1 fail). Prior passing A evidence invalidated for corrected boundary. Primary inspected exact new14-case matrix and reproduced the defect independently.
- Accepted test boundary and current test owner: groq_a_test; updated tests/groq-generation-contract.test.ts SHA256 9fb59727c85602fb513baec3193c19ad6b075a5946552d2f9d8b3158bd1f5294; helper remains d6177b2229c3820fe18f9bd7512ba5378f28e40f0f339cbcc30c86fded5a27d1. All assertions and test bytes protected.
- Relevant boundaries and paths: New src/server/generation/groq-credential.ts, groq-generation-configuration.ts, groq-generation-fit.ts. Read-only shared contracts/artifacts/stage and Local analogues. New tests/groq-generation-contract.test.ts and tests/helpers/m304-groq-fixture.ts.
- Production responsibility placement and fit: groq-credential.ts owns selected credential grammar and async filesystem/lifetime with injected synthetic I/O; groq-generation-configuration.ts owns one immutable versioned fixed profile; groq-generation-fit.ts owns pure schema/message/body serialization and byteadmission. No I/O in profile or mapper.
- Dependency, runtime-call, or interface-edge changes: Native fs/promises/util→credentialloader; shared pure types, artifacts and validators→Groq profile and mapper; later B factory consumes these modules. No browser/domain/renderer import, SDK or new dependency.
- Reuse, justified separation, bounded creation, or local-extraction disposition: Reuse existing shared artifacts/closed readers/byteadmission types. Create exactly three cohesiveGroq module owners and one task-only testhelper; no genericclient/parserregistry/configplatform.
- Permitted local structural refactor: Small private parsing/comparison/lifetime helpers within declared owners preserving Gcontract; no source outside the3newmodules.
- Non-goals: NativeHTTPS/factory/service integration (B), shared/Local implementation changes, actual.envread/hash/overwrite, provider/probe/model/runtimeoperations, new packages, frozeninputs, UI/routes or Gitmutations.
- Named uncertainties: None. Existing G1 defines LF/CRLF physical lines; Unicode separators within selected values are invalid ASCII, but do not hide the selected identifier or terminate permitted comments.
- Risk tier: S3 (secretfilesystem/lifetime and exactserialization/identity).
- Review and escalation triggers: Binding/path/authority drift, unknown classification, changed Local behavior, unexpected state; fresh critical review after accepted Green.

Write scope
- Allowed files: src/server/generation/groq-credential.ts; src/server/generation/groq-generation-configuration.ts; src/server/generation/groq-generation-fit.ts.
- Allowed directory roots: None.
- Forbidden files: README.md, package.json, package-lock.json, tsconfig.json, AGENTS.md, PLANS.md.
- Forbidden directory roots: tests, docs, evaluation, corpus, .codex, .agents, data. All other paths remain outside lease.

Validation
- Working directory: C:/projects/a11y-evidence-lab
- Focused command: Load README[79..172] preparation definitions, then Invoke-M105Command { & $m105Node --test --test-timeout=120000 tests/groq-generation-contract.test.ts; if ($LASTEXITCODE -ne 0) { throw 'M304 A focused tests failed' }; & $m105Node node_modules/typescript/bin/tsc --project tsconfig.json; if ($LASTEXITCODE -ne 0) { throw 'M304 strict TypeScript failed' } }. Preserve independent strict exit.
- Task-level command: G4 complete22-suite closure with independent strict/build; primary owns later effect.
- Expected decisive result and reusable evidence IDs: All 22 tests pass, including every14-case physical-line separator vector; independent strict passes. Correct existing G1 recognition/remainder/comment handling for U+2028/U+2029 without globally banning allowed comments or unrelated values. No test changes or broader production refactor.
- Relevant-tree fingerprint: 47-file source/test tree 7c786442881f56ce989181f103df39c14d850ee1311aa49969c347e9696fea9a before correction. All accepted tests and unrelated source protected.
- Environment fingerprint or Non-reusable: Node24.20.0 SHA5c976096e04e5c2c1f091938926234cc9fbebfe9787ddd149351b3b0ecc707b5; package01c0b39bd9141588543bd520dbb7a160eac2d95414eef54d36f394fe0fb7ba5c; lock38ce94019310a5efdba9bb5565abe6eb13f678fa18fcd9d87b1c5dc21b30748d; tsconfig3957f80af41b23dc4ccefaa6b24823c367e6984980420b596275b8692df5abde. Pinned virtual-only run identity; no mutable external boundary.
- Known external side effects and cleanup: Only three leased production modules written. Runtime verification uses virtual synthetic CredentialIO and in-memory request fixtures only; never read/hash actual .env or create fixture files. No provider, acquisition, native request, Git mutations or dependency changes.

Budget and stopping
- Maximum worker turns: One ordinary correction Green attempt2, parent Green01, inside A's sole S3 correction loop. Conditional final Green attempt3 remains available only with primary new-evidence/progress justification; Red attempts exhausted.
- Maximum corrections: One ordinary plus conditional final correction with primary evidence justification; one S3 review correction loop.
- Maximum repeated identical failure: Two without new evidence stops.
- Maximum no-diff outcomes: Two stops.
- Validation cadence: Apply smallest complete same-contract parser correction, run exact focused22 tests and independent strict, inspect cohesion and stop.
- Stop and escalate when: Contract/test conflict, binding or authority drift, undeclared path needed, actual secret/provider boundary, unexpected state, or exhausted budget.

Handoff
- Report assignment/digest, touched paths, exact commands/results, source and protected test hashes, tree/environment identity, responsibility placement and dependency inspection, residual risks and documentation impact. Stop writing at handoff. You are not alone; preserve owner/peer work. Git is read-only; no guard/metadata mutations or actual .env read/hash.
```


### M304-A-CORRECTION-EVIDENCE-01 — Unicode parsing corrected

Green attempt 2 closes compliant under contract `a8ce972360b08e236e1a6c7d8d655ba1235774e0e61ba31df113961c6af404b1`, receipt `2ad40e5466f4efcafa5e68920b157aad2fb7097d633730a8deb13abbcf26934a`. Primary inspected the three dot-all expression changes and physical-line comment; no other source, test or helper changed. Exact focused execution passes all 22 tests and all fourteen separator vectors; primary independently reran strict TypeScript successfully. Credential source SHA-256 is `ad5f2a9bf34e7692ca9ac57a3d783f0f036234280aa37f33d13134031cad5962`; the other source and protected test hashes remain those in the correction packet. Primary reproduced the 47-file tree `de6ee831769778dfa5ed3bfe54a80a934243acb3eaa3e60bd4bb13e548624764`. This evidence supersedes prior Green for the parser boundary; responsibility placement is unchanged. A remains pending proportional re-review in its sole correction loop.

### M304-A-ACCEPT-01 — credential and exact-body preparation accepted

Primary accepts A after fresh S3 re-review PASS with no remaining findings. M304-A-R1 is verified: all 22 focused tests and all fourteen separator cases pass; two independent virtual-loader duplicate cases also reject with observed close and zeroed buffers. Primary independent strict and unchanged evidence identities are recorded in M304-A-CORRECTION-EVIDENCE-01. The reviewer reconstructed the pre-correction source/test hashes in memory and confirmed all unrelated source and tests unchanged. Sole review correction loop is consumed; A Red attempts 1–3 and Green attempts 1–2 are terminally compliant. No active lease remains.

Credential, immutable profile and pure body preparation retain cohesive ownership. Native transport, operation-private dispatch lifetime, credential echo checks and durable integration remain B. Synthetic evidence does not establish real provider behavior, race-free filesystem safety or JavaScript memory erasure. No real secret access or provider call occurred.

### M304-B-PACKET — native transport and service integration preflight

```text
Milestone Assignment Packet v2

Identity
- Workflow ID: M304-20260911-01
- Roadmap task ID: M3-04
- Work-slice ID: M304-20260911-01-B
- Assignment ID: M304-B-preflight-01
- Lease ID: None for preflight
- Phase: preflight
- Attempt: 1
- Correction parent lease ID: None
- Worker role: test_worker
- Lease owner: groq_b_test
- Guard contract digest: None for preflight

Work-slice capsule
- Owning ExecPlan: docs/plans/m3-04-groq-adapter.md, M304-G-CONTRACT-01 and accepted M304-FIT-AMENDMENT-01.
- Observable acceptance contract: Implement G1 private credential lifetime/echo prevention and G3 fixed native HTTPS transport through G4 thin Groq factory, then actual shared stage and service/repository integration. One request only inside AttemptTransport, unchanged admitted bytes, fixed normal TLS endpoint/options, closed response validation and exact status precedence, bounded 1MiB fatal UTF8, every observed resource close, bounded abort/deadline and harmless late callbacks. Missing/malformed credentials, debug guards, oversized bodies and outbound collisions fail before transport entry without invocation; actual attempted status errors preserve truthful invocation. No secret/raw diagnostics in durable output. Factory construction and Local/abstention perform zero credential/provider I/O.
- Exact requirement / ADR / roadmap Verification / BHV / SPEC / HS anchors: REQ-LLM-008/019 in docs/requirements/generation-provider-and-model-lifecycle/GENERATION_PROVIDER_EXECUTION.md; ADR-0020 Groq admission amendment--2026-09-11; docs/DEVELOPMENT_ROADMAP.md M3-04 Verification; EVALUATION_AND_ACCEPTANCE.md BHV-03 and Groq admission amendment to frozen definition; SPEC-003 Groq byte/rejection scenarios; HS-008; ADR-0024 and .codex/execplan-implementation-workflow.md.
- Readiness and evaluation-freeze evidence: Exact task, accepted amendment and G final PASS; M304-A0-ACCEPT-01: fresh S3 PASS,61 focused tests and independent strict passed. Original manifest63770583a97e1d0517337474dadc706c1047d78e026e22c7a745ce7674ed9e6b+13referencesunchanged; no outputs, calls or real .env reads. M3-03 capacity remains blocked independently.
- TDD applicability: Applicable; preflight must classify the exact missing B native dispatch/factory behavior and service test coverage. First-module exception requires exact missing export failure and complete behavioral tests.
- Current-state and preflight evidence IDs: M304-A-ACCEPT-01 accepted A after corrected22 tests, independent strict and fresh S3 re-review PASS; M304-A-R1 resolved.
- Accepted test boundary and current test owner: A contract test remains protected; B may extend test-only helper while preserving all A fixture semantics. B tests owner groq_b_test; no accepted B tests until Red.
- Relevant boundaries and paths: New src/server/generation/groq-generation-http.ts and groq-generation.ts; new tests/groq-generation.test.ts and groq-generation-service.test.ts; extension tests/helpers/m304-groq-fixture.ts. Read-only A preparation owners, shared stage/service/repository and Local analogues.
- Production responsibility placement and fit: groq-generation-http.ts owns fixed native TLS request, private echo scanning and bounded response/resource settlement. groq-generation.ts owns thin adapter composition and operation-private credential reference, consuming accepted pure preparation and credential loader. No service or shared-stage changes.
- Dependency, runtime-call, or interface-edge changes: Groq factory imports A preparation and B transport; transport imports native https/util and shared types. Actual service uses its existing explicit adapter seam; no automatic routing/HTTP/UI surface. Shared modules never import Groq I/O.
- Reuse, justified separation, bounded creation, or local-extraction disposition: Reuse accepted A modules and shared stage/proposal validation; create only two declared B responsibility owners. Reuse task-only helper and existing M302 synthetic inputs; native test double and owned service fixture additions stay task-scoped, no generic transport extraction.
- Permitted local structural refactor: Private response/object/echo/resource helpers inside B transport; private lifetime coordination inside thin factory, no edits to A/shared/Local production.
- Non-goals: Any actual provider call, .env read/hash/overwrite, credential acquisition, new dependency, Local implementation, UI/HTTP route/model/runtime work, frozen inputs, Git writes or other roadmap task.
- Named uncertainties: Preflight confirms exact absent exports, service fixture ownership/cleanup and safe runner. G1/G3/G4 already resolve behavior; return contract gaps to primary.
- Risk tier: S3 (credential egress, transport one-attempt provenance, resource lifecycle, durable service integrity).
- Review and escalation triggers: Secret exposure, actual egress, undeclared source placement, wrong status/attempt or cleanup, authority or fixture ownership drift; fresh critical review after Green.

Write scope
- Allowed files: None during preflight. Prospective Red: tests/groq-generation.test.ts, tests/groq-generation-service.test.ts, tests/helpers/m304-groq-fixture.ts.
- Allowed directory roots: None.
- Forbidden files: README.md, package.json, package-lock.json, tsconfig.json, AGENTS.md, PLANS.md.
- Forbidden directory roots: All writes forbidden during preflight.

Validation
- Working directory: C:/projects/a11y-evidence-lab
- Focused command: Read-only preflight only; no fixture-producing command. Prospective G4 B runner loads README[79..172], then Invoke-M105Command { foreach ($m304Test in @('groq-generation-contract','groq-generation','groq-generation-service','generation-stage','generation-service','ollama-generation-contract','ollama-generation','ollama-generation-service')) { & $m105Node --test --test-timeout=120000 ('tests/' + $m304Test + '.test.ts'); if ($LASTEXITCODE -ne 0) { throw 'M304 B focused suite failed' } }; & $m105Node node_modules/typescript/bin/tsc --project tsconfig.json; if ($LASTEXITCODE -ne 0) { throw 'M304 strict TypeScript failed' } }. Red omits strict; first-module failure may stop array at groq-generation.
- Task-level command: G4 complete22-suite closure with independent strict/build; primary owns later effect.
- Expected decisive result and reusable evidence IDs: One supported preflight classification from exact code/exports, harness and runtime evidence. Proposed complete native and service matrix covers G1/G3/G4, no existence-only tests. Identify direct missing dispatchGroqGeneration/GroqNativeRequest and createGroqGenerationAdapter if absent.
- Relevant-tree fingerprint: 47-file source/test tree de6ee831769778dfa5ed3bfe54a80a934243acb3eaa3e60bd4bb13e548624764; all accepted A production remains protected.
- Environment fingerprint or Non-reusable: Node24.20.0 SHA5c976096e04e5c2c1f091938926234cc9fbebfe9787ddd149351b3b0ecc707b5; package01c0b39bd9141588543bd520dbb7a160eac2d95414eef54d36f394fe0fb7ba5c; lock38ce94019310a5efdba9bb5565abe6eb13f678fa18fcd9d87b1c5dc21b30748d; tsconfig3957f80af41b23dc4ccefaa6b24823c367e6984980420b596275b8692df5abde. Pinned virtual-only run identity; no mutable external boundary.
- Known external side effects and cleanup: None during preflight. Prospective B native transport is injected EventEmitter doubles only, credential I/O virtual with no fallback. Service tests may create only owned ordinary temp/m304-groq-* leaves and ephemeral loopback services/probes; close and verify owned resources before contained leaf cleanup, preserve leaf and fail on uncertainty. No unowned endpoint or fixture deletion.

Budget and stopping
- Maximum worker turns: One read-only preflight; future writes separately leased within max3 unchanged role/phase chain.
- Maximum corrections: One ordinary plus conditional final correction with primary evidence justification; one S3 review correction loop.
- Maximum repeated identical failure: Two without new evidence stops.
- Maximum no-diff outcomes: Two stops.
- Validation cadence: Inspect exact source, tests, environment and fixture safety read-only; report classification and stop without writes.
- Stop and escalate when: Any write needed now, unknown classification, altered authority/binding, actual secret/provider boundary or unexpected fixture ownership.

Handoff
- Report full identity, supported classification, exact code/runner facts, proposed native/service fixture matrix and cleanup, risks and documentation impact. No writes, tests, actual .env read/hash, provider call or Git mutation. You are not alone; preserve owner/peer work.
```


### M304-B-PREFLIGHT-01 — native dispatch and factory missing

Primary accepts read-only MISSING: both B production modules and both B test files are absent; shared stage/service seams cover the required composition without changes. The frozen dispatch/factory/type exports and inherited runner are confirmed. The accepted fixture plan adds Groq-specific native lifetime/echo/status doubles and owned actual-service tests while preserving A helper semantics. Complete first-module Red is authorized; assertions blocked by missing imports must be reported as unexecuted.

### M304-B-RED-01 — native and service contract tests

```text
Milestone Assignment Packet v2

Identity
- Workflow ID: M304-20260911-01
- Roadmap task ID: M3-04
- Work-slice ID: M304-20260911-01-B
- Assignment ID: M304-B-red-01
- Lease ID: M304-B-red-01
- Phase: red
- Attempt: 1
- Correction parent lease ID: None
- Worker role: test_worker
- Lease owner: groq_b_test
- Guard contract digest: Pending primary guard start; exact digest supplied at dispatch

Work-slice capsule
- Owning ExecPlan: docs/plans/m3-04-groq-adapter.md, M304-G-CONTRACT-01 and accepted M304-FIT-AMENDMENT-01.
- Observable acceptance contract: Implement G1 private credential lifetime/echo prevention and G3 fixed native HTTPS transport through G4 thin Groq factory, then actual shared stage and service/repository integration. One request only inside AttemptTransport, unchanged admitted bytes, fixed normal TLS endpoint/options, closed response validation and exact status precedence, bounded 1MiB fatal UTF8, every observed resource close, bounded abort/deadline and harmless late callbacks. Missing/malformed credentials, debug guards, oversized bodies and outbound collisions fail before transport entry without invocation; actual attempted status errors preserve truthful invocation. No secret/raw diagnostics in durable output. Factory construction and Local/abstention perform zero credential/provider I/O.
- Exact requirement / ADR / roadmap Verification / BHV / SPEC / HS anchors: REQ-LLM-008/019 in docs/requirements/generation-provider-and-model-lifecycle/GENERATION_PROVIDER_EXECUTION.md; ADR-0020 Groq admission amendment--2026-09-11; docs/DEVELOPMENT_ROADMAP.md M3-04 Verification; EVALUATION_AND_ACCEPTANCE.md BHV-03 and Groq admission amendment to frozen definition; SPEC-003 Groq byte/rejection scenarios; HS-008; ADR-0024 and .codex/execplan-implementation-workflow.md.
- Readiness and evaluation-freeze evidence: Exact task, accepted amendment and G final PASS; M304-A0-ACCEPT-01: fresh S3 PASS,61 focused tests and independent strict passed. Original manifest63770583a97e1d0517337474dadc706c1047d78e026e22c7a745ce7674ed9e6b+13referencesunchanged; no outputs, calls or real .env reads. M3-03 capacity remains blocked independently.
- TDD applicability: Applicable; preflight must classify the exact missing B native dispatch/factory behavior and service test coverage. First-module exception requires exact missing export failure and complete behavioral tests.
- Current-state and preflight evidence IDs: M304-B-PREFLIGHT-01 accepted MISSING: exact B dispatch/factory exports and B native/service tests absent. Accepted A22 tests and environment remain. Existing shared adapter/service seams suffice; first-module Red exception applies.
- Accepted test boundary and current test owner: A contract test remains protected; B may extend test-only helper while preserving all A fixture semantics. B tests owner groq_b_test; no accepted B tests until Red.
- Relevant boundaries and paths: New src/server/generation/groq-generation-http.ts and groq-generation.ts; new tests/groq-generation.test.ts and groq-generation-service.test.ts; extension tests/helpers/m304-groq-fixture.ts. Read-only A preparation owners, shared stage/service/repository and Local analogues.
- Production responsibility placement and fit: groq-generation-http.ts owns fixed native TLS request, private echo scanning and bounded response/resource settlement. groq-generation.ts owns thin adapter composition and operation-private credential reference, consuming accepted pure preparation and credential loader. No service or shared-stage changes.
- Dependency, runtime-call, or interface-edge changes: Groq factory imports A preparation and B transport; transport imports native https/util and shared types. Actual service uses its existing explicit adapter seam; no automatic routing/HTTP/UI surface. Shared modules never import Groq I/O.
- Reuse, justified separation, bounded creation, or local-extraction disposition: Reuse accepted A modules and shared stage/proposal validation; create only two declared B responsibility owners. Reuse task-only helper and existing M302 synthetic inputs; native test double and owned service fixture additions stay task-scoped, no generic transport extraction.
- Permitted local structural refactor: Private response/object/echo/resource helpers inside B transport; private lifetime coordination inside thin factory, no edits to A/shared/Local production.
- Non-goals: Any actual provider call, .env read/hash/overwrite, credential acquisition, new dependency, Local implementation, UI/HTTP route/model/runtime work, frozen inputs, Git writes or other roadmap task.
- Named uncertainties: Preflight confirms exact absent exports, service fixture ownership/cleanup and safe runner. G1/G3/G4 already resolve behavior; return contract gaps to primary.
- Risk tier: S3 (credential egress, transport one-attempt provenance, resource lifecycle, durable service integrity).
- Review and escalation triggers: Secret exposure, actual egress, undeclared source placement, wrong status/attempt or cleanup, authority or fixture ownership drift; fresh critical review after Green.

Write scope
- Allowed files: tests/groq-generation.test.ts; tests/groq-generation-service.test.ts; tests/helpers/m304-groq-fixture.ts.
- Allowed directory roots: None.
- Forbidden files: README.md, package.json, package-lock.json, tsconfig.json, AGENTS.md, PLANS.md, tests/groq-generation-contract.test.ts.
- Forbidden directory roots: src, docs, evaluation, corpus, .codex, .agents, data. All other paths remain outside lease.

Validation
- Working directory: C:/projects/a11y-evidence-lab
- Focused command: Load README[79..172] preparation; Invoke-M105Command { foreach ($m304Test in @('groq-generation-contract','groq-generation','groq-generation-service','generation-stage','generation-service','ollama-generation-contract','ollama-generation','ollama-generation-service')) { & $m105Node --test --test-timeout=120000 ('tests/' + $m304Test + '.test.ts'); if ($LASTEXITCODE -ne 0) { throw 'M304 B focused suite failed' } } }. Red omits strict; A22 must pass, then exact missing B module/export may stop the array at groq-generation. Syntax-check both B tests and helper using pinned Node; no alternate/stub imports.
- Task-level command: G4 complete22-suite closure with independent strict/build; primary owns later effect.
- Expected decisive result and reusable evidence IDs: Complete G1/G3/G4 native/factory/stage/service behavioral tests at frozen exports. Exact ERR_MODULE_NOT_FOUND naming groq-generation-http.ts or groq-generation.ts only; report declarations/assertions unexecuted, including service file not reached by fail-fast runner. No existence-only tests, skips or production stubs. Cover exact options/body, zero-call gates, private secret echo/property/escaped rejection, status precedence including qualifying quota with echo, complete envelope matrix/1MiBcap, all sockets and late callbacks/abort/deadline, actual service selected-only preservation and persistence failures.
- Relevant-tree fingerprint: 47-file source/test tree de6ee831769778dfa5ed3bfe54a80a934243acb3eaa3e60bd4bb13e548624764; all accepted A production remains protected.
- Environment fingerprint or Non-reusable: Node24.20.0 SHA5c976096e04e5c2c1f091938926234cc9fbebfe9787ddd149351b3b0ecc707b5; package01c0b39bd9141588543bd520dbb7a160eac2d95414eef54d36f394fe0fb7ba5c; lock38ce94019310a5efdba9bb5565abe6eb13f678fa18fcd9d87b1c5dc21b30748d; tsconfig3957f80af41b23dc4ccefaa6b24823c367e6984980420b596275b8692df5abde. Pinned virtual-only run identity; no mutable external boundary.
- Known external side effects and cleanup: Only3leased test files written. At initial missing-module Red no servicefixture executes. EventEmitter native doubles and virtual credential I/O only; no fallback to native/provider. Later Green service tests own only ordinary temp/m304-groq-* leaves and ephemeral loopback services/probes; bound stop and verified closure, absolute containment and ordinary inventory before exact leaf removal. Preserve leaf and fail when uncertain; no other deletion. Preserve Ahelper exports/semantics.

Budget and stopping
- Maximum worker turns: One active Red write turn, attempt1 of maximum3 unchanged role/phase chain; any correction requires primary lease.
- Maximum corrections: One ordinary plus conditional final correction with primary evidence justification; one S3 review correction loop.
- Maximum repeated identical failure: Two without new evidence stops.
- Maximum no-diff outcomes: Two stops.
- Validation cadence: Add complete coherent B matrix, run exact focused Red once and syntax checks, report declaration counts/unexecuted assertions and evidence hashes, then stop. No Green, fullsuite, build or source edits.
- Stop and escalate when: Wrong Red, contract ambiguity, undeclared file/source required, Afixture semantic change, actual secret/provider boundary or exhausted budget.

Handoff
- Report full assignment/digest, touched paths, exact command/exit and missing-callable failure, complete declaration matrix and unexecuted assertions, test/helper hashes, preservation and cleanup limits. Cohesion None. No actual .env read/hash, provider call or Git/guard mutation. You are not alone; preserve owner/peer work. Stop writing at handoff.
```

### M304-B-RED-RECONCILE-01 — native fixture and coverage correction

B Red01 closed-compliant under contract `fbbff53ce4df51c9e992f6eb5679e8c923cf59b056569fc6dee0215a6b228ff6`, receipt `c9463be6a2c7acb321075f93702e5e8d1e9482aff975ce7bcedd38a28366b272`. A22 passes; the expected missing Groq HTTP module prevents all twelve native/stage and six service tests from executing. Primary read both full new tests and the additive helper. Acceptance is withheld: the claimed escaped credential example changes the required response object and leaves the key literal, while the synthetic timeout uses a non-native event. Several declared G1/G3 lifecycle and failure edges also lack discriminating proof. These are contained test corrections within the original contract; no source exists or changes. Red02 supersedes initial test evidence and uses the ordinary correction allowance.

### M304-B-RED-02 — corrected native and service matrix

```text
Milestone Assignment Packet v2

Identity
- Workflow ID: M304-20260911-01
- Roadmap task ID: M3-04
- Work-slice ID: M304-20260911-01-B
- Assignment ID: M304-B-red-02
- Lease ID: M304-B-red-02
- Phase: red
- Attempt: 2
- Correction parent lease ID: M304-B-red-01
- Worker role: test_worker
- Lease owner: groq_b_test
- Guard contract digest: Pending primary guard start; exact digest supplied at dispatch

Work-slice capsule
- Owning ExecPlan: docs/plans/m3-04-groq-adapter.md, M304-G-CONTRACT-01 and accepted M304-FIT-AMENDMENT-01.
- Observable acceptance contract: Implement G1 private credential lifetime/echo prevention and G3 fixed native HTTPS transport through G4 thin Groq factory, then actual shared stage and service/repository integration. One request only inside AttemptTransport, unchanged admitted bytes, fixed normal TLS endpoint/options, closed response validation and exact status precedence, bounded 1MiB fatal UTF8, every observed resource close, bounded abort/deadline and harmless late callbacks. Missing/malformed credentials, debug guards, oversized bodies and outbound collisions fail before transport entry without invocation; actual attempted status errors preserve truthful invocation. No secret/raw diagnostics in durable output. Factory construction and Local/abstention perform zero credential/provider I/O.
- Exact requirement / ADR / roadmap Verification / BHV / SPEC / HS anchors: REQ-LLM-008/019 in docs/requirements/generation-provider-and-model-lifecycle/GENERATION_PROVIDER_EXECUTION.md; ADR-0020 Groq admission amendment--2026-09-11; docs/DEVELOPMENT_ROADMAP.md M3-04 Verification; EVALUATION_AND_ACCEPTANCE.md BHV-03 and Groq admission amendment to frozen definition; SPEC-003 Groq byte/rejection scenarios; HS-008; ADR-0024 and .codex/execplan-implementation-workflow.md.
- Readiness and evaluation-freeze evidence: Exact task, accepted amendment and G final PASS; M304-A0-ACCEPT-01: fresh S3 PASS,61 focused tests and independent strict passed. Original manifest63770583a97e1d0517337474dadc706c1047d78e026e22c7a745ce7674ed9e6b+13referencesunchanged; no outputs, calls or real .env reads. M3-03 capacity remains blocked independently.
- TDD applicability: Applicable; preflight must classify the exact missing B native dispatch/factory behavior and service test coverage. First-module exception requires exact missing export failure and complete behavioral tests.
- Current-state and preflight evidence IDs: Initial B Red01 closed compliant and exact missing B HTTP module reproduced by worker after A22 pass. Primary inspected all new tests/helper. Test boundary not yet accepted: escaped-echo case changes required object and does not escape the credential; timeout double emits fixture-timeout, not native timeout. Existing G1/G3 lifecycle/failure cases need complete proof.
- Accepted test boundary and current test owner: A contract test remains protected; B may extend test-only helper while preserving all A fixture semantics. B tests owner groq_b_test; no accepted B tests until Red.
- Relevant boundaries and paths: New src/server/generation/groq-generation-http.ts and groq-generation.ts; new tests/groq-generation.test.ts and groq-generation-service.test.ts; extension tests/helpers/m304-groq-fixture.ts. Read-only A preparation owners, shared stage/service/repository and Local analogues.
- Production responsibility placement and fit: groq-generation-http.ts owns fixed native TLS request, private echo scanning and bounded response/resource settlement. groq-generation.ts owns thin adapter composition and operation-private credential reference, consuming accepted pure preparation and credential loader. No service or shared-stage changes.
- Dependency, runtime-call, or interface-edge changes: Groq factory imports A preparation and B transport; transport imports native https/util and shared types. Actual service uses its existing explicit adapter seam; no automatic routing/HTTP/UI surface. Shared modules never import Groq I/O.
- Reuse, justified separation, bounded creation, or local-extraction disposition: Reuse accepted A modules and shared stage/proposal validation; create only two declared B responsibility owners. Reuse task-only helper and existing M302 synthetic inputs; native test double and owned service fixture additions stay task-scoped, no generic transport extraction.
- Permitted local structural refactor: Private response/object/echo/resource helpers inside B transport; private lifetime coordination inside thin factory, no edits to A/shared/Local production.
- Non-goals: Any actual provider call, .env read/hash/overwrite, credential acquisition, new dependency, Local implementation, UI/HTTP route/model/runtime work, frozen inputs, Git writes or other roadmap task.
- Named uncertainties: No new decision. Tests must honor G3 dispatch-time pre-entry exceptions (stage maps configuration/no invocation) rather than require a returned failure from every direct dispatch. Native timeout event is timeout. Do not turn fixture conventions into production requirements.
- Risk tier: S3 (credential egress, transport one-attempt provenance, resource lifecycle, durable service integrity).
- Review and escalation triggers: Secret exposure, actual egress, undeclared source placement, wrong status/attempt or cleanup, authority or fixture ownership drift; fresh critical review after Green.

Write scope
- Allowed files: tests/groq-generation.test.ts; tests/groq-generation-service.test.ts; tests/helpers/m304-groq-fixture.ts.
- Allowed directory roots: None.
- Forbidden files: README.md, package.json, package-lock.json, tsconfig.json, AGENTS.md, PLANS.md, tests/groq-generation-contract.test.ts.
- Forbidden directory roots: src, docs, evaluation, corpus, .codex, .agents, data. All other paths remain outside lease.

Validation
- Working directory: C:/projects/a11y-evidence-lab
- Focused command: Load README[79..172] preparation; Invoke-M105Command { foreach ($m304Test in @('groq-generation-contract','groq-generation','groq-generation-service','generation-stage','generation-service','ollama-generation-contract','ollama-generation','ollama-generation-service')) { & $m105Node --test --test-timeout=120000 ('tests/' + $m304Test + '.test.ts'); if ($LASTEXITCODE -ne 0) { throw 'M304 B focused suite failed' } } }. Red omits strict; A22 must pass, then exact missing B module/export may stop the array at groq-generation. Syntax-check both B tests and helper using pinned Node; no alternate/stub imports.
- Task-level command: G4 complete22-suite closure with independent strict/build; primary owns later effect.
- Expected decisive result and reusable evidence IDs: Correct one coherent B test boundary: (1) valid envelope metadata and candidate string/property echoes with genuinely Unicode-escaped key; prove raw encoded representation lacks literal key and decoded target contains it, without unrelated invalid envelope fields; (2) native timeout event/callback semantics; (3) precise zero-attempt error classes via actual stage or accepted prepare/pre-entry exception, outbound property-name collision and admitted invalid config; (4) credential preparation abort/deadline and post-prepare abort, cleared terminal credential prevents fresh-capability replay; (5) network/synchronous failures, non200 after response/socket/request errors, incomplete qualifying400 stays provider; (6) late assigned sockets/errors destroyed/absorbed after abort; (7) allowed null/absent refusal and null/empty/absent reasoning plus invalid types and candidate echoes; (8) remove vacuous exclusion sentinels absent from source fixture, retain actual present-value and closed outbound structure proof. Preserve all valid current B tests and A helper semantics. Exact first-module Red remains expected; all complete B assertions still unexecuted. Keep body fixtures synthetic and full suite out of scope.
- Relevant-tree fingerprint: 47-file source/test tree de6ee831769778dfa5ed3bfe54a80a934243acb3eaa3e60bd4bb13e548624764; all accepted A production remains protected.
- Environment fingerprint or Non-reusable: Node24.20.0 SHA5c976096e04e5c2c1f091938926234cc9fbebfe9787ddd149351b3b0ecc707b5; package01c0b39bd9141588543bd520dbb7a160eac2d95414eef54d36f394fe0fb7ba5c; lock38ce94019310a5efdba9bb5565abe6eb13f678fa18fcd9d87b1c5dc21b30748d; tsconfig3957f80af41b23dc4ccefaa6b24823c367e6984980420b596275b8692df5abde. Pinned virtual-only run identity; no mutable external boundary.
- Known external side effects and cleanup: Only3leased test files written. At initial missing-module Red no servicefixture executes. EventEmitter native doubles and virtual credential I/O only; no fallback to native/provider. Later Green service tests own only ordinary temp/m304-groq-* leaves and ephemeral loopback services/probes; bound stop and verified closure, absolute containment and ordinary inventory before exact leaf removal. Preserve leaf and fail when uncertain; no other deletion. Preserve Ahelper exports/semantics.

Budget and stopping
- Maximum worker turns: One ordinary B Red correction attempt2 of max3 unchanged chain; conditional final attempt only with primary new-evidence/progress justification.
- Maximum corrections: One ordinary plus conditional final correction with primary evidence justification; one S3 review correction loop.
- Maximum repeated identical failure: Two without new evidence stops.
- Maximum no-diff outcomes: Two stops.
- Validation cadence: Complete this single same-contract matrix correction; run exact B fail-fast Red (A22 then absentB) and syntaxcheck all3paths, report updated hashes/counts and stop.
- Stop and escalate when: Wrong Red, contract ambiguity, undeclared file/source required, Afixture semantic change, actual secret/provider boundary or exhausted budget.

Handoff
- Report full assignment/digest, touched paths, exact command/exit and missing-callable failure, complete declaration matrix and unexecuted assertions, test/helper hashes, preservation and cleanup limits. Cohesion None. No actual .env read/hash, provider call or Git/guard mutation. You are not alone; preserve owner/peer work. Stop writing at handoff.
```

### M304-B-RED-RECONCILE-02 — final bounded test correction

Red02 closes compliant, contract `ad746f55140812472e063fe9f76dfcd502d186b1269387794208e6abf9a401d0`, receipt `0d9d7fa196540fb060ba72817b60a9472bea13d274e86dcf3360039f38bb1b7e`. It materially improves all eight named test groups and preserves A22. Primary inspection and diagnostic strict checking now identify an undefined `waitUntil` helper (two TS2304 references), separately from the expected missing-module/contextual-type diagnostics. Two assertions also overconstrain the existing contract: arbitrary capability exception text need not propagate, and valid early preparation rejection need not claim dispatch cleanup uncertainty. Original preparation-signal cancellation should be exercised explicitly in the existing lifetime case.

The following conditional final correction is justified by that concrete progress and new static/semantic evidence. It changes no product contract, source placement or scope. B remains unaccepted until the corrected complete tests and evidence are inspected; no fourth test write attempt is available.

### M304-B-RED-03 — complete bounded test correction

```text
Milestone Assignment Packet v2

Identity
- Workflow ID: M304-20260911-01
- Roadmap task ID: M3-04
- Work-slice ID: M304-20260911-01-B
- Assignment ID: M304-B-red-03
- Lease ID: M304-B-red-03
- Phase: red
- Attempt: 3
- Correction parent lease ID: M304-B-red-02
- Worker role: test_worker
- Lease owner: groq_b_test
- Guard contract digest: Pending primary guard start; exact digest supplied at dispatch

Work-slice capsule
- Owning ExecPlan: docs/plans/m3-04-groq-adapter.md, M304-G-CONTRACT-01 and accepted M304-FIT-AMENDMENT-01.
- Observable acceptance contract: Implement G1 private credential lifetime/echo prevention and G3 fixed native HTTPS transport through G4 thin Groq factory, then actual shared stage and service/repository integration. One request only inside AttemptTransport, unchanged admitted bytes, fixed normal TLS endpoint/options, closed response validation and exact status precedence, bounded 1MiB fatal UTF8, every observed resource close, bounded abort/deadline and harmless late callbacks. Missing/malformed credentials, debug guards, oversized bodies and outbound collisions fail before transport entry without invocation; actual attempted status errors preserve truthful invocation. No secret/raw diagnostics in durable output. Factory construction and Local/abstention perform zero credential/provider I/O.
- Exact requirement / ADR / roadmap Verification / BHV / SPEC / HS anchors: REQ-LLM-008/019 in docs/requirements/generation-provider-and-model-lifecycle/GENERATION_PROVIDER_EXECUTION.md; ADR-0020 Groq admission amendment--2026-09-11; docs/DEVELOPMENT_ROADMAP.md M3-04 Verification; EVALUATION_AND_ACCEPTANCE.md BHV-03 and Groq admission amendment to frozen definition; SPEC-003 Groq byte/rejection scenarios; HS-008; ADR-0024 and .codex/execplan-implementation-workflow.md.
- Readiness and evaluation-freeze evidence: Exact task, accepted amendment and G final PASS; M304-A0-ACCEPT-01: fresh S3 PASS,61 focused tests and independent strict passed. Original manifest63770583a97e1d0517337474dadc706c1047d78e026e22c7a745ce7674ed9e6b+13referencesunchanged; no outputs, calls or real .env reads. M3-03 capacity remains blocked independently.
- TDD applicability: Applicable; preflight must classify the exact missing B native dispatch/factory behavior and service test coverage. First-module exception requires exact missing export failure and complete behavioral tests.
- Current-state and preflight evidence IDs: Red02 closed compliant and materially completed all eight correction groups. Primary read the changed tests/helper and ran diagnostic strict: expected TS2307 absent modules and contextual TS7006, but two TS2304 references prove waitUntil is undefined. Primary also found overconstraint of allowed prepare/pre-entry cleanup and arbitrary AttemptTransport exception message.
- Accepted test boundary and current test owner: A contract test remains protected; B may extend test-only helper while preserving all A fixture semantics. B tests owner groq_b_test; no accepted B tests until Red.
- Relevant boundaries and paths: New src/server/generation/groq-generation-http.ts and groq-generation.ts; new tests/groq-generation.test.ts and groq-generation-service.test.ts; extension tests/helpers/m304-groq-fixture.ts. Read-only A preparation owners, shared stage/service/repository and Local analogues.
- Production responsibility placement and fit: groq-generation-http.ts owns fixed native TLS request, private echo scanning and bounded response/resource settlement. groq-generation.ts owns thin adapter composition and operation-private credential reference, consuming accepted pure preparation and credential loader. No service or shared-stage changes.
- Dependency, runtime-call, or interface-edge changes: Groq factory imports A preparation and B transport; transport imports native https/util and shared types. Actual service uses its existing explicit adapter seam; no automatic routing/HTTP/UI surface. Shared modules never import Groq I/O.
- Reuse, justified separation, bounded creation, or local-extraction disposition: Reuse accepted A modules and shared stage/proposal validation; create only two declared B responsibility owners. Reuse task-only helper and existing M302 synthetic inputs; native test double and owned service fixture additions stay task-scoped, no generic transport extraction.
- Permitted local structural refactor: Private response/object/echo/resource helpers inside B transport; private lifetime coordination inside thin factory, no edits to A/shared/Local production.
- Non-goals: Any actual provider call, .env read/hash/overwrite, credential acquisition, new dependency, Local implementation, UI/HTTP route/model/runtime work, frozen inputs, Git writes or other roadmap task.
- Named uncertainties: No new decision. Tests must honor G3 dispatch-time pre-entry exceptions (stage maps configuration/no invocation) rather than require a returned failure from every direct dispatch. Native timeout event is timeout. Do not turn fixture conventions into production requirements.
- Risk tier: S3 (credential egress, transport one-attempt provenance, resource lifecycle, durable service integrity).
- Review and escalation triggers: Secret exposure, actual egress, undeclared source placement, wrong status/attempt or cleanup, authority or fixture ownership drift; fresh critical review after Green.

Write scope
- Allowed files: tests/groq-generation.test.ts; tests/groq-generation-service.test.ts; tests/helpers/m304-groq-fixture.ts.
- Allowed directory roots: None.
- Forbidden files: README.md, package.json, package-lock.json, tsconfig.json, AGENTS.md, PLANS.md, tests/groq-generation-contract.test.ts.
- Forbidden directory roots: src, docs, evaluation, corpus, .codex, .agents, data. All other paths remain outside lease.

Validation
- Working directory: C:/projects/a11y-evidence-lab
- Focused command: Load README[79..172] preparation; Invoke-M105Command { foreach ($m304Test in @('groq-generation-contract','groq-generation','groq-generation-service','generation-stage','generation-service','ollama-generation-contract','ollama-generation','ollama-generation-service')) { & $m105Node --test --test-timeout=120000 ('tests/' + $m304Test + '.test.ts'); if ($LASTEXITCODE -ne 0) { throw 'M304 B focused suite failed' } } }. Red omits strict; A22 must pass, then exact missing B module/export may stop the array at groq-generation. Syntax-check both B tests and helper using pinned Node; no alternate/stub imports.
- Task-level command: G4 complete22-suite closure with independent strict/build; primary owns later effect.
- Expected decisive result and reusable evidence IDs: Finish only bounded Red02 issues: define bounded waitUntil using captured native timer and performance clock; remove raw AUTHORED_PREENTRY_EXCEPTION propagation expectation (G3 promises zero invocation/configuration via stage, not arbitrary exception identity); for debug/outbound stage gates assert failed/configuration, no invocation, zero native requests, and honest boolean cleanupFailed without forcing dispatch instead of allowed early preparation. Preserve meaningful exact error checks. Extend existing post-prepare abort case to retain and abort the original preparation signal, then prove no later native start with fresh non-aborted dispatch signal/capability; allow contract-compatible closed failure or pre-entry rejection, not raw diagnostic identity. Preserve all other accepted G1/G3 vectors and A semantics. Run exact missing-module Red/syntax checks; diagnostic strict may still report missing modules and dependent contextual types, but no unknown helper/name errors. No production stub or tests for hypothetical scope.
- Relevant-tree fingerprint: 47-file source/test tree de6ee831769778dfa5ed3bfe54a80a934243acb3eaa3e60bd4bb13e548624764; all accepted A production remains protected.
- Environment fingerprint or Non-reusable: Node24.20.0 SHA5c976096e04e5c2c1f091938926234cc9fbebfe9787ddd149351b3b0ecc707b5; package01c0b39bd9141588543bd520dbb7a160eac2d95414eef54d36f394fe0fb7ba5c; lock38ce94019310a5efdba9bb5565abe6eb13f678fa18fcd9d87b1c5dc21b30748d; tsconfig3957f80af41b23dc4ccefaa6b24823c367e6984980420b596275b8692df5abde. Pinned virtual-only run identity; no mutable external boundary.
- Known external side effects and cleanup: Only3leased test files written. At initial missing-module Red no servicefixture executes. EventEmitter native doubles and virtual credential I/O only; no fallback to native/provider. Later Green service tests own only ordinary temp/m304-groq-* leaves and ephemeral loopback services/probes; bound stop and verified closure, absolute containment and ordinary inventory before exact leaf removal. Preserve leaf and fail when uncertain; no other deletion. Preserve Ahelper exports/semantics.

Budget and stopping
- Maximum worker turns: Conditional final B Red attempt3, parent Red02; no fourth attempt. Red02 made concrete progress: true escaped envelope/candidate checks, native timeout semantics, status/lifetime cases, A22 pass. New diagnostic evidence identifies exactly two undefined waitUntil references, while direct contract comparison identifies two assertion overconstraints. Different bounded correction supplies that helper and aligns assertions with existing G3 stages; likely to finish because all other changed test families have been inspected and remain unchanged. Existing max3 rule authorizes this final correction without renewed scope; S3 review loop remains unused.
- Maximum corrections: One ordinary plus conditional final correction with primary evidence justification; one S3 review correction loop.
- Maximum repeated identical failure: Two without new evidence stops.
- Maximum no-diff outcomes: Two stops.
- Validation cadence: Apply only named bounded corrections; run exact B fail-fast Red and syntax checks, then diagnostic strict with failure honestly retained for absent modules. Report no TS2304 or other independent errors, exact hashes/counts and stop.
- Stop and escalate when: Unsuccessful final correction, new independent test defect, same decisive failure without new evidence, contract/scope drift, actual secret/provider boundary. No further test attempt authorized.

Handoff
- Report full assignment/digest, touched paths, exact command/exit and missing-callable failure, complete declaration matrix and unexecuted assertions, test/helper hashes, preservation and cleanup limits. Cohesion None. No actual .env read/hash, provider call or Git/guard mutation. You are not alone; preserve owner/peer work. Stop writing at handoff.
```

### M304-B-RED-ACCEPT-01 — complete native/service tests accepted

Red03 closes compliant under contract `258a67e814abf72f043f17cc0c80f4f96b537f2226c8fe78ef99638468258100`, receipt `7db774a8fb6aa0434ec98e45436228fe1b6f2bb381853664438367b618e5172a`. Primary inspected the final corrections and complete B test/helper surface. Exact worker fail-fast caller passes A22 then reaches only the absent `groq-generation-http.ts`; primary additionally reproduced the same import failure with a two-file A/B native-test caller (22 pass, one file-level failure). All sixteen B native/stage and six service tests remain unexecuted under the first-module exception. Diagnostic strict has only absent-module-dependent errors; the unknown helper references are resolved.

The original A helper body reconstructs byte-for-byte to its accepted `d6177b2229c3820fe18f9bd7512ba5378f28e40f0f339cbcc30c86fded5a27d1` hash after excluding additive B imports/exports. A source and A test hashes are unchanged. The fresh 49-file tree is `bd5e7e99c4152d274b6fd79588e4de406f7ca4b64ffa132aba3ff52396ae920c`. Corrected test hashes are pinned below; prior B test evidence is superseded. Red attempts are exhausted after successful final correction; Green and S3 review allowances remain.

### M304-B-GREEN-01 — native transport and adapter composition

```text
Milestone Assignment Packet v2

Identity
- Workflow ID: M304-20260911-01
- Roadmap task ID: M3-04
- Work-slice ID: M304-20260911-01-B
- Assignment ID: M304-B-green-01
- Lease ID: M304-B-green-01
- Phase: green
- Attempt: 1
- Correction parent lease ID: None
- Worker role: code_worker
- Lease owner: groq_b_code
- Guard contract digest: Pending primary guard start; exact digest supplied at dispatch

Work-slice capsule
- Owning ExecPlan: docs/plans/m3-04-groq-adapter.md, M304-G-CONTRACT-01 and accepted M304-FIT-AMENDMENT-01.
- Observable acceptance contract: Implement G1 private credential lifetime/echo prevention and G3 fixed native HTTPS transport through G4 thin Groq factory, then actual shared stage and service/repository integration. One request only inside AttemptTransport, unchanged admitted bytes, fixed normal TLS endpoint/options, closed response validation and exact status precedence, bounded 1MiB fatal UTF8, every observed resource close, bounded abort/deadline and harmless late callbacks. Missing/malformed credentials, debug guards, oversized bodies and outbound collisions fail before transport entry without invocation; actual attempted status errors preserve truthful invocation. No secret/raw diagnostics in durable output. Factory construction and Local/abstention perform zero credential/provider I/O.
- Exact requirement / ADR / roadmap Verification / BHV / SPEC / HS anchors: REQ-LLM-008/019 in docs/requirements/generation-provider-and-model-lifecycle/GENERATION_PROVIDER_EXECUTION.md; ADR-0020 Groq admission amendment--2026-09-11; docs/DEVELOPMENT_ROADMAP.md M3-04 Verification; EVALUATION_AND_ACCEPTANCE.md BHV-03 and Groq admission amendment to frozen definition; SPEC-003 Groq byte/rejection scenarios; HS-008; ADR-0024 and .codex/execplan-implementation-workflow.md.
- Readiness and evaluation-freeze evidence: Exact task, accepted amendment and G final PASS; M304-A0-ACCEPT-01: fresh S3 PASS,61 focused tests and independent strict passed. Original manifest63770583a97e1d0517337474dadc706c1047d78e026e22c7a745ce7674ed9e6b+13referencesunchanged; no outputs, calls or real .env reads. M3-03 capacity remains blocked independently.
- TDD applicability: Applicable; preflight must classify the exact missing B native dispatch/factory behavior and service test coverage. First-module exception requires exact missing export failure and complete behavioral tests.
- Current-state and preflight evidence IDs: M304-B-RED-ACCEPT-01 accepts final corrected Red03; first-module failure is exact groq-generation-http.ts. A22 passes, all16 native/stage and6 service tests remain unexecuted.
- Accepted test boundary and current test owner: Owner groq_b_test; tests/groq-generation.test.ts SHA256 29e2e7fa9c6d77831f612e5940f0dc5470cb5e3430f13767d85aba900b456282; tests/groq-generation-service.test.ts e1b931f425e62afd5bde60a5945e60b878fef8908ae37e2b9ff552aafb90e878; helper 6f14d01ddfd87309effb626fbe5760b19921290db88ec0f6aab37f1d8632ff15. Every test and helper byte is protected during Green.
- Relevant boundaries and paths: New src/server/generation/groq-generation-http.ts and groq-generation.ts; new tests/groq-generation.test.ts and groq-generation-service.test.ts; extension tests/helpers/m304-groq-fixture.ts. Read-only A preparation owners, shared stage/service/repository and Local analogues.
- Production responsibility placement and fit: groq-generation-http.ts owns fixed native TLS request, private echo scanning and bounded response/resource settlement. groq-generation.ts owns thin adapter composition and operation-private credential reference, consuming accepted pure preparation and credential loader. No service or shared-stage changes.
- Dependency, runtime-call, or interface-edge changes: Groq factory imports A preparation and B transport; transport imports native https/util and shared types. Actual service uses its existing explicit adapter seam; no automatic routing/HTTP/UI surface. Shared modules never import Groq I/O.
- Reuse, justified separation, bounded creation, or local-extraction disposition: Reuse accepted A modules and shared stage/proposal validation; create only two declared B responsibility owners. Reuse task-only helper and existing M302 synthetic inputs; native test double and owned service fixture additions stay task-scoped, no generic transport extraction.
- Permitted local structural refactor: Private response/object/echo/resource helpers inside B transport; private lifetime coordination inside thin factory, no edits to A/shared/Local production.
- Non-goals: Any actual provider call, .env read/hash/overwrite, credential acquisition, new dependency, Local implementation, UI/HTTP route/model/runtime work, frozen inputs, Git writes or other roadmap task.
- Named uncertainties: Preflight confirms exact absent exports, service fixture ownership/cleanup and safe runner. G1/G3/G4 already resolve behavior; return contract gaps to primary.
- Risk tier: S3 (credential egress, transport one-attempt provenance, resource lifecycle, durable service integrity).
- Review and escalation triggers: Secret exposure, actual egress, undeclared source placement, wrong status/attempt or cleanup, authority or fixture ownership drift; fresh critical review after Green.

Write scope
- Allowed files: src/server/generation/groq-generation-http.ts; src/server/generation/groq-generation.ts.
- Allowed directory roots: None.
- Forbidden files: README.md, package.json, package-lock.json, tsconfig.json, AGENTS.md, PLANS.md.
- Forbidden directory roots: tests, docs, evaluation, corpus, .codex, .agents, data. All other paths remain outside lease.

Validation
- Working directory: C:/projects/a11y-evidence-lab
- Focused command: Load README[79..172] preparation; Invoke-M105Command { foreach ($m304Test in @('groq-generation-contract','groq-generation','groq-generation-service','generation-stage','generation-service','ollama-generation-contract','ollama-generation','ollama-generation-service')) { & $m105Node --test --test-timeout=120000 ('tests/' + $m304Test + '.test.ts'); if ($LASTEXITCODE -ne 0) { throw 'M304 B focused suite failed' } }; & $m105Node node_modules/typescript/bin/tsc --project tsconfig.json; if ($LASTEXITCODE -ne 0) { throw 'M304 strict TypeScript failed' } }. All eight suites sequential; verify owned service fixture cleanup.
- Task-level command: G4 complete22-suite closure with independent strict/build; primary owns later effect.
- Expected decisive result and reusable evidence IDs: Every accepted B behavioral test executes and passes unchanged, along with all eight focused suites and independent strict. Implement full authored G1/G3/G4 beyond visible tests; no source outside the two named B owners. Exact single native attempt and admitted bytes, private credential echo/lifetime, status precedence and honest cleanup, actual selected-only durable integration without new shared/service code.
- Relevant-tree fingerprint: 49-file source/test tree bd5e7e99c4152d274b6fd79588e4de406f7ca4b64ffa132aba3ff52396ae920c. A source and all other production remain protected.
- Environment fingerprint or Non-reusable: Node24.20.0 SHA5c976096e04e5c2c1f091938926234cc9fbebfe9787ddd149351b3b0ecc707b5; package01c0b39bd9141588543bd520dbb7a160eac2d95414eef54d36f394fe0fb7ba5c; lock38ce94019310a5efdba9bb5565abe6eb13f678fa18fcd9d87b1c5dc21b30748d; tsconfig3957f80af41b23dc4ccefaa6b24823c367e6984980420b596275b8692df5abde. Pinned virtual-only run identity; no mutable external boundary.
- Known external side effects and cleanup: Only2leased source files written. Verification uses injected virtual credentials/native doubles; actual service tests own only ordinary temp/m304-groq-* leaves and ephemeral loopback services/probes. Confirm normal cleanup leaves no owned fixture; uncertain resources preserve leaf and fail. No actual.envread/hash/provider/acquisition/Gitmutation. No source/test edits outside lease.

Budget and stopping
- Maximum worker turns: One Green attempt1 of maximum3 unchanged role/phase chain. Any correction requires primary fresh lease; never fix accepted tests.
- Maximum corrections: One ordinary plus conditional final correction with primary evidence justification; one S3 review correction loop.
- Maximum repeated identical failure: Two without new evidence stops.
- Maximum no-diff outcomes: Two stops.
- Validation cadence: Implement two cohesive B owners, run eight focused suites and independent strict, inspect structural responsibility and source/test hashes, report and stop.
- Stop and escalate when: Contract/test conflict, unsafe fixture ownership, need to modify A/shared/Local/tests or other undeclared path, real secret/provider boundary, authority drift or exhausted budget.

Handoff
- Report assignment/digest, exact touched paths and complete commands/results, full source/test/tree/environment identities, fixture cleanup evidence, responsibility and dependency inspection (RETAINED/REFACTORED/RECONCILE), residual risks and documentation impact. Stop writing at handoff. You are not alone; preserve owner/peer work. Git read-only; no guard or actual .env/provider operations.
```


### M304-B-GREEN-EVIDENCE-01 — native and service implementation ready for review

M304-B-green-01 closes compliant, contract `86d3e72930c3cb1912e818571c592960e597e91c99eba0deccf56124b4156567`, receipt `6ac232a0c7d0330849ced430584a9ec2583ee5e047420093b795ee6dd6531fbf`. Primary inspected both complete source modules, independently reran strict TypeScript, and reproduced the 51-file source/test fingerprint `63273f1d555f8ee9e81943ddcaffdf006d166bf502a144605f2ea7b140e2eead`. The protected 49-file pre-Green tree remains unchanged. Source hashes: native HTTP `1b8784e1f46d12f1e87e94cecab86c25bf647a513e2821509783b134d58e9b22`, factory `2a05e924e99f5611085656afadf2bbe0abce008e668bd9ef598a65c884168642`.

Exact eight-suite execution passes 131 tests (22, 16, 6, 27, 10, 34, 10, 6); strict passes independently and no owned `temp/m304-groq-*` leaf remains. A preliminary worker Red caller failed to propagate its native exit; its result is not accepted evidence and is superseded by the exact fail-fast Red caller. No post-Green source change occurred. Responsibility placement remains cohesive: native transport/response/resource ownership and thin adapter/private credential lifetime are separate. All accepted tests are unchanged. Fresh B S3 review remains required before full task closure.

### M304-B-REVIEW-01 — bounded response corrections

Fresh critical review returned REVISE with two Major findings and no Blocker or Minor. B1: envelope/choice reserved `tool_calls`, `function_call`, non-permitted `refusal` and `reasoning` bypass message-only validation; an actual shared-stage probe publishes a proposal. B2: an active duplicate response is destroyed but its unobserved close does not prevent successful publication. Both violate existing G3 and require no authority amendment. Review independently passed all 44 Groq tests, reproduced both defects and the Green01 tree, and verified its compliant receipt. Candidate-then-cancellation/error probes passed. No owned fixture remained. Routine corrections remain in this task record under the bug recording rules.

Primary authorizes the sole B S3 correction loop. Before any Green lease, the explicit [ADR-0024 coordinator test-correction exception](../../architecture/decisions/ADR-0024-milestone-slice-tdd-with-independent-ownership.md) applies narrowly to `tests/groq-generation.test.ts`: add envelope/choice extension vectors and one active-duplicate resource regression using existing helpers. No source or helper edits are authorized to primary. This is an exceptional bounded test correction between leases, not a fourth test-worker write turn or renewed budget; the separate implementation owner remains `groq_b_code`. Existing successful Red03 and Green01 evidence is invalidated for this revised boundary. Primary must inspect the additive diff, run fresh behavioral Red with the prepared native-suite caller, capture its test/tree identities, and re-accept the boundary before Green02. All other accepted tests remain unchanged. Green02 is the existing ordinary correction, parent Green01, with the same two source paths and remaining conditional-third-attempt rules.


### M304-B-CORRECTION-RED-01 — primary test exception accepted

Primary added eight envelope/choice vectors to the existing response table and one active-duplicate regression, using unchanged helpers. The prepared caller `Invoke-M105Command { & $m105Node --test --test-timeout=120000 tests/groq-generation.test.ts; if ($LASTEXITCODE -ne 0) { throw 'M304 B regression Red' } }` exits 1: 15 pass, exactly 2 fail on envelope tool_calls success and duplicate response success. Remaining new table vectors stop after the first failing assertion; the independent review reproduced all eight. Native suite has 17 tests, no skip/todo/cancellation. The duplicate test cancels in finally and awaits terminal settlement. Primary inspected the additive diff; source and all other tests remain unchanged. Corrected test SHA-256 `6bec77b1d262efaa83a79fa2c79a0e6c09b75eea624da5ffe3296af26603dc5c`; 51-file tree `8ec5c4d55dd719bbfc1ece8eb82aa7cb89149dd02e7185fb314b6cd933e1bd1b`. This fresh executed Red replaces affected prior evidence and is accepted before Green02. Environment identities and preparation are unchanged. The read-only process check also found no matching application Node service; no secret contents were inspected.

### M304-B-GREEN-CORRECTION-02 — same-contract packet

```text
Milestone Assignment Packet v2

Identity
- Workflow ID: M304-20260911-01
- Roadmap task ID: M3-04
- Work-slice ID: M304-20260911-01-B
- Assignment ID: M304-B-green-02
- Lease ID: M304-B-green-02
- Phase: green
- Attempt: 2
- Correction parent lease ID: M304-B-green-01
- Worker role: code_worker
- Lease owner: groq_b_code
- Guard contract digest: Pending primary guard start; exact digest supplied at dispatch

Work-slice capsule
- Owning ExecPlan: docs/plans/m3-04-groq-adapter.md, M304-G-CONTRACT-01 and accepted M304-FIT-AMENDMENT-01.
- Observable acceptance contract: Implement G1 private credential lifetime/echo prevention and G3 fixed native HTTPS transport through G4 thin Groq factory, then actual shared stage and service/repository integration. One request only inside AttemptTransport, unchanged admitted bytes, fixed normal TLS endpoint/options, closed response validation and exact status precedence, bounded 1MiB fatal UTF8, every observed resource close, bounded abort/deadline and harmless late callbacks. Missing/malformed credentials, debug guards, oversized bodies and outbound collisions fail before transport entry without invocation; actual attempted status errors preserve truthful invocation. No secret/raw diagnostics in durable output. Factory construction and Local/abstention perform zero credential/provider I/O.
- Exact requirement / ADR / roadmap Verification / BHV / SPEC / HS anchors: REQ-LLM-008/019 in docs/requirements/generation-provider-and-model-lifecycle/GENERATION_PROVIDER_EXECUTION.md; ADR-0020 Groq admission amendment--2026-09-11; docs/DEVELOPMENT_ROADMAP.md M3-04 Verification; EVALUATION_AND_ACCEPTANCE.md BHV-03 and Groq admission amendment to frozen definition; SPEC-003 Groq byte/rejection scenarios; HS-008; ADR-0024 and .codex/execplan-implementation-workflow.md.
- Readiness and evaluation-freeze evidence: Exact task, accepted amendment and G final PASS; M304-A0-ACCEPT-01: fresh S3 PASS,61 focused tests and independent strict passed. Original manifest63770583a97e1d0517337474dadc706c1047d78e026e22c7a745ce7674ed9e6b+13referencesunchanged; no outputs, calls or real .env reads. M3-03 capacity remains blocked independently.
- TDD applicability: Applicable; existing production behavior has two independently reproduced G3 defects, now demonstrated by executed regression Red.
- Current-state and preflight evidence IDs: M304-B-REVIEW-01 and M304-B-CORRECTION-RED-01; B1/B2 corrected through sole S3 correction loop. Native suite 15 passed / 2 failed exactly on newly added behavioral assertions. No further test-worker attempt.
- Accepted test boundary and current test owner: Owner groq_b_test, with narrowly recorded primary exceptional additive correction accepted between leases; tests/groq-generation.test.ts SHA256 6bec77b1d262efaa83a79fa2c79a0e6c09b75eea624da5ffe3296af26603dc5c; tests/groq-generation-service.test.ts e1b931f425e62afd5bde60a5945e60b878fef8908ae37e2b9ff552aafb90e878; helper 6f14d01ddfd87309effb626fbe5760b19921290db88ec0f6aab37f1d8632ff15. Every test and helper byte is protected during Green.
- Relevant boundaries and paths: New src/server/generation/groq-generation-http.ts and groq-generation.ts; new tests/groq-generation.test.ts and groq-generation-service.test.ts; extension tests/helpers/m304-groq-fixture.ts. Read-only A preparation owners, shared stage/service/repository and Local analogues.
- Production responsibility placement and fit: groq-generation-http.ts owns fixed native TLS request, private echo scanning and bounded response/resource settlement. groq-generation.ts owns thin adapter composition and operation-private credential reference, consuming accepted pure preparation and credential loader. No service or shared-stage changes.
- Dependency, runtime-call, or interface-edge changes: Groq factory imports A preparation and B transport; transport imports native https/util and shared types. Actual service uses its existing explicit adapter seam; no automatic routing/HTTP/UI surface. Shared modules never import Groq I/O.
- Reuse, justified separation, bounded creation, or local-extraction disposition: Reuse accepted A modules and shared stage/proposal validation; create only two declared B responsibility owners. Reuse task-only helper and existing M302 synthetic inputs; native test double and owned service fixture additions stay task-scoped, no generic transport extraction.
- Permitted local structural refactor: Private response/object/echo/resource helpers inside B transport; private lifetime coordination inside thin factory, no edits to A/shared/Local production.
- Non-goals: Any actual provider call, .env read/hash/overwrite, credential acquisition, new dependency, Local implementation, UI/HTTP route/model/runtime work, frozen inputs, Git writes or other roadmap task.
- Named uncertainties: None in existing G3. B1 requires reserved extension checks at envelope, choice and message; B2 must prevent success when an active duplicate response has unobserved closure (bounded failure with uncertain cleanup is permitted). Preserve harmless post-terminal disposal and fixed status precedence.
- Risk tier: S3 (credential egress, transport one-attempt provenance, resource lifecycle, durable service integrity).
- Review and escalation triggers: Secret exposure, actual egress, undeclared source placement, wrong status/attempt or cleanup, authority or fixture ownership drift; fresh critical review after Green.

Write scope
- Allowed files: src/server/generation/groq-generation-http.ts; src/server/generation/groq-generation.ts.
- Allowed directory roots: None.
- Forbidden files: README.md, package.json, package-lock.json, tsconfig.json, AGENTS.md, PLANS.md.
- Forbidden directory roots: tests, docs, evaluation, corpus, .codex, .agents, data. All other paths remain outside lease.

Validation
- Working directory: C:/projects/a11y-evidence-lab
- Focused command: Load README[79..172] preparation; Invoke-M105Command { foreach ($m304Test in @('groq-generation-contract','groq-generation','groq-generation-service','generation-stage','generation-service','ollama-generation-contract','ollama-generation','ollama-generation-service')) { & $m105Node --test --test-timeout=120000 ('tests/' + $m304Test + '.test.ts'); if ($LASTEXITCODE -ne 0) { throw 'M304 B focused suite failed' } }; & $m105Node node_modules/typescript/bin/tsc --project tsconfig.json; if ($LASTEXITCODE -ne 0) { throw 'M304 strict TypeScript failed' } }. All eight suites sequential; verify owned service fixture cleanup.
- Task-level command: G4 complete22-suite closure with independent strict/build; primary owns later effect.
- Expected decisive result and reusable evidence IDs: Every accepted B behavioral test, including B1/B2 regression, executes and passes unchanged, along with all eight focused suites and independent strict. Implement full authored G1/G3/G4 beyond visible tests; no source outside the two named B owners. Exact single native attempt and admitted bytes, private credential echo/lifetime, status precedence and honest cleanup, actual selected-only durable integration without new shared/service code.
- Relevant-tree fingerprint: 51-file source/test tree 8ec5c4d55dd719bbfc1ece8eb82aa7cb89149dd02e7185fb314b6cd933e1bd1b; only accepted primary test correction differs from Green01. A, shared, Local, service and helper remain protected.
- Environment fingerprint or Non-reusable: Node24.20.0 SHA5c976096e04e5c2c1f091938926234cc9fbebfe9787ddd149351b3b0ecc707b5; package01c0b39bd9141588543bd520dbb7a160eac2d95414eef54d36f394fe0fb7ba5c; lock38ce94019310a5efdba9bb5565abe6eb13f678fa18fcd9d87b1c5dc21b30748d; tsconfig3957f80af41b23dc4ccefaa6b24823c367e6984980420b596275b8692df5abde. Pinned virtual-only run identity; no mutable external boundary.
- Known external side effects and cleanup: Only2leased source files written. Verification uses injected virtual credentials/native doubles; actual service tests own only ordinary temp/m304-groq-* leaves and ephemeral loopback services/probes. Confirm normal cleanup leaves no owned fixture; uncertain resources preserve leaf and fail. No actual.envread/hash/provider/acquisition/Gitmutation. No source/test edits outside lease.

Budget and stopping
- Maximum worker turns: One ordinary Green correction attempt2, parent Green01, within sole S3 review correction loop. Conditional final Green3 requires primary progress/new-evidence justification. No fourth test-worker turn and no budget reset.
- Maximum corrections: One ordinary plus conditional final correction with primary evidence justification; one S3 review correction loop.
- Maximum repeated identical failure: Two without new evidence stops.
- Maximum no-diff outcomes: Two stops.
- Validation cadence: Implement two cohesive B owners, run eight focused suites and independent strict, inspect structural responsibility and source/test hashes, report and stop.
- Stop and escalate when: Contract/test conflict, unsafe fixture ownership, need to modify A/shared/Local/tests or other undeclared path, real secret/provider boundary, authority drift or exhausted budget.

Handoff
- Report assignment/digest, exact touched paths and complete commands/results, full source/test/tree/environment identities, fixture cleanup evidence, responsibility and dependency inspection (RETAINED/REFACTORED/RECONCILE), residual risks and documentation impact. Stop writing at handoff. You are not alone; preserve owner/peer work. Git read-only; no guard or actual .env/provider operations.
```


### M304-B-CORRECTION-EVIDENCE-01 — response checks and duplicate settlement

Green02 closes compliant under contract `dd9c391a617d5344501c0e96619fe192fdb3e8b24c7d35a2ee6edbbc6c7635c9`, receipt `e78684999cef043830e64dd1a7d705f805f3a0224c6daf5f518c5395833dd3a3`. Only the native HTTP source changed: one private extension predicate is reused at envelope, choice and message; an active duplicate revokes success before destruction can emit close. Primary inspected the actual change and independently passed strict TypeScript. Worker executed all 132 focused tests successfully; no owned fixture remained. Native source SHA-256 `dd944dca3f0d5acb16216097097e9d1dfa206f54a3bfaed9d849ed1ae0da9980`; all accepted tests, factory and helper remain unchanged. Primary reproduced the 51-file tree `8fd214112c2e64af645bb553e591e5842a58c3361f00b766686a1cc942b2e066`. Responsibility placement is retained and no post-Green source change occurred. The sole B correction loop now requires proportional re-review; no active lease remains.


### M304-B-ACCEPT-01 — native and service integration accepted

Primary accepts B after fresh proportional S3 re-review PASS with no remaining findings. B1 rejects prohibited extensions at all three envelope locations, preserves twelve permitted states, and returns truthful response-validation provenance through the actual stage. B2 prevents successful publication for an unclosed active duplicate, including synchronous destruction/close ordering, while retaining harmless late disposal and status precedence. The reviewer passed all 45 Groq tests, five status vectors and targeted probes; reconstructed pre-correction source/test identities; and verified the corrected tree and compliant Green02 receipt. Independent strict and 132-test evidence remain fresh. Both findings are resolved within the sole B review correction loop. No active lease, source drift, actual credential access or provider call occurred.


### M304-TASK-VERIFY-01 — integrated verification candidate

A0/A/B are accepted. The maintained README now names exactly all 22 top-level test files, including three Groq suites, and documents explicit adapter construction and the ignored file-only credential setup. The original preparation block remains unchanged. Primary verified empty scanner/UI/integration scratch, no matching application Node service, and the exact ordinary generated `dist/client` inventory before replacing only that contained output. Independent strict TypeScript and Vite build pass; output remains the same three generated files. The complete prepared 22-suite caller below terminated successfully with exit 0, including all fail-fast native checks and the three final scratch-empty checks. Original manifest and all thirteen referenced digests match; an initial case-sensitive hexadecimal comparison was corrected to compare digest bytes. Documentation checks currently pass 13 files, 601 local links, and 10 PowerShell fences; final closure repeats only materially changed documentation checks.

```powershell
$m304Readme=Get-Content -LiteralPath README.md
. ([scriptblock]::Create(($m304Readme[79..172] -join "`n")))
foreach ($m304Scratch in @($m105ScanTemp,$m105UiTemp,$m105IntegrationTemp)) { Assert-M105EmptyDirectory $m304Scratch }
foreach ($m304Test in @('run-contract','run-repository','local-service','scan-normalization','retrieval-contract','embedding-retrieval','retrieval-service','finding-sufficiency','finding-guidance-api','generation-contract','generation-stage','generation-service','ollama-generation-contract','ollama-generation','ollama-generation-service','groq-generation-contract','groq-generation','groq-generation-service')) {
  Invoke-M105Command {
    & $m105Node --test --test-timeout=120000 ("tests/" + $m304Test + ".test.ts")
    if ($LASTEXITCODE -ne 0) { throw 'M304 full browser-free suite failed' }
  }
}
foreach ($m304Test in @('scan-page','walking-skeleton')) {
  Assert-M105EmptyDirectory $m105ScanTemp
  Assert-M105EmptyDirectory $m105IntegrationTemp
  Invoke-M105Command {
    & $m105Node --test --test-timeout=120000 ("tests/" + $m304Test + ".test.ts")
    if ($LASTEXITCODE -ne 0) { throw 'M304 full scanner/integration suite failed' }
  } $m105ScanTemp
}
foreach ($m304Test in @('target-results-ui','finding-guidance-ui')) {
  Assert-M105EmptyDirectory $m105UiTemp
  Invoke-M105Command {
    & $m105Node --test --test-timeout=120000 ("tests/" + $m304Test + ".test.ts")
    if ($LASTEXITCODE -ne 0) { throw 'M304 full UI suite failed' }
  } $m105UiTemp
}
foreach ($m304Scratch in @($m105ScanTemp,$m105UiTemp,$m105IntegrationTemp)) { Assert-M105EmptyDirectory $m304Scratch }
```

Different final integrated critical review is required for S3 credential egress, configuration identity, single-attempt provenance, resource recovery and selected durable integrity. It must cover the complete A0/A/B implementation and applicable I1–I7, mapped roadmap Verification, the accepted mode-specific admission amendment, protected Local behavior, actual tests and current closure documentation. Controlled tests cannot prove real hosted availability, semantic output or the six evaluations. Read-only review may reuse fresh complete evidence identities, must independently reproduce critical risks proportionally, and receives terminal full-suite evidence before its verdict. No new implementation lease or provider call follows the review.



### M304-VERIFICATION-ACCEPT-01 — complete authoritative regression

Primary accepts successful terminal execution of the exact 22-suite caller in M304-TASK-VERIFY-01, independent strict TypeScript and the fresh Vite build. All three Groq suites (45 tests), shared/Local regressions, real controlled scanner/integration suites and both browser UI suites passed; no failed, skipped, cancelled or todo result appeared. Initial console output truncation omits some aggregate counts, so this receipt reports the verified complete suite inventory rather than reconstructing a total. Scanner, UI and integration scratch directories are empty at terminal completion. The existing UI suite retained its declared project-owned synthetic evidence leaf; no Groq-owned fixture remains. No actual credential read/hash or provider request occurred. Source/test identity remains `8fd214112c2e64af645bb553e591e5842a58c3361f00b766686a1cc942b2e066`; dependency and original frozen-input identities remain unchanged.

Task Verification mapping: ignored/untracked fixed root secret is checked without reading contents; README supplies official account/key setup guidance; factory/stage tests exclude target URL, locator, siblings and credentials from the body and retain exact model context; credential failures precede native entry with no invocation; native and actual service tests retain bounded authentication, quota, rate-limit and attempted-failure provenance; immutable fixed transport and no-fallback tests preserve Local isolation. Current fixed-model availability is an explicit before-evaluation gate in the retained plan and README, not a live M3-04 request or account-access claim. Actual Generate interface and eligible provider calls remain M3-05.

### M304-FINAL-01 — integrated review and documentation closure

The different final critical reviewer returned PASS for the integrated A0/A/B candidate, with no Blocker, Major or Minor. All I1–I7 and the changed-surface quality baseline pass. Independent verification ran 72 credential/configuration, native/factory, service and shared-stage tests plus eleven in-memory cross-slice probes: multibyte boundary dispatch, post-preparation mutation, rejection provenance, split UTF-8 chunks, deep credential echoes and cancellation/network failure before resource closure. No owned Groq fixture remained. The reviewer reproduced source/test tree `8fd214112c2e64af645bb553e591e5842a58c3361f00b766686a1cc942b2e066`, original manifest and thirteen references, runtime/configuration pins, all twelve compliant lease digests and parent chains, and all fifty protected Green02 paths. No active lease or Git-state mutation exists. Complete 22-suite, independent strict and build evidence is reused from M304-VERIFICATION-ACCEPT-01.

Primary accepts final review and the mapped task Verification. The candidate documentation gate passes thirteen changed documents, 602 local links/anchors, eleven PowerShell fences, UTF-8/final-newline/whitespace checks and git diff --check. Current capability, developer setup, the full 22-suite command, mode-specific admission authorities/scenarios and evaluation forward disposition are reconciled. A transient Windows text-insertion encoding mismatch was corrected before acceptance; no source or test evidence changed. The final status transition, single-plan archive and incoming links are reconciled together and receive a final proportional link/consistency check. M3-03 remains Blocked, M3-05 remains Not started, and no later task is selected.

Documentation impact: Updated README setup/API/commands, documentation capability navigation, accepted admission requirement/ADR/evaluation/scenario authorities, roadmap, plan/progress indexes and this task's execution/progress records; the completed M302 plan retains a forward amendment link without rewriting its history. Original frozen bytes and public-content boundaries remain intact. No actual credential configuration, provider/model availability, hosted behavior, semantic quality or evaluation success is claimed. The accepted filesystem-race, string-erasure, remote-cancellation and hosted-input-consumption limits remain explicit. No actual credential read/hash, provider call, acquisition, commit, push or publication occurred.

Final reconciliation: the exact completed plan was archived after Verification and the candidate documentation gate passed. All nine incoming documents and relocated relative links were repaired. Final checks pass thirteen changed documents, 605 local links/anchors, UTF-8/newline/whitespace validation and git diff --check. Roadmap and progress agree on M3-04 Complete; M3-03 remains Blocked and M3-05 Not started. Source/test identity and the ignored, untracked secret boundary remain unchanged. No required M3-04 work remains.
