# Repository bugs

## Purpose and authority

This directory holds durable reports of defects in this repository's application, documentation, configuration, or agent workflow. A report preserves the problem, evidence, useful investigation, solution, and verification so another agent can resume without repeating discovery. Accessibility findings produced by the application remain in the product's own evidence workflow.

Requirements and Accepted ADRs define expected product behavior. The [development roadmap](../DEVELOPMENT_ROADMAP.md) owns application task selection, dependencies, and status; the [owning ExecPlan](../plans/README.md) coordinates authorized execution and its evidence. Bug records own the defect description and evidence-backed disposition. They cannot authorize implementation, expand scope, accept a decision, reopen a completed task, or prove task closure. Link to controlling evidence instead of copying plan detail. The index below mirrors each record; correct it from the record if they disagree.

## When to create a record

Search this index and relevant task records before starting a new investigation. Create one record for a substantive defect that persists across sessions or handoffs, recurs, crosses task boundaries, or needs investigation worth retaining. Routine corrections already contained in a task, temporary Red failures, feature proposals, and ordinary clarification do not need separate bug files.

Use `BUG-0001` style IDs and `bug-0001-short-description.md` filenames. The primary coordinator assigns the next unused number after checking existing records and updates this index in the same change. Keep IDs and filenames stable after resolution; add no empty future records or active/resolved subdirectories. Historical corrections stay in their original plans unless a current investigation needs a linked record.

## Ownership and handoff

- The primary coordinator maintains the record and index between worker write leases. Other agents read the relevant record and return evidence, hypotheses, proposed corrections, and the next action through their existing handoff; they do not write shared bug records.
- Include the bug ID and record link in the existing assignment packet or research capsule when relevant. The record supplements that assignment; it does not replace its scope, permissions, acceptance criteria, or budget. Update only material accepted findings, blockers, handoffs, or resolution evidence, rather than every agent turn.
- Identify the owning roadmap task and ExecPlan when a fix falls within already selected application work. Otherwise record `Unassigned` and the next scope/selection decision; continue unaffected authorized work. An out-of-scope bug does not authorize its own fix. Standalone documentation or workflow fixes name their authorized policy scope and may use `ExecPlan: Not required` under the [existing route](../../.codex/README.md#authorized-continuation-and-delegation).
- Preserve the [existing test/implementation ownership, review, and correction rules](../../.codex/execplan-implementation-workflow.md). A new bug ID, recurrence, or handoff never resets a work-slice budget or lease. Record observations separately from hypotheses and mark an unknown cause as unknown.
- Keep reports professional and concise. Link to suitable repository evidence; do not copy private or ignored material, credentials, personal conversations, raw agent transcripts, or token/cost logs into these public records. Add no telemetry or automatic logging.

## Status and verification

These labels describe a bug record, independently of roadmap task status:

| Status | Meaning |
| --- | --- |
| Reported | A suspected defect; reproduction or supporting evidence still needs confirmation. |
| Confirmed | Reproduction or other decisive evidence establishes a mismatch with the controlling expected behavior. A fix may remain unassigned. |
| In progress | An authorized fix is underway in its owning task or standalone policy scope. Record any current blocker in the next-action field. |
| Verified | The primary has accepted evidence that the reported behavior is corrected, including applicable regression checks and required review. |
| Closed | Disposed without a separate fix, with an evidenced reason such as duplicate or not a defect. Link a duplicate to its existing record; closure is not verification of a fix. |

Mark a fix `Verified` only after checking the original reproduction or equivalent evidence against the corrected revision, preserving applicable regression coverage and required review. For non-executable documentation/workflow defects, record the proportional structural, semantic, or manual evidence instead of inventing a test. Link results, affected revision, limitations, and primary acceptance in the record; a proposed patch or worker assertion alone is insufficient. An unknown cause can remain explicitly unknown when the fix is otherwise verified.

If the same defect recurs, reuse its record and return to `Reported` or `Confirmed` according to the new evidence. Preserve the previous fix, verified revision, and result in a short dated note. A materially different defect receives its own linked record. Bug verification does not close or reopen the owning roadmap task; its normal verification and documentation gates still apply.

## Bug index

The records below preserve confirmed defects and their current disposition.

| Bug | Summary | Status | Responsible task or policy scope |
| --- | --- | --- | --- |
| [BUG-0001](bug-0001-generation-metadata-read-escape.md) | Admitted generation metadata can throw after transport and escape bounded outcomes | Verified | M3-02 |
| [BUG-0002](bug-0002-successor-manifest-checkout-bytes.md) | Windows checkout changes frozen successor-manifest bytes and blocks admission | Verified | M6-02 |
| [BUG-0003](bug-0003-metadata-phase-deadline-race.md) | Late metadata can bypass its ten-second phase limit | Verified | M6-02 |
| [BUG-0004](bug-0004-regression-private-input-dependency.md) | Ordinary regression depends on unpublished evaluation inputs | Verified | Test-workflow maintenance associated with M6-02 |

## Record template

Copy this template into a new bug file only when a record is warranted. Replace placeholders with facts or explicit `Unknown`, `Unassigned`, or `Not yet verified` values. Links in the new file resolve from this directory.

```markdown
# BUG-NNNN - Short defect description

- **Status:** Reported
- **Impact:** Who or what is affected, severity, and known scope.
- **Responsible task or policy scope:** Unassigned, or the selected task/scope and its primary coordinator.
- **ExecPlan:** Link when applicable; otherwise state why it is not required.
- **Affected revision and environment:** Commit/revision, relevant working-tree changes, versions, and conditions.
- **Last updated:** YYYY-MM-DD
- **Next action or blocker:** Smallest useful next step and its responsible role or decision owner.

## Expected and actual behavior

Describe the mismatch and link the controlling requirement, ADR, or repository instruction.

## Reproduction and evidence

Give minimal steps or commands with working directory, expected result, and observed result.
Link decisive evidence and state reproducibility and any limitations.

## Investigation

Separate confirmed observations, open hypotheses, and confirmed cause (or Unknown).
Retain only relevant unsuccessful approaches, their results, and why they were ruled out.

## Solution

Not yet implemented. When changed, explain the correction and link affected files and
the owning execution evidence. Distinguish a workaround from a verified fix.

## Verification and disposition

Not yet verified. Record the corrected revision, original reproduction result,
regression test/equivalent check and result, required review, remaining limitations,
and primary acceptance. For closure without a fix, record the reason and evidence.
Preserve prior verification here if the defect recurs.
```

## Navigation

- [Documentation authority map and task router](../README.md)
- [Agent coordination workflow](../../.codex/README.md)
- [Development roadmap](../DEVELOPMENT_ROADMAP.md)
- [Execution-plan index](../plans/README.md)
