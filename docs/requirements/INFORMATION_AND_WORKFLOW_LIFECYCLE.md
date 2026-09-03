# Information and workflow lifecycle model

## Authority and use

This document is part of the authoritative requirements baseline indexed by [Project requirements](../PROJECT_REQUIREMENTS.md). The index defines status vocabulary, priority semantics, ID stability, and precedence. This file describes the Accepted MVP target; the roadmap owns which portions are implemented.

## Decision scope and history

**Status: Accepted for the MVP information and lifecycle boundary.** OD-012 accepted local filesystem persistence and canonical JSON. [OD-022](DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-022--portfolio-mvp-yagni-simplification) and [ADR-0021](../architecture/decisions/ADR-0021-single-file-run-aggregate.md) now supersede [ADR-0016](../architecture/decisions/ADR-0016-filesystem-run-persistence.md) for the MVP by narrowing that decision to one versioned `run.json` aggregate per PageAnalysisRun directory and at most one current review decision for a proposal, created only when review completes. ADR-0016 remains decision history; its independently identified and versioned child records and optional Markdown report no longer govern the MVP.

[OD-020](DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-020--authorized-public-page-analysis-scope) retains one **PageAnalysisRun**, one public HTTPS page, one immutable global Local-or-Groq provider/exact-model context, one complete provider-independent three-rule scan, a variable Finding collection, and one selected Finding workflow at a time. [OD-021](DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-021--trusted-operator-url-boundary-for-the-portfolio-mvp) and [ADR-0018](../architecture/decisions/ADR-0018-trusted-operator-url-boundary.md) retain the trusted developer-input target boundary.

OD-018's simple `running -> completed / failed` parent operation, no-overwrite rule, and deferral of queues, cancellation, resume, workers, and workflow engines remain current where they do not conflict with OD-020 or ADR-0021. Starting Analyze again after a failure creates another independent run and never overwrites the failed aggregate; the MVP requires no retry-specific identity or lineage. OD-003 and OD-019 remain controlled evaluation-fixture history.

The aggregate sections below are conceptual responsibilities, not separate files, database tables, schemas, or services. Diagnostics remain local and content-safe but are not another canonical run-record type. LangSmith, hosted tracing, telemetry, and analytics remain outside the MVP.

