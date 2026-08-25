# Human remediation review assessment

## Authority, status, and scope

**Status:** Proposed assessment as of 2026-08-24, aligned with the accepted MVP boundaries on 2026-08-25. This assessment elaborates the accepted human-decision boundary in REQ-REV-001 and proposes the smallest review behavior for one reviewer and one proposal at a time. It does not change the status of REQ-REV-002 through REQ-REV-007, override an accepted decision, select a UI component or workflow library, authorize development, or claim that the behavior exists.

The authoritative requirement IDs, wording, and recorded statuses for this workflow step remain in [Evidence and review workflow requirements](../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#human-review-and-manual-checks). This is a supporting Proposed architecture assessment: it owns no requirement IDs or statuses, cannot override an identified requirement or accepted ADR, and does not authorize development.

## Recommendation and technical boundary

Use one linear, evidence-first proposal review screen backed by the authoritative local application service. The same screen supports exactly three project-owned synthetic profiles—`informative-image-alt` (`image-alt`/SC 1.1.1), `form-input-label` (`label`/SC 4.1.2), and `text-contrast` (`color-contrast`/SC 1.4.3)—but presents only one finding and one proposal at a time. It never batches decisions or compares proposals across profiles. The proposal's content and provenance remain immutable, its exact upstream support and review readiness are visible, and the reviewer has three explicit choices: approve it unchanged, edit and accept a reviewer-authored successor, or reject it.

The same local reviewer is the MVP authority for deciding whether each material claim and remediation step is semantically supported within the displayed evidence and cited guidance. This human judgment is required before acceptance and is not delegated to another model, reviewer queue, or workflow. This is enough to demonstrate all three profiles without user accounts, login, reviewer identity authentication, assignment, queues, collaboration, or production workflow orchestration. The accepted authenticated-loopback-API boundary still applies to application requests.

The future implementation should evaluate this slice through the boundary already established by [ADR-0012](../decisions/ADR-0012-react-as-initial-user-interface-library.md): React renders a closed, sanitized, text-by-default view projection and holds only transient interaction state, while the local service owns canonical records, transition validation, application-recorded timestamps, persistence, and recovery. No router, form library, state library, component kit, Markdown renderer, or workflow engine is required by this step.

The minimum interaction is:

1. The local service resolves the exact finding, evidence, retrieval, generation, proposal, citation, evidence-sufficiency, and manual-check versions into one bounded review projection.
2. The React view presents those facts in a deterministic reading order, with each information layer explicitly named and no unsafe target or model markup rendered.
3. The reviewer compares every material claim and remediation step with its displayed evidence and passages, records the required semantic-support confirmations and any pre-acceptance manual-check results, and submits one explicit decision against the displayed proposal revision.
4. The service mechanically rechecks the current revision, reference resolution, required fields, prohibited claims, evidence-sufficiency invariants, and manual-check states before it records the review action and resulting proposal state together. The service does not infer semantic entailment; it preserves the reviewer's explicit judgment. A stale or superseded view cannot decide a different revision.

This division preserves the service as the source of truth after reload or interruption and prevents a browser component, disabled-button state, or client clock from becoming decision authority.

## Minimum review information and presentation

All required information should be available on the same page. Accessible disclosures may reveal bounded detail, but the decision basis, limitations, evidence-sufficiency reasons, unresolved assumptions, and blocking conditions must not be hidden by default.

1. **Context and status.** Show the sanitized target or fixture label, active profile, exact axe rule and mapped success criterion, scan time and declared page state, material scan configuration, supported scenario coverage, proposal version, current lifecycle state, and the label **AI-generated proposal — pending review**. For `label`, state explicitly that this profile maps the axe result to SC 4.1.2, not to SC 3.3.2 or SC 1.3.1, and that the automated result does not establish complete success-criterion non-conformance. At the point of decision, state that acceptance creates only a remediation plan for later work; it does not modify code, prove that a barrier is fixed, establish whole-page accessibility, establish legal compliance, or provide certification.
2. **Review readiness.** Show the immutable pre-generation eligibility basis: complete required finding evidence plus a completed `supported` retrieval. A proposal cannot exist for `incomplete`, `missing`, or `conflicting` support; those states keep the finding visible on the abstention/manual-review path. Separately show the proposal's categorical confidence (`high`, `medium`, or `low`), uncertainty reasons, unresolved assumptions, citation-resolution status, and blocking manual-check state. Confidence is not evidence sufficiency, a model probability, retrieval score, accessibility score, or compliance likelihood.
3. **Deterministic finding and captured evidence.** Show the scanner rule and result type, affected target's minimized semantic or locator summary, permitted evidence excerpts, scan provenance, redaction or withheld-data indicators, and coverage limits. Keep links to exact evidence-item records inspectable. A scanner result must not be relabeled as a confirmed accessibility issue merely because it reached review.
4. **Retrieved guidance and citations.** For each admitted passage, show publisher, source title, authority type, document version or date, section or locator, canonical citation, and the exact retained passage used. Attach passage references directly to the material claims and remediation steps they support. Retrieval rank or vector distance must not be presented as authority or confidence. An external canonical-source link, if offered, must come from the corpus record, be explicitly activated by the user, and pass the accepted URL policy; the application must not fetch remote previews automatically.
5. **AI-generated interpretation and remediation.** Clearly label the finding summary, explanation, user-impact statements, remediation steps, assumptions, limitations, and unverified statements as model-generated. Each atomic material claim and remediation step should expose its evidence and passage references in context and require an explicit reviewer judgment that the references support it within their stated scope before acceptance. Exact generation provenance can remain in an inspectable details region, but it must preserve the generation, provider-profile, model, prompt, schema, and validation identities needed for later traceability.
6. **Manual checks.** Show each immutable check definition's question or procedure, reason, related claim or remediation step, evidence needed, intended phase, and whether it blocks acceptance. Keep the definition separate from every human execution/result occurrence. An occurrence shows its execution status and, only when applicable under the matrix below, observed outcome, relationship to the proposal, reviewer attribution, time, and evidence or note; a checkbox alone must never imply that a check was executed.
7. **Human decision and history.** Present the decision controls only in the reviewer layer. Human edits and notes must be labeled reviewer-authored, and the original proposal version, changed fields, decision, resulting state, actor attribution, and application-recorded time must remain inspectable after the decision.

The page should use native headings, landmarks, lists, links, buttons, labels, and form controls; one logical visual and DOM order; visible focus; and text labels that do not depend on color or icons. Citation names must identify their source and section. Validation failures need an error summary and field association, while save, failure, and status changes need non-disruptive assistive-technology announcements. Passive refresh must not steal focus or replace an in-progress edit. An unavailable acceptance action must remain inert and have adjacent text explaining the exact blocker.

Scanner excerpts, target content, corpus passages, generated content, and reviewer notes remain untrusted text. Raw HTML, `srcdoc`, executable URLs, externally supplied DOM identifiers, arbitrary object properties, automatic remote previews, and hidden sensitive payloads must not enter the renderer. Any future rendered page preview requires a separate accepted security and privacy design.

## Semantic support, evidence sufficiency, abstention, and manual checks

A proposal entering this screen has passed structural, reference-membership, and prohibited-state checks, but those mechanical checks do not prove that a passage entails a claim or that the remediation fits the evidence. For the single-reviewer MVP, the reviewer is the per-proposal semantic-support authority: every material claim and remediation step must be explicitly confirmed as supported within the exact displayed evidence and cited passage scope before acceptance. An unsupported claim blocks unchanged approval. The reviewer may edit and accept only when the revised wording is supportable from the same retained evidence and guidance; otherwise the only proposal decision is rejection for insufficient evidence or context.

A proposal may show `high`, `medium`, or `low` confidence, but that label alone does not approve or reject it. Concrete semantic-support confirmations, assumptions, and manual-check conditions control readiness. The evidence-sufficiency gate remains the immutable `supported` retrieval plus complete required evidence that allowed generation. For an edited successor, the reviewer may assess successor-specific confidence under the same categorical rubric; the service validates the allowed value, uncertainty reasons, and affected-claim mapping. It must not copy or raise confidence automatically without existing evidence, resolved assumptions, and reviewer support confirmation. Because edit-and-accept cannot add evidence or guidance in this MVP, a newly discovered missing basis requires rejection rather than an unsupported eligibility change.

If the core evidence or guidance needed for a remediation conclusion is absent or irreconcilably conflicting, the generation result should have been an abstention rather than a reviewable proposal. If that condition becomes apparent here, reject the proposal. An abstention is outside this proposal-decision screen and has no approve, edit-and-accept, or reject control in this assessment.

### Profile-specific review boundaries

The shared screen changes only the profile-specific evidence, remediation, and checks. All three profiles keep the same decision semantics:

| Profile | Reviewer must confirm before acceptance | Permitted plan | Later verification retained with the plan |
| --- | --- | --- | --- |
| `informative-image-alt` | The image's actual purpose and context—informative, functional, or decorative—and whether the cited guidance supports the selected branch. | An equivalent alternative for informative content, a purpose-oriented name for a functional image, or ignored decorative treatment. | Inspect the implemented alternative in context and confirm its appropriateness; the rescan alone cannot judge alt-text quality. |
| `form-input-label` | The control's purpose, appropriate wording, whether the fixture needs a visible label, and that the proposed explicit association targets the intended control. | For this controlled fixture, an explicit association between a concise visible label and the intended control. Do not treat the `label` finding as proof of complete SC 4.1.2 non-conformance or relabel it as SC 3.3.2/1.3.1. | Inspect rendered wording and visibility and confirm the intended control exposes the appropriate programmatic name/association. |
| `text-contrast` | The retained measured ratio and threshold, normal/large-text classification, exceptions, comparable scan profile, and relevant design constraint. If any material contrast evidence is incomplete, no proposal is approvable; generation should abstain. | Adjust the foreground, background, or both, preserve the stated design constraint, and measure again. An unmeasured candidate pair cannot be described as passing. | Inspect the rendered result and measure the foreground/background combination under the comparable profile. |

These judgments use the exact retained passages and evidence described in the [generation assessment's profile boundaries](EVIDENCE_GROUNDED_REMEDIATION_GENERATION_ASSESSMENT.md#profile-specific-evidence-and-proposal-limits). They do not expand automated coverage or turn reviewer acceptance into a WCAG-conformance decision.

The three profile-defining pre-acceptance checks are expected to be executed, not bypassed as `not applicable`. If inspection shows that the selected profile or remediation branch does not apply, the reviewer rejects the proposal as inapplicable or insufficiently grounded. The generic record model retains `not applicable` for future check definitions, but the three portfolio profiles do not need that exception to demonstrate their acceptance path.

Each manual check has an immutable, versioned **definition** containing its provenance, question or procedure, reason, related claim or step, evidence needed, intended phase, and blocking classification. Each planned or actual execution is a separate **result occurrence** that references the definition and exact proposal or finding. For post-change verification, the later comparison stage creates a new `pending` occurrence already linked to the later scan and comparison; until then the accepted plan shows the unexecuted definition rather than a fabricated result. Repeating a check creates another occurrence; it does not overwrite the definition or an earlier result.

The allowed result-field combinations are:

| Execution status | Observed outcome | Relationship to proposal | Reviewer and execution time | Evidence or rationale | Acceptance effect |
| --- | --- | --- | --- | --- | --- |
| `pending` | Unset | Unset | Executor and execution time unset | No execution evidence; the definition still explains what is needed | Blocks when the definition is blocking. A non-blocking post-change check may remain pending in an accepted plan. |
| `completed` | Required | Exactly one of `supports`, `contradicts`, or `inconclusive` | Required | At least one bounded evidence reference or note is required | A blocking check clears only with `supports`; `contradicts` or `inconclusive` blocks acceptance. |
| `not applicable` | Unset; no outcome was observed | Unset; do not fabricate `supports` or `inconclusive` | Required | Rationale explaining why the check does not apply is required | Clears a blocking check only when an accepted profile policy permits it; the three selected pre-acceptance checks do not. |

REQ-REV-006 permits `not applicable` only when an accepted profile policy allows it and records a rationale. This Proposed assessment recommends that the three profile-defining checks do not allow that exception: contradictory, inconclusive, pending, or inapplicable profile/remediation judgments prevent acceptance and lead to edit or rejection as described above. That stricter profile detail remains Proposed and cannot override the owning requirement. Acceptance never relabels a pending check as executed, and a later result never rewrites the earlier proposal decision. Rejection affects only the proposal version; it does not reject or alter the deterministic finding, captured evidence, or canonical guidance.

## Decision actions and acceptance criteria

Approval and edit-and-accept share these minimum gates:

1. The exact displayed proposal version is current, publication-eligible, structurally and referentially valid, and in `pending_review`; it is not an abstention.
2. Its finding, evidence, retrieval, corpus, generation, citation, and validation references still resolve to the recorded versions.
3. The reviewer explicitly confirms that every material claim and remediation step is supported within the scope of the displayed evidence and cited guidance, and no prohibited accessibility, compliance, certification, applied-code, or “fixed” claim is present.
4. The immutable `supported` eligibility basis still resolves, and the separate confidence category, uncertainty reasons, limitations, assumptions, source authority, and required checks are visible at confirmation time.
5. Every blocking manual-check occurrence satisfies the matrix above, with no contradictory or inconclusive material result.
6. The reviewer explicitly confirms the action, and the proposal transition, review action, accepted-plan pointer where applicable, and any successor version can be recorded together. A persistence failure leaves the proposal pending when no commit occurred, fails the enclosing workflow run, and permits an explicit retry only as a new linked workflow run after reading the durable state.

| Reviewer choice | Minimum user-facing behavior | Durable meaning and additional criteria |
| --- | --- | --- |
| **Approve** | Use an unambiguous label such as **Accept proposal as remediation plan**, followed by a summary of the exact proposal version, semantic-support confirmations, evidence-sufficiency basis, confidence/uncertainty, and limitations. An optional bounded note may be recorded. | Apply the shared gates to the unchanged AI proposal. Record an `approve` review action and make that exact version the accepted remediation plan. Approval does not approve the finding, page, implementation, accessibility, compliance, certification, or model accuracy. |
| **Edit and accept** | Editing opens a transient working copy; it is not a separate durable action. The reviewer may change only AI interpretation, remediation, assumptions, and the successor's confidence/uncertainty assessment. The immutable evidence-sufficiency basis, generated check definitions, and blocking classifications remain read-only. The reviewer may add only a separately labeled, non-blocking post-change verification definition. The final action is **Accept edited remediation plan**; cancel leaves the original pending. | Keep findings, evidence, canonical passages, original generation output, original eligibility basis, generated check definitions, and recorded result occurrences immutable. Record an edit reason, the complete reviewer-authored successor, changed-field summary or readable difference, and a link to the original. For every changed material claim or step, the same MVP reviewer must explicitly confirm support from the exact existing evidence and passages. The reviewer assesses successor confidence under the same rubric, and the service mechanically validates its value, uncertainty reasons, and affected-claim mapping. If the edit needs new evidence, guidance, a newly blocking pre-acceptance check, or correction of a materially wrong generated blocking definition, reject with the reason `insufficient evidence or context/manual-check support`; do not accept the edit or invent another workflow action. On success, record the canonical `edit` action with explicit acceptance semantics, mark the AI version superseded, and make the complete human-authored successor the accepted plan together. |
| **Reject** | **Reject proposal** remains available for every current pending proposal. Require a reason category and allow a bounded optional note; selecting `other` requires a note. | Record a `reject` action and make the exact proposal version terminally rejected. A small initial reason taxonomy should distinguish unsupported or incorrect interpretation/citation, unsafe or inapplicable remediation, insufficient evidence/context or manual-check support, unclear or unusable output, and other. Rejection creates no accepted plan, does not state that the finding or guidance is false, and triggers no regeneration, corpus change, prompt change, or model update. |

The exact editable-field and reason-code vocabulary remains Proposed. Free-form feedback should supplement a small structured taxonomy rather than replace it, because bounded categories are easier to inspect, minimize, and evaluate later. For this candidate, “every human edit” in REQ-REV-002 means the complete reviewer-authored successor submitted through each successful `edit` decision, whose semantics include explicit acceptance of that successor. That full version, its reason, readable difference, support confirmations, immutable evidence-sufficiency basis, reviewer-assessed confidence/uncertainty, action, and link to the immutable source version are retained and never overwritten. Transient keystrokes, canceled working copies, and mechanically invalid form attempts are not submitted edits; the MVP has no separate save-draft or submit-edit-without-decision action.

## Proposal lifecycle and allowed transitions

Keep proposal lifecycle, review readiness, manual-check execution, immutable evidence sufficiency, categorical confidence, and generation outcome as separate dimensions. This prevents combinations such as `low-confidence-approved-with-checks` from becoming opaque status values.

| Proposal-version state | Meaning |
| --- | --- |
| `pending_review` | A structurally and referentially validated proposal version is available for one explicit human decision. Semantic support has not yet been accepted by the reviewer, and the version may be blocked by other review conditions. |
| `accepted` | This exact version is the accepted remediation plan. It may be the unchanged AI version or a reviewer-authored successor. The review action records which path produced it. |
| `rejected` | This exact version was not accepted. It remains traceable and cannot appear as an accepted plan. |
| `superseded` | This version was replaced by an explicitly linked successor, such as the reviewer-authored version produced by edit-and-accept. It is preserved and is not itself the accepted plan. |

`Editing` is transient UI state, and `incomplete manual checks` or `acceptance blocked` is derived review readiness; none needs a durable proposal status in the MVP. An abstention is a different generation-result branch, not a proposal status.

The allowed minimum transitions are:

| From | Trigger | Result |
| --- | --- | --- |
| Validated generated proposal | Publication after generation | Create the proposal version in `pending_review`; keep its content and provenance immutable while allowing validated lifecycle transitions. |
| `pending_review` | Approve after all gates pass | Change the same version to `accepted` and append the `approve` action. |
| `pending_review` | Edit and explicitly accept after all gates pass | In one durable operation, change the AI version to `superseded`, create the complete reviewer-authored successor in `accepted`, and append the canonical `edit` action linking both versions. |
| `pending_review` | Reject with a reason | Change the same version to `rejected` and append the `reject` action. |
| `pending_review` | Cancel editing, fail transient form validation, or encounter a stale revision before a decision attempt | Remain `pending_review`; preserve the working view when safe or reconstruct it from durable records, and explain the condition. |
| `pending_review` | Fail during durable decision persistence with no confirmed commit | Keep the proposal `pending_review`, fail the enclosing workflow run, read the durable state, and allow an explicit retry only through a new linked workflow run. |

`Accepted`, `rejected`, and `superseded` are terminal for that proposal version in the MVP. An explicit later generation outside this review action set creates a new linked `pending_review` version and leaves the earlier decision intact. Correcting a terminal decision or persisting edit drafts would require a later versioning policy; neither should be implied by an overwrite or undo control. Abstention handling remains a separate generation-result path and cannot create an accepted remediation plan; this assessment adds no abstention action to the proposal review screen.

## Conceptual review record

Do not introduce a page-specific review entity. The minimum record is a documented composition of the existing **Proposal version**, **Review action**, **Manual-check result**, and referenced upstream records in the [information and workflow lifecycle model](../../requirements/INFORMATION_AND_WORKFLOW_LIFECYCLE.md). The proposal carries immutable manual-check definitions; each **Manual-check result** is a separate execution occurrence and may later reference the exact scan and comparison it verifies. OD-015 requires only small application-owned TypeScript records and runtime validation at actual external boundaries; this conceptual record does not select a schema framework.

| Record part | Minimum conceptual information |
| --- | --- |
| Identity and lineage | Review-action ID and schema version; active profile with exact rule/success-criterion mapping; exact proposal version; prior and resulting state; and references to the finding, scan, evidence, retrieval run, corpus snapshot, passages, and generation run. Their existing records preserve deeper configuration provenance. |
| Presented decision basis | The original proposal reference; immutable `supported` eligibility and complete-evidence basis; categorical confidence and uncertainty reasons; material claim and remediation-step links to evidence and passages; assumptions and limitations; and immutable manual-check definitions with separate result-occurrence references. Prefer references over duplicating sensitive payloads. |
| Decision | Action `approve`, `edit`, or `reject`, with `edit` meaning explicit acceptance of the complete reviewer-authored successor; a stable non-identifying application-local reviewer reference and display label; application-recorded UTC timestamp; reviewer semantic-support disposition for every material claim and remediation step; resulting state; reason category where required; optional bounded sanitized note; and the limitation version shown at confirmation. The actor reference is attribution, not authenticated identity or proof of reviewer qualification. |
| Gate snapshot | Reference-resolution and mechanical-validation results; reviewer semantic-support confirmations; immutable evidence-sufficiency result; confidence/uncertainty assessment; required blocking-definition IDs; exact result-occurrence IDs, execution statuses and relationships; and gate outcome at decision time. Later check results must not retroactively rewrite the basis of a prior decision. |
| Manual checks | Immutable definition ID and version, origin, question/procedure, reason, related claim or step, evidence needed, intended phase, and blocking classification. Each separate result occurrence has its own ID, definition/proposal/finding references, execution status, conditionally allowed outcome and relationship fields, reviewer and time, evidence or rationale, and later scan/comparison references for post-change execution. |
| Edited-successor branch | Immutable original ID, complete reviewer-authored successor content, changed-field summary or readable difference, edit rationale, retained references, reviewer support confirmation for each changed material claim, successor-specific reviewer-assessed confidence and uncertainty reasons, mechanical validation outcome, and `supersedes` link. A difference alone is insufficient to reconstruct the accepted plan. |
| Rejection branch | Rejected version and digest, structured reason, optional bounded feedback, no accepted-plan reference, and any later explicit retry link. Rejection is a decision not to accept this proposal, not an accessibility truth label. |
| Feedback and privacy disposition | Default classification `review signal only`, content sensitivity, retention/deletion status, and separately governed evaluation-candidate eligibility. No review decision is a gold label by default. |

The local service assigns the decision time, verifies that the displayed proposal version is still pending, and records the state change, review action, accepted-plan reference, and any edited successor together. After an ambiguous failure or reload, the screen reads that durable state before showing the result or allowing another decision. If no commit is confirmed, the current workflow run is `failed` and an explicit retry creates a new linked workflow run; it never reuses or overwrites the failed run. This is the minimum integrity behavior for one local reviewer, not a workflow-engine or storage selection.

## Reviewer decisions as future evaluation feedback

Reviewer decisions are context-bound product choices, not automatic ground truth. Approval means only that one reviewer accepted that plan for the recorded evidence; editing creates reviewer-authored content; rejection means the proposal was not accepted and does not prove that its finding, citation, or remediation was false. Acceptance rate must not be reported as model accuracy.

The preserved action, structured reason, edited fields, manual-check results, and exact evidence/retrieval/generation identities may help explain one bounded evaluation result. The compact MVP manifest does not promote review history into a gold set, training set, or formal evaluation authority. Any later curation or promotion requires a new explicit decision after OD-017's deferral is revisited. The product review action must not automatically:

- create a gold evaluation label or training example;
- change the corpus, retrieval mapping, prompt, model, provider profile, or support status;
- fine-tune or perform online learning;
- trigger regeneration or a rescan; or
- publish aggregate reviewer behavior or private notes.

Manual-check outcomes and later rescan evidence remain separate observations that may support or contradict the review decision; they must not be retroactively folded into the model-generated layer.

## Privacy and public-demo boundary

Page text, accessible names, selectors, attributes, URLs and query strings, evidence excerpts, screenshots, reviewer edits, free-form notes, actor identity, and precise timestamps can reveal personal data, proprietary markup, credentials, internal vulnerabilities, or working patterns. The review page should therefore receive only the minimized closed projection needed for the decision, render it as text, and show when content was redacted or withheld. Merely hiding raw evidence in a collapsed DOM region is not minimization.

Use a stable opaque application-local reviewer reference and a neutral label such as `Local reviewer` rather than an operating-system username or email. Bound and sanitize notes and warn against entering secrets. Keep the minimized proposal, edit or rejection, and decision timestamp only in that run's local directory; deleting the directory deletes the application's MVP copy. The MVP adds no protected-storage service, cascading deletion, tombstone, backup, export service, analytics, cloud tracing, telemetry, automatic source preview, or unrelated egress.

A future public demonstration must use project-owned synthetic or explicitly approved non-sensitive fixture evidence **and** synthetic demo-created reviewer identities, timestamps, edits, notes, and history. Superficially redacted private review history is not an acceptable demo source. Demo screens, exports, evaluation summaries, and captured images must contain only the approved public projection; private URLs, raw page evidence, prompts, provider responses, and protected notes remain excluded.

## Meaningful alternatives

| Alternative | Benefit | Why it is not the MVP recommendation |
| --- | --- | --- |
| Sequential evidence-to-decision wizard | Can reduce the amount shown at once and can make the intended review order explicit. | It hides cross-layer comparison, complicates backtracking and recovery, and introduces step-navigation or draft state. Consider it only if accessibility and usability evaluation shows that the linear page is overwhelming. |
| Wide split-pane evidence and proposal workspace | Can keep evidence and editable proposal text simultaneously visible on a large display. | It adds reading-order, focus, zoom, reflow, duplication, and narrow-window complexity. Consider it only if reviewer research demonstrates a material need for simultaneous visual comparison. |

The linear page is sufficient for the MVP because it closes one proposal-to-human-decision path, preserves exact evidence and citation traceability, records an inspectable product history, supports required manual checks, and leaves an accepted plan ready for later implementation and rescan without adding identity, collaboration, queueing, or orchestration systems.

## Planning acceptance checks

This workflow step is adequately defined for later implementation planning when all of the following are demonstrable in the accepted design and evaluation authority:

- One current proposal can be traced from every material claim and remediation step to exact deterministic evidence and exact retained guidance without confusing scanner facts, retrieved content, model interpretation, manual work, or reviewer authorship.
- The same screen reviews each of the three profiles independently and never carries a claim, citation, manual-check result, or decision from one finding into another.
- Image-purpose, label wording/purpose/visibility/association, and contrast classification/exception/profile/design judgments enforce their documented blocking checks; incomplete contrast evidence cannot reach an approvable proposal.
- Evidence sufficiency, reasons, assumptions, limitations, citation state, and manual-check blockers are understandable without color and without a probability, compliance, certification, or aggregate accessibility score.
- Approve, edit-and-accept, and reject enforce the stated gates and preserve the original, exact action, actor attribution, application timestamp, reason or note, resulting state, and superseding version where applicable.
- An unchanged approval accepts only the exact current version after the reviewer confirms semantic support; an edit creates a reconstructable reviewer-authored successor with a reviewer-assessed confidence category, uncertainty reasons, and changed-claim support confirmation while leaving the immutable evidence-sufficiency basis unchanged; a rejection never appears accepted or triggers regeneration.
- Every successful edit-and-accept submission retains the complete successor and its source version, while canceled or mechanically invalid transient edits create no durable version; there is no standalone draft or edit-only action.
- An abstention has no acceptance path, blocking checks cannot be bypassed in the one-reviewer MVP, a newly needed blocking check requires rejection for insufficient context, and unexecuted checks never appear completed.
- Manual-check definitions remain immutable; pending, completed, and not-applicable result occurrences obey the cross-field matrix, and a post-change occurrence can be traced to the later scan and comparison without rewriting the review-time record.
- Stale, duplicate, interrupted, and failed submissions cannot overwrite history or create contradictory accepted states, and the visible result reconstructs from durable service records after reload.
- Keyboard review and the one documented screen-reader smoke path proposed by REQ-A11Y-006 can inspect all layers and citations, understand unavailable actions, edit permitted fields, confirm a decision, recover from errors, and receive state announcements without implying a support matrix.
- Review feedback remains a privacy-bounded observation rather than automatic truth or learning input, and a public-demo inspection contains only synthetic or explicitly approved evidence and synthetic review history.

## Assumptions

- A publication-eligible proposal has passed structural, reference-membership, and prohibited-state validation, or an abstention is available on its separate result path; per-proposal semantic support still awaits the reviewer.
- One local reviewer examines one proposal at a time, with no concurrent decision or shared editing.
- The primary reviewer is the frontend developer accepted under OD-001; QA is a secondary user who may reproduce the finding, inspect evidence, and verify the later change. Neither label creates an authenticated role or certification.
- The generated proposal is concise enough to review on one page, and exact evidence and guidance can be disclosed without loading raw page captures into the renderer.
- A stable application-local attribution label and application-recorded time are sufficient for MVP product history; they are not authentication or compliance-audit identity.
- The accepted MVP boundary uses one local run directory, canonical JSON, and minimal TypeScript/runtime validation; exact filenames and field shapes remain implementation details.

## Remaining implementation questions

- Which compact interaction best captures material-claim support confirmation and the edited successor's confidence/uncertainty assessment on one screen?
- What small edit and rejection reason taxonomy provides useful feedback without encouraging sensitive notes?
- Should the local reviewer label be fixed, installation-local, or user-entered, and how is it exported without implying authenticated identity?
- What exact bounded note length, difference presentation, local filenames, and minimal record fields best fit the accepted run-directory policy?
- Does later usability evidence justify a persistent edit draft, wizard, or split view, or is the single linear page sufficient?

## Risks

- A fluent proposal or prominent approval control may cause a reviewer to overtrust AI output or mistake plan acceptance for page accessibility, compliance, certification, or completed implementation.
- A reviewer may see a citation without checking whether its passage actually supports the attached claim or remediation step.
- A reviewer edit may retain stale AI citations, sufficiency labels, or assumptions even though the material claim changed.
- A reviewer may overstate an edited successor's confidence or semantic support even though the edit cannot add evidence or guidance.
- Manual checks may be rubber-stamped, reduced to checkboxes, fabricated, or mistaken for completed implementation verification.
- A reviewer may infer image purpose, label intent, or a contrast exception from the proposal instead of inspecting the rendered fixture and retained evidence.
- The `label` profile may be overstated as proof of complete SC 4.1.2 failure or incorrectly broadened to SC 3.3.2/1.3.1; a contrast edit may be described as passing before the rendered colors are measured.
- A single reviewer's expertise, preference, or time pressure may bias decisions that later look authoritative.
- A stale page or duplicate submission may decide the wrong proposal revision or append conflicting history.
- Client rendering, generated Markdown, unsafe source URLs, or automatic previews may expose untrusted content or create unintended egress.
- Free-form notes, differences, actor labels, timestamps, and minimally redacted locators may leak private or proprietary page context.
- Review decisions may be misused as correctness labels, training data, or model-quality metrics without independent adjudication.
- Accessibility defects in focus, reading order, disabled-state explanations, differences, or announcements may prevent the intended reviewer from making an informed decision.

## Explicit non-goals

- User accounts, login, reviewer identity authentication, teams, roles, permissions, reviewer authorization, assignments, queues, notifications, escalations, comments, collaboration, or compliance-audit workflow. This does not remove the accepted local API request-authentication boundary or any applicable request-forgery control.
- Bulk review, multi-proposal comparison, reviewer ranking, second-signature approval, durable shared drafts, or production-scale workflow orchestration.
- Batch or cross-profile decisions, a fourth scenario, and carrying reviewer confirmations or manual-check outcomes from one finding to another.
- Automatic source-code edits, patch generation or application, repository access, deployment, remediation execution, or a claim that approval changed the page.
- Automatic regeneration, rescan, corpus mutation, prompt updates, provider switching, training-data promotion, fine-tuning, online learning, or behavioral telemetry from a decision.
- Selecting a router, form library, state library, component kit, Markdown renderer, workflow engine, storage engine, desktop container, or external service.
- Treating approval, rejection, evidence sufficiency, manual-check status, or later scan results as accessibility certification, legal compliance, whole-page accessibility, or automatic ground truth.
- Displaying raw private pages, screenshots, full HTML, credentials, proprietary content, personal conversation history, or real private review history in tracked material or a public demonstration.

## Documentation navigation

- Previous workflow step: [Evidence-grounded remediation generation assessment](EVIDENCE_GROUNDED_REMEDIATION_GENERATION_ASSESSMENT.md)
- Next workflow step: [Rescan evidence comparison assessment](RESCAN_EVIDENCE_COMPARISON_ASSESSMENT.md)
- [Evidence and review workflow requirements](../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md)
- [Architecture index](../README.md)
- [Project documentation index](../../README.md)
