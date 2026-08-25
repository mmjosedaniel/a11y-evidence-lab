# Reliability, reproducibility, and operations requirements

## Authority and use

This document is a focused canonical module within [Quality, security, and operations requirements](README.md) and the authoritative requirements baseline indexed by [Project requirements](../../PROJECT_REQUIREMENTS.md). The index defines status vocabulary, priority semantics, ID stability, and precedence. This file describes planned behavior, not implemented behavior; each identified row's recorded status controls.

## Decision history

OD-010, OD-011, OD-015, and OD-018 were resolved on 2026-08-25. Rows below that moved from Proposed to Accepted define only the proportional MVP controls. Rows moved from Proposed to Deferred retain their stable IDs for a later, explicitly authorized performance, support, packaging, or release stage.

`REQ-QUAL-010` was already Accepted, but OD-015 narrows its earlier broad interpretation: MVP runtime validation is required at the axe result, Groq response, local-runtime response, and persisted-JSON read boundaries. It does not require a universal schema platform. `REQ-QUAL-009` remains the accepted local-model capacity gate; passing it admits an evaluation candidate and does not qualify a supported release dependency.

## Reliability, reproducibility, and operations

| ID | Requirement | Priority | Status | Planned verification |
| --- | --- | --- | --- | --- |
| REQ-QUAL-001 | Every validated stage result and human decision must be written as complete canonical data within its workflow-run record before it is treated as durable. An internal stage result is not another operation lifecycle and does not complete the workflow. Interruption must not overwrite an earlier durable record. An explicit retry creates a new linked workflow run; in-flight resume is not required. | Must | Accepted | Interruption and new-run retry inspection |
| REQ-QUAL-002 | Completed deterministic scan evidence must remain available when a later retrieval, generation, review, comparison, or optional diagnostic action fails. | Must | Accepted | Stage-failure inspection |
| REQ-QUAL-003 | Each fixed MVP evaluation case must record the material identities needed to interpret it: fixture and revision, scenario/rule/scan profile, browser and scanner, corpus snapshot and retrieval configuration, prompt/output contract, selected provider/model/runtime configuration, and application revision. This provenance is portfolio evidence, not release qualification. | Must | Accepted | Fixed-manifest provenance inspection |
| REQ-QUAL-004 | Automated corpus update, index replacement, and recovery behavior are deferred. The MVP uses one fixed, approved corpus snapshot; changing it creates a new snapshot and requires rerunning affected fixed cases rather than an in-place production update. | Could | Deferred | Reconsider if mutable corpus management is authorized |
| REQ-QUAL-005 | Diagnostics must stay local, identify the failing stage, and exclude secrets, raw provider payloads, excluded page content, credentials, and arbitrary input values. Hosted tracing, LangSmith, telemetry, and analytics are outside the MVP. | Must | Accepted | Content-safe local-record inspection |
| REQ-QUAL-006 | The three local-mode happy-path cases must complete sequentially on the reference machine described in [Local MVP feasibility](../../LOCAL_MVP_FEASIBILITY.md), without out-of-memory failure or making the single-reviewer interface unusable. Observed stalls, failures, and practical limitations must be recorded without converting them into performance or support claims. | Must | Accepted | Reference-PC practical-capacity observation |
| REQ-QUAL-007 | MVP reporting may include bounded descriptive observations such as whether each stage completed, elapsed time observed for that run, and readily observable resource pressure. It must not define or claim latency budgets, throughput, p95 values, thermal stability, public performance, or generalized hardware support. | Must | Accepted | Portfolio-report wording inspection |
| REQ-QUAL-008 | The MVP supports one local user and one current item. Multi-user concurrency, high availability, and cloud-scale operation are deferred. | Must | Accepted | Scope inspection |
| REQ-QUAL-009 | A local model configuration must pass the two-stage reference-PC capacity gate in ADR-0004 before it becomes an evaluation candidate or is recommended for the MVP. Configurations that clearly exceed the metadata envelope are excluded without download; a borderline candidate receives only the bounded on-device preflight. Passing does not create a public support claim. | Must | Accepted | Candidate-list and capacity-gate inspection |
| REQ-QUAL-010 | Runtime validation is required where unknown data crosses the four MVP boundaries: axe results, Groq responses, local-model-runtime responses, and persisted JSON read back from a run directory. Compile-time TypeScript types, SDK types, and successful transpilation are not runtime validation. | Must | Accepted | Malformed-boundary-record inspection |
| REQ-QUAL-011 | The MVP must keep a minimal application-owned TypeScript record definition for each persisted or external boundary shape, treat incoming data as unknown, perform structural validation, and apply the few semantic checks required by the consuming stage. JSON Schema, schema code generation, a schema framework, multiple schema dialects, migrations, and a compatibility framework are not required. | Must | Accepted | Record-definition and boundary-check inspection |
| REQ-QUAL-012 | One user-requested workflow operation runs at a time for one scenario, fixture revision, rule, and target. Its only states are `running`, `completed`, and `failed`. Only a complete validated workflow result may complete; timeout or shutdown fails the current operation without publishing partial success. Retry creates a new linked run/operation and never overwrites the earlier one. | Must | Accepted | Sequential lifecycle and failure inspection |
| REQ-QUAL-013 | The MVP must use one local application service with an unprivileged browser UI and an independently owned local model runtime through its adapter. It requires no separate helper supervisor, worker pool, process-orchestration layer, automatic restart, or provider failover. | Must | Accepted | Component and process-ownership inspection |
| REQ-QUAL-014 | Quantitative budgets for input size, nodes, findings, provider payloads, duration, temporary storage, concurrency, or cooperative yielding are deferred until implementation evidence identifies a real limit that needs a policy. | Could | Deferred | Reconsider after implementation measurement |
| REQ-QUAL-015 | A release-grade exact component inventory, including artifact digests, signing state, removal ownership, audit references, and formal support states, is deferred until packaging or release authorization. | Could | Deferred | Release-stage decision |
| REQ-QUAL-016 | Packaged/native matrices, installer lifecycle validation, signing verification, formal exact-host qualification, and public-release evidence are deferred. Deterministic MVP checks and portfolio observations must not be presented as substitutes. | Could | Deferred | Packaging or release-stage decision |
| REQ-QUAL-017 | Exact-limit and maximum-plus-one suites for quantitative trust/resource boundaries are deferred until such limits are accepted. MVP boundary records still require the structural and semantic validation in `REQ-QUAL-010` and `REQ-QUAL-011`. | Could | Deferred | Boundary-limit decision |
| REQ-QUAL-018 | A generated state-machine authority spanning services, serialized records, UI projections, and documentation is deferred. The accepted three-state lifecycle in `REQ-QUAL-012` and [Information and workflow lifecycle](../INFORMATION_AND_WORKFLOW_LIFECYCLE.md) is the MVP authority. | Could | Deferred | Reconsider if a second lifecycle consumer creates drift |

The MVP remains limited to the three project-owned synthetic controlled scenarios. Live-target intake, link discovery, crawling, and a crawler implementation are not reliability obligations.

## Accepted practical local-capacity observation

The fixed MVP manifest exercises one happy local generation path for each accepted scenario, sequentially, using the selected capacity-screened local configuration. For each run, record the exact reference-PC and software/model identities, whether all stages completed, any out-of-memory or visibly unusable-interface condition, and observed limitations. Elapsed times and readily observable resource facts may be included as descriptive context only.

The three Groq happy-path cases validate the same application-owned output contract separately and are not local-capacity evidence. Neither mode is ranked against the other. Formal repetitions, percentile statistics, thermal protocols, provider leaderboards, and performance/support thresholds require a later decision and are not inferred from this compact portfolio manifest.

## Documentation navigation

- Previous: [Privacy and security requirements](PRIVACY_AND_SECURITY.md)
- Up: [Quality, security, and operations requirements](README.md)
- [Project requirements index](../../PROJECT_REQUIREMENTS.md)
- [Project documentation index](../../README.md)
