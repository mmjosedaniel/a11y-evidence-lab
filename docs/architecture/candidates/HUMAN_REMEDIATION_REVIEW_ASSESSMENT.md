# Human remediation review assessment

## Authority, status, and scope

**Status:** Proposed assessment as of 2026-08-24, refined on 2026-08-27 to apply YAGNI to the single-reviewer portfolio MVP. It is aligned with the trusted operator-input boundary in [ADR-0018](../decisions/ADR-0018-trusted-operator-url-boundary.md).

The authoritative requirement IDs, wording, and statuses remain in [Evidence and review workflow requirements](../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#human-review-and-manual-checks). This assessment owns no requirement or decision, does not authorize development, and elaborates the accepted single-decision boundary in `REQ-REV-001`, `REQ-REV-008`, and `REQ-REV-009`. OD-022 supersedes or defers the earlier audit-history, proposal-version, manual-check-record, regeneration, and abstention-routing proposals.

## Recommended minimal review experience

Use one accessible results-list-and-detail flow backed by the local application service. The scan view lists every retained violation-node `Finding` for `image-alt`, `label`, and `color-contrast`, while native axe `incomplete` observations remain a separate non-proposal list. The user selects one Finding and reviews only that Finding's original AI proposal.

The MVP retains:

- the immutable original AI proposal and its evidence and citation references;
- one final action: `approve`, `edit and accept`, or `reject`;
- the complete final reviewer-authored text only for `edit and accept`;
- simple answers or notes for the proposal's required manual judgments; and
- one application-recorded decision timestamp and an optional bounded note.

It does not need proposal-version chains, an append-only review history, actor identities, edit-event logs, immutable manual-check-definition entities, separate manual-check execution records, a reason taxonomy, draft persistence, undo, regeneration, or audit-workflow machinery. The original proposal plus the one final decision is enough to demonstrate that AI output remains subordinate to human judgment.

React should render application-owned text and hold only transient form state. The local service should resolve the selected proposal, validate the submitted final decision, and persist the original proposal reference and final decision together. No router, form library, state library, component kit, Markdown renderer, or workflow engine is required by this step.

## Minimum interaction

1. Show the complete retained Finding list and the distinct scanner-review observations.
2. Let the user select one Finding with a reviewable proposal.
3. Present the deterministic evidence, retrieved guidance, AI interpretation, uncertainty, and required manual judgments in one clear reading order.
4. Let the reviewer choose `approve`, `edit and accept`, or `reject`.
5. Validate that the proposal is still pending, required references resolve, prohibited claims are absent, and any blocking manual judgment is resolved.
6. Persist one final review decision. A failed save leaves the proposal pending and reports the failure; it does not create a partial decision.

The findings list is navigation, not a queue. Reviewing one Finding must not retrieve, generate, decide, or change a sibling Finding.

## Minimum information shown to the reviewer

All required information should be available on one page, with bounded details disclosed where useful:

1. **Context.** Show the selected Finding, bounded target summary, exact axe rule and mapped WCAG success criterion, scan time, supported-rule coverage, and the run's immutable Local-or-Groq mode. Show actual provider/model provenance only when this Finding invoked a provider.
2. **Evidence sufficiency.** Show why the Finding was eligible for generation, the proposal's uncertainty and assumptions, citation-resolution status, and any unresolved manual judgment. Evidence sufficiency is not model confidence or an accessibility score.
3. **Deterministic evidence.** Show the rule result, minimized target facts, relevant scanner measurements, provenance, omissions, and coverage limits. Do not relabel the Finding as confirmed whole-page non-conformance.
4. **Retrieved guidance.** Show the retained passage, publisher, source type, version or date, heading or locator, and canonical source link. Retrieval rank or vector distance is not authority.
5. **AI proposal.** Clearly label the explanation, potential user impact, remediation approach, assumptions, limitations, and citations as AI-generated.
6. **Manual judgments.** Show a short rule-specific question list and let the reviewer record a simple answer or note. A blocking unresolved judgment prevents acceptance but does not require a separate workflow record.
7. **Decision.** Keep the original AI proposal inspectable. For an edit, collect the complete final reviewer-authored proposal. For rejection, an optional bounded note is enough.

Use native headings, landmarks, lists, links, buttons, labels, and form controls; one logical visual and DOM order; visible focus; and text labels that do not depend on color or icons. Validation errors should identify the problem, and status changes should be available to assistive technology without stealing focus.

Scanner excerpts, corpus passages, generated content, and reviewer notes remain text data. Do not render them as raw HTML or automatically load remote previews.

## Rule-specific manual judgment

The same small review interaction applies to all three profiles:

| Profile | Judgment required before acceptance | Permitted plan | Later verification |
| --- | --- | --- | --- |
| `informative-image-alt` | Determine the image's actual purpose and whether the cited conditional branch fits that context. | An equivalent alternative for informative content, a purpose-oriented name for a functional image, or ignored decorative treatment. | Inspect the implemented alternative in context; the rescan cannot judge its quality. |
| `form-input-label` | Confirm the intended control, appropriate wording, visibility, and programmatic association. | A concise visible label associated with the intended control. | Inspect the rendered label and confirm the control exposes the intended name. |
| `text-contrast` | Confirm the retained measurement, text classification, applicable exceptions, and design constraint. | Change the foreground, background, or both and measure again. | Inspect and measure the implemented combination under a comparable scan profile. |

These judgments do not expand automated coverage. In particular, the `label` rule remains mapped narrowly to SC 4.1.2, and no review decision establishes accessibility, conformance, certification, or legal compliance.

For the MVP, each required judgment needs only one of these inline dispositions:

- **supports:** the reviewer inspected the context and the judgment supports the current plan;
- **contradicts:** the judgment conflicts with the current plan, requiring an edit or rejection;
- **unresolved:** the reviewer cannot yet support the plan, so acceptance remains unavailable; or
- **not applicable:** allowed only with a short explanation when the proposed branch genuinely does not apply.

The final decision stores these dispositions and optional notes inline. Separate execution histories, immutable definition versions, relationship records, and post-change occurrences are deferred until a demonstrated product need requires them.

## Decision actions and lifecycle

Approval and edit-and-accept require:

1. the original proposal is still pending and its evidence and passage references resolve;
2. the reviewer can inspect evidence, citations, assumptions, limitations, and manual judgments;
3. no prohibited accessibility, compliance, certification, applied-code, or “fixed” claim remains in the accepted text;
4. every blocking manual judgment supports the plan or is validly marked not applicable; and
5. the reviewer explicitly submits one final action.

| Action | Minimal behavior | Durable meaning |
| --- | --- | --- |
| **Approve** | Accept the displayed AI proposal unchanged. An optional note may be added. | Store `approve`, the original proposal reference, inline manual judgments, and the decision time. |
| **Edit and accept** | Edit a transient working copy and submit the complete final text. Canceling creates no record. | Store `edit and accept`, the original proposal reference, complete reviewer-authored text, inline manual judgments, optional note, and decision time. The original AI proposal remains unchanged and inspectable. |
| **Reject** | Reject the proposal. An optional note may explain why. | Store `reject`, the original proposal reference, the current inline manual judgments, optional note, and decision time. A judgment may remain contradictory or unresolved. No accepted plan exists. |

The minimal lifecycle is:

`pending_review -> accepted`

`pending_review -> rejected`

`edit and accept` is an accepted decision with reviewer-authored final text, not a second proposal version or a `superseded` state. Transient editing is UI state only. A terminal decision has no edit, undo, regeneration, or retry workflow in this MVP.

## Conceptual review record

One Finding needs at most one review record:

| Part | Minimum conceptual information |
| --- | --- |
| References | PageAnalysisRun, Finding, original proposal, evidence, retrieval, and cited passage references. |
| Decision | `approve`, `edit and accept`, or `reject`; application-recorded time; optional bounded note. |
| Manual judgments | The small rule-specific question identifiers, their final dispositions, and optional bounded notes, stored inline. |
| Edited result | Present only for `edit and accept`: the complete final reviewer-authored proposal text. |
| Result | `accepted` for approve or edit-and-accept; `rejected` for reject. |

The service validates and writes this one record atomically. A reload reconstructs the view from the original proposal and final decision. This is ordinary local persistence, not an audit log or event-sourced workflow.

## Feedback, privacy, and public demonstrations

A reviewer decision is a context-bound product choice, not ground truth. Approval is not model accuracy, and rejection does not prove that the Finding or guidance is false. The MVP must not automatically turn decisions or notes into evaluation labels, training data, corpus changes, prompt changes, regeneration, or analytics.

Reviewer-authored text and notes may contain private page context. Bound and sanitize notes, retain them only in the local run directory, and send none to a provider. A public demonstration should use the project-owned synthetic evaluation cases or an explicitly approved non-sensitive public-page run. Do not publish arbitrary page evidence, prompts, provider payloads, or reviewer notes.

## Meaningful alternatives

| Alternative | Benefit | Why it is not the MVP recommendation |
| --- | --- | --- |
| Sequential evidence-to-decision wizard | May reduce the amount shown at once. | It adds step navigation and draft state. Consider it only if usability evaluation shows that one page is overwhelming. |
| Versioned review and manual-check history | Supports multiple decisions, reviewers, or audit reconstruction. | The MVP has one local reviewer and one final decision. Introduce it only after a real correction, collaboration, or audit requirement appears. |

## Planning acceptance checks

This step is adequately defined when:

- one selected Finding's deterministic evidence, retrieved passages, AI interpretation, assumptions, limitations, and manual judgments are clearly distinguishable;
- the reviewer can inspect the exact evidence and passages before making one decision;
- approve, edit-and-accept, and reject affect only the selected Finding;
- the original AI proposal remains inspectable after every decision;
- edit-and-accept stores the complete final reviewer-authored text without creating a version graph;
- unresolved blocking judgments prevent acceptance, while no separate check-definition or execution-history subsystem is required;
- a failed save does not create a partial or duplicate decision;
- abstention has no approval path;
- the interaction is keyboard operable and exposes status and errors to assistive technology; and
- no decision is presented as code modification, accessibility proof, compliance, certification, or automatic ground truth.

## Assumptions and open questions

- One local reviewer handles one selected proposal at a time.
- The original proposal is concise enough to inspect on one page.
- The run directory's one canonical `run.json` aggregate is sufficient for the original proposal and one final decision.
- Exact field names, note length, and layout remain implementation details.
- Usability evaluation may later show that a wizard or persisted draft is needed; neither is assumed now.

## Risks

- A fluent proposal or prominent approval control may cause overtrust.
- The reviewer may accept a citation without checking whether it supports the claim.
- An edit may make a citation or assumption stale.
- Manual judgments may be rubber-stamped.
- Reviewer notes may disclose page context.
- Accessibility defects in focus, reading order, errors, or announcements may prevent informed review.

## Explicit non-goals

- Accounts, login, reviewer authentication, teams, roles, assignments, queues, notifications, comments, or collaboration.
- Proposal-version graphs, edit-event history, actor attribution, audit logs, check-definition entities, repeated check occurrences, decision correction, undo, persisted drafts, or regeneration.
- Bulk or cross-finding review, combined proposals, reviewer ranking, or second-signature approval.
- Automatic code edits, repository access, deployment, remediation execution, rescanning, learning, or provider switching.
- Treating approval, rejection, manual judgments, or later scan results as accessibility certification, legal compliance, whole-page accessibility, or automatic ground truth.

## Documentation navigation

- Previous workflow step: [Evidence-grounded remediation generation assessment](EVIDENCE_GROUNDED_REMEDIATION_GENERATION_ASSESSMENT.md)
- Next workflow step: [Rescan evidence comparison assessment](RESCAN_EVIDENCE_COMPARISON_ASSESSMENT.md)
- [Evidence and review workflow requirements](../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md)
- [Architecture index](../README.md)
- [Project documentation index](../../README.md)
