# ADR-0021: Single-file run aggregate

- **Status:** Accepted for the MVP
- **Decision date:** 2026-08-27
- **Supersedes for the MVP:** [ADR-0016](ADR-0016-filesystem-run-persistence.md)

## Context

The portfolio MVP must preserve enough local evidence to reopen one page analysis, inspect its RAG inputs and result, record at most one current human decision per generated proposal and exactly one only after review completes, and compare a finding with one later scan. ADR-0016 correctly selected local filesystem persistence instead of a database, but its later parent/child amendments introduced independently identified and versioned workflow records, optional child files, and an optional Markdown report. That structure is larger than the bounded single-user demonstration requires.

The application has no concurrent writers, accounts, collaboration, synchronization, migration framework, audit platform, or production recovery requirement. The complete three-rule scan, every selected-finding workflow, and the independent scan-evidence comparison path can therefore remain one small application-owned aggregate without losing the traceability that demonstrates deterministic evidence and curated retrieval, then either a terminal application-authored abstention or a validated proposal with human review. Comparison may start from any retained baseline Finding and does not require those downstream steps.

### Comparison-semantics clarification recorded 2026-08-27

This clarification preserves the accepted persistence decision and OD-019's controlled-evaluation history rather than replacing either one. Public runtime comparison always starts from a baseline Finding. Consequently, positive-baseline-to-violation `image-alt` or `label` regression remains a controlled-fixture evaluation case and is not a public runtime result. Public `color-contrast` comparison may still report `regressed` when exact matched baseline and later violations have a lower later contrast margin. The comparison-only still-failing contrast pair used to exercise `improved` adds no third fixture revision, provider call, generation case, domain identity, or canonical artifact.

### Provider-context clarification recorded 2026-08-27

The selected mode, provider, and exact model belong to immutable run context from creation so a no-call or abstained run remains interpretable. `ProviderInvocation` remains call-only and records actual-call provenance. This clarification adds no record family, identity, or provider workflow.

## Considered options

1. Retain ADR-0016's parent record plus independently identified and versioned child records.
2. Use one versioned `run.json` aggregate per PageAnalysisRun directory.
3. Add a database or event log so every workflow transition is append-only.

## Decision

Use one application-owned, versioned JSON aggregate for each MVP PageAnalysisRun:

`data/runs/<run-id>/run.json`

- `run.json` is the only canonical run artifact. The MVP creates no canonical child files and no Markdown report.
- The file has one top-level format version. Nested evidence, retrieval, optional invocation, proposal or abstention, proposal-only review, and comparison data do not have independent schema versions or migration lifecycles.
- Only these domain identities are required:
  - `runId`, which identifies the aggregate;
  - `findingId`, which identifies one violation-node Finding within that run; and
  - the curated corpus's stable `passageId`, which supports citations and retrieval traceability.
