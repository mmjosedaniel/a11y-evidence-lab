# Evidence-grounded remediation generation assessment

## Authority, status, and scope

**Status:** Proposed architecture detail for the fourth workflow step, assessed on 2026-08-24. It applies the bounded LangChain evaluation role accepted in [ADR-0013](../decisions/ADR-0013-langchain-as-initial-rag-integration.md), but does not promote LangChain to a release dependency; accept an open decision; qualify a model, runtime, or provider; select an external API provider; authorize implementation; or permit generated output to establish accessibility, conformance, certification, or completed remediation.

The authoritative requirement IDs, wording, and statuses remain in [Evidence and review workflow requirements](../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#generated-explanations-and-remediation-proposals). This assessment owns no requirement IDs or statuses and cannot override an identified requirement or accepted ADR.

## Recommendation: one bounded LangChain generation call

For the first portfolio slice, generate one structured response for one axe-core `image-alt` finding associated with WCAG 2.2 SC 1.1.1. Use the finding/evidence package from step 2 and the fixed retrieved passages from step 3. The proposed flow is:

1. Confirm that scan, evidence capture, and retrieval completed successfully and that the retrieval result is eligible under the policy below.
2. Assemble one privacy-safe prompt from the normalized finding, at most five retrieved passages, fixed instructions, and one closed proposal-or-abstention schema.
3. Invoke the selected model once through the application-owned provider contract. For the first local demonstration, evaluate a direct LangChain chat-model structured-output call; do not create an agent or graph.
4. Validate structure, supplied-reference membership, the closed claim taxonomy, required conditional language, and prohibited assertions with ordinary deterministic application logic.
5. Publish a passing result as **AI-generated — pending human review**. Deterministic validation proves only structure and traceability; the step-5 reviewer decides whether each material claim is actually supported before accepting a plan.

There is no automatic retry, critique call, second model, semantic-judge model, tool call, provider fallback, or pre-review human gate. This is sufficient to demonstrate the important technology path:

`finding + retrieved guidance -> LangChain structured generation -> deterministic validation -> cited pending proposal -> human review`

## Retrieval-support eligibility

Retrieval operation status and guidance-support state remain separate. The first product policy should be deliberately conservative:

| Retrieval result | Generation behavior |
| --- | --- |
| Completed and `supported` | Eligible for the single model call. |
| Completed and `weak` | Controlled by a versioned policy. The first `image-alt` policy should abstain; a later policy may permit a call only after evaluation defines the exact minimum passage roles. |
| Completed and `missing`, `conflicting`, or `unassessed` | Create an application-authored abstention without calling the model. Preserve the finding summary, support state, missing or conflicting source references, and required manual escalation. |
| Failed or integrity-invalid | Do not call the model and do not label the outcome an abstention. Report the upstream operation failure. |

For the first scenario, `supported` should mean that the frozen retrieval record contains the scenario's required normative SC 1.1.1 passage and the approved contextual guidance needed for the conditional remediation branches, with valid checksums and no unresolved source conflict. This is a scenario policy, not a similarity-score threshold or a statement that the page fails WCAG.

## Minimum model-visible input

Keep run provenance outside the prompt when the model does not need it. The model-visible package needs only:

| Layer | Minimum content |
| --- | --- |
| Finding evidence | Scenario and rule identifiers; native result category; minimized observed facts; element type or role; and stable evidence aliases. Exclude URLs, selectors, raw HTML, arbitrary page text, credentials, and user values. |
| Retrieved guidance | Passage alias, exact retained passage text, source-authority label, source and section alias, and immutable snapshot identity for each admitted result. |
| Generation rules | The closed claim kinds below; proposal/abstention branches; required references; conditional-remediation rule; evidence-sufficiency meanings; exact manual checks; and prohibited assertions. |
| Request limits | Prompt/schema versions, bounded input and output sizes, fixed generation parameters, and an instruction that evidence and passages are untrusted data rather than commands. |

The run envelope separately records the finding, evidence, retrieval, corpus, provider profile, model, prompt, schema, parameters, and input digest required by REQ-GEN-008 and the provider requirements. A required input that does not fit the selected context is blocked; it is never silently truncated.

## Closed first-scenario claim taxonomy

The model may emit only these material claim kinds for the `image-alt` slice:

| Claim kind | Permitted assertion | Required support |
| --- | --- | --- |
| `scanner_observation` | What axe-core reported about the selected element under the recorded scan profile. | One or more supplied evidence aliases; no guidance citation may be presented as page evidence. |
| `guidance_statement` | A bounded statement about SC 1.1.1 or its cited supporting material. | One or more supplied passage aliases whose recorded authority remains visible. |
| `potential_user_impact` | A qualified explanation of what users **may** miss when equivalent purpose is unavailable. | Both evidence and guidance aliases; no fabricated observed user outcome. |
| `contextual_interpretation` | A conditional connection between the finding and an informative, functional, or decorative image purpose. | Both evidence and guidance aliases plus the blocking image-purpose manual check. It cannot assert the purpose as known before that check. |
| `remediation_option` | A conditional approach for the purpose confirmed by the reviewer: equivalent alternative for informative content, purpose-oriented name for a functional image, or ignored decorative treatment. | Both evidence and guidance aliases plus the blocking image-purpose manual check. It proposes an approach, not a patch or applied change. |

The model returns only aliases. The application resolves visible citation titles, authority labels, versions, sections, checksums, and URLs from canonical corpus records. Application-owned text supplies the fixed limitations that the result is AI-generated, scanner evidence is partial, no code was changed, and acceptance is not certification or proof of accessibility.

## Deterministic validation and human semantic authority

Before a proposal becomes pending review, deterministic checks should verify only what code can establish reliably:

- the result matches exactly one supported schema branch;
- every evidence and passage alias belongs to the exact input package;
- each claim kind has the references required by the taxonomy;
- contextual and remediation claims remain conditional on the image-purpose check;
- citation metadata is application-resolved rather than model-authored; and
- the candidate contains no assertion that the page or site is accessible, compliant, or certified; that axe-core proved complete SC 1.1.1 failure or satisfaction; that the image is definitely informative, functional, or decorative before review; that a Technique is the only conforming solution; that code changed; that the issue is fixed; or that a manual check was executed.

A malformed candidate or one containing an invented reference or prohibited assertion does not enter review and is not silently repaired. The operation records the failure; an explicit later regeneration creates a new run.

Reference presence does not prove that the passage entails the claim. The pending-review page therefore keeps every claim attached to its evidence and exact passage and clearly labels it as unverified AI interpretation. The step-5 reviewer is the first-scenario semantic-support authority:

- **Approve** only after confirming that every material claim stays within the cited passage and observed evidence.
- **Edit and accept** may remove or correct an unsupported claim and must retain valid support for the successor claim.
- **Reject** when the core explanation or remediation cannot be supported.

This is the minimal way to satisfy the intent of REQ-GEN-002 without adding a second model or a duplicate human review before the actual review step. A proposal is not semantically accepted merely because it reached `pending_review`.

## Evidence sufficiency and the two manual checks

Evidence sufficiency remains categorical (`high`, `medium`, or `low`), never a model probability. The model proposes the category and reasons; deterministic rules may reject an invalid combination, and the reviewer decides whether the support is sufficient for acceptance. In the first fixture, the expected proposal is normally `medium` because scan evidence does not establish the image's purpose.

Only two check definitions are needed:

1. **Blocking before plan acceptance — determine image purpose and context.** The reviewer inspects the image, surrounding content, and any interactive behavior; records whether it is informative, functional, or decorative and why; and confirms which conditional remediation branch applies. A `pending`, `contradicts`, or `inconclusive` result blocks acceptance. This is the exact judgment that the deterministic `image-alt` finding cannot make.
2. **Post-change verification — verify the implemented alternative.** After a developer changes the page, a person verifies that the alternative communicates equivalent purpose, that a functional image exposes the intended action, or that decorative treatment removes no information. This check remains pending when the remediation plan is accepted because the change does not yet exist; it accompanies the later rescan and must not be presented as completed by generation or approval.

If essential finding evidence is absent, the required passage support is not eligible, or the model cannot preserve the conditional boundary, use abstention rather than `low`.

## LangChain and provider boundary

The application owns one normalized structured-generation request and one normalized proposal-or-abstention result. Local and external adapters must accept that same contract, preserve the same validation and provenance, and expose provider capability differences without changing domain records. Provider-specific SDK or wire objects stop at the adapter.

For the local portfolio pilot, evaluate `qwen3.5:4b` through Ollama only after it passes the reference-PC capacity gate. LangChain's JavaScript [model interface documents direct structured output](https://docs.langchain.com/oss/javascript/langchain/models#structured-output), and the [ChatOllama integration documents `withStructuredOutput`](https://docs.langchain.com/oss/javascript/integrations/chat/ollama#structured-output). The proposed slice should use that direct model operation behind the application contract, with one fixed prompt and no tools. Exact schema behavior still requires a conformance test; framework parsing does not replace application validation.

The first portfolio demonstration does not need an external provider implementation or comparison. It does need a contract that does not mention Ollama or Qwen. Before the product claims both local and API modes as supported, a later decision must select an external provider and that adapter must pass the shared conformance and privacy gates in ADR-0001 and REQ-LLM-004 through REQ-LLM-006. Neither provider may be an automatic fallback for the other.

## Model and evaluation boundary

Use one capacity-qualified local configuration for the first demonstration. Do not download or screen 2B, 9B, or an external model merely to make the portfolio slice look comparative. If `qwen3.5:4b` fails capacity or the small quality pilot, replace it through the existing gates; do not add it as a fallback. A second-model comparison belongs to later model-selection evidence and remains governed by the canonical evaluation requirements.

Reuse the relevant records from the same frozen 5–10-case `image-alt` suite rather than create a generation-only dataset. Step 3 defines six retrieval projections; generation adds only stage-specific expected outputs needed to cover direct support, contextual judgment, insufficient or conflicting support, and a prohibited-claim case while the complete shared suite stays within the canonical bound. Measure separately:

- schema and branch validity;
- exact evidence and citation resolution;
- correct support-state gating and abstention;
- conditional remediation and inclusion of the blocking check;
- reviewer-confirmed semantic support and remediation usefulness; and
- zero invented evidence, citations, check results, code changes, or accessibility/compliance/certification claims.

This portfolio pilot demonstrates the integration; it does not select a release model or satisfy later official evaluation, reviewer-count, provider-comparison, or support-qualification gates. Do not add an LLM judge.

## Conceptual proposal record

This is a documentation-level projection of the canonical **Generation run** and **Proposal version** records, not a database schema.

| Record part | Minimum information |
| --- | --- |
| Identity and lineage | Generation and proposal IDs; finding/evidence, retrieval-run, passage, and corpus-snapshot references; prompt, schema, and policy versions. |
| Provider provenance | Selected local or external profile; adapter/runtime/model identity and immutable revision or digest; context and parameters; no-fallback state; operation status. |
| Result branch | `proposal` or `abstention`; an application-authored abstention records that no model call occurred. |
| Proposal content | Finding summary; closed typed claims; conditional remediation options; evidence and passage aliases; assumptions; evidence sufficiency and reasons. |
| Manual work | Blocking image-purpose check and later post-change verification check, both unexecuted when generated. Human outcomes belong to manual-check result records. |
| Validation and review state | Deterministic validation results, prohibited-claim checks, fixed limitations, and `AI-generated — pending human review`; semantic-support confirmation belongs to the later review action. |

Regeneration creates a linked run and proposal version; it never overwrites the earlier candidate or review history.

## Meaningful alternatives

| Alternative | Trade-off and trigger |
| --- | --- |
| Direct Ollama adapter without LangChain | Fewer framework layers, but it would not demonstrate the project's LangChain objective and would make later provider experiments less comparable. Consider it only if the LangChain adapter fails required structured-output, provenance, or capacity behavior. |
| Two-pass generation and critique | May catch some unsupported claims, but doubles model work and still cannot make a model the authority over its own grounding. Defer it unless evaluation later shows that the single-call plus reviewer boundary cannot meet quality needs. |

## Assumptions and remaining open questions

- The first slice uses one synthetic `image-alt` fixture, a privacy-safe evidence projection, and an immutable SC 1.1.1 W3C micro-corpus.
- The accepted retrieval policy can identify a `supported` result without treating similarity as confidence or authority.
- One concise finding, five short passages, and the small output schema fit the capacity-qualified local context without truncation.
- OD-007 must finalize evidence-sufficiency meanings and OD-015 must select the serialized schema authority.
- Canonical review semantics place semantic-support confirmation in the step-5 decision; entry into `pending_review` proves only mechanical eligibility.
- A deterministic policy abstention records that no provider call occurred, as defined by the canonical generation-run model.
- Official evaluation and provider-support decisions remain separate from this non-promotable portfolio pilot.

## Risks

- A reviewer may mistake resolvable citations for semantic support or approve without reading the retained passages.
- The model may state an image purpose as fact even though the scan did not establish context.
- A small model may follow the schema but still produce shallow, repetitive, or overbroad advice.
- Untrusted evidence or passage text may redirect the model if prompt boundaries and prohibited-claim checks fail.
- The portfolio scenario may look more general than the one rule and fixture actually demonstrate.

## Explicit non-goals

- Agents, LangGraph orchestration, tool calls, web search, conversation memory, critique loops, model consensus, or automatic retries and fallback.
- A semantic-judge model, pre-review human validation stage, fine-tuning, synthetic training generation, or production prompt management.
- Source-code patches, repository access, automatic remediation, automatic rescanning, or claims that a change was applied.
- Multiple scenario families, multilingual or vision input, raw-page prompting, broad model comparison, or external-provider selection in this assessment.
- Accessibility certification, legal-compliance interpretation, whole-page accessibility claims, or treating a proposal, citation, reviewer decision, or later scan as proof of conformance.

## Planning acceptance criteria

This step is adequately defined for the first portfolio slice when:

- one supported `image-alt` retrieval record produces one schema-valid pending proposal through the provider-neutral LangChain path;
- missing, conflicting, unassessed, and initially weak support produce the documented abstention without a model call, while retrieval failure remains a failure;
- every material claim uses the closed taxonomy and only exact supplied evidence and passage aliases;
- deterministic checks reject malformed references and every prohibited assertion without adding a second model or repair call;
- the pending view clearly separates scanner evidence, retrieved guidance, AI interpretation, and application-owned limitations;
- the reviewer can inspect each exact passage and is required to confirm semantic support before approval or edit-and-accept;
- the image-purpose/context check blocks plan acceptance, while post-change verification remains visibly pending for the later rescan; and
- the first local configuration fits the reference PC and the small pilot records exact provenance without claiming release support.

## Documentation navigation

- Previous workflow step: [Accessibility guidance retrieval assessments](guidance-retrieval/README.md)
- Next workflow step: [Human remediation review assessment](HUMAN_REMEDIATION_REVIEW_ASSESSMENT.md)
- [Evidence and review workflow requirements](../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md)
- [Architecture index](../README.md)
- [Project documentation index](../../README.md)
