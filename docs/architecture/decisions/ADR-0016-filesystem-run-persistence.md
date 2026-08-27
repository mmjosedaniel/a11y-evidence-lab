# ADR-0016: Filesystem run persistence

- **Status:** Superseded for the MVP by [ADR-0021](ADR-0021-single-file-run-aggregate.md) on 2026-08-27
- **Decision date:** 2026-08-25

## Supersession

[ADR-0021](ADR-0021-single-file-run-aggregate.md) preserves this record's local-filesystem, canonical-JSON, exact-directory deletion, and no-database decisions while replacing its later parent/child record graph for the portfolio MVP. The current MVP uses one versioned `run.json` aggregate, no independently versioned child files, and no Markdown report. The remainder of this document is preserved as decision history.

## Context

The MVP needs only enough local persistence to reopen one synthetic run, inspect its evidence and citations, see the proposal and review decision, and compare it with one later run. A database, migration framework, backup service, synchronization layer, or general project tracker would add infrastructure without improving that controlled portfolio demonstration.

The retrieval index is a replaceable derived artifact and is not the authority for run evidence. Browser storage and a rendered Markdown report are also insufficient as the canonical record because privileged workflow state must remain owned by the local application service and machine-readable.

### Authorized public-page amendment recorded 2026-08-25

[ADR-0017](ADR-0017-authorized-public-page-scan-boundary.md) replaces the one-synthetic-finding-per-directory assumption with a small filesystem aggregate. One `PageAnalysisRun` is the parent scan record and deletion unit. It contains the complete variable Finding and `ScannerReviewObservation` collections. Selecting a Finding may add its independently identified and versioned `FindingWorkflow` child; no child record is required while the Finding remains `unprocessed`, and only one child may be active. A `ProviderInvocation` record exists only when a provider call is actually attempted; deterministic abstention and unprocessed findings create none. `ScannerReviewObservation` records have no finding workflow. This preserves filesystem simplicity without introducing a database, queue, batch controller, or schema platform.

### Trusted operator URL amendment recorded 2026-08-27

[ADR-0018](ADR-0018-trusted-operator-url-boundary.md) supersedes ADR-0017's hostile-network controls but preserves the parent-run and child-workflow aggregate above. The canonical parent needs the entered and observed-final page identity, scan provenance, coverage, and outcome; it does not need a user attestation, acknowledgement gate, DNS/IP admission record, egress-gate trace, redirect re-attestation, subresource-policy record, or numeric-limit manifest for this portfolio MVP.

## Considered options

1. Use a relational or document database for all MVP records.
2. Keep all state only in browser memory or browser storage.
3. Store each run in its own local directory with canonical JSON records and an optional Markdown report.

## Decision

Use application-owned filesystem persistence for MVP run data.

- Use the conceptual layout `data/runs/<timestamp-or-run-id>/`, where one directory belongs to one canonical `PageAnalysisRun` parent and contains its child records. The exact safe ID format, filenames, subdirectories, write protocol, and serialization split remain implementation details.
- Store the parent and child graph as canonical machine-readable JSON. The parent contains only the entered and observed-final page identity required by the privacy authority, immutable scan configuration and provenance, navigation and scan outcome, exact per-rule and full-result coverage, complete Finding and `ScannerReviewObservation` collections or their contained indexes, timestamps, and record version needed to reopen the page analysis.
- Store the complete Finding collection and minimized-evidence references in the parent scan graph. An unselected Finding is visibly `unprocessed` without requiring a child record. When the user selects it, add one independently identified `FindingWorkflow` child, which may acquire retrieval, proposal or abstention, optional invocation, review or edit, comparison, timing, version, and non-secret execution-provenance fields as those validated stages occur. Updating one versioned child must not rewrite the immutable completed scan evidence or a sibling child.
- Create a `ProviderInvocation` child or subrecord only when a local or Groq call is attempted. It records the non-secret provider/model/configuration, disclosed data categories, request time, outcome, and available usage or limit metadata; it never stores a credential or duplicate raw request/response payload. No-call abstention records why no invocation exists.
- A human-readable Markdown report may be generated for portfolio inspection, but it is optional and must never be the only source of truth.
- Keep user/run data outside Git. The future implementation must ignore the local data root and must not commit generated runs, model artifacts, credentials, downloaded source copies, or private material.
- Retrying a failed scan or any failed finding workflow creates a new linked `PageAnalysisRun` and parent directory with a new scan, global provider-mode choice, and optional retry reference. It never overwrites or resumes the earlier parent or child. A coverage-incomplete or failed operation is never presented as partial success or a complete zero-finding scan.
- Deleting a `PageAnalysisRun` means deleting its exact local parent directory and all contained child records. The MVP does not add independent child deletion, a recycle-bin workflow, cross-run cascading deletion, retention scheduler, backup, restore, sync, export service, audit store, or multi-user ownership model.
- Do not retain full HTML, DOM snapshots, screenshots, browser traces, cookies, credentials, arbitrary input values, private URLs, or unrelated page content. The application still minimizes and validates data before persistence.
- Chroma, if it passes its separate evaluation, stores a rebuildable corpus index only. It is not the canonical run store, and this ADR does not promote Chroma to a release dependency.

## Consequences

- One local parent directory is enough to reopen, inspect, extend with independently versioned selected-finding work, compare, and delete a page analysis.
- Canonical JSON keeps the record inspectable and testable without introducing a database or schema-migration platform; minimal record-version fields remain necessary.
- The variable number of deterministic findings and selected child workflows does not require batch processing or concurrent writers; one user action can append one validated child at a time.
- There is intentionally no automatic backup or synchronization. Deleting the directory removes the application's only MVP copy unless the developer independently copied it.
- A future need for private projects, high-volume history, concurrent writers, migrations, backup, or cross-device access requires a new persistence decision.

## Related decisions and requirements

- [ADR-0011: TypeScript as the initial application language](ADR-0011-typescript-as-initial-application-language.md)
- [ADR-0012: React as the initial user-interface library](ADR-0012-react-as-initial-user-interface-library.md)
- [ADR-0015: Localhost browser MVP execution](ADR-0015-localhost-browser-mvp-execution.md)
- [ADR-0018: Trusted operator URL boundary](ADR-0018-trusted-operator-url-boundary.md)
- [ADR-0021: Single-file run aggregate](ADR-0021-single-file-run-aggregate.md) — current MVP persistence decision
- [Information and workflow lifecycle requirements](../../requirements/INFORMATION_AND_WORKFLOW_LIFECYCLE.md)
- [Privacy and security requirements](../../requirements/quality-security-and-operations/PRIVACY_AND_SECURITY.md): `REQ-SEC-*`
- [Reliability, reproducibility, and operations requirements](../../requirements/quality-security-and-operations/RELIABILITY_REPRODUCIBILITY_AND_OPERATIONS.md): `REQ-QUAL-*`