M1-01 now implements only the immediate run/scan record types and pure runtime validators in [run-contract.ts](../../src/server/domain/run-contract.ts), with [focused contract tests](../../tests/run-contract.test.ts). Its [literal contract and evidence](../plans/completed/m1-01-run-and-scan-contracts.md#authored-literal-contract--m101-literals-001-l1) define the exact fields. A validated completed snapshot alone does not prove browser execution or disk durability. M1-02 now implements validated create/read/finish persistence and service-owned admission/shutdown; its [execution plan](../plans/completed/m1-02-local-service-and-aggregate.md) records passed disk/loopback verification, both slice reviews, different final integration review and documentation closure; M1-02 is Complete. The current schema rejects all terminal rewrites. Later Finding lifecycle updates remain their owning tasks and must preserve completed evidence and siblings. No later sections below or real scanner execution are implied by M1-01/M1-02 alone. [M1-03](../plans/completed/m1-03-real-scan-and-evidence.md) now supplies internal scan/capture modules with real-browser test evidence, both accepted S3 reviews and 290 passing integrated tests. Final review and task closure passed; M1-03 is Complete. M1-05 now verifies the real terminal callback through HTTP submission, durable publication, validated reads, and the existing Results UI. Its controlled cases, authorized public-page smoke, final independent review, exact cleanup, and documentation closure passed; M1-05 is Complete. No later aggregate section is implemented.

## Accepted minimal information model

Each PageAnalysisRun uses exactly one canonical machine-readable artifact outside Git:

`data/runs/<run-id>/run.json`

The file has one top-level format version. It contains the complete run aggregate and may be updated as the user processes selected Findings, but a downstream update must not alter completed scan evidence or a sibling Finding's data. If a later nested retrieval, generation, review, or comparison update cannot be durably written, the already completed parent and last valid aggregate remain unchanged, the application reports that selected action as failed, and no unsaved state is presented as durable. The MVP has no canonical child files, independent nested-record versions, Markdown report, event log, recovery journal, transaction service, or migration system.

| Aggregate section | Minimum required information |
| --- | --- |
| Run identity | Top-level format version; immutable `runId` and creation time; normalized requested and observed final public-page identities; immutable global Local-or-Groq mode, selected provider, and exact selected model identifier as run configuration; application revision; optional `baselineRunId` only for an intentional later verification scan. Provider/model configuration is not evidence that a call occurred. |
| Target and scan context | Basic public-HTTPS parse result; fresh non-persistent context and no-imported-state disposition; no-interaction/no-crawl scope; simple timeout and cleanup disposition; page-state/readiness description; browser, scanner, exact three-rule configuration, viewport, locale, and other material provenance. No URL credential, imported authentication material, attestation, DNS/IP admission, egress-gate, or hostile-target safety result. |
| Parent scan status | `running`, `completed`, or `failed`; start and completion/failure time; bounded content-safe failure when applicable. `completed` requires the complete validated scan collections described below. |
| Coverage and collections | Exactly one coverage entry for each of `image-alt`, `label`, and `color-contrast`; every retained violation node as a nested Finding; every native axe `incomplete` node as a separate nested ScannerReviewObservation; complete, untruncated collection disposition. ScannerReviewObservations need no independent stable ID and never enter retrieval, generation, or review. |
| Finding | Stable within-run `findingId`; exact rule/check and native bucket; immutable minimized rule-specific evidence; relevant measured facts; a valid bounded comparison locator when available or one concise unavailability reason; other omission or sanitization notes; and current finding-level state. Run and Finding context replace separate scan, evidence-item, and workflow IDs. |
| Selected-finding analysis | Nested only for a Finding the user processes: the privacy-safe query representation; corpus version; ordered stable `passageId` references and metrics; retrieval support result; optional provider invocation; proposal or abstention; no review decision while a proposal is pending and exactly one after review completes; and bounded content-safe failure when applicable. It contains no sibling Finding content. |
| Optional provider invocation | Exists only after one Local or Groq call is attempted. It inherits or references the immutable run mode/provider/model configuration and its owning selected-Finding retrieval context, including `findingId`, corpus version, and relevant `passageId` values, without duplicating them. It records the actual adapter identifier and version, non-secret endpoint identity, prompt/output-contract provenance, bounded material generation parameters, non-secret outcome, and validation result. Runtime/model revision, request time, and safe usage metadata are optional when available. It has no independent ID and stores no credential or raw request/response payload. |
| Proposal or abstention | A proposal retains the immutable generated finding summary, explanation, evidence and `passageId` citations, remediation, confidence/uncertainty, assumptions, the rule profile's blocking pre-acceptance manual judgment, its non-blocking post-change verification reminder, and validation result. A terminal pre-call application-authored abstention exists only for incomplete required Finding evidence or a completed retrieval with `incomplete`, `missing`, or `conflicting` support. It retains references to the Finding, available evidence and retrieval; the applicable evidence or guidance state; missing or conflicting information; a clear reason; confirmation that no provider was called; and manual-investigation guidance. Retrieval execution/integrity and post-call response failures are not abstentions. An abstention has no provider invocation or review decision. |
| Review decision | Absent while the immutable original proposal is pending review. After review completes, exactly one current final object records action `approve`, `edit and accept`, or `reject`; decision time; a concise disposition for the blocking pre-acceptance manual judgment; an optional bounded reviewer note for any action; and the complete reviewer-edited proposal only for `edit and accept`. The post-change verification reminder remains proposal guidance, is not completed at review, and creates no second record. The decision has no actor identity, independent review ID, proposal-successor graph, audit event history, reason taxonomy, per-claim confirmation records, or separately versioned manual-check definitions/results. |
| Comparison | For persisted public runtime comparison on a later run: `baselineRunId`; baseline `findingId` and minimized evidence; pair comparability with bounded rationale; a target-match disposition only when the pair is comparable; the relevant current Finding or nested positive observation plus after-evidence only when exact rule-and-locator correlation yields one unique later target; outcome when classifiable; applicable rule-specific delta; and limitations. A missing, invalid, or withheld baseline locator, or a missing, changed, duplicate, or ambiguous later match, remains representable as `inconclusive` without a current-target reference or after-evidence. A pair-level `not comparable` result records its mismatch and performs no target correlation. It has no independent comparison ID or file and makes no page-level accessibility claim. Controlled comparison-only evaluation pairs do not enter the run aggregate or require a baseline `findingId`. |

Only `runId`, within-run `findingId`, and curated-corpus `passageId` are required as stable domain identifiers. `baselineRunId` reuses another run's `runId`. Corpus, application, browser, scanner, provider/model, prompt, evidence-policy, and comparison-policy versions remain provenance values, not independently addressable run-record identities. The MVP requires no separate scan, observation, evidence, retrieval-run, invocation, generation, proposal-version, review-action, manual-check, or comparison ID.

TypeScript record definitions and runtime validation at external and persisted-JSON boundaries remain governed by `REQ-QUAL-010` and `REQ-QUAL-011`. This model selects no schema framework, code generator, database, or safe-write library; the implementation must choose the smallest write protocol that prevents a failed update from being presented as durable success.

## PageAnalysisRun lifecycle

At most one user-requested PageAnalysisRun is active at a time:

`running -> completed`

`running -> failed`

`completed` means only that target parsing and navigation succeeded, the provider-independent scan executed all three supported rules, the complete untruncated Finding and ScannerReviewObservation collections were runtime-validated, and the canonical aggregate became durable. It does **not** mean every Finding was processed or reviewed, that every ScannerReviewObservation was resolved, that the selected provider was called, that the application proved the target safe, or that the page is accessible or conformant.

Malformed target input is rejected before a PageAnalysisRun is created. Once a run exists, the parent becomes `failed` after a navigation, readiness, or scanner failure; malformed top-level output; a fatal failure in result validation or evidence capture that prevents the complete bounded scan collection; a timeout; shutdown; or failure to durably write the initial complete scan aggregate. A failed parent operation, including one with coverage-incomplete scanning, never publishes a valid zero or complete findings list. An individual missing, invalid, or withheld allowlisted fact instead preserves its Finding or ScannerReviewObservation with the concise category or sufficiency reason required by `REQ-SCAN-005`; it does not by itself fail the parent. Bounded failure information may remain in `run.json`; it does not turn the run into a completed scan.

After parent completion, a failed write for a nested retrieval, generation, review, or comparison update does not move the parent to `failed` and does not publish a partial update. The last valid aggregate remains authoritative, the selected action is reported as failed, and the application must not claim that its unsaved result or state transition is durable.

The immutable global generation mode, selected provider, and exact model identifier are recorded when the PageAnalysisRun begins, but scanner execution does not depend on them. This run configuration creates no provider invocation, performs no automatic Finding processing, and cannot change the rule set or Findings collection.

## Finding lifecycle

Every completed PageAnalysisRun lists all Findings with independent downstream state. Selecting one Finding activates only its nested analysis and does not create or change sibling data. The minimum paths remain:

`unprocessed -> active -> abstained`

`unprocessed -> active -> proposal pending review -> accepted / edited and accepted / rejected`

`unprocessed -> active -> failed`

Only one Finding may be `active` at a time. This is sequential application state inside `run.json`, not a queue or separately versioned FindingWorkflow record.

- Incomplete required Finding evidence, or a completed retrieval with `incomplete`, `missing`, or `conflicting` support, produces the terminal `abstained` state, preserves the Finding, and records a clear application-authored explanation plus manual-investigation guidance without a provider invocation or proposal-review decision.
- A retrieval execution or passage-integrity failure has no guidance-support state and produces `failed` for that Finding.
- A provider invocation is nested only when the user explicitly starts generation for one eligible Finding and one call is attempted. A readiness, context-fit, authentication, quota, network, provider, or response-validation failure remains visible for that Finding and never causes automatic retry, a second call, or fallback.
- A validated proposal enters `proposal pending review`. The one final review decision moves that Finding to `accepted`, `edited and accepted`, or `rejected`; there is no separate proposal-version lifecycle.
- ScannerReviewObservations never use this lifecycle and cannot become proposals.

A completed parent scan may contain a truthful mix of these Finding states. That is not a partially completed scan: the provider-independent scan and collection are already complete. The interface must never aggregate Finding decisions into page-level approval or accessibility status.

## Repeated analysis, provider change, and rescan

The MVP has no in-place retry, regeneration, provider switch, or resume. Starting Analyze again after a failed scan or Finding action creates another independent `runId` and directory. It preserves the earlier directory and makes no retry-history graph or `retryOfRunId` necessary. Choosing the other provider requires another explicit analysis run and remains new work, not fallback.

An intentional later verification scan is also a new PageAnalysisRun, but its aggregate records `baselineRunId`. It parses and navigates the same trusted developer-supplied page and reruns the exact provider-independent three-rule scan. Any retained baseline Finding may be selected for comparison regardless of downstream state. Finding-level comparison data is nested in the later aggregate. Retrieval, generation or abstention, ProviderInvocation, proposal, and review are not comparison prerequisites, and the rescan does not automatically perform or change any of them.

The MVP has no `created`, `queued`, `cancelled`, `paused`, `resuming`, or parent partial-success state. It also has no automatic fan-out, combined prompt, checkpoint, cancellation controller, background worker, replacement-in-flight behavior, or workflow engine.

## Comparison lifecycle

**Status:** The exact-locator public-page model is Accepted through OD-022, `REQ-EVID-010`, `REQ-COMP-007`, and `REQ-COMP-008`; the frozen fixture-key evaluation model remains Accepted under `REQ-EVID-002` and `REQ-COMP-002`.

Both source scans must be complete. A material mismatch in normalized page identity or the applicable exact three-rule, browser, viewport, locale, evidence, coverage, or contrast-measurement provenance produces pair-level `not comparable` and no classified finding outcome.

For a comparable pair, correlation uses the exact rule and one valid retained locator string that matches uniquely. A missing, invalid, or withheld baseline locator, or a missing, changed, duplicate, or ambiguous later match, is `inconclusive`, never a forced match; the Finding remains preserved with its concise reason, and the MVP adds no fingerprint, weighted descriptor, threshold, fuzzy matcher, or new identity. Public runtime comparison always starts from a baseline Finding. `resolved` requires complete later coverage and a unique same-target native non-failing observation; disappearance from the violation list, target removal, or locator failure is insufficient. Exact matched binary failures are `persistent`; public `image-alt` and `label` comparisons cannot produce `regressed` because no retained non-failing baseline is selectable as a Finding. Exact comparable `color-contrast` baseline and later failures use the retained contrast margin for `improved`, `persistent`, or `regressed`. OD-019's reverse positive-to-violation binary case remains a controlled-fixture, logic-only evaluation input under a stable fixture key; it creates no canonical run comparison or new identity. A later-only unmatched Finding remains visible without being called `regressed`; `new` remains Deferred.

When present, review decisions, pre-acceptance judgments, and post-change reminders may be displayed as contextual data but never alter deterministic comparability or outcome calculation. No comparison proves accessibility, conformance, certification, or remediation causality.

## Retention and deletion boundary

The MVP retains one minimized `run.json` aggregate to keep completed evidence, later selected-Finding work, and comparison inputs durable. It contains immutable run and selected-provider configuration; target and scan provenance; complete Finding and ScannerReviewObservation collections; per-Finding evidence and downstream data; retrieval passage references; optional actual-call invocation provenance; proposal or abstention; one final proposal-review decision when applicable; comparison data when applicable; and bounded failure information. Validated reads remain an application/service boundary, while user-facing reopening after navigation or reload is Deferred through `REQ-UX-014` and OD-026.

Deleting a run means deleting its exact local directory. The MVP adds no per-finding deletion, database cascade, backup, cloud synchronization, telemetry store, analytics store, audit store, or multi-user retention policy. An already persisted comparison in a later aggregate remains viewable with a visible broken-lineage limitation when its `baselineRunId` target is deleted, but it cannot be recomputed or used to start another comparison. That later aggregate retains only the baseline evidence it already explicitly owns as comparison data; the application creates no hidden duplicate.

## Deferred lifecycle concepts

The following remain outside the MVP: user-facing retained-run reopening, reload restoration, deep-link loading, and recent-run history; canonical child files; independently versioned nested records; Markdown reports; audit or event histories; authenticated, private, or intentionally hostile-page support; multiple targets; crawling; generalized project management; automatic collection processing; bulk generation/review; parallel finding workflows; queues; selective in-place retry or resume; retry-lineage graphs; provider mixing; combined prompts/proposals; fuzzy or AI target correlation; databases, migrations, backup, and synchronization; multi-user history; long-term analytics; support qualification; release inventories; and public claim publication.

## Documentation navigation

- [ADR-0021: Single-file run aggregate](../architecture/decisions/ADR-0021-single-file-run-aggregate.md)
- [Project requirements index](../PROJECT_REQUIREMENTS.md)
- [Project documentation index](../README.md)
