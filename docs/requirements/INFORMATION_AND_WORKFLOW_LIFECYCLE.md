# Information and workflow lifecycle model

## Authority and use

This document is part of the authoritative requirements baseline indexed by [Project requirements](../PROJECT_REQUIREMENTS.md). The index defines status vocabulary, priority semantics, ID stability, and precedence. This file describes planned behavior, not implemented behavior.

## Decision scope and history

**Status: Accepted for the MVP information and lifecycle boundary.** OD-012 retains one application-owned local directory with canonical JSON per run. [OD-020](DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-020--authorized-public-page-analysis-scope) and [ADR-0017](../architecture/decisions/ADR-0017-authorized-public-page-scan-boundary.md) replace OD-018's one-scenario/one-rule/one-target operation cardinality with one parent **PageAnalysisRun**, one attested public HTTPS page, one immutable global Local-or-Groq mode context, one complete provider-independent three-rule scan, a variable bounded finding collection, and one selected child FindingWorkflow at a time.

OD-018's simple `running -> completed / failed` operation shape, immutable new-run retry, and deferral of queues, cancellation, resume, workers, and workflow engines remain current where they do not conflict with OD-020. OD-003 and OD-019 remain controlled evaluation-fixture history; fixture revision/state and project-owned stable target keys are no longer runtime PageAnalysisRun identity.

The record names below are conceptual responsibilities, not a database schema or authorization to create implementation files. Diagnostics remain local and content-safe. LangSmith, hosted tracing, telemetry, and analytics remain outside the MVP.

## Accepted minimal information model

The conceptual storage root remains `data/runs/<timestamp-or-run-id>/`. Each directory belongs to one PageAnalysisRun and stays outside Git. Canonical machine-readable records are JSON; optional Markdown is derived only. OD-020 accepts the parent/child cardinality and provider-call boundary below; exact public-page target-correlation fields and comparison algorithms retain their Proposed status under `REQ-EVID-010`, `REQ-COMP-007`, and `REQ-COMP-008`.

| Record | Minimum required information |
| --- | --- |
| PageAnalysisRun identity | Immutable run ID and creation time; normalized requested and validated final public-page identities; single-page authorization attestation reference/time/scope; exact three-rule scan-profile identity; immutable global Local-or-Groq provider/model context; application revision; optional `retryOfRunId`; optional baseline-run reference for a later rescan. |
| Target and scan authorization | Public HTTPS validation result; URL/network-policy version; public-address, DNS, redirect, navigation, browser-capability, download, resource, and timeout dispositions required by ADR-0017; page-state/readiness description; no credential or prohibited URL component. |
| Scan record | Scan ID/times/execution identity; browser, scanner, rule-set, viewport, locale, readiness, evidence/sanitizer, and coverage-profile versions; exact per-rule completion; applied collection/resource limits; full-result disposition; content-safe failure category when applicable. |
| Finding collection | Complete variable bounded list of every retained axe violation node. Each Finding has an opaque within-run ID, run/scan reference, exact rule/check and native bucket, one minimized target-evidence reference, rule-specific measured facts when applicable, sanitizer/omission notes, and an optional FindingWorkflow reference. Absence of the child reference means `unprocessed`; collection order is presentation only, and a Proposed correlation descriptor is not needed to distinguish records within one run. |
| ScannerReviewObservation collection | Every retained native axe `incomplete` node, with its own ID, run/scan and rule/check references, minimized target evidence, reason when available, and scan provenance. These records are distinct from Findings and have no FindingWorkflow, retrieval, proposal, ProviderInvocation, or review action. |
| Rule coverage and valid zero | Exactly one coverage entry for each of `image-alt`, `label`, and `color-contrast`, including native execution/result disposition and retained Finding/ScannerReviewObservation counts. Zero Findings is valid only when all three entries and the full collection validate as complete and untruncated. |
| Finding evidence | One immutable minimized source-evidence item per Finding, containing only the rule-specific facts allowed by the evidence-policy version. Raw axe results and page/DOM captures remain transient. |
| FindingWorkflow | Finding and evidence references; individual state; selected-at/start/completion/failure times when applicable; one retrieval reference; one proposal-or-abstention result when reached; optional ProviderInvocation; review/manual-check references; and bounded content-safe failure when applicable. Exactly one workflow may be active at a time. |
| Corpus and retrieval | Corpus snapshot ID; approved source/passage IDs; exact locators/URLs; retrieval configuration; exact privacy-safe single-finding query representation; ordered passage references/metrics; support rule and state. No sibling Finding content. |
| Global generation-mode context | The run's immutable `local` or `groq` mode, exact provider/model/configuration identity, selection/disclosure version/time, and adapter/contract versions. This context is not a provider call and does not create call provenance. |
| ProviderInvocation | Optional finding-specific record created only when one call is attempted: selected FindingWorkflow, inherited run mode/provider/model, adapter/configuration, prompt/output-contract versions, request time, non-secret outcome, validation result, and safe usage metadata when available. No raw payload, credential, or sibling finding data. |
| Proposal or abstention | For a proposal: validated finding-specific explanation, evidence/passage citations, remediation proposal, confidence/uncertainty, assumptions, required manual checks, and validation outcome. For an abstention: Finding/evidence/support references, reason, manual direction, and explicit no-call meaning; ProviderInvocation is absent. |
| Review | Original proposal reference; one individual action (`approve`, `edit and accept`, or `reject`); preserved reviewer-authored edit or rejection feedback; decision timestamp; manual-check results and limitations. No page-level or bulk decision. |
| Scan-pair comparison | Proposed public-page detail: baseline and later run/scan references; page and scan-profile comparability; zero or more child finding-comparison entries; unmatched-evidence disclosure; limitations; and no page-level accessibility outcome. Each child contains the rule/target-correlation rationale permitted by the future frozen policy, before/after evidence, outcome when classifiable, and rule-specific delta. |
| Parent operation | PageAnalysisRun scan-capture state; start and completion/failure time; complete validated scan/collection reference only when completed; bounded content-safe failure when failed. Child FindingWorkflow states do not rewrite a completed parent scan. |
| Local diagnostic | Timestamp, run/workflow/stage reference, non-secret configuration identity, content-safe event/error category, and enough bounded context for the public-page workflow without page content, URL secrets, credentials, or provider payloads. |

