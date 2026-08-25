# Information and workflow lifecycle model

## Authority and use

This document is part of the authoritative requirements baseline indexed by [Project requirements](../PROJECT_REQUIREMENTS.md). The index defines status vocabulary, priority semantics, ID stability, and precedence. This file describes planned behavior, not implemented behavior; each identified row's recorded status controls.

## Core information and provenance model

**Status:** Proposed until the data, retention, and persistence decisions are accepted. This is a conceptual information model, not a database design.

| Record | Minimum required information |
| --- | --- |
| Target | Identifier, type, URL or fixture reference, authorization attestation, declared scope, sensitivity classification, and owner-provided state description |
| Scan run | Target, timestamp, page state, viewport, locale, browser, scanner/rules/configuration, execution status, coverage, and evidence-package reference when capture succeeds |
| Finding | Stable record identifier, scan, rule, result type, impact metadata as reported by the scanner, affected target, correlation fingerprint version, and evidence references |
| Evidence item | Type, exactly one source finding, minimal sanitized content, capture/sanitization policy and omissions, integrity metadata, sensitivity, access policy, and retention status |
| Positive target observation | Stable identifier, scan, rule/profile, stable fixture-element key, narrow non-failing observation, capture policy, and the finding or baseline target whose later comparison it supports |
| Corpus source and snapshot | Publisher, title, canonical URL, authority type, version/date, license notes, checksum, snapshot ID, and ingestion configuration |
| Corpus derivation profile | Versioned source allowlist, normalization, segmentation, chunk-identity, locator, and snapshot-publication rules. Continuation, concurrency, cancellation, and generalized resource-budget fields are added only when a later corpus build needs them. |
| Guidance passage | Snapshot, source, exact locator, text checksum, chunk identifier, and derivation metadata |
| Retrieval run | Finding, source-evidence, normalized-projection, rule and scenario-mapping inputs; exact privacy-safe query or complete reconstruction inputs; query digest; filters; embedding/index/config versions; ranked passage IDs; support state; and operation status |
| Provider profile | Identifier, local or external type, adapter and runtime versions, approved endpoint reference and class, model ID and revision or digest, capability-snapshot reference, non-secret configuration, privacy/cost disclosure version, consent status, secret-store reference only, and last validation state |
| Readiness snapshot | Privacy-safe bounded observations for host capacity, runtime identity and availability, artifact installation and integrity, adapter capabilities and health, workload eligibility, observation freshness, unknown facts, and resulting eligibility |
| Acquisition manifest | Approved artifact and profile IDs, sources and origins, revision and digests, license, transfer/installed/temporary/free-space sizes, dependencies, compatibility profile, staging and promotion rules, and install/removal ownership |
| Model artifact | Purpose, source, exact tag and digest, format or quantization, size, location, license and integrity metadata, acquisition and verification times, lifecycle status, and dependent provider profiles |
| Work operation | Operation ID, type, input identities, state, start/completion times, failure reason, result reference when completed, and a cancellation reason only if that later capability is supported. Revision, supersession, queue, cancellation, and stale-publication fields are added only when concurrency, replacement, or interactive cancellation is introduced. |
| Generation run | Retrieval and evidence inputs; prompt/schema/config versions; proposal-or-abstention result; and validation outcome. A model-invoking run also records the provider profile, capability snapshot, local/API mode, model identity, no-fallback state, safe provider request/response references, and available usage/cost metadata. A deterministic policy abstention records that no provider call occurred. |
| Setup or model-lifecycle action | Actor, time, action, affected runtime/model/profile, disclosure and consent versions, source/destination, planned and actual transfer/storage, integrity result, outcome, and recovery state without credentials |
| Proposal version | Generation source, authorship type (`AI-generated` or `reviewer-edited`), predecessor when edited, complete submitted content, evidence-sufficiency state and authority, citations, manual-check definitions, and lifecycle state |
| Review action | Proposal version, actor, timestamp, action, reason or note, edits, and resulting state |
| Manual-check definition | Stable identifier, proposal/finding source, instructions, purpose, timing, blocking classification, and author |
| Manual-check result | Definition, proposal, actor, timestamp, execution status, evidence or note, and—only when completed—observed accessibility outcome and one proposal relationship. A post-change occurrence may also reference its later scan and comparison. |
| Scan-pair comparison | Baseline and later scans, operation status, comparability assessment, profile, limitations, and identified finding-comparison entries. A comparable first `image-alt` demonstration contains exactly one entry; a `not comparable` pair contains none, and broader comparable pairs may contain more. |
| Finding-comparison entry | Parent scan-pair comparison, correlated finding or positive-observation references, outcome, rationale, before/after evidence, uncertainty, and follow-up checks |
| Evaluation authority | Authority version and status, pilot/official classification, exact candidates, dataset and transforms, rubric and gates, runtime rules, software and hardware identities, result schema, privacy rules, interpretation policy, and authority digest |
| Evaluation run and decision | Authority reference, exact profile and artifact identities, implementation revision and locks, measured results, validity state, decision state, reviewer or decision authority, failure evidence, and content-safe trace references |
| Support qualification | Exact provider-profile, artifact/runtime configuration, hardware-profile, workload, and evaluation-authority identities; support state; applicable passed, failed, unavailable, or deferred gates; evidence digests; decision time and scope; and superseding qualification |
| Release inventory and claim | Exact component inventory and tested artifact digests, validation classes, applicable profile qualifications, signing state, notices, audit blind spots, release-claim scope, outcome, and superseding evidence set |

