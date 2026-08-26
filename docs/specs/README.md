# Gherkin specifications

Start with the [project documentation index](../README.md). [Evaluation and acceptance](../requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md) is the direct source for the `BHV-*` examples and their traceability table; the linked requirements and decisions remain authoritative. Use this directory only as a derived Gherkin view.

## Status and authority

These files are documentation-only planning artifacts for future implementation and acceptance work:

- [SPEC.feature](SPEC.feature) describes the observable MVP behavior currently derived from `BHV-01` through `BHV-08` and the fixed controlled-evaluation baseline.
- [HARD_SPEC.feature](HARD_SPEC.feature) describes the derived fail-closed, safety, privacy, failure, isolation, lifecycle, and scope invariants that a future implementation must preserve.

The [project requirements](../PROJECT_REQUIREMENTS.md) and their focused modules own requirement wording and status. [OD-020](../requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-020--authorized-public-page-analysis-scope) owns the current MVP product scope. Accepted architecture remains governed by the [ADR index](../architecture/decisions/README.md), including [ADR-0017](../architecture/decisions/ADR-0017-authorized-public-page-scan-boundary.md).

The Gherkin files create no requirement, architectural decision, implementation authorization, test, fixture, or acceptance evidence. If a scenario and an authority conflict, the authority controls. A Proposed source behavior remains Proposed even when represented in Gherkin.

`HARD_SPEC.feature` restates constraints already established by its linked requirements, operating decisions, and ADRs. **Hard** means a future implementation must not violate an applicable **Accepted** source constraint. It does not promote a Proposed detail, activate a Deferred capability, resolve an open value, or create authority of its own.

## Execution state

`SPEC.feature` and `HARD_SPEC.feature` are **specified, not executed**. The repository contains no Gherkin runner configuration, step definitions, executable bindings, test command, dependency, or generated test artifact. Their `.feature` extension provides readable behavioral notation; it does not make the scenarios executable or demonstrate that they pass.

Executable acceptance assets remain outside the idea-exploration stage. They require explicit development authorization and must be implemented through the later test strategy rather than by treating this planning file as a test suite.

## Planning and implementation values

The specifications describe observable intent and hard boundaries without inventing values that belong to implementation qualification. Terms such as **accepted scan boundary**, **complete scan**, **minimized evidence**, **supported guidance**, and **comparable scans** refer to their owning requirements and decisions.

The specifications therefore do not freeze:

- numeric URL, redirect, request, transfer, duration, memory, DOM, finding, evidence, or storage limits;
- concrete browser-network enforcement, cleanup, runtime, framework, package, or command choices;
- exact controlled-fixture literals, public-page correlation fields, evidence allowlists, record property names, or filenames;
- the exact local evaluation model/runtime configuration subject to the reference-PC capacity gate; or
- the concrete evaluation input used to demonstrate contrast-only `improved` behavior.

Those values remain open, and their owning authorities retain the recorded timing for selecting and freezing them. These planning `.feature` files may exist without resolving them because they neither execute nor claim readiness. Selecting a value does not require changing a derived specification when the resulting behavior still satisfies those authorities; a change to product behavior or an accepted decision must update the authority first and these derived views afterward.

## Tag convention

| Tag | Meaning |
| --- | --- |
| `@SPEC` | Classifies the feature as the observable product specification. |
| `@HARD_SPEC` | Classifies the feature as the hard-boundary planning specification. |
| `@planned` | Inherited by every rule and scenario; specified but not bound to an executable check. |
| `@SPEC-*` | Stable identifier for one derived specification rule. |
| `@HS-*` | Stable identifier for one derived hard-boundary rule. |
| `@BHV-*` | Traceability to the planning-level behavioral example in `EVALUATION_AND_ACCEPTANCE.md`. |
| `@REQ-*` | Traceability to a canonical requirement ID; the requirement's recorded status still controls. |
| `@OD-*` | Traceability to an operating decision in the delivery-readiness register. |
| `@ADR-*` | Traceability to an accepted architecture record within its stated scope. |
| `@proposed_source` | In `HARD_SPEC.feature`, marks a scenario that directly includes at least one Proposed source detail; it does not accept that detail. |
| `@deferred_scope` | In `HARD_SPEC.feature`, preserves an explicitly Deferred exclusion; it does not activate or commit the capability. |
| `@controlled_evaluation` | Identifies behavior exercised through the project-owned synthetic evaluation baseline rather than user-submitted runtime input. |