TypeScript record definitions and runtime validation at external and persisted-JSON boundaries remain governed by `REQ-QUAL-010` and `REQ-QUAL-011`. This model selects no schema framework, filename layout, migration system, or database.

## PageAnalysisRun lifecycle

At most one user-requested PageAnalysisRun is active at a time:

`running -> completed`

`running -> failed`

`completed` means only that target authorization and boundary validation succeeded, the provider-independent scan executed all three supported rules, the complete untruncated Finding and ScannerReviewObservation collections were runtime-validated, and the canonical parent records became durable. It does **not** mean every Finding was processed or reviewed, that every ScannerReviewObservation was resolved, that the selected provider was called, or that the page is accessible or conformant.

A target-validation, navigation, containment, readiness, scanner, result-validation, collection-limit, persistence, timeout, or shutdown failure produces `failed`. A failed operation, including one with coverage-incomplete scanning, never publishes a valid zero or complete findings list. Valid minimized data durably written before failure may remain available for diagnosis, but it does not turn the parent into a completed run.

The immutable global generation-mode context is selected when the PageAnalysisRun begins, but scanner execution does not depend on it. Selecting Local or Groq creates no ProviderInvocation, performs no automatic finding processing, and cannot change the rule set or findings collection.

## FindingWorkflow lifecycle

Every completed PageAnalysisRun lists all Findings with independent downstream state. An unprocessed Finding need not have a child record; selecting it creates or activates its one FindingWorkflow and does not create children for siblings. The smallest child path is:

`unprocessed -> active -> abstained`

`unprocessed -> active -> proposal pending review -> accepted / accepted reviewer edit / rejected`

`unprocessed -> active -> failed`

Only one FindingWorkflow may be `active` at a time. `unprocessed` is a visible child disposition, not a queue. Selecting a Finding does not select, schedule, retrieve, generate, or review a sibling.

- Evidence/guidance insufficiency produces `abstained`, preserves the Finding, and creates no ProviderInvocation.
- A retrieval execution failure has no guidance-support state and produces child `failed`.
- A ProviderInvocation is created only when the user explicitly starts generation for one eligible FindingWorkflow and that one provider call is attempted. A readiness, context-fit, authentication, quota, network, provider, or response-validation failure remains visible in that child and never causes automatic retry, a second call, or fallback.
- A successful validated proposal enters its own pending-review path. Approval, edit-and-accept, rejection, or failure affects only that FindingWorkflow.
- ScannerReviewObservations do not use this lifecycle and cannot become proposals.

