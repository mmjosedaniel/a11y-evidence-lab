# ADR-0016: Filesystem run persistence

- **Status:** Accepted
- **Decision date:** 2026-08-25

## Context

The MVP needs only enough local persistence to reopen one synthetic run, inspect its evidence and citations, see the proposal and review decision, and compare it with one later run. A database, migration framework, backup service, synchronization layer, or general project tracker would add infrastructure without improving that controlled portfolio demonstration.

The retrieval index is a replaceable derived artifact and is not the authority for run evidence. Browser storage and a rendered Markdown report are also insufficient as the canonical record because privileged workflow state must remain owned by the local application service and machine-readable.

## Considered options

1. Use a relational or document database for all MVP records.
2. Keep all state only in browser memory or browser storage.
3. Store each run in its own local directory with canonical JSON records and an optional Markdown report.

## Decision

Use application-owned filesystem persistence for MVP run data.

- Use the conceptual layout `data/runs/<timestamp-or-run-id>/`, where each directory belongs to one immutable run. The exact safe ID format and filenames remain implementation details.
- Store the canonical machine-readable run graph as JSON. It contains only the minimized synthetic finding evidence, guidance passage references and source metadata needed to interpret them, generation proposal or abstention, review decision or edit, comparison reference/result when present, timestamps, record versions, and non-secret execution provenance required to reopen the run.
- A human-readable Markdown report may be generated for portfolio inspection, but it is optional and must never be the only source of truth.
- Keep user/run data outside Git. The future implementation must ignore the local data root and must not commit generated runs, model artifacts, credentials, downloaded source copies, or private material.
- A retry creates a new run directory and never overwrites the earlier run. A failed operation remains failed and must not be presented as partial success.
- Deleting a run means deleting that run's local directory. The MVP does not add a recycle-bin workflow, cross-run cascading deletion, retention scheduler, backup, restore, sync, export service, audit store, or multi-user ownership model.
- Do not retain full HTML, DOM snapshots, screenshots, browser traces, cookies, credentials, arbitrary input values, private URLs, or unrelated page content. The application still minimizes and validates data before persistence.
- Chroma, if it passes its separate evaluation, stores a rebuildable corpus index only. It is not the canonical run store, and this ADR does not promote Chroma to a release dependency.

## Consequences

- One local directory is enough to reopen, inspect, compare, and delete a controlled run.
- Canonical JSON keeps the record inspectable and testable without introducing a database or schema-migration platform; minimal record-version fields remain necessary.
- There is intentionally no automatic backup or synchronization. Deleting the directory removes the application's only MVP copy unless the developer independently copied it.
- A future need for private projects, high-volume history, concurrent writers, migrations, backup, or cross-device access requires a new persistence decision.

## Related decisions and requirements

- [ADR-0011: TypeScript as the initial application language](ADR-0011-typescript-as-initial-application-language.md)
- [ADR-0012: React as the initial user-interface library](ADR-0012-react-as-initial-user-interface-library.md)
- [ADR-0015: Localhost browser MVP execution](ADR-0015-localhost-browser-mvp-execution.md)
- [Information and workflow lifecycle requirements](../../requirements/INFORMATION_AND_WORKFLOW_LIFECYCLE.md)
- [Privacy and security requirements](../../requirements/quality-security-and-operations/PRIVACY_AND_SECURITY.md): `REQ-SEC-*`
- [Reliability, reproducibility, and operations requirements](../../requirements/quality-security-and-operations/RELIABILITY_REPRODUCIBILITY_AND_OPERATIONS.md): `REQ-QUAL-*`