## Workflow state and recovery model

**Status:** The high-level first-run provider choice is Accepted; detailed setup, persistence, review, and deletion transitions remain Proposed until their policies are accepted.

The proposed installation and provider-readiness path is:

`installed -> first launch -> choose recommended local / choose external API / defer AI setup -> validate or provision selected provider -> application ready`

Deferring setup or losing provider readiness disables generation visibly but does not block authorized scanning, evidence inspection, or history. Switching provider creates or selects a versioned provider profile and affects only later generation runs.

The proposed readiness dimensions are evaluated separately rather than collapsed into one optimistic status:

`host compatible -> required runtime available -> exact artifact installed and verified -> adapter healthy and capable -> requested workload eligible`

The proposed application-owned optional-artifact lifecycle is:

`absent -> confirming -> acquiring by managed download / offline import / runtime-managed pull -> verifying -> installed -> activated`

Cancellation or failure can occur at every active phase. It must leave partial staging unavailable and preserve the last verified selection. Installation, activation, deactivation, selection, and removal are distinct explicit actions. An adapter for an independently installed runtime may observe and request its supported operations rather than duplicate that runtime's model store.

The proposed durable proposal path is:

`target declared -> scan running -> evidence available -> retrieval complete -> proposal generated -> pending review -> accepted / edited and accepted -> rescan requested -> comparison operation complete`

`pending review -> rejected`

A completed comparable comparison operation contains one or more finding outcomes such as `resolved`, `persistent`, `regressed`, or `inconclusive`. `Inconclusive` is not an operation state. A materially mismatched valid pair completes with pair-level `not comparable` and contains no finding outcomes; an invalid or incomplete source pair blocks or fails the operation.

The separate abstention path is:

`retrieval complete -> abstained -> acknowledged / manual triage / explicit retry after inputs change`

An abstention cannot become an accepted remediation plan. Any first-slice stage may enter a visible failure state. Timeout or application shutdown aborts the current work without publishing completed output; an explicit retry starts a linked operation from the last valid durable input. A visible `cancelled` state is added only if a later stage introduces interactive cancellation. A new generation after rejection or abstention creates a linked result version; it does not erase the earlier record. Optional tracing failure does not destroy deterministic evidence or an existing human decision.

The minimal operation lifecycle is:

`created -> running -> completed / failed`

A later cancellable stage may add `running -> cancelled`; that transition is not part of the first portfolio slice.

The controlled-fixture portfolio slice runs one user-requested operation per stage and needs no queue, child-worker lifecycle, replace-in-flight action, or generalized publication-eligibility protocol. Explicit retry creates a linked operation and must not automatically resubmit an ambiguous billable provider request. If later concurrency introduces replacement or late results, OD-018 must define the additional identity and eligibility semantics before that behavior is implemented.

The proposed evaluation lifecycle is:

`non-promotable calibration -> authority frozen -> official execution -> validity determination -> accepted / deferred / rejected -> exact-profile support state`

Historical authorities and results remain immutable. One current support matrix identifies the effective status without rewriting the evidence that produced earlier states.

## Documentation navigation

- [Project requirements index](../PROJECT_REQUIREMENTS.md)
- [Project documentation index](../README.md)