A completed parent run may therefore contain a truthful mix of `unprocessed`, `active`, `abstained`, `proposal pending review`, `accepted`, `accepted reviewer edit`, `rejected`, and child `failed` states over time. That is not a partially completed scan: the parent scan/collection is already complete, while downstream work is explicitly finding-specific. The interface must never aggregate those child states into a page-level success or approval.

## Retry, provider change, and rescan

There is no in-place retry, regeneration, provider switch, or resume inside a PageAnalysisRun. Retrying a failed scan or FindingWorkflow creates a new PageAnalysisRun with a new immutable ID, a new authorization attestation and scan, a new explicit global provider-mode selection, and optional `retryOfRunId`. The earlier directory, evidence, calls, failures, proposals, and decisions are never overwritten. Choosing the other provider in the new run is explicit new work, not fallback.

A later verification scan is also a new PageAnalysisRun, linked through its baseline-run reference rather than `retryOfRunId`. It must revalidate the same public-page boundary and rerun the exact three-rule provider-independent scan. The resulting complete variable collection is compared conservatively against the baseline under the owning comparison requirements. The rescan does not automatically regenerate a proposal, repeat a provider call, change an earlier review decision, or process every new/persistent finding; any later generation still requires explicit selection of one FindingWorkflow under that run's global mode.

The MVP has no `created`, `queued`, `cancelled`, `paused`, `resuming`, or parent partial-success state. It also has no background worker lifecycle, automatic fan-out, combined prompt, checkpoint, cancellation controller, replacement-in-flight behavior, or workflow engine.

## Comparison lifecycle

**Status:** The conservative public-page model in this section is Proposed under `REQ-EVID-010`, `REQ-COMP-007`, and `REQ-COMP-008`; the frozen fixture-key evaluation model remains Accepted under `REQ-EVID-002` and `REQ-COMP-002`.

Pair-level comparability and child finding outcome remain separate. Both parent scans must be complete. Under the Proposed public-page model, a material mismatch in normalized page identity, authorization scope, three-rule profile, browser, viewport, locale, scanner, evidence/sanitizer, coverage, or measurement profile produces pair-level `not comparable` and no classified child outcome.

For a comparable pair, each child correlation uses the exact rule and one versioned minimized target-correlation descriptor. Missing, changed, duplicate, or ambiguous identity is `inconclusive`, never a forced match. A baseline Finding may be `resolved` only when the later scan has complete relevant coverage and a unique same-target native non-failing observation; disappearance from the violation list, target removal, or locator failure is insufficient. Binary matched failures are `persistent`. Exact comparable contrast failures use the retained contrast margin for `improved`, `persistent`, or `regressed`. A later-only unmatched Finding remains visible without being called `regressed`; `new` remains Deferred until separately accepted.

Reviewer decisions and manual-check results remain contextual records and never alter deterministic comparability or outcome calculation. No scan-pair or child outcome proves accessibility, conformance, certification, or remediation causality.

## Retention and deletion boundary

The MVP retains only minimized public-page records needed to reopen one PageAnalysisRun: authorization and scan provenance, complete Finding and ScannerReviewObservation collections, per-finding evidence and downstream state, retrieval passage references, optional invocation provenance, proposal or abstention, individual review decisions, comparisons, and content-safe diagnostics.

Deleting a run means deleting its exact local directory. The MVP adds no per-finding deletion workflow, database cascade, backup, cloud synchronization, telemetry store, analytics store, or multi-user retention policy. A comparison that references a deleted run exposes broken lineage and becomes unusable; the application does not preserve a hidden duplicate of deleted page evidence. Deleting the local directory must not be presented as deleting any provider-controlled record.

## Deferred lifecycle concepts

The following remain outside the MVP: authenticated or private-page state; multiple targets; link discovery or crawling; generalized URL/project management; automatic processing of the findings collection; bulk generation/review; parallel child workflows; queues; selective in-place retry or resume; provider mixing; combined prompts/proposals; fuzzy or AI target correlation; databases, migrations, backup, and synchronization; multi-user history; long-term analytics; support qualification; release inventories; and public claim publication.

## Documentation navigation

- [Project requirements index](../PROJECT_REQUIREMENTS.md)
- [Project documentation index](../README.md)