Tags provide navigation and do not independently make a behavior Accepted, implemented, mandatory, passing, or release-qualified.

## Observable-specification coverage

| Rule | Derived behavior |
| --- | --- |
| `SPEC-001` | Start and reach the developer-run local application. |
| `SPEC-002` | Analyze one authorized public HTTPS page and list every finding from the exact three supported rules. |
| `SPEC-003` | Inspect one finding's minimized evidence and retrieved guidance. |
| `SPEC-004` | Generate one grounded proposal or abstain before provider invocation. |
| `SPEC-005` | Apply one immutable Local-or-Groq mode to the analysis and keep invocation explicit. |
| `SPEC-006` | Review one proposal through approval, edit-and-accept, or rejection. |
| `SPEC-007` | Rescan in a new run and compare correlated evidence conservatively. |
| `SPEC-008` | Preserve and reopen immutable local run history. |
| `SPEC-009` | Keep evidence, guidance, AI interpretation, human work, and limitations distinguishable. |
| `SPEC-010` | Exercise the three project-owned controlled profiles and fixed six generation cases. |

The specification does not add authenticated or private targets, crawling, link discovery, multiple input pages, rules beyond `image-alt`, `label`, and `color-contrast`, combined proposals, bulk generation or review, automatic remediation, provider fallback, accounts, collaboration, agents, LangGraph, LangSmith, a database, packaging, an installer, release qualification, or accessibility/compliance certification.

## Hard-boundary coverage

| Rule | Derived boundary |
| --- | --- |
| `HS-001` | Reject unauthorized, ambiguous, non-public, or identity-changing public targets before analysis can succeed. |
| `HS-002` | Keep the admitted main document and exact three-rule scan from becoming crawling or page interaction. |
| `HS-003` | Force managed-browser networking and state through the accepted isolation boundary. |
| `HS-004` | Publish only a complete, bounded, runtime-validated exact-three-rule result. |
| `HS-005` | Clean up browser work and transient material on every terminal path. |
| `HS-006` | Minimize page/provider data before durable or public use. |
| `HS-007` | Keep ScannerReviewObservations outside FindingWorkflow and process one selected FindingWorkflow at a time. |
| `HS-008` | Gate generation on complete evidence and supported retrieval, with validation before review. |
| `HS-009` | Keep provider selection, disclosure, egress, invocation, and failures explicit and isolated. |
| `HS-010` | Require an individual human decision before one proposal becomes an accepted plan. |
| `HS-011` | Keep canonical runs validated, immutable, retry-safe, and exactly deletable. |
| `HS-012` | Compare only adequate evidence and keep public-page correlation details visibly Proposed. |
| `HS-013` | Keep local-model setup explicit, runtime-owned, capacity-bounded, and separate from analysis. |
| `HS-014` | Keep the loopback browser UI unprivileged, render untrusted data inertly, and preserve Proposed application-accessibility constraints. |
| `HS-015` | Bound the fixed evaluation and prohibit unsupported scope, quality, remediation, and compliance claims. |

The hard specification does not freeze the unresolved bound manifest, public-page correlation descriptor, renderer projection design, detailed review/manual-check records, or abstention schema. Its `@proposed_source` scenarios make those pending constraints visible without changing their status.

## Maintenance

- Change the authoritative requirement or decision first when scope, behavior, or status changes.
- Update the affected `SPEC-*` or `HS-*` rule and traceability tags in the same documentation task.
- Keep outcomes observable and avoid selecting implementation details through Gherkin wording.
- Do not mark a scenario passing without reproducible implementation evidence from a later authorized stage.
- Do not add executable bindings, runner configuration, step definitions, or implementation artifacts as an incidental extension of these planning files.

## Documentation navigation

- [Project documentation index](../README.md)
- [Evaluation and acceptance](../requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md)
- [Project requirements](../PROJECT_REQUIREMENTS.md)
- [Observable MVP specification](SPEC.feature)
- [Hard-boundary MVP specification](HARD_SPEC.feature)