- A later verification run may contain `baselineRunId`, which is a reference to another `runId`, not a new identity type. The MVP requires no `retryOfRunId` or retry-history graph.
- The aggregate contains the requested and observed final page identities, immutable global Local-or-Groq mode, selected provider, exact selected model identifier, application and material scan configuration, parent scan status, exact three-rule coverage, complete Finding collection, and separate native axe `incomplete` observations. The provider/model values are run configuration and do not prove that a call occurred.
- Each Finding contains its `findingId`, exact rule/check identity, immutable minimized evidence, and current finding-level state. Only a selected Finding needs nested downstream data.
- Selected-finding data may contain one retrieval result with corpus/version metadata and ordered `passageId` references, one optional provider-invocation object created only when a call is attempted, and one proposal-or-abstention result. An invocation inherits or references the run's selected provider/model context and the owning Finding's retrieval context—`findingId`, corpus version, and relevant `passageId` values—without duplicating them. It records the actual adapter identifier/version, non-secret endpoint identity, material generation parameters, prompt/output-contract version, non-secret outcome, and validation result; runtime/model revision, request time, and safe usage metadata are optional when available. These nested objects require no independent IDs.
- The original generated proposal remains immutable and has no final-decision object while pending review. After review completes, the proposal branch contains exactly one current object with `approve`, `edit and accept`, or `reject`, the decision time, one blocking rule-specific pre-acceptance judgment disposition, and one optional bounded reviewer note for any action. Only `edit and accept` additionally stores the complete reviewer-edited proposal. The proposal's post-change verification reminder remains visible but is not completed at review and creates no separate record. An abstention is a terminal pre-call application-authored explanation for incomplete required evidence or completed `incomplete`, `missing`, or `conflicting` retrieval, with missing or conflicting information and manual-investigation guidance; it has no invocation, approve/edit/reject path, or review object. Retrieval execution/integrity and post-call response failures remain failed FindingWorkflows. The MVP adds no actor identity, review event log, reason taxonomy, proposal successor graph, per-claim confirmation records, manual-check definition/result entities, or audit-version chain.
- A later run may contain finding-level comparison results that reference `baselineRunId`, the baseline `findingId` and minimized evidence, pair comparability with bounded rationale, outcome when classifiable, applicable rule-specific delta, and limitations. A target-match disposition is present only when the pair is comparable. A relevant current Finding or positive observation and its after-evidence are required only when exact rule-and-locator correlation yields one unique later target; a missing, invalid, or withheld baseline locator, or a missing, changed, duplicate, or ambiguous later match, remains representable as `inconclusive` without them. The Finding remains preserved with its concise unavailability reason and no new identity. A pair-level `not comparable` result records the mismatch and performs no target correlation. Public runtime comparison therefore always originates from a baseline Finding: binary `image-alt` and `label` results may be `resolved`, `persistent`, `inconclusive`, or pair-level `not comparable`, while exact matched failing `color-contrast` evidence may additionally be `improved` or `regressed` through its ordered margin. Controlled evaluation may use its stable fixture key and retained positive baseline to exercise binary `regressed`, but that logic-only pair is not persisted as a run comparison and creates no baseline `findingId`. A comparison requires no independent ID or file.
- Adding selected-finding or comparison data must not modify the completed scan evidence or another Finding's nested data. The exact safe-write protocol remains an implementation detail; this decision does not require event sourcing, an append-only log, or a transactional storage framework.
- A ProviderInvocation exists only after an attempted call. Abstention retains no provider-call provenance or proposal-review decision, and the run's mode/provider/exact-model configuration never implies that a call occurred. Provider mixing and automatic fallback remain prohibited.
- Deleting a run means deleting its exact `data/runs/<run-id>/` directory. An already persisted comparison in another run remains viewable with a visible broken-lineage limitation after its baseline is deleted, but it cannot be recomputed or used to start another comparison. Its explicitly retained baseline comparison evidence is not a hidden duplicate or cascade. Run data remains outside Git, and the MVP adds no per-finding deletion, backup, synchronization, or recycle bin.
- Raw scanner payloads, full HTML or DOM captures, screenshots, traces, cookies, credentials, form values, arbitrary page text, and raw provider payloads remain outside the durable aggregate.

## Consequences

- One file is enough to inspect the complete evidence-first demonstration and reconstruct the React view after reload.
- Run and finding identity remain stable without assigning IDs and versions to every nested one-to-one artifact.
- The original scan evidence and either terminal abstention or generated proposal remain traceable; a pending proposal has no decision, and a completed review needs exactly one current decision rather than an audit workflow.
- There is no independent child-file lifecycle, cross-file commit protocol, schema migration system, event log, or report generator in the MVP.
- A failed run remains inspectable if a valid aggregate was written. Starting Analyze again creates another independent run; only an intentional rescan uses `baselineRunId`.
- A future need for concurrent writers, editable review history, multiple proposal revisions, import/export, migrations, backup, or synchronization requires a new persistence decision.

## Related decisions and requirements

- [OD-022: Portfolio MVP YAGNI simplification](../../requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-022--portfolio-mvp-yagni-simplification)
- [ADR-0011: TypeScript as the initial application language](ADR-0011-typescript-as-initial-application-language.md)
- [ADR-0012: React as the initial user-interface library](ADR-0012-react-as-initial-user-interface-library.md)
- [ADR-0015: Localhost browser MVP execution](ADR-0015-localhost-browser-mvp-execution.md)
- [ADR-0016: Filesystem run persistence](ADR-0016-filesystem-run-persistence.md) — superseded for the MVP
- [ADR-0018: Trusted operator URL boundary](ADR-0018-trusted-operator-url-boundary.md)
- [Information and workflow lifecycle requirements](../../requirements/INFORMATION_AND_WORKFLOW_LIFECYCLE.md)
- [Evidence and review workflow requirements](../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md)
- [Privacy and security requirements](../../requirements/quality-security-and-operations/PRIVACY_AND_SECURITY.md)
