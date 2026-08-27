# Gherkin specifications

Start with the [project documentation index](../README.md). [Evaluation and acceptance](../requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md) owns the fixed manifest, compact rubric, and `BHV-*` behavioral scope. The linked requirements and decisions remain authoritative.

## Status and authority

These files are concise documentation-only planning views:

- [SPEC.feature](SPEC.feature) describes the essential observable MVP workflow.
- [HARD_SPEC.feature](HARD_SPEC.feature) restates seven non-negotiable boundaries that a future implementation must preserve.

They create no requirement, architectural decision, implementation authorization, executable test, fixture, or acceptance evidence. If a scenario conflicts with an authority, the authority controls. Omission from either feature file does not defer or weaken an Accepted requirement.

[OD-021](../requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-021--trusted-operator-url-boundary-for-the-portfolio-mvp) owns the trusted developer-input assumption. [OD-022](../requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-022--portfolio-mvp-yagni-simplification) owns the compact planning boundary used here. [OD-024](../requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-024--minimum-complete-mvp-behavior-contracts) accepts the minimum scanner-evidence, structured-result, comparison, interface, and application-accessibility contracts reflected by these views. [ADR-0018](../architecture/decisions/ADR-0018-trusted-operator-url-boundary.md) owns the single-page browser boundary, [ADR-0022](../architecture/decisions/ADR-0022-closed-versioned-guidance-corpus.md) owns the closed corpus, and [ADR-0023](../architecture/decisions/ADR-0023-local-mode-data-boundary.md) owns the Local-mode data boundary. The [requirements index](../PROJECT_REQUIREMENTS.md) and [ADR index](../architecture/decisions/README.md) own all other statuses and decisions.

The accepted application-accessibility behavior is not duplicated as another feature matrix. `REQ-A11Y-006` keeps its verification to one automated check, one keyboard smoke path, and one screen-reader smoke path; omission of those detailed checks here does not weaken `REQ-A11Y-001`–`REQ-A11Y-004`, `REQ-A11Y-009`, or `REQ-A11Y-010`.

## Execution state

Both feature files are **specified, not executed**. The repository contains no Gherkin runner, step definitions, bindings, test command, implementation fixture, or generated acceptance artifact. Their `.feature` extension provides readable planning notation only.

Executable acceptance work requires explicit development authorization. A future test strategy may reuse these examples, but these files do not prove that any behavior passes.

## Evaluation freeze boundary

The [evaluation authority](../requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md#freeze-boundary) owns the accepted scope, expected native outcomes, and timing for freezing exact evaluation inputs. These feature files create no additional freeze artifact, implementation value, or development-authorization gate.

## Tag convention

| Tag | Meaning |
| --- | --- |
| `@SPEC` / `@HARD_SPEC` | Observable or hard-boundary derived view. |
| `@planned` | Specified but not executable or passing. |
| `@SPEC-*` / `@HS-*` | Stable identifier within the derived view. |
| `@BHV-*` | Link to the compact behavioral scope in the evaluation authority. |
| `@REQ-*`, `@OD-*`, `@ADR-*` | Navigation to a controlling requirement or decision; source status still controls. |

Previously used `SPEC-*` or `HS-*` identifiers omitted from the compact views are retired and are not reused. They were derived navigation labels, not requirement IDs.

## Maintenance

- Change an authoritative requirement or decision before changing product scope or status here.
- Keep one concise scenario per essential concern unless a second branch is required to make a safety distinction observable.
- Trace only the primary authorities needed to understand the scenario.
- Do not add executable bindings, implementation artifacts, or exhaustive matrices during the idea-exploration stage.

## Documentation navigation

- [Project documentation index](../README.md)
- [Evaluation and acceptance](../requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md)
- [Project requirements](../PROJECT_REQUIREMENTS.md)
- [Observable MVP specification](SPEC.feature)
- [Hard-boundary MVP specification](HARD_SPEC.feature)
