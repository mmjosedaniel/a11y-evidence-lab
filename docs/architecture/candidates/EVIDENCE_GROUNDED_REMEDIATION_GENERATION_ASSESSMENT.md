# Evidence-grounded remediation generation assessment

## Authority, status, and scope

**Status:** Proposed architecture detail for the fourth workflow step, assessed on 2026-08-24 and aligned on 2026-08-27 with the trusted operator-input portfolio boundary in [ADR-0018](../decisions/ADR-0018-trusted-operator-url-boundary.md). It applies the bounded LangChain evaluation role accepted in [ADR-0013](../decisions/ADR-0013-langchain-as-initial-rag-integration.md) and the local/Groq provider decision in [ADR-0014](../decisions/ADR-0014-groq-as-mvp-external-generation-provider.md), but does not promote LangChain, Ollama, a local model, Groq, or the named Groq model to a release-qualified dependency; authorize implementation; or permit generated output to establish accessibility, conformance, certification, or completed remediation.

The authoritative requirement IDs, wording, and statuses remain in [Evidence and review workflow requirements](../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#generated-explanations-and-remediation-proposals). This assessment owns no requirement IDs or statuses and cannot override an identified requirement or accepted ADR.

## Recommendation: one bounded LangChain generation call per selected finding

A complete page scan lists every returned violation node as an independent `Finding`; that collection may contain multiple Findings. Generation still supports only the three accepted rule families and processes one user-selected Finding at a time. Controlled synthetic cases remain the fixed evaluation packages for these mappings:

| Rule family | Deterministic rule | Retrieval scope | Generation boundary |
| --- | --- | --- | --- |
| `informative-image-alt` | `image-alt` | WCAG 2.2 SC 1.1.1 | Explain the missing alternative and propose purpose-dependent treatment without deciding the image's purpose. |
| `form-input-label` | `label` | WCAG 2.2 SC 4.1.2 | Explain the missing programmatic label/name and propose a conditional explicit visible-label association without inferring wording, page purpose, or full WCAG non-conformance. The axe-rule mapping is not expanded to SC 3.3.2 or SC 1.3.1. |
| `text-contrast` | `color-contrast` | WCAG 2.2 SC 1.4.3 | Explain the retained measured ratio and applicable recorded threshold, then propose adjusting the foreground, background, or both and measuring again. It must not claim that an unmeasured candidate color pair passes. |

Process findings independently: one selected finding, one retrieval run, at most one eligible model call, and at most one proposal at a time. Do not batch findings, combine targets in a prompt, or let evidence from one finding support another. The public page itself never enters the prompt or corpus; use only the selected finding's minimized evidence package and the fixed passages from Step 3. The proposed flow is:

1. Confirm that scan, evidence capture, and retrieval completed successfully and that the retrieval result is eligible under the policy below.
2. For an eligible package, assemble one privacy-safe prompt from the normalized finding, at most three retrieved passages, fixed instructions, and one closed candidate-proposal schema.
3. Inherit the analysis-wide mode explicitly selected by the user—local or Groq—and invoke that adapter once for this eligible finding through the same application-owned provider contract. Evaluate a direct LangChain chat-model structured-output call; do not create an agent or graph.
4. Validate structure, supplied-reference membership, the closed claim taxonomy, required conditional language, and prohibited assertions with ordinary deterministic application logic.
5. Publish a passing result as **AI-generated — pending human review**. Deterministic validation proves only structure and traceability; the step-5 reviewer inspects the proposal against its evidence and guidance before making one final decision.

The provider mode applies globally to the current analysis so findings from one scan do not prompt repeated mode selection. Actual invocation provenance remains per finding call; an abstaining finding records no provider invocation. There is no automatic processing of the collection, retry, critique call, second model, semantic-judge model, tool call, provider fallback, or pre-review human gate. Changing the mode requires an explicit new analysis choice and never rewrites prior results. This is sufficient to demonstrate the important technology path without designing a general accessibility assistant:

`finding + retrieved guidance -> LangChain structured generation -> deterministic validation -> cited pending proposal -> human review`

## Retrieval-support eligibility

The enclosing workflow-operation state, retrieval-stage disposition, and evidence-sufficiency state remain separate. The accepted MVP policy is deliberately conservative, and the deterministic finding remains visible in every row below:

| Retrieval result | Generation behavior |
| --- | --- |
| Completed and `supported` with all required evidence present | Eligible for the one explicitly selected provider call and a cited proposal. |
| Completed and `incomplete` | Do not call a model. Keep the Finding and returned passages visible and publish a terminal application-authored abstention that identifies the missing required guidance role and provides manual-investigation guidance; create no proposal-review decision. |
| Completed and `missing` | Do not call a model. Keep the finding visible and publish a terminal application-authored abstention that explains the missing guidance and provides manual-investigation guidance; create no proposal-review decision. |
| Completed and `conflicting` | Do not call a model. Keep the finding and conflicting references visible and publish a terminal application-authored abstention that explains the conflict and provides manual-investigation guidance; create no proposal-review decision. |
| Incomplete required Finding evidence, a supported-rule contextual variant that lacks required support, or withheld core evidence | Do not call a model. Keep this Finding visible and publish a terminal application-authored abstention with the separate evidence-gate reason and manual-investigation guidance; create no proposal-review decision. Other Findings from the same scan remain independently eligible. |
| Failed operation, invalid/unknown/ambiguous fixed rule-to-guidance mapping, or rejected stale/integrity-invalid input | Do not assign an evidence-sufficiency state, call a model, or label the outcome an abstention. Report the upstream configuration or integrity failure. The first slice has no interactive cancellation or separate stale lifecycle state. |

The accepted post-ranking support policy applies in this order: an execution or integrity failure has no state; a curator-declared unresolved material conflict is `conflicting`; zero applicable resolved passages is `missing`; some applicable guidance with a required profile role absent is `incomplete`; and all required roles within the resolved top three with no conflict is `supported`. Required Finding-evidence completeness is a separate gate. Evidence sufficiency combines complete evidence with `supported` retrieval; it is not a similarity-score threshold, model confidence, or statement that the page fails WCAG.

## Minimum model-visible input

Keep run provenance outside the prompt when the model does not need it. The model-visible package needs only:

| Layer | Minimum content |
| --- | --- |
| Finding evidence | Rule-family and rule identifiers; native result category; minimized observed facts; element type or role; stable evidence aliases; and only the rule-specific facts listed below. Exclude page URLs, locators, raw HTML, arbitrary page text, credentials, user values, and unrelated findings. |
| Retrieved guidance | Passage alias, exact retained passage text, and the source-authority/context label needed to qualify the claim. Canonical `passageId`, corpus version, title, heading, and direct URL stay in application records and are resolved from the alias after generation. |
| Generation rules | The closed proposal claim kinds below; required references; conditional-remediation rule; separate proposal-confidence labels; exact manual questions; and prohibited assertions. Evidence-sufficiency policy has already selected the eligible proposal branch before the model-visible package is constructed; an abstention never enters the prompt. |
| Input boundary | The fixed bounded-input/output instruction and an instruction that evidence and passages are data rather than commands. |

Outside model-visible content, the normalized application request carries the application-owned prompt/output-contract versions, exact selected model, and bounded material generation parameters. A fixed adapter adds only the provider's required destination/model routing, structured-output representation, and transport authentication. These protocol fields are not an arbitrary metadata channel; the credential is never model-visible or persisted.

Generation data stays nested under the existing FindingWorkflow and therefore inherits the aggregate's `runId`, the Finding's `findingId`, its evidence and retrieval result, the corpus version and ordered `passageId` references, and the analysis-wide selected mode, provider, and exact model instead of duplicating them. Only an actual call adds one compact invocation containing the adapter identifier/version, non-secret endpoint identity, prompt/output-contract provenance, bounded material generation parameters, non-secret outcome, and validation result; runtime/model revision or digest, request time, and safe usage provenance are optional when available. The MVP creates no separate input, retrieval, generation, invocation, or proposal identity. A required input that does not fit the selected context is blocked and never silently truncated.

## Closed three-profile claim taxonomy

The same schema supports all three profiles, but the active profile fixes which assertions and manual checks are allowed:

| Claim kind | Permitted assertion | Required support |
| --- | --- | --- |
| `scanner_observation` | What axe-core reported about the selected element under the recorded scan profile. | One or more supplied evidence aliases; no guidance citation may be presented as page evidence. |
| `guidance_statement` | A bounded statement about the active profile's mapped success criterion or cited supporting material. | One or more supplied passage aliases whose recorded authority remains visible. |
| `potential_user_impact` | A qualified explanation of what users **may** experience because of the observed condition. | Both evidence and guidance aliases; no fabricated observed user outcome. |
| `contextual_interpretation` | A conditional connection between the scanner observation and the active profile's unresolved contextual facts. | Both evidence and guidance aliases plus that profile's blocking manual check. It cannot state an unresolved fact as known. |
| `remediation_option` | The active profile's bounded, conditional remediation approach. | Both evidence and guidance aliases plus any applicable blocking manual check. It proposes an approach, not a patch, exact unverified final value, or applied change. |

The model returns only aliases. The application resolves visible citation titles, authority labels, corpus versions, sections, and URLs from canonical passage records. Application-owned text supplies the fixed limitations that the result is AI-generated, scanner evidence is partial, no code was changed, and acceptance is not certification or proof of accessibility.

### Profile-specific evidence and proposal limits

| Profile | Minimum evidence admitted to generation | Allowed remediation direction and required uncertainty |
| --- | --- | --- |
| `informative-image-alt` (`image-alt` → SC 1.1.1) | The scanner's missing-alternative observation and minimized image-element facts. Neither public-page text nor an evaluation author's gold purpose classification enters the prompt. | Present informative, functional, and decorative treatment as conditional branches until a reviewer determines purpose and context. An alternative must communicate equivalent purpose rather than merely appearance or a filename. See W3C's [Understanding SC 1.1.1](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content) and axe-core's versioned [`image-alt` rule](https://github.com/dequelabs/axe-core/blob/v4.13.0/lib/rules/image-alt.json). |
| `form-input-label` (`label` → SC 4.1.2) | The scanner's missing-label observation, safe control type, and minimized programmatic association facts. Do not infer intended wording from public-page text, private data, or absent content. | Propose a concise visible label and explicit programmatic association only as a conditional approach. The reviewer must determine the wording, purpose, visibility, and intended target. The rule mapping remains SC 4.1.2 and does not prove complete failure of that criterion or establish SC 3.3.2/1.3.1. See W3C's [Understanding SC 4.1.2](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value) and axe-core's versioned [`label` rule](https://github.com/dequelabs/axe-core/blob/v4.13.0/lib/rules/label.json). |
| `text-contrast` (`color-contrast` → SC 1.4.3) | Complete retained foreground and background values, measured ratio, applicable threshold, recorded text size/weight, and explicit unresolved exception assumptions, all bound to the scan profile. | Explain the recorded measurement and propose changing the foreground, background, or both while preserving the design intent, then measuring the rendered result. It may offer exact candidate colors only as unverified options and must not claim that they pass before a comparable measurement and rescan. Missing or internally inconsistent material contrast evidence requires abstention. See W3C's [Understanding SC 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum) and axe-core's versioned [`color-contrast` rule](https://github.com/dequelabs/axe-core/blob/v4.13.0/lib/rules/color-contrast.json). |

## Deterministic validation and human semantic authority

Before a proposal becomes pending review, deterministic checks should verify only what code can establish reliably:

- the result matches exactly one supported schema branch;
- every evidence and passage alias belongs to the exact input package;
- each claim kind has the references required by the taxonomy;
- contextual and remediation claims retain the active profile's required conditions and check references;
- citation metadata is application-resolved rather than model-authored; and
- the candidate contains no assertion that the page or site is accessible, compliant, or certified; that an axe rule proved complete success-criterion failure or satisfaction; that the image's purpose, a label's appropriate wording or intended association, or a contrast exception is known before review; that an unmeasured color proposal passes; that a Technique is the only conforming solution; that code changed; that the issue is fixed; or that a manual check was executed.

A malformed candidate or one containing an invented reference or prohibited assertion does not enter review and is not silently repaired. The operation reports the failure. The MVP adds no regeneration workflow.

Reference presence does not prove that the passage entails the claim. The pending-review page therefore keeps material claims attached to their evidence and exact passages and clearly labels them as unverified AI interpretation. The reviewer considers that support as part of one final **approve**, **edit and accept**, or **reject** decision. No claim-by-claim decision records or separate semantic-review workflow are required.

This is the minimal way to satisfy the intent of REQ-GEN-002 without adding a second model or a duplicate human review before the actual review step. A proposal is not semantically accepted merely because it reached `pending_review`.

## Proposal confidence and scenario checks

Evidence sufficiency is already fixed by retrieval eligibility: only a completed `supported` package with all required evidence may reach the model. The proposal carries the separate categorical confidence label required by the current canonical requirements (`high`, `medium`, or `low`) with explicit uncertainty reasons; it is not a model probability, retrieval score, or accessibility score. Deterministic rules reject an invalid label. Incomplete required Finding evidence is a separate ineligible evidence-gate result and deterministic abstention; it does not assign a retrieval support state. A retrieval state of `incomplete`, `missing`, or `conflicting` independently produces the same deterministic abstention outcome, never merely `low` confidence.

Each profile needs one short pre-acceptance manual question and one later verification reminder. These are proposal fields, not independently versioned definition or execution entities:

| Profile | Blocking question before accepting a plan | Later verification reminder |
| --- | --- | --- |
| Image alternative | Inspect the rendered image, surrounding content, and behavior; classify its purpose as informative, functional, or decorative; record why; and select the applicable conditional branch. | Verify that the implemented alternative communicates equivalent purpose, a functional image exposes the intended action, or decorative treatment removes no information and is ignored as intended. |
| Form label | Inspect the control and task context; confirm the intended control, purpose, appropriate wording, whether a visible label is needed, and that the proposed explicit association targets that control. | Verify the rendered wording and visibility and confirm that the intended control exposes the appropriate programmatic name/association. |
| Text contrast | Confirm that the retained ratio, threshold, text-size/weight classification, exception status, scan profile, and design constraint describe the rendered page state. Incomplete material measurement evidence must already have produced abstention. | After the change, inspect the rendered foreground/background combination and measure it under the comparable profile. The accepted plan cannot predeclare that result. |

An unresolved blocking question prevents acceptance. The later verification reminder is not marked completed when the plan is accepted because the change does not yet exist. The final review record stores one final judgment disposition and may include one bounded note; it does not add a separate answer or manual-check record. Repeated occurrences and relationship enums are outside the MVP.

## LangChain and provider boundary

The application owns one normalized eligible structured-generation request and one normalized adapter outcome: a candidate-proposal value or a bounded error. The current analysis records one explicit global Local-or-Groq mode, selected provider, and exact model before any Finding generation; this configuration is not evidence of invocation. Each eligible selected Finding inherits that context, while only an actual call adds adapter/runtime and call provenance. The application-owned generation stage separately exposes `proposal` or deterministic `abstention`: an abstention bypasses both adapters and records no invocation provenance, while an adapter error fails the selected FindingWorkflow. Both adapters accept the same closed eligible request and, on success, the same candidate-proposal contract; they preserve the same validation and stop provider-specific wire objects at the adapter boundary.

For the local portfolio path, evaluate `qwen3.5:4b` through Ollama only after it passes the reference-PC capacity gate. LangChain's JavaScript [model interface documents direct structured output](https://docs.langchain.com/oss/javascript/langchain/models#structured-output), and the [ChatOllama integration documents `withStructuredOutput`](https://docs.langchain.com/oss/javascript/integrations/chat/ollama#structured-output). The proposed slice should use that direct model operation behind the application contract, with one fixed prompt and no tools. Exact schema behavior still requires a conformance test; framework parsing does not replace application validation.

For the external path, [ADR-0014](../decisions/ADR-0014-groq-as-mvp-external-generation-provider.md) fixes Groq model ID `openai/gpt-oss-20b` with Groq strict Structured Outputs for MVP evaluation. Groq's [Structured Outputs documentation](https://console.groq.com/docs/structured-outputs) is the current capability authority; model availability and deprecation status must be rechecked before evaluation. Groq remains the provider even though its API is [mostly OpenAI compatible](https://console.groq.com/docs/openai) and the model namespace begins `openai/`. The Groq-specific request schema is an adapter detail, not a second canonical application contract or a schema-generation platform. Neither provider may be an automatic fallback for the other. A failure for one finding stays attached to that finding's attempt and triggers neither another provider nor automatic processing of the remaining list. The two paths are exercised without a provider ranking or comparison claim.

## Model and evaluation boundary

Use one capacity-screened local configuration and the fixed Groq configuration for the MVP demonstration. Do not download or screen 2B or 9B local alternatives merely to make the portfolio slice look comparative. If `qwen3.5:4b` fails capacity or the small quality pilot, pause local evaluation and record a new model-selection decision that updates the exact-model requirements and frozen evaluation configuration before screening one smaller replacement through the existing local gates. Do not add the failed model or its replacement as a fallback. A second active local model or another hosted provider remains outside this assessment.

Use the compact fixed controlled manifest: one supported happy-path finding package per rule family through the capacity-screened local configuration and the same three packages through Groq, for six generation calls total. The three calls in each mode inherit that evaluation analysis's global provider selection; this is not a provider comparison. Freeze all inputs and expected outcomes before seeing either model's results. Run the one frozen `incomplete` retrieval package defined by the accepted evaluation manifest and the shared comparison checks once because they occur before provider invocation and do not need provider duplication. Observe separately:

- schema and branch validity;
- exact evidence and citation resolution;
- correct support-state gating and abstention;
- conditional remediation and inclusion of the blocking check;
- reviewer-confirmed semantic support and remediation usefulness; and
- zero invented evidence, citations, check results, code changes, or accessibility/compliance/certification claims.

This portfolio manifest demonstrates the two bounded integrations; it does not select a release model or satisfy statistical evaluation, reviewer-count, provider-comparison, support-qualification, or generalized quality gates. Do not add an LLM judge, aggregate score, leaderboard, or significance claim.

## Conceptual generated result

This is a documentation-level projection nested under one selected FindingWorkflow in the run's `run.json` aggregate, not a database schema or a proposal-version graph.

| Record part | Minimum information |
| --- | --- |
| Placement and lineage | Nested under the owning FindingWorkflow, so it inherits the aggregate's `runId`, the Finding's `findingId`, and that Finding's rule mapping and retrieval context. Do not repeat those identities or create a generated-result ID. Reuse the Finding's corpus version and cited `passageId` references. |
| Run provider context | Inherited from the run: analysis-wide selected Local or Groq mode, provider, and exact model identifier. This immutable configuration does not prove invocation and is not duplicated in the generated result. |
| Invocation provenance | Present only after a call is attempted, as one compact nested invocation: actual adapter identifier/version, non-secret endpoint identity, prompt/output-contract provenance, bounded material generation parameters, non-secret outcome, and validation result. Runtime/model revision or digest, request time, and safe usage metadata are optional when available. It inherits or references the run provider/model context and owning Finding's corpus/passage context and adds no invocation ID. |
| Generation-stage result when present | Exactly one of `proposal` or deterministic pre-call `abstention`. A proposal references the eligible invocation and validation outcome. An application-authored abstention references its available evidence and retrieval result, records its sufficiency state, missing or conflicting information, policy reason, confirmation that no adapter or model call occurred, and manual-investigation guidance; it has no invocation and no proposal-review decision. A bounded provider or validation failure retains the attempted invocation and failure outcome but creates neither result branch. |
| Proposal content | Finding summary; closed typed claims; conditional remediation options; evidence and passage aliases; assumptions; the deterministic `supported` eligibility reference; separate categorical confidence and uncertainty reasons. This immutable original is the only AI proposal for the Finding in the MVP. |
| Manual work | Proposal branch only: the active profile's blocking contextual question and later verification reminder. The final review record stores one judgment disposition plus an optional bounded note, not a separate answer record. An abstention instead provides non-decisional manual-investigation guidance. |
| Validation and review state | Proposal branch only: deterministic validation results, prohibited-claim checks, fixed limitations, and `AI-generated — pending human review`; semantic-support confirmation belongs to the later review action. An abstention remains terminal and never enters that state. |

The MVP has no regeneration, proposal-version chain, or separate one-to-one IDs for generation and proposal objects. The original proposal remains inspectable after its one final review decision; a terminal abstention remains inspectable without a review decision.

## Meaningful alternatives

| Alternative | Trade-off and trigger |
| --- | --- |
| Direct Ollama adapter without LangChain | Fewer framework layers, but it would not demonstrate the project's LangChain objective and would make later provider experiments less comparable. Consider it only if the LangChain adapter fails required structured-output, provenance, or capacity behavior. |
| Two-pass generation and critique | May catch some unsupported claims, but doubles model work and still cannot make a model the authority over its own grounding. Defer it unless evaluation later shows that the single-call plus reviewer boundary cannot meet quality needs. |

## Assumptions and remaining open questions

- Runtime findings are limited to `image-alt`/SC 1.1.1, `label`/SC 4.1.2, and `color-contrast`/SC 1.4.3; the project-owned synthetic packages remain evaluation baselines rather than runtime target intake.
- A complete page scan lists every returned violation node as an independent Finding, so its collection may contain multiple Findings; only one selected Finding enters generation at a time, and only its minimized evidence is model-visible.
- The accepted retrieval policy can identify a `supported` result without treating similarity as confidence or authority.
- One concise finding, at most three short passages, and the small output schema fit the capacity-screened local context without truncation.
- OD-007 and OD-015 are resolved for the MVP: the closed evidence-sufficiency states and minimal application-owned TypeScript/runtime-validation boundary are authoritative; exact record field names remain implementation detail.
- Canonical review semantics place human semantic judgment in the step-5 final decision; entry into `pending_review` proves only mechanical eligibility.
- A deterministic policy abstention records that no provider call occurred in the Finding's nested generated result.
- Formal qualification, provider support, and release claims remain Deferred and separate from this non-promotable portfolio manifest.

## Risks

- A reviewer may mistake resolvable citations for semantic support or approve without reading the retained passages.
- Public-page text or attributes may escape minimization, redirect the model, or reveal sensitive data if the selected-finding boundary fails.
- The model may state an image purpose, label wording/association, exception, or design constraint as fact even though the scan did not establish it.
- A contrast response may present an unmeasured color pair as passing or repeat a ratio whose underlying evidence is incomplete.
- A small model may follow the schema but still produce shallow, repetitive, or overbroad advice.
- Untrusted evidence or passage text may redirect the model if prompt boundaries and prohibited-claim checks fail.
- A list of public-page findings may look like broad WCAG coverage even though the product runs only three rules and processes one finding at a time.

## Explicit non-goals

- Agents, LangGraph orchestration, tool calls, web search, conversation memory, critique loops, model consensus, or automatic retries and fallback.
- A semantic-judge model, pre-review human validation stage, fine-tuning, synthetic training generation, or production prompt management.
- Source-code patches, repository access, automatic remediation, automatic rescanning, or claims that a change was applied.
- A fourth rule family, multilingual or vision input, raw-page prompting, page ingestion into the corpus, combined multi-finding prompts/proposals, a second hosted provider, provider registry, or provider comparison.
- Automatic retrieval or generation for the finding list, parallel calls, queues, bulk review, or scan-level remediation conclusions.
- Accessibility certification, legal-compliance interpretation, whole-page accessibility claims, or treating a proposal, citation, reviewer decision, or later scan as proof of conformance.

## Planning acceptance criteria

This step is adequately defined for the exact-three-rule portfolio slice when:

- one supported controlled finding from each of the `informative-image-alt`, `form-input-label`, and `text-contrast` evaluation profiles can independently produce one schema-valid pending proposal through the same application-owned LangChain path in local mode and in Groq mode;
- any runtime finding remains isolated from the page's other findings, and its prompt contains neither the page URL/locator/raw content nor unrelated finding evidence;
- `incomplete`, `missing`, and `conflicting` support produce the documented deterministic abstention without a model call, while retrieval failure remains a failure with no support state;
- every material claim uses the closed taxonomy and only exact supplied evidence and passage aliases;
- deterministic checks reject malformed references and every prohibited assertion without adding a second model or repair call;
- the pending view clearly separates scanner evidence, retrieved guidance, AI interpretation, and application-owned limitations;
- the reviewer can inspect each exact passage before making one final approve, edit-and-accept, or reject decision;
- each profile's contextual question blocks acceptance while unresolved, its later verification remains a reminder rather than a separate execution record, and incomplete contrast evidence always abstains; and
- the analysis-wide mode is explicit and immutable, each actual call records its own invocation provenance, abstention records no invocation, no failure triggers fallback or automatic collection processing, and the six controlled generation calls remain non-comparative.

## Documentation navigation

- Previous workflow step: [Accessibility guidance retrieval assessments](guidance-retrieval/README.md)
- Next workflow step: [Human remediation review assessment](HUMAN_REMEDIATION_REVIEW_ASSESSMENT.md)
- [Evidence and review workflow requirements](../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md)
- [Architecture index](../README.md)
- [Project documentation index](../../README.md)
