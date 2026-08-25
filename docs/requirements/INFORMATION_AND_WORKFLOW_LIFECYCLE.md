# Information and workflow lifecycle model

## Authority and use

This document is part of the authoritative requirements baseline indexed by [Project requirements](../PROJECT_REQUIREMENTS.md). The index defines status vocabulary, priority semantics, ID stability, and precedence. This file describes planned behavior, not implemented behavior.

## Decision scope and history

**Status: Accepted for the MVP information and operation lifecycle.** OD-012 and OD-018 were resolved on 2026-08-25. They narrow the earlier Proposed model: the MVP uses one local filesystem run directory, canonical JSON records, and a three-state operation lifecycle. Database storage, backup, synchronization, resumable work, queues, cancellation, and formal release records remain Deferred. The record names below are conceptual responsibilities, not a database schema or authorization to create implementation files during planning.

OD-011 also keeps MVP diagnostics local and content-safe. LangSmith, hosted tracing, telemetry, and analytics are outside the MVP.

## Accepted minimal information model

The conceptual storage root is `data/runs/<timestamp-or-run-id>/`. This notation describes a future application-data layout; it does not place user data in the source repository. A run directory and its contents must remain outside Git.

| Record | Minimum required information |
| --- | --- |
| Run identity | Immutable run ID; creation time; one of the three accepted scenario/profile IDs; project-owned fixture revision and declared failing or corrected state; stable fixture target key; exact rule and scan-profile identity; optional `retryOfRunId` |
| Scan and finding | Scan time and execution identity; browser/scanner/rule versions; viewport and locale; native result bucket; affected stable target key; minimized deterministic evidence; rule-specific measured values when applicable; sanitization and omission notes |
| Corpus and retrieval | Corpus snapshot ID; approved source and passage IDs; exact section locators and URLs; retrieval configuration identity; ordered retrieved passage references; evidence-sufficiency result; enough query metadata to reconstruct the bounded finding-to-guidance query without retaining excluded page content |
| Generation | Application generation-stage branch (`proposal` or deterministic `abstention`), evidence-eligibility basis, and policy/output-contract versions. For a provider invocation: selected local or Groq mode; exact provider/model/configuration identity; prompt version; validated structured proposal; citations; confidence/uncertainty; assumptions; required manual checks; validation outcome; and safe usage metadata when available. For a deterministic abstention: reason, manual-review direction, and explicit confirmation that no adapter or model was invoked; provider-call provenance fields are absent. |
| Review | Original proposal reference; one reviewer action (`approve`, `edit`, or `reject`); preserved reviewer-edited proposal or rejection feedback when applicable; decision timestamp; manual-check results and limitations |
| Comparison | Baseline and later run references; scenario, rule, fixture revisions, stable target key and comparison-profile identity; before/after minimized evidence; ordered measure name and values for contrast when applicable; outcome; rationale; limitations; follow-up manual checks |
| Operation | State; start and completion/failure time; complete workflow-result reference only when completed; bounded content-safe failure category when failed |
| Local diagnostic | Timestamp, run/operation reference, stage, non-secret configuration identity, content-safe event or error category, and enough bounded context to diagnose the controlled workflow without page content, secrets, or provider payloads |

Canonical machine-readable records are JSON. An optional Markdown report may be generated for human reading, but it is derived output and must not be the only source of truth. TypeScript record definitions and the runtime checks required at external and persisted-JSON boundaries are governed by `REQ-QUAL-010` and `REQ-QUAL-011`; this conceptual model does not select a schema framework.

## Accepted operation lifecycle

One user-requested workflow operation exists at a time for one selected scenario, fixture revision, rule, and target:

`running -> completed`

`running -> failed`

Only a completely validated workflow result may be referenced by `completed`. Timeout or application shutdown produces `failed` and must not publish the run as a partial success. Valid minimized records completed before the failure may remain available for diagnosis and a later explicit retry, but they do not make the failed run successful.

Retry starts a new run/operation with a new immutable ID and an optional link to the failed run; it never overwrites the earlier directory or result. The MVP has no `created`, `queued`, `cancelled`, `paused`, `resuming`, or partial-success state. It also has no worker lifecycle, concurrency, replacement-in-flight behavior, checkpointing, or workflow engine.

The proposal decision path remains deliberately small:

`pending review -> accepted / superseded by an accepted reviewer-edited version / rejected`

The reviewer actions are `approve`, `edit` with explicit acceptance of the edited version, and `reject`. An abstention is not an approvable proposal. It remains visible with its reason and required manual review. Reviewer decisions and manual-check results remain distinct from deterministic evidence and model-generated interpretation.

Pair comparability and child finding outcome are separate. A material mismatch in scenario, target, fixture relationship, browser/rule/measurement profile, or required coverage produces pair-level `not comparable` and no child outcome. For a comparable pair, the child outcome is one of `resolved`, `improved`, `persistent`, `regressed`, or `inconclusive`, subject to the scenario-owned comparison requirements; ambiguous correlation or insufficient/conflicting evidence after comparability produces `inconclusive`. `Improved` is available only for `text-contrast` and requires the defined ordered contrast measure to increase while the deterministic result still fails. A failing-to-non-failing transition is `resolved`. Neither manual review nor an earlier accepted proposal converts any outcome into automated proof.

## Retention and deletion boundary

The MVP retains only the synthetic minimized records needed to reopen a local run: deterministic evidence, retrieved passage references, proposal or abstention, review decision, comparison, and content-safe diagnostics. Deleting a run means deleting its one local run directory. No database migration, cascading-delete service, backup, cloud synchronization, telemetry store, analytics store, or multi-user retention policy is required.

## Deferred lifecycle concepts

The following are not MVP records or transitions: generalized target intake; live-page or crawler state; provider registries; installation readiness matrices; automated model-acquisition workflows; cancellation and resume; background queues; multi-user history; long-term analytics; support qualification; release inventories; and public claim publication. They require a later explicit scope decision before their lifecycle is designed.

## Documentation navigation

- [Project requirements index](../PROJECT_REQUIREMENTS.md)
- [Project documentation index](../README.md)
