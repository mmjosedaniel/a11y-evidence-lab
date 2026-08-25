# Evidence-grounded remediation generation assessment

## Authority, status, and scope

**Status:** Proposed architecture detail for the fourth workflow step, assessed on 2026-08-24 and aligned with the accepted MVP boundaries on 2026-08-25. It applies the bounded LangChain evaluation role accepted in [ADR-0013](../decisions/ADR-0013-langchain-as-initial-rag-integration.md) and the local/Groq provider decision in [ADR-0014](../decisions/ADR-0014-groq-as-mvp-external-generation-provider.md), but does not promote LangChain, Ollama, a local model, Groq, or the named Groq model to a release-qualified dependency; authorize implementation; or permit generated output to establish accessibility, conformance, certification, or completed remediation.

The authoritative requirement IDs, wording, and statuses remain in [Evidence and review workflow requirements](../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#generated-explanations-and-remediation-proposals). This assessment owns no requirement IDs or statuses and cannot override an identified requirement or accepted ADR.

## Recommendation: one bounded LangChain generation call per finding

Support exactly three project-owned synthetic portfolio profiles. Each profile has one frozen axe-core rule-to-guidance mapping:

| Profile | Deterministic rule | Retrieval scope | Generation boundary |
| --- | --- | --- | --- |
| `informative-image-alt` | `image-alt` | WCAG 2.2 SC 1.1.1 | Explain the missing alternative and propose purpose-dependent treatment without deciding the image's purpose. |
| `form-input-label` | `label` | WCAG 2.2 SC 4.1.2 | Explain the missing programmatic label/name and propose an explicit visible-label association for the controlled fixture without inferring full WCAG non-conformance. The axe-rule mapping is not expanded to SC 3.3.2 or SC 1.3.1. |
| `text-contrast` | `color-contrast` | WCAG 2.2 SC 1.4.3 | Explain the retained measured ratio and applicable recorded threshold, then propose adjusting the foreground, background, or both and measuring again. It must not claim that an unmeasured candidate color pair passes. |

Process the profiles independently: one finding, one retrieval run, at most one eligible model call, and at most one proposal at a time. Do not batch findings, combine scenarios in a prompt, or let evidence from one profile support another. Use the finding/evidence package from step 2 and the fixed passages from step 3. The proposed flow is:

1. Confirm that scan, evidence capture, and retrieval completed successfully and that the retrieval result is eligible under the policy below.
2. For an eligible package, assemble one privacy-safe prompt from the normalized finding, at most five retrieved passages, fixed instructions, and one closed candidate-proposal schema.
3. Invoke the explicitly selected local or Groq model once through the same application-owned provider contract. Evaluate a direct LangChain chat-model structured-output call; do not create an agent or graph.
4. Validate structure, supplied-reference membership, the closed claim taxonomy, required conditional language, and prohibited assertions with ordinary deterministic application logic.
5. Publish a passing result as **AI-generated — pending human review**. Deterministic validation proves only structure and traceability; the step-5 reviewer decides whether each material claim is actually supported before accepting a plan.

There is no automatic retry, critique call, second model within a mode, semantic-judge model, tool call, provider fallback, or pre-review human gate. A failed local request never sends content to Groq; using Groq requires a new explicit per-run choice. This is sufficient to demonstrate the important technology path without designing a general accessibility assistant:

`finding + retrieved guidance -> LangChain structured generation -> deterministic validation -> cited pending proposal -> human review`

## Retrieval-support eligibility

The enclosing workflow-operation state, retrieval-stage disposition, and evidence-sufficiency state remain separate. The accepted MVP policy is deliberately conservative, and the deterministic finding remains visible in every row below:

| Retrieval result | Generation behavior |
| --- | --- |
| Completed and `supported` with all required evidence present | Eligible for the one explicitly selected provider call and a cited proposal. |
| Completed and `incomplete` | Do not call a model. Keep the finding visible and publish a deterministic abstention with the missing evidence and required manual review. |
| Completed and `missing` | Do not call a model. Keep the finding visible and publish a deterministic abstention with the missing guidance and required manual review. |
| Completed and `conflicting` | Do not call a model. Keep the finding and conflicting references visible and publish a deterministic abstention requiring manual review. |
| Failed operation or rejected stale/integrity-invalid input | Do not assign an evidence-sufficiency state, call a model, or label the outcome an abstention. Report the upstream failure. The first slice has no interactive cancellation or separate stale lifecycle state. |

For each profile, `supported` means that the frozen retrieval record contains the mapped normative success-criterion passage and the required contextual or implementation guidance for that profile's bounded proposal, with valid checksums, complete required evidence, and no unresolved source conflict. Evidence sufficiency is this eligibility state, not a similarity-score threshold, model confidence, or statement that the page fails WCAG.

## Minimum model-visible input

Keep run provenance outside the prompt when the model does not need it. The model-visible package needs only:

| Layer | Minimum content |
| --- | --- |
| Finding evidence | Profile and rule identifiers; native result category; minimized observed facts; element type or role; stable evidence aliases; and only the profile-specific facts listed below. Exclude URLs, selectors, raw HTML, arbitrary page text, credentials, and user values. |
| Retrieved guidance | Passage alias, exact retained passage text, source-authority label, source and section alias, and immutable snapshot identity for each admitted result. |
| Generation rules | The closed claim kinds below; proposal/abstention branches; required references; conditional-remediation rule; evidence-sufficiency eligibility states; separate proposal-confidence labels; exact manual checks; and prohibited assertions. |
| Request limits | Prompt/schema versions, bounded input and output sizes, fixed generation parameters, and an instruction that evidence and passages are untrusted data rather than commands. |

The run envelope separately records the finding, evidence, retrieval, corpus, provider profile, model, prompt, schema, parameters, and input digest required by REQ-GEN-008 and the provider requirements. A required input that does not fit the selected context is blocked; it is never silently truncated.

## Closed three-profile claim taxonomy

The same schema supports all three profiles, but the active profile fixes which assertions and manual checks are allowed:

| Claim kind | Permitted assertion | Required support |
| --- | --- | --- |
| `scanner_observation` | What axe-core reported about the selected element under the recorded scan profile. | One or more supplied evidence aliases; no guidance citation may be presented as page evidence. |
| `guidance_statement` | A bounded statement about the active profile's mapped success criterion or cited supporting material. | One or more supplied passage aliases whose recorded authority remains visible. |
| `potential_user_impact` | A qualified explanation of what users **may** experience because of the observed condition. | Both evidence and guidance aliases; no fabricated observed user outcome. |
| `contextual_interpretation` | A conditional connection between the scanner observation and the active profile's unresolved contextual facts. | Both evidence and guidance aliases plus that profile's blocking manual check. It cannot state an unresolved fact as known. |
| `remediation_option` | The active profile's bounded, conditional remediation approach. | Both evidence and guidance aliases plus any applicable blocking manual check. It proposes an approach, not a patch, exact unverified final value, or applied change. |

The model returns only aliases. The application resolves visible citation titles, authority labels, versions, sections, checksums, and URLs from canonical corpus records. Application-owned text supplies the fixed limitations that the result is AI-generated, scanner evidence is partial, no code was changed, and acceptance is not certification or proof of accessibility.

### Profile-specific evidence and proposal limits

| Profile | Minimum evidence admitted to generation | Allowed remediation direction and required uncertainty |
| --- | --- | --- |
| `informative-image-alt` (`image-alt` → SC 1.1.1) | The scanner's missing-alternative observation and minimized image-element facts. The fixture author's gold classification is excluded from the prompt. | Present informative, functional, and decorative treatment as conditional branches until a reviewer determines purpose and context. An alternative must communicate equivalent purpose rather than merely appearance or a filename. See W3C's [Understanding SC 1.1.1](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content) and axe-core's versioned [`image-alt` rule](https://github.com/dequelabs/axe-core/blob/v4.13.0/lib/rules/image-alt.json). |
| `form-input-label` (`label` → SC 4.1.2) | The scanner's missing-label observation, control type, and minimized programmatic association facts. Do not infer the intended label wording from private or absent content. | For the controlled fixture, propose a concise visible label whose explicit programmatic association targets the intended control. The reviewer must determine the wording, purpose, visibility, and intended association. The rule mapping remains SC 4.1.2 and does not prove complete failure of that criterion or establish SC 3.3.2/1.3.1. See W3C's [Understanding SC 4.1.2](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value) and axe-core's versioned [`label` rule](https://github.com/dequelabs/axe-core/blob/v4.13.0/lib/rules/label.json). |
| `text-contrast` (`color-contrast` → SC 1.4.3) | Complete retained foreground and background values, measured ratio, applicable threshold, recorded text size/weight, and explicit unresolved exception assumptions, all bound to the scan profile. | Explain the recorded measurement and propose changing the foreground, background, or both while preserving the design intent, then measuring the rendered result. It may offer exact candidate colors only as unverified options and must not claim that they pass before a comparable measurement and rescan. Missing or internally inconsistent material contrast evidence requires abstention. See W3C's [Understanding SC 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum) and axe-core's versioned [`color-contrast` rule](https://github.com/dequelabs/axe-core/blob/v4.13.0/lib/rules/color-contrast.json). |

## Deterministic validation and human semantic authority

Before a proposal becomes pending review, deterministic checks should verify only what code can establish reliably:

- the result matches exactly one supported schema branch;
- every evidence and passage alias belongs to the exact input package;
- each claim kind has the references required by the taxonomy;
- contextual and remediation claims retain the active profile's required conditions and check references;
- citation metadata is application-resolved rather than model-authored; and
- the candidate contains no assertion that the page or site is accessible, compliant, or certified; that an axe rule proved complete success-criterion failure or satisfaction; that the image's purpose, a label's appropriate wording or intended association, or a contrast exception is known before review; that an unmeasured color proposal passes; that a Technique is the only conforming solution; that code changed; that the issue is fixed; or that a manual check was executed.

A malformed candidate or one containing an invented reference or prohibited assertion does not enter review and is not silently repaired. The operation records the failure; an explicit later regeneration creates a new run.

Reference presence does not prove that the passage entails the claim. The pending-review page therefore keeps every claim attached to its evidence and exact passage and clearly labels it as unverified AI interpretation. The step-5 reviewer is the per-proposal semantic-support authority:

- **Approve** only after confirming that every material claim stays within the cited passage and observed evidence.
- **Edit and accept** may remove or correct an unsupported claim and must retain valid support for the successor claim.
- **Reject** when the core explanation or remediation cannot be supported.

This is the minimal way to satisfy the intent of REQ-GEN-002 without adding a second model or a duplicate human review before the actual review step. A proposal is not semantically accepted merely because it reached `pending_review`.

## Proposal confidence and scenario checks

Evidence sufficiency is already fixed by retrieval eligibility: only a completed `supported` package with all required evidence may reach the model. The proposal carries a separate categorical confidence label (`high`, `medium`, or `low`) with explicit uncertainty reasons; it is not a model probability, retrieval score, or accessibility score. The model proposes the label, deterministic rules reject invalid combinations, and the reviewer may confirm or revise it. A proposal with an unresolved blocking contextual judgment will normally have `medium` confidence. Missing core evidence is an `incomplete`, `missing`, or `conflicting` evidence-sufficiency result and deterministic abstention, never merely `low` confidence.

Each profile needs one blocking pre-acceptance definition and one later post-change definition:

| Profile | Blocking before accepting a plan | Non-blocking at plan acceptance; required after change |
| --- | --- | --- |
| Image alternative | Inspect the rendered image, surrounding content, and behavior; classify its purpose as informative, functional, or decorative; record why; and select the applicable conditional branch. | Verify that the implemented alternative communicates equivalent purpose, a functional image exposes the intended action, or decorative treatment removes no information and is ignored as intended. |
| Form label | Inspect the control and task context; confirm the intended control, purpose, appropriate wording, whether a visible label is needed for the fixture, and that the proposed explicit association targets that control. | Verify the rendered wording and visibility and confirm that the intended control exposes the appropriate programmatic name/association. |
| Text contrast | Confirm that the retained ratio, threshold, text-size/weight classification, exception status, scan profile, and design constraint describe the rendered fixture. Incomplete material measurement evidence must already have produced abstention. | After the change, inspect the rendered foreground/background combination and measure it under the comparable profile. The accepted plan cannot predeclare that result. |

A `pending`, `contradicts`, or `inconclusive` blocking result prevents acceptance. Post-change checks remain pending when the plan is accepted because the change does not yet exist; generation and approval must never present them as completed.

## LangChain and provider boundary

The application owns one normalized eligible structured-generation request and one normalized candidate-proposal result from an invoked adapter. The application-owned generation stage separately exposes the final `proposal` or deterministic `abstention` branches: an evidence-sufficiency abstention bypasses both adapters and records that no model call occurred. The selected local adapter and fixed Groq adapter must accept the same eligible request and candidate-proposal contract, preserve the same validation and provenance, and expose provider capability differences without changing domain records. Provider-specific SDK or wire objects stop at the adapter.

For the local portfolio path, evaluate `qwen3.5:4b` through Ollama only after it passes the reference-PC capacity gate. LangChain's JavaScript [model interface documents direct structured output](https://docs.langchain.com/oss/javascript/langchain/models#structured-output), and the [ChatOllama integration documents `withStructuredOutput`](https://docs.langchain.com/oss/javascript/integrations/chat/ollama#structured-output). The proposed slice should use that direct model operation behind the application contract, with one fixed prompt and no tools. Exact schema behavior still requires a conformance test; framework parsing does not replace application validation.

For the external path, [ADR-0014](../decisions/ADR-0014-groq-as-mvp-external-generation-provider.md) fixes Groq model ID `openai/gpt-oss-20b` with Groq strict Structured Outputs for MVP evaluation. Groq's [Structured Outputs documentation](https://console.groq.com/docs/structured-outputs) is the current capability authority; model availability and deprecation status must be rechecked before evaluation. Groq remains the provider even though its API is [mostly OpenAI compatible](https://console.groq.com/docs/openai) and the model namespace begins `openai/`. The Groq-specific request schema is an adapter detail, not a second canonical application contract or a schema-generation platform. Neither provider may be an automatic fallback for the other, and the two paths are exercised without a provider ranking or comparison claim.

## Model and evaluation boundary

Use one capacity-screened local configuration and the fixed Groq configuration for the MVP demonstration. Do not download or screen 2B or 9B local alternatives merely to make the portfolio slice look comparative. If `qwen3.5:4b` fails capacity or the small quality pilot, replace it through the existing local gates; do not add it as a fallback. A second local model or another hosted provider remains outside this assessment.

Use the compact fixed manifest accepted under OD-009: one supported happy-path generation package per scenario through the capacity-screened local configuration and the same three packages through Groq, for six generation calls total. Freeze all inputs and expected outcomes before seeing either model's results. Run one frozen representative `incomplete`, `missing`, or `conflicting` abstention package and the shared comparison checks once because they occur before provider invocation and do not need provider duplication. Observe separately:

- schema and branch validity;
- exact evidence and citation resolution;
- correct support-state gating and abstention;
- conditional remediation and inclusion of the blocking check;
- reviewer-confirmed semantic support and remediation usefulness; and
- zero invented evidence, citations, check results, code changes, or accessibility/compliance/certification claims.

This portfolio manifest demonstrates the two bounded integrations; it does not select a release model or satisfy statistical evaluation, reviewer-count, provider-comparison, support-qualification, or generalized quality gates. Do not add an LLM judge, aggregate score, leaderboard, or significance claim.

## Conceptual proposal record

This is a documentation-level projection of the canonical **Generation run** and **Proposal version** records, not a database schema.

| Record part | Minimum information |
| --- | --- |
| Identity and lineage | Generation and proposal IDs; exact profile/rule/success-criterion mapping; finding/evidence, retrieval-run, passage, and corpus-snapshot references; prompt, schema, and policy versions. |
| Provider provenance | Present only when an adapter was invoked: explicitly selected local or Groq mode; adapter/runtime/model identity and immutable revision or digest when available; context and parameters; no-fallback state; enclosing workflow-operation reference. |
| Result branch | `proposal` or `abstention`. A proposal references the eligible provider result and validation outcome; an application-authored deterministic abstention records its policy reason, manual-review direction, and that no adapter or model call occurred. |
| Proposal content | Finding summary; closed typed claims; conditional remediation options; evidence and passage aliases; assumptions; the deterministic `supported` eligibility reference; separate categorical confidence and uncertainty reasons. |
| Manual work | The active profile's blocking contextual check and later post-change verification check, both unexecuted when generated. Human outcomes belong to manual-check result records. |
| Validation and review state | Deterministic validation results, prohibited-claim checks, fixed limitations, and `AI-generated — pending human review`; semantic-support confirmation belongs to the later review action. |

Regeneration creates a linked run and proposal version; it never overwrites the earlier candidate or review history.

## Meaningful alternatives

| Alternative | Trade-off and trigger |
| --- | --- |
| Direct Ollama adapter without LangChain | Fewer framework layers, but it would not demonstrate the project's LangChain objective and would make later provider experiments less comparable. Consider it only if the LangChain adapter fails required structured-output, provenance, or capacity behavior. |
| Two-pass generation and critique | May catch some unsupported claims, but doubles model work and still cannot make a model the authority over its own grounding. Defer it unless evaluation later shows that the single-call plus reviewer boundary cannot meet quality needs. |

## Assumptions and remaining open questions

- The portfolio slice uses exactly three project-owned synthetic profiles: `informative-image-alt` (`image-alt`/SC 1.1.1), `form-input-label` (`label`/SC 4.1.2), and `text-contrast` (`color-contrast`/SC 1.4.3).
- The accepted retrieval policy can identify a `supported` result without treating similarity as confidence or authority.
- One concise finding, five short passages, and the small output schema fit the capacity-screened local context without truncation.
- OD-007 and OD-015 are resolved for the MVP: the closed evidence-sufficiency states and minimal application-owned TypeScript/runtime-validation boundary are authoritative; exact record field names remain implementation detail.
- Canonical review semantics place semantic-support confirmation in the step-5 decision; entry into `pending_review` proves only mechanical eligibility.
- A deterministic policy abstention records that no provider call occurred, as defined by the canonical generation-run model.
- Formal qualification, provider support, and release claims remain Deferred and separate from this non-promotable portfolio manifest.

## Risks

- A reviewer may mistake resolvable citations for semantic support or approve without reading the retained passages.
- The model may state an image purpose, label wording/association, exception, or design constraint as fact even though the scan did not establish it.
- A contrast response may present an unmeasured color pair as passing or repeat a ratio whose underlying evidence is incomplete.
- A small model may follow the schema but still produce shallow, repetitive, or overbroad advice.
- Untrusted evidence or passage text may redirect the model if prompt boundaries and prohibited-claim checks fail.
- The three profiles may look like broad WCAG coverage even though each demonstrates only one controlled rule mapping.

## Explicit non-goals

- Agents, LangGraph orchestration, tool calls, web search, conversation memory, critique loops, model consensus, or automatic retries and fallback.
- A semantic-judge model, pre-review human validation stage, fine-tuning, synthetic training generation, or production prompt management.
- Source-code patches, repository access, automatic remediation, automatic rescanning, or claims that a change was applied.
- A fourth scenario, multilingual or vision input, raw-page prompting, a second hosted provider, provider registry, or provider comparison.
- Accessibility certification, legal-compliance interpretation, whole-page accessibility claims, or treating a proposal, citation, reviewer decision, or later scan as proof of conformance.

## Planning acceptance criteria

This step is adequately defined for the three-profile portfolio slice when:

- one supported finding from each of the `informative-image-alt`, `form-input-label`, and `text-contrast` profiles can independently produce one schema-valid pending proposal through the same application-owned LangChain path in local mode and in Groq mode;
- `incomplete`, `missing`, and `conflicting` support produce the documented deterministic abstention without a model call, while retrieval failure remains a failure with no support state;
- every material claim uses the closed taxonomy and only exact supplied evidence and passage aliases;
- deterministic checks reject malformed references and every prohibited assertion without adding a second model or repair call;
- the pending view clearly separates scanner evidence, retrieved guidance, AI interpretation, and application-owned limitations;
- the reviewer can inspect each exact passage and is required to confirm semantic support before approval or edit-and-accept;
- each profile's contextual check blocks plan acceptance, its post-change verification remains visibly pending for the later rescan, and incomplete contrast evidence always abstains; and
- the selected local configuration passes the practical reference-PC capacity gate, the Groq path uses the exact dated evaluation model, and the six generation runs record exact provenance without provider ranking or release support claims.

## Documentation navigation

- Previous workflow step: [Accessibility guidance retrieval assessments](guidance-retrieval/README.md)
- Next workflow step: [Human remediation review assessment](HUMAN_REMEDIATION_REVIEW_ASSESSMENT.md)
- [Evidence and review workflow requirements](../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md)
- [Architecture index](../README.md)
- [Project documentation index](../../README.md)
