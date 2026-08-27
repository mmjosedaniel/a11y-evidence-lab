# ADR-0021: Single-file run aggregate

- **Status:** Accepted for the MVP
- **Decision date:** 2026-08-27
- **Supersedes for the MVP:** [ADR-0016](ADR-0016-filesystem-run-persistence.md)

## Context

The portfolio MVP must preserve enough local evidence to reopen one page analysis, inspect its RAG inputs and output, record one human decision per processed finding, and compare it with one later scan. ADR-0016 correctly selected local filesystem persistence instead of a database, but its later parent/child amendments introduced independently identified and versioned workflow records, optional child files, and an optional Markdown report. That structure is larger than the bounded single-user demonstration requires.

The application has no concurrent writers, accounts, collaboration, synchronization, migration framework, audit platform, or production recovery requirement. The complete three-rule scan and every selected finding workflow can therefore remain one small application-owned aggregate without losing the traceability that demonstrates deterministic evidence, curated retrieval, generation or abstention, human review, and comparison.

## Considered options

1. Retain ADR-0016's parent record plus independently identified and versioned child records.
2. Use one versioned `run.json` aggregate per PageAnalysisRun directory.
3. Add a database or event log so every workflow transition is append-only.

## Decision

Use one application-owned, versioned JSON aggregate for each MVP PageAnalysisRun:

`data/runs/<run-id>/run.json`

- `run.json` is the only canonical run artifact. The MVP creates no canonical child files and no Markdown report.
- The file has one top-level format version. Nested evidence, retrieval, invocation, proposal, review, and comparison data do not have independent schema versions or migration lifecycles.
- Only these domain identities are required:
  - `runId`, which identifies the aggregate;
  - `findingId`, which identifies one violation-node Finding within that run; and
  - the curated corpus's stable `passageId`, which supports citations and retrieval traceability.
- A later verification run may contain `baselineRunId`, which is a reference to another `runId`, not a new identity type. The MVP requires no `retryOfRunId` or retry-history graph.
- The aggregate contains the requested and observed final page identities, global Local-or-Groq mode, application and material scan configuration, parent scan status, exact three-rule coverage, complete Finding collection, and separate native axe `incomplete` observations.
- Each Finding contains its `findingId`, exact rule/check identity, immutable minimized evidence, and current finding-level state. Only a selected Finding needs nested downstream data.
- Selected-finding data may contain one retrieval result with corpus/version metadata and ordered `passageId` references, one optional provider-invocation object created only when a call is attempted, and one proposal-or-abstention result. These nested objects require no independent IDs.
- The original generated proposal remains immutable. Review is one current final-decision object containing `approve`, `edit and accept`, or `reject`, the decision time, rule-specific manual judgments, and only the edited proposal or rejection note needed by the chosen action. The MVP adds no actor identity, review event log, reason taxonomy, proposal successor graph, per-claim confirmation records, manual-check definition/result entities, or audit-version chain.
- A later run may contain finding-level comparison results that reference `baselineRunId`, the baseline `findingId`, the current run's relevant Finding or positive evidence, before/after minimized evidence, outcome, rationale, and limitations. A comparison requires no independent ID or file.
- Adding downstream data must not modify the completed scan evidence or another Finding's nested data. The exact safe-write protocol remains an implementation detail; this decision does not require event sourcing, an append-only log, or a transactional storage framework.
- A ProviderInvocation exists only after an attempted call. Abstention retains no provider-call provenance, and the run's global provider mode never implies that a call occurred. Provider mixing and automatic fallback remain prohibited.
- Deleting a run means deleting its exact `data/runs/<run-id>/` directory. Run data remains outside Git, and the MVP adds no per-finding deletion, backup, synchronization, recycle bin, or hidden duplicate.
- Raw scanner payloads, full HTML or DOM captures, screenshots, traces, cookies, credentials, form values, arbitrary page text, and raw provider payloads remain outside the durable aggregate.

## Consequences

- One file is enough to inspect the complete evidence-first demonstration and reconstruct the React view after reload.
- Run and finding identity remain stable without assigning IDs and versions to every nested one-to-one artifact.
- The original scan evidence and generated proposal remain traceable while review needs only one final decision rather than an audit workflow.
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
