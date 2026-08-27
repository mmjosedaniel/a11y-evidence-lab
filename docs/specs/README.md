# Gherkin specifications

Start with the [project documentation index](../README.md). [Evaluation and acceptance](../requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md) owns the fixed manifest, compact rubric, and `BHV-*` behavioral scope. The linked requirements and decisions remain authoritative.

## Status and authority

These files are concise documentation-only planning views:

- [SPEC.feature](SPEC.feature) describes the essential observable MVP workflow.
- [HARD_SPEC.feature](HARD_SPEC.feature) restates seven non-negotiable boundaries that a future implementation must preserve.

They create no requirement, architectural decision, implementation authorization, executable test, fixture, or acceptance evidence. If a scenario conflicts with an authority, the authority controls. Omission from either feature file does not defer or weaken an Accepted requirement.

[OD-021](../requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-021--trusted-operator-url-boundary-for-the-portfolio-mvp) owns the trusted developer-input assumption. [OD-022](../requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-022--portfolio-mvp-yagni-simplification) owns the compact planning boundary used here. [ADR-0018](../architecture/decisions/ADR-0018-trusted-operator-url-boundary.md) owns the single-page browser boundary. The [requirements index](../PROJECT_REQUIREMENTS.md) and [ADR index](../architecture/decisions/README.md) own all other statuses and decisions.

## Execution state

Both feature files are **specified, not executed**. The repository contains no Gherkin runner, step definitions, bindings, test command, implementation fixture, or generated acceptance artifact. Their `.feature` extension provides readable planning notation only.

Executable acceptance work requires explicit development authorization. A future test strategy may reuse these examples, but these files do not prove that any behavior passes.

## Evaluation freeze boundary

- Before implementation, record the accepted product scope and expected native failing/corrected scanner outcome for each of the three controlled profiles.
- Exact fixture literals, timeout values, record fields, filenames, browser configuration, and implementation choices may be selected during the applicable implementation slice.
- Before inspecting Local or Groq model output, freeze the exact evaluation inputs, gold passages, output contract, rubric, prohibited claims, and failure interpretation.

The specifications therefore avoid inventing implementation literals. Their existence does not make an unresolved implementation value a development-authorization gate.

## Tag convention

| Tag | Meaning |
| --- | --- |
| `@SPEC` / `@HARD_SPEC` | Observable or hard-boundary derived view. |
| `@planned` | Specified but not executable or passing. |
| `@SPEC-*` / `@HS-*` | Stable identifier within the derived view. |
| `@BHV-*` | Link to the compact behavioral scope in the evaluation authority. |
| `@REQ-*`, `@OD-*`, `@ADR-*` | Navigation to a controlling requirement or decision; source status still controls. |
| `@controlled_evaluation` | The scenario uses project-owned synthetic evaluation input rather than runtime page input. |

Previously used `SPEC-*` or `HS-*` identifiers omitted from the compact views are retired and are not reused. They were derived navigation labels, not requirement IDs.

## Observable-specification coverage

| Rule | Essential behavior |
| --- | --- |
| `SPEC-001` | Start the local application, scan one trusted page once, and show the complete supported result. |
| `SPEC-002` | Select one Finding and inspect its minimized evidence and exact retrieved guidance. |
| `SPEC-003` | Produce one validated proposal or abstain before provider invocation. |
| `SPEC-004` | Keep one explicit Local-or-Groq mode, one Finding per invocation, visible failure, and no fallback. |
| `SPEC-005` | Apply one individual human review decision. |
| `SPEC-006` | Rescan in a new run and compare evidence conservatively. |
| `SPEC-007` | Preserve and reopen local run evidence without overwriting earlier work. |
| `SPEC-008` | Keep evidence layers and limitations distinct and prohibit automatic remediation claims. |
| `SPEC-009` | Execute exactly the fixed six generation evaluations without comparing providers. |

## Hard-boundary coverage

| Rule | Non-negotiable invariant |
| --- | --- |
| `HS-001` | One trusted public HTTPS page, one fresh context, and no crawling or deliberate page interaction. |
| `HS-004` | Exactly three rules, every returned violation node, separate native `incomplete` observations, and no false zero or partial success. |
| `HS-006` | Minimized evidence and provider input; excluded raw content never crosses the durable or provider boundary. |
| `HS-008` | Complete evidence plus `supported` guidance is required before a model call; otherwise abstain with no invocation. |
| `HS-009` | One immutable global provider mode, one Finding per call, no mixing, batching, automatic retry, or fallback. |
| `HS-010` | No proposal becomes an accepted plan without one finding-specific human decision. |
| `HS-015` | No automatic source-code modification, certification, conformance, provider-ranking, or release claim. |

Production hostile-target protection, authenticated pages, crawling, broader rules, combined proposals, queues, agents, provider comparison, packaging, and release qualification remain outside this derived view. Their governing authorities, not their repetition in Gherkin, preserve those exclusions.

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
