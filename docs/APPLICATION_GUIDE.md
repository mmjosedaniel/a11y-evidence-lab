# Application workflow and API reference

[Documentation index](README.md) · [Project overview](../README.md)

This guide describes the implemented interactions, service boundaries and fixed provider setup. Start with [Run the project locally](DEVELOPMENT.md); consult the [bounded evidence report](BOUNDED_MVP_EVIDENCE.md) for verification limits. Requirements and ADRs remain the controlling authorities.

In this guide: [Example walkthrough](#walkthrough-a-form-field-without-a-label) · [Get guidance](#getting-guidance-for-one-finding) · [Generate a proposal](#inspecting-generation-for-one-finding) · [Review a proposal](#reviewing-one-proposal) · [Rescan and compare](#intentional-rescans) · [Retrieval APIs](#retrieval-apis) · [Generation APIs](#shared-generation-apis) · [Review APIs](#proposal-review-apis) · [Local setup](#fixed-local-qwen-adapter) · [Groq setup](#fixed-groq-adapter).

## Current scope

The [capability summary](../README.md#project-status) distinguishes implemented behavior from later work. A **Finding** is one recorded accessibility issue; a **run** holds one scan and its associated work. **Retrieval** means looking up relevant guidance in the **corpus**, the project's fixed collection of W3C guidance passages. Source entry points are the [domain contract](../src/server/domain/run-contract.ts), [run repository](../src/server/persistence/run-repository.ts), [local service](../src/server/service.ts), [scanner](../src/server/scan/scan-page.ts), and [scan minimization](../src/server/scan/normalize-scan.ts). The [retrieval APIs](#retrieval-apis) consume the [closed corpus](CORPUS.md#closed-corpus-snapshot).

For component responsibilities and local/external data flow, see the [implemented system architecture](architecture/SYSTEM_ARCHITECTURE.md).

## Walkthrough: a form field without a label

This reading example uses the project's synthetic [failing form](../fixtures/rd003/form-input-label/failing.html) and [corrected form](../fixtures/rd003/form-input-label/corrected.html). It explains how to interpret the UI; it is not a new recorded run or a promise of a particular AI response. The [evidence report](BOUNDED_MVP_EVIDENCE.md) links the actual observations.

The failing example puts visible text next to an email input without connecting the text to the field:

```html
<span>Email address</span>
<input id="rd3-email" type="email">
```

These files are controlled test inputs. Do not enter a file path or localhost fixture URL into **Analyze**. To follow the steps interactively, use an authorized, non-sensitive public HTTPS page you control with equivalent content and complete the [local setup](DEVELOPMENT.md) first. Keep the frozen repository fixtures unchanged; any page edits belong to your own example page.

### Example result at a glance

The following is an **authored, hypothetical example**, not an actual model response, retrieved passage, saved review or recorded comparison. It summarizes one possible supported path; a real run can instead abstain or fail. The proposed correction comes from the linked corrected fixture.

| Step | Illustrative content or outcome |
| --- | --- |
| Finding | The email field has visible nearby text, but that text is not connected to the input as its label. |
| Guidance | The reviewer checks the returned guidance for support for an explicit label associated with this input. A citation alone is not proof that it applies. |
| Proposal | Replace the nearby `span` with `<label for="rd3-email">Email address</label>`, keeping the input's matching `id`. This suggestion assumes the reviewer confirms that “Email address” describes the field's intended purpose. |
| Human decision | If the proposal's claims and citations are supported and the required judgment is resolved, the reviewer can approve it and save that decision. Otherwise, edit and accept a supported correction or reject it. Approval does not modify the page. |
| Later comparison | After the developer changes the page, a separate scan may report `Resolved` if it finds a unique matching non-failing observation in compatible scan context. Missing or ambiguous evidence is not a pass. |

The steps below explain the actions, required checks and other outcomes. Actual recorded results, including unsupported suggestions, remain in the [evidence report](BOUNDED_MVP_EVIDENCE.md).

### 1. Scan and inspect the finding

Enter the page address, explicitly select Local or Groq, and choose **Analyze**. Scanning itself needs no model or API key. In a successful scan of the failing example, inspect the `label` Finding for the email field. The nearby visible words are not an explicitly associated label in this markup.

Read the captured facts before requesting an AI suggestion. Findings, checks the scanner could not decide automatically, and scan errors are different results. A failed scan is not a result with zero issues.

### 2. Read the guidance

Select the Finding and choose **Get guidance**. This uses local Ollama and EmbeddingGemma in either generation mode when the required evidence is complete. Ollama runs the local models; EmbeddingGemma produces **embeddings**, numerical representations of text used to rank passages by similarity. Read the returned passages and their sources.

The app checks whether the required types of guidance are present. That check does not prove that every passage is relevant or that a later AI claim is supported. If evidence or guidance is insufficient, the app explains the missing or conflicting information and does not call a generation model. This is an **abstention**. A retrieval error is shown separately.

### 3. Request and assess a suggestion

If **Generate** becomes available, read the provider/model information and choose Generate once. Local sends the allowed input to the local Ollama runtime; Groq sends it to the fixed external API. A missing prerequisite or failed response remains a failure, with no automatic provider switch.

If a proposal passes validation and is saved, compare each material claim with the scanner evidence and cited guidance. For this example, consider whether a suggested label actually identifies the field and is connected to the intended input. Do not assume that an AI suggestion matches the repository's corrected example. The recorded label-generation cases include unsupported suggestions, as explained in the [Local](BOUNDED_MVP_EVIDENCE.md#local-results) and [Groq](BOUNDED_MVP_EVIDENCE.md#groq-results--inherited-originals) results.

**Application validation** checks required structure, allowed values and reference rules. **Semantic assessment** asks whether the proposal's claims are supported and its suggested change is appropriate for this issue. Passing the first does not establish the second.

### 4. Save a human decision

Choose **Approve**, **Edit and accept**, or **Reject**. Complete the **blocking judgment**—the required human check about context the scanner or model cannot settle—and then choose **Save decision**. Approval or edit-and-accept also requires confirmation that the resulting proposal's material claims are supported; a contradictory or unresolved judgment cannot be accepted unchanged.

Saving a decision does not change the page. It records your decision alongside the original proposal. A post-change verification reminder remains for later work; it is not completed by approving the proposal. If you select another Finding before saving, unsaved edits are discarded.

### 5. Change your page and compare a later scan

The project-owned corrected example uses an explicit label associated with the same input:

```html
<label for="rd3-email">Email address</label>
<input id="rd3-email" type="email">
```

This is the fixture's authored correction, not an AI-generated or automatically applied edit. If appropriate for your own page, make and publish the equivalent change yourself at the same page address. From the selected baseline Finding, explicitly choose **New scan mode**, then **Start intentional rescan**. You can also take this comparison path without generating or reviewing a proposal.

The later scan is saved as a separate run. Read the **Comparison** region's before/after evidence and explanation. `Resolved` requires a unique matching non-failing scanner observation; disappearance alone is not enough. A changed or ambiguous target can be inconclusive, and incompatible scan context can make the pair not comparable. Even a resolved Finding does not prove whole-page accessibility or that the proposed edit caused the result.

### How to interpret other outcomes

| What you see | Meaning |
| --- | --- |
| Abstention | Required evidence or guidance is insufficient. No generation model was called, and there is no proposal to approve. |
| Guidance or generation failure | That operation did not produce an accepted result. Read the reason; do not treat it as a successful suggestion. |
| Proposal pending review | Application checks passed, but you still need to assess source support, usefulness and the blocking judgment. |
| Save outcome unknown | The reply was lost or could not be confirmed; a write may have happened. Do not assume it is safe to submit again. Follow the action-specific limits below. |
| Later scan saved without comparison | The scan can be valid even when comparison calculation or saving fails. There is no saved comparison outcome to infer. |

Keep the current session open while following the example. Records are saved locally, but the MVP cannot browse or reopen earlier results in the UI after restart. The sections below describe the exact action boundaries; the [architecture guide](architecture/SYSTEM_ARCHITECTURE.md#storage-and-operation-lifetime) explains why saved records and temporary workflow state are different.

## Getting guidance for one Finding

Before using **Get guidance**, complete [Enable guidance and generation](DEVELOPMENT.md#enable-guidance-and-generation). Both Local and Groq modes need Ollama running on your computer with `embeddinggemma` installed for guidance lookup.

Follow [Run the local service](DEVELOPMENT.md#start-the-application) to open the Analyze/Results UI. Select a Finding to inspect its native evidence, then activate **Get guidance** once. The application first checks captured evidence; complete evidence uses the developer-managed local embedding runtime. The detail shows complete cited passages and source notices, evidence sufficiency, and supported eligibility, a no-generation-call abstention, or a distinct retrieval failure. Citation links open in a separate tab to preserve the current results session. The exact corpus version remains visible even when retrieval returns no passages. Similarity describes ranking, not support or confidence. Opening the UI and selecting an item do not start model work. Scanner review observations remain evidence-only; no saved-run reopen/import, retry or review control is provided. Supported live eligibility enables the separate [explicit generation action](#inspecting-generation-for-one-finding). A supported unfinished workflow retains ownership and prevents another guidance operation. The [M2-03 closure record](plans/completed/m2-03-sufficiency-abstention-and-detail-ui.md#m203-c-post01-closure--renewed-task-closure) records completed verification and its limits; the [M2-04 observations](plans/completed/m2-04-retrieval-checkpoint.md#m204-b-accept-01--bounded-checkpoint-observations) record the fixed three-profile integration evaluation separately from general retrieval quality.

## Inspecting generation for one Finding

In a new analysis, select a Finding and activate **Get guidance**. Complete captured evidence and supported guidance from the current service session enable **Generate** for that Finding. Read the fixed provider/model and data-flow disclosure, then activate Generate once. Local uses the approved Ollama loopback boundary; Groq sends the permitted minimized selected facts and guidance to its fixed external endpoint. Mode selection and scanning make no generation request.

The pending state keeps selection available. The result distinguishes a confirmed pre-call failure, an attempted call, durable publication, an unsaved attempt and an unknown outcome. A browser timeout or lost response does not prove that service/provider work stopped. The consumed action cannot be retried; ordinary Analyze can start an independent run when the service accepts it. Restart does not recover a supported workflow capability.

A validated proposal keeps its original cited summary, user impact and remediation separate from scanner evidence and curated guidance. Evidence sufficiency, model confidence, uncertainty, assumptions, blocking human judgment and the post-change verification reminder remain visible. The [individual review controls](#reviewing-one-proposal) now support approve, edit-and-accept and reject. Use [intentional rescans and saved comparison](#intentional-rescans) to inspect later scanner evidence separately from proposal review.

The [M3-05 plan](plans/completed/m3-05-generation-checkpoint.md) records implementation verification and bounded actual-provider checks. The clarified runtime prompt preserves historical invocation identities. One Local and one Groq run saved and displayed original proposals that pass mechanical validation under the same runtime version. Both remain pending human review, including their judgment and remediation limitations. The successful Local diagnostic did not reproduce the earlier rejection; its exact cause remains unknown. The selection amendment also retains an informative-image relevance failure despite complete guidance-role coverage. These observations do not establish model capacity, semantic quality or release readiness.

## Reviewing one proposal

For a selected valid pending proposal, choose **Approve**, **Edit and accept**, or **Reject**, complete its blocking judgment and optional note, then use **Save decision**. Approval/edit require explicit support confirmation; changing any relevant input clears it. Edit-and-accept exposes a complete plain-field proposal editor with existing validation bounds and recorded evidence/guidance choices. Selecting another item discards unsaved edits. Abstentions, failed generation and scanner manual-review observations have no proposal-review controls.

A saved decision preserves the original AI proposal and provider invocation, displays human action/time/judgment/note, and labels any complete accepted edit as reviewer-authored. Rejection accepts no remediation plan. Post-change reminders remain visible without a completion gate. The shared announcement and native controls support the existing keyboard, focus and semantic contract; [M4-02 verification](plans/completed/m4-02-accessible-review-ui.md#m402-final-01--integrated-review-and-task-closure) passes automated accessibility, keyboard/focus, desktop/narrow visual checks and the complete suite. Native 200% was omitted at owner direction and is not claimed as passed. The subsequent [verification amendment](requirements/quality-security-and-operations/APPLICATION_ACCESSIBILITY.md#200-zoom-verification-deferral--2026-09-15-utc) defers every 200% zoom test until after MVP, including the earlier M2-03 carry to M6-03; accessible behavior requirements remain Accepted.

Review requests have a 30000-ms local deadline. A definite refusal is distinct from **Save outcome unknown**, which means the decision may have been saved. Unknown or retained refusal blocks further mutations, including Analyze, while preserving list and citation inspection. Only a validated release permits explicit correction and submission; there is no automatic retry or recovery read. This does not change the existing generation-unknown path's independent Analyze behavior. Controlled UI tests perform all three final actions and a lost-response case through the real service and disposable disk records; M4-03 records the separate actual-proposal observations and their evidence limits.

## Intentional rescans

For a selected Finding, choose **New scan mode** and use **Start intentional rescan**. Either mode must be chosen explicitly, including when repeating the previous mode. Retrieval, generation and review are not prerequisites; scanner manual-review observations have no rescan action. The service scans the baseline's requested page with all three supported checks and saves a separate run with immutable `baselineRunId`. It preserves the baseline's evidence and human work.

The client-enabled service accepts `POST /api/rescans` with exactly `{runId, baselineRunId, findingId, mode}`, JSON content type, a 4096-byte body limit and a 30000-ms body deadline. The service validates the retained completed baseline and selected Finding under its existing operation reservation. Success returns `{ok:true,run}` after publication; known failures retain truthful later-run, persistence and cleanup information. Malformed or lost replies do not prove that no run was created.

Pending or failed rescans preserve the visible baseline. An unknown outcome blocks further mutations, with no automatic retry or recovery read. Validated success opens the later run and retires prior transient workflow capabilities. **Return to baseline** shows one read-only snapshot; **Return to later results** resumes viewing the same active later workflow. For a saved comparison, initial presentation and explicit return navigation refresh immediate-baseline availability through the read API. The response changes availability metadata only; it cannot replace newer human work or restore earlier workflow capabilities. A new successful rescan replaces that pair, and successful independent Analyze clears it.

### Internal comparison

The [internal comparison executor](../src/server/local-service/rescan-comparison.ts) consumes selected-rule native pass candidates during the rescan operation, then releases them. It delegates calculation to the pure [comparison policy](../src/server/comparison/compare-finding.ts) and its [closed input/result contract](../src/server/comparison/comparison-contract.ts). It validates both scans, checks exact page/scan-profile compatibility before target correlation, and requires a unique native non-failing observation with sufficient evidence to resolve a baseline Finding. Missing or ambiguous targets remain inconclusive. Comparable binary failures remain persistent; sufficient contrast failures use the retained margin ordering. The executor supplies a bounded result only after successful completed-run publication and its lifetime checks. M5-03 then appends that result through the aggregate writer before announcing durable comparison. Invalid comparison evidence or a comparison exception preserves an independently valid scan result.

The service now appends one optional closed `comparison` to the completed later aggregate and returns the exact durable run. Historical aggregates without comparison remain readable. The append preserves every other field; subsequent selected-Finding updates preserve the comparison. Transient candidate collections remain absent from saved records and responses.

Comparison calculation, lineage, save, abort or shutdown failures after scan completion return the completed run without comparison, with `persisted:true`, `comparisonPersisted:false` and truthful cleanup information. They never convert it to a failed scan. A successful append is authoritative even if stop or abort becomes observable at commit; an unknown transport outcome remains unknown and cannot be retried automatically.

Validated `GET /api/runs/<runId>` adds `comparisonLineage` only for a saved comparison. It reports availability of the immediate baseline's referenced native evidence and context; missing or unreadable lineage leaves the later comparison readable. A comparison-bearing baseline with unavailable immediate lineage cannot start another comparison. Client admission applies only this metadata and cannot overwrite newer human work.

The run-level **Comparison** region presents Before/After evidence, outcome, rationale, limitations and follow-up even when the later scan has zero Findings. Native passes are labeled observations; unavailable after-evidence has an explicit reason. Verified baseline proposal and human work are optional, separately labeled context. Failed availability verification withholds that context and preview, disables another comparison and explains why. Availability changes preserve focus, restoring Results only when the focused content disappears. M5-03's [completed verification and final review](plans/completed/m5-03-comparison-persistence-and-ui.md#m503-final-01--integrated-review-and-task-closure) include native scanner/service/disk/browser persistence and exact synthetic baseline-deletion proof.

[M5-02 final verification](plans/completed/m5-02-conservative-comparison.md#m502-final-01--integrated-review-and-task-closure) records three real controlled pairs over the six frozen states, separate policy-only cases and checkout-byte preservation for the [frozen comparison companion](../evaluation/m502-comparison-v1.json). These observations establish neither public-site qualification nor accessibility, conformance or remediation causality. History browsing and reopening retained runs remain Deferred.

## Retrieval APIs

M2-02's slice-A APIs are [loadCorpusCatalog/createCorpusDocuments](../src/server/retrieval/corpus-catalog.ts), [createFindingQuery](../src/server/retrieval/finding-query.ts), and [validateRetrievalResult](../src/server/retrieval/retrieval-contract.ts). The loader accepts only the fixed normalized corpus identities and preserves the manifest notices; query/result validation is pure and imports no corpus I/O or model runtime. M2-02 wired these APIs into the internal service; M2-03 adds the guidance HTTP boundary and its selected-Finding UI. The [browser-free retrieval-contract test](DEVELOPMENT_REFERENCE.md#build-and-verify-the-walking-skeleton) covers them without Ollama, model files or a tokenizer installation.

M2-02's slice-B APIs are [createExactRetrieval](../src/server/retrieval/exact-retrieval.ts) and its [bounded Ollama session](../src/server/retrieval/ollama-embedding.ts), [input-fit guard](../src/server/retrieval/embedding-input-fit.ts), and [exact ranking](../src/server/retrieval/retrieval-ranking.ts). Imports and factory construction perform no model or corpus I/O; only an explicit retrieval call uses the fixed local Ollama boundary. The engine builds all 16 document vectors lazily, reuses only a compatible verified collection, and returns at most three canonical passages. Deterministic embedding-retrieval tests use fake transport and supplied vectors, with the actual in-memory search library; they do not establish real model compatibility or capacity. M2-02's slice C integrated the engine into the internal service. The separate [real retrieval-capacity observation](LOCAL_MVP_FEASIBILITY.md#m2-02-retrieval-only-observation--2026-09-08) passed for the recorded model/runtime configuration; M2-03 provides the selected-Finding UI; its evidence does not extend that capacity observation.

[LocalService.retrieveFinding](../src/server/local-service/contracts.ts) and [RunRepository.updateRetrieval](../src/server/persistence/run-repository/contracts.ts) now implement M2-03's evidence-first extension of M2-02's selected-Finding service. Guidance accepts exactly one `{runId, findingId}`, reserves the shared operation, and durably activates only that Finding. Incomplete required evidence produces an application-authored abstention without retrieval; complete evidence uses the lazy default engine, authenticates exact citations, and evaluates support before publication. Insufficient completed guidance produces terminal abstention; supported guidance remains active and retains its service owner for a later workflow stage. Execution or integrity failure has no support state. Return values identify the actual durable aggregate and preserve native evidence and siblings; a failed write keeps the last valid aggregate. Startup, scans and reads do not start model work.

## Shared generation APIs

[LocalService.generateFinding](../src/server/local-service/contracts.ts) continues only the exact live supported retrieval workflow for one `{runId, findingId}`. It saves generation-running before invoking the [shared stage](../src/server/generation/generation-stage.ts), then publishes a validated pending proposal or bounded failure through [RunRepository.updateGeneration](../src/server/persistence/run-repository/contracts.ts). Failure results distinguish the last durable run from separately returned, unpersisted invocation provenance. Failed publication retains ownership, uncertain cleanup closes admission, and restart never reconstructs a generation capability.

The [adapter contract](../src/server/generation/generation-contract.ts) defines preparation, the bounded transport attempt and invocation provenance; the [proposal validator](../src/server/generation/proposal-contract.ts) admits only the shared structured output and authenticated selected citations. The service resolves the fixed Local or Groq adapter from the durable run's immutable provider context only after consuming the supported owner and saving generation-running. An explicitly supplied adapter remains the internal controlled-test seam. The same-origin generation API and Generate action pass only the selected run and Finding IDs; browser input cannot configure a provider.

The [generation contract](../tests/generation-contract.test.ts), [shared-stage](../tests/generation-stage.test.ts) and [service continuation](../tests/generation-service.test.ts) suites are included in the [complete verification command](DEVELOPMENT_REFERENCE.md#build-and-verify-the-walking-skeleton). Service tests use exclusive `temp/m302-generation-*` roots and owned loopback ports. The [M3-02 closure record](plans/completed/m3-02-shared-generation-stage.md#m302-final-01--final-integrated-review-and-documentation-closure) preserves accepted verification and its limits: controlled adapters do not prove actual provider conformance, model capacity or semantic grounding.

## Proposal review APIs

[LocalService.reviewFinding](../src/server/local-service/contracts.ts) accepts exactly `{runId, findingId, review}` for one valid pending proposal in a completed run. It reserves the service before inspecting caller input, rejects active or retained workflows, and publishes through [RunRepository.updateReview](../src/server/persistence/run-repository/contracts.ts). A clean retained pending proposal can be reviewed through this service method after restart without reconstructing a generation owner. Browser reopening remains Deferred.

The same-origin `POST /api/finding-review` route accepts that exact outer object with `Content-Type: application/json`, no query or fragment, at most 131072 received bytes and a 30000-ms body deadline. It checks declared length, decodes UTF-8 strictly and dispatches once. Known failures retain the service envelope with HTTP 400 for input validation, 404 for absence, 409 for admission/eligibility, 503 for stopping/shutdown and 500 for read/publication failures. Unexpected callback failure or an unusable result returns HTTP 500 with `{ok: false, error: 'review-outcome-unknown'}`, without claiming non-publication. API-only startup without client assets exposes no review route; health capabilities are unchanged. [A acceptance](plans/completed/m4-02-accessible-review-ui.md#m402-a-accept-01--transport-and-admission-accepted) records this boundary; the individual review controls are implemented and verified.

| Review action | Final Finding state | Required action-specific input |
| --- | --- | --- |
| `approve` | `accepted` | `supportConfirmed: true` |
| `edit-and-accept` | `edited-and-accepted` | `supportConfirmed: true` and complete `editedProposal` |
| `reject` | `rejected` | Neither confirmation nor edited content is allowed |

Every review requires `blockingJudgment`. Approval/edit admit `{status: 'supports-proposal'}` or `{status: 'not-applicable', reason}`; rejection also permits `unresolved` and `contradicts-proposal`. N/A requires a nonblank reason of at most 500 raw UTF-16 units. An optional `note` must be nonblank and at most 1000 raw UTF-16 units. Supplied text is preserved exactly. Unknown keys, partial edits, unconfirmed acceptance and action-inapplicable fields fail. Edited content uses the existing complete Proposal validator with the selected Finding and retained guidance; confirmation and judgment concern that resulting proposal. These mechanical gates cannot establish the truth of a person's support assessment.

The service owns canonical `decidedAt`, at least the generation finish time. The one nested `review` stores action, time, judgment, optional note and edited content only for edit; input confirmation is not retained. Original proposal, reminder, invocation, native evidence, retrieval, analysis, siblings and parent remain unchanged. The post-change reminder is neither completed nor an acceptance gate. Format-version-1 historical records remain readable. Final decisions cannot be replaced or repeated.

Success returns `{ok: true, run}` only after publication. Failure returns `{ok: false, error, run, persisted: false, cleanupFailed}`; `run` is the last validated read when available and is null for stale-transition failure. Closed errors distinguish request/body validation, eligibility/admission, stored-read failure, publication failure and shutdown. Precommit failure preserves the last valid file. Cleanup uncertainty closes admission and remains visible to stop; a successful rename retains its existing commit meaning. A lost response does not establish whether publication occurred; never automatically resubmit a final decision.

[Client review admission](../src/client/review/finding-review-admission.ts) requires the returned HTTP status and body to agree and binds success to the captured action, complete edited content, judgment and exact note. Restoring the selected Finding to pending must reproduce the entire captured run, preserving the original proposal, siblings, order, evidence and invocation. Invalid or mismatched responses cannot publish success. [Transport](../tests/finding-review-api.test.ts) and [admission](../tests/finding-review-admission.test.ts) tests use synthetic inputs.

The [pure review](../tests/review-contract.test.ts), [repository](../tests/review-repository.test.ts) and [service](../tests/review-service.test.ts) suites use synthetic proposals, exclusive `temp/m401-review-repository-*` / `temp/m401-review-service-*` leaves and owned loopback ports. They perform no actual provider or retrieval work and do not review retained owner proposals. The [M4-03 checkpoint](plans/completed/m4-03-review-checkpoint.md#m403-a-accept-01--caller-integrity-accepted) adds a source-bound test-only caller. Its ordinary regression uses synthetic data; actual-case commands are finite, require exact human decisions and must follow that plan. All three human-authorized outcomes are saved on isolated copies of one authentic retained proposal; the originals remain unchanged. Integrated critical review, exact cleanup and documentation closure passed. Actual-case allowances are consumed; they must not be replayed.

## Fixed Local Qwen adapter

Start with the [shared Ollama and embedding setup](DEVELOPMENT.md#enable-guidance-and-generation). Local suggestions also need the exact Qwen model described below.

The service selects [createNativeSchemaOllamaGenerationAdapter](../src/server/generation/ollama-generation.ts) for the current live supported Local retrieval owner. Import, construction, service startup and mode selection perform no generation I/O. Preparation first checks the complete initial messages and schema against the initial-prompt budget, then reads version, model metadata and tags from fixed `127.0.0.1:11434`; dispatch uses one bounded `/api/chat` attempt.

This implementation admits the developer-managed [Ollama v0.33.3 release](https://github.com/ollama/ollama/releases/tag/v0.33.3) and `qwen3.5:4b` Q4_K_M manifest SHA-256 `2a654d98e6fba55d452b7043684e9b57a947e393bbffa62485a7aac05ee4eefd`. Install the retained official runtime outside the repository and acquire the model through Ollama's own `ollama pull qwen3.5:4b` command only after the [local capacity prefilter](LOCAL_MVP_FEASIBILITY.md) passes; the application performs no acquisition. A fresh pull must match the admitted digest and metadata. Missing prerequisites or drift fail before chat. Preserve the runtime/model configuration while an eligible action is in progress; observed metadata does not lock a mutable model tag atomically.

The ordinary Local request enables reasoning and native schema enforcement within an explicit 32768-token context, with temperature 1 and top-p 0.95. One application request can use up to two native completions, each capped at 12288 tokens, for an aggregate ceiling of 24576. The full case schema appears in the measured system message and in native `format`; streaming, input truncation and context shifting are disabled. Initial admission reserves the first completion only; a later internal prompt can fail capacity after invocation. The [native contract](plans/completed/m6-02-six-fixed-generation-executions.md#m602-native-contract--frozen-implementation-semantics-for-review) owns these limits and the fixed neutral post-change reminder. A fixed 300000-ms server budget covers admission through generation; the browser has its own 300000-ms wait. Groq and the explicit legacy Local factory retain 120000 ms. Only the final answer is validated and retained; hidden reasoning is discarded.

The preceding single-pass profile passed [corrected integration](plans/completed/m6-02-six-fixed-generation-executions.md#m602-deadline-pass--corrected-integration-and-live-admission) and a [genuine reasoning capacity smoke](plans/completed/m6-02-six-fixed-generation-executions.md#m602-resolve-capacity-pass--genuine-capacity-accepted). The separate [current native-schema capacity screen](plans/completed/m6-02-six-fixed-generation-executions.md#m602-native-capacity--genuine-current-profile-screen-accepted) now passes for the recorded workload, followed by three runtime-valid fixed Local cases. The explicit legacy factory preserves its 4096-token, thinking-disabled profile and historical records. The [M3-03 capacity observation](plans/completed/m3-03-qwen-adapter-and-capacity-screen.md#m303-c-observation-01--successful-full-local-stack-capacity-screen) applies to that earlier profile. Neither controlled tests nor a capacity observation establishes semantic quality or broad hardware support.

## Fixed Groq adapter

The service selects [createUncertaintyGroqGenerationAdapter](../src/server/generation/groq-generation.ts) for the current live supported Groq retrieval owner. Import, construction, startup and mode selection perform no credential or provider I/O. The adapter uses only the fixed `openai/gpt-oss-20b` model and one HTTPS Chat Completions attempt at `api.groq.com`, with normal certificate and hostname verification.

Groq still needs the [local Ollama and embedding setup](DEVELOPMENT.md#enable-guidance-and-generation) for guidance lookup. It does not need the local Qwen generation model.

To configure your Groq key:

1. Create your own API key using the [Groq quickstart](https://console.groq.com/docs/quickstart).
2. Open `.env` in the repository root, beside `package.json`. Create it if it does not exist. Confirm that it is Git-ignored and untracked before adding the key; the repository's [`.gitignore`](../.gitignore) includes this file.
3. Add one line in the form `GROQ_API_KEY=your_key_here`, replacing `your_key_here` with your actual key. If the entry already exists, update it instead of adding another. Preserve other file contents and save as UTF-8 without a byte-order mark (BOM).

Never paste the key into chat or tracked files. The service reads this file entry only when preparing an eligible Groq request; setting an environment variable alone does not configure it. Missing or invalid credentials fail before a provider attempt.

Preparation preserves both complete shared messages, the strict `m301_proposal_v1` schema and fixed controls. Its versioned policy admits at most 65536 UTF-8 bytes for the complete serialized request body, then sends that exact body with a 4096-token completion limit. The byte cap is an application policy, not a token estimate or proof of hosted context fit or full input consumption. [The accepted contract](plans/completed/m3-04-groq-adapter.md#m304-g-contract-01--authored-groq-adapter-contract) records the exposed defaults and provider-processing limits.

Groq and the historical Local uncertainty factory use the [uncertainty correction](plans/completed/m6-02-six-fixed-generation-executions.md#m602-uncertainty-01--nonblank-uncertainty-and-content-free-rejection-detail): `m602-uncertainty-instructions-v1` and `m602-uncertainty-schema-v1` retain the exact application-defined pre-acceptance human task and require nonblank uncertainty in the schema. Instructions and the field description request one sentence explaining unresolved image, label or contrast context. Historical profiles, proposal readers and human editing remain available with unchanged semantics. That correction preserves its models, controls and deadlines; hidden reasoning is discarded. The current Local native profile extends those instructions with a fixed reminder under distinct prompt/schema/adapter identities. Offline checks establish request construction and validation, not supported prose or provider success. The [bounded live evaluation](plans/completed/m6-02-six-fixed-generation-executions.md#m602-uncertainty-result--six-observations-with-local-validation-blockers) confirms Groq admission of the exact new schemas for all three requests; it does not establish general schema support or semantic quality.

The adapter rejects credential echoes before publication, bounds response bodies and cleanup, and preserves authentication, quota, rate-limit, network and provider failure provenance without retry or fallback. The three `groq-generation` suites use virtual credentials, injected native transport and actual service/repository fixtures in exclusive `temp/m304-groq-*` roots. These controlled tests establish adapter behavior. The separate [M3-05 integration observation](plans/completed/m3-05-generation-checkpoint.md#m305-f-observation-02--corrected-local-failure-and-groq-proposal) records one successful actual Groq proposal, without establishing continued availability, output quality or the later fixed evaluation results.

Before an authorized evaluation, check the fixed model's current [availability](https://console.groq.com/docs/models), [deprecations](https://console.groq.com/docs/deprecations) and [strict-output support](https://console.groq.com/docs/structured-outputs), and confirm your account's access and limits without sharing its credential. Documentation listings alone do not prove account access.
