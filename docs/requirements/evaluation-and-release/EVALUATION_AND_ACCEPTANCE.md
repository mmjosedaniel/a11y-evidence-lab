# Evaluation and acceptance requirements

## Authority and use

This document is a focused canonical module within [Evaluation and release requirements](README.md) and the authoritative requirements baseline indexed by [Project requirements](../../PROJECT_REQUIREMENTS.md). The index defines status vocabulary, priority semantics, ID stability, and precedence. This file describes planned behavior, not implemented behavior; each identified row's recorded status controls.

## Decision history

OD-009 was resolved on 2026-08-25. It replaces the earlier Proposed 9–12-case pilot and formal qualification direction with the Accepted compact, fixed, non-promotable MVP manifest below. The manifest demonstrates integration; it does not produce statistical evidence, a provider leaderboard, a support matrix, a release qualification, or a generalized product-quality claim.

OD-017 defers the formal qualification and release requirements that were previously Proposed. Their stable IDs remain below so that the planning history is explicit.

[OD-021](../DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-021--trusted-operator-url-boundary-for-the-portfolio-mvp) retains one developer-supplied public HTTPS page as the runtime target while replacing the earlier production-style URL-security gate with an explicit trusted-input portfolio boundary. [ADR-0018](../../architecture/decisions/ADR-0018-trusted-operator-url-boundary.md) supersedes ADR-0017 for the MVP. Hostile, private, authenticated, and otherwise untrusted targets, plus production SSRF, DNS/IP, redirect, and connection-level egress guarantees, are unsupported and deferred. The three project-owned profiles remain the canonical evaluation baseline, live pages do not become evaluation-gold inputs, and the fixed six generation executions do not change.

[OD-022](../DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-022--portfolio-mvp-yagni-simplification) replaces duplicated behavioral narratives and exhaustive hard-specification matrices with the compact derived views below and in `docs/specs/`. It also narrows provider disclosure, persistence, review, and public-page correlation through their owning requirements and ADRs. It does not change the fixed six generation executions or turn them into a provider comparison.

## Evaluation requirements

| ID | Requirement | Priority | Status | Planned verification |
| --- | --- | --- | --- | --- |
| REQ-EVAL-001 | The fixed MVP manifest must contain one canonical controlled-fixture happy structured-generation case for each of the three accepted rule profiles in local mode and the same three cases in Groq mode: six generation executions total. Fixture-owned deterministic scan, collection, evidence, retrieval, abstention, review-transition, comparison, and trusted-URL scope checks run only at their provider-independent frequency and are not duplicated per generation provider. | Must | Accepted | Manifest inspection |
| REQ-EVAL-002 | Scanner fidelity, evidence completeness, retrieval relevance, citation validity and support, generated-answer groundedness, remediation usefulness, abstention, review transitions, comparison accuracy, and prohibited claims must be evaluated as distinct observations. | Must | Accepted | Fixed-case report inspection |
| REQ-EVAL-003 | Each scenario must map its deterministic finding and minimized evidence to at least one directly supporting passage in the accepted curated corpus. Gold passage IDs and locators are fixed before model output is observed. | Must | Accepted | Gold-passage mapping inspection |
| REQ-EVAL-004 | Each recorded case must identify its exact controlled scenario/fixture state or trusted-URL scope input, rule/scan profile, corpus snapshot when applicable, retrieval configuration when applicable, prompt/output contract when applicable, provider mode when applicable, and selected model/runtime configuration when applicable, while keeping traces local and content-safe. | Must | Accepted | Case-provenance inspection |
| REQ-EVAL-005 | A material change to a fixture's controlled content or expected rule result, scanner/rule profile, corpus snapshot, retrieval configuration, prompt/output contract, provider adapter, model configuration, or comparison rule must rerun the affected fixed cases. It creates new evidence and does not rewrite the prior result. | Must | Accepted | Change-to-case traceability inspection |
| REQ-EVAL-006 | The manifest uses one capacity-screened local evaluation candidate and the one exact Groq model selected by the provider decision. Their inclusion validates only the bounded portfolio paths; it does not promote either model, runtime, scanner, retrieval component, or provider to a release-qualified dependency. | Must | Accepted | Candidate/status wording inspection |
| REQ-EVAL-007 | The fixed case inputs, expected deterministic outcomes, acceptable supporting passages, proposal rubric, prohibited claims, and failure interpretation must be frozen before either model's output is reviewed. One reviewer may apply the compact rubric. Statistical confidence, percentages inferred from the small set, multiple reviewers, inter-rater agreement, severity weighting, and broader stratification are excluded. | Must | Accepted | Pre-execution manifest freeze inspection |
| REQ-EVAL-008 | Each provider's three happy cases must return the same application-owned structured proposal contract and pass runtime validation. An invalid or failed response fails that case; it must not trigger automatic fallback. The evidence-sufficiency abstention check is deterministic, occurs before provider invocation, and therefore runs once rather than once per provider. | Must | Accepted | Structured-result, abstention, and no-fallback inspection |
| REQ-EVAL-009 | Local and Groq results must be reported in separate sections against the same three happy case definitions. The report may confirm that each path completed and record its limitations, but it must not rank providers, aggregate them into one score, or claim comparative model quality. | Must | Accepted | Non-comparative report inspection |
| REQ-EVAL-010 | A formal versioned qualification authority with candidate promotion, statistical gates, immutable official-run governance, and generalized interpretation policy is deferred until the project intends to make a support or release claim. | Could | Deferred | Later qualification decision |
| REQ-EVAL-011 | Formal qualification states, conjunctive release gates, multi-reviewer adjudication, and support-selection rules are deferred. A fixed MVP case records only completion/failure and its separate bounded observations. | Could | Deferred | Later qualification decision |
| REQ-EVAL-012 | Release-grade provenance binding full artifact digests, package locks, complete hardware profiles, signed evidence, and qualification authorities is deferred. The minimal MVP provenance required by `REQ-EVAL-004` remains Accepted. | Could | Deferred | Packaging or release decision |
| REQ-EVAL-013 | Provider-profile support qualification, availability commitments, cost qualification, installer inclusion, and signed public publication are deferred and remain separate future decisions. Success in the compact manifest must not imply any of them. | Could | Deferred | Provider support or release decision |

## Fixed MVP manifest

The manifest is deliberately limited to the evidence needed to demonstrate one end-to-end portfolio slice.

### Freeze boundary

- Before implementation begins, record the accepted product boundary and each profile's expected native failing and corrected scanner outcome.
- Exact fixture literals, physical layout, timeout value, filenames, record fields, and implementation configuration may be selected during the applicable implementation slice; they are not separate pre-development gates.
- Before inspecting any Local or Groq model output, freeze the exact controlled inputs, stable target keys, scan profiles, gold passages, minimized evidence-and-guidance input packages, output contract, rubric, prohibited claims, and failure interpretation.
- A material change after model output has been inspected creates a new manifest version and new evidence; it never rewrites the earlier observation.

This section constrains later evaluation but does not authorize implementation.

### Controlled profiles

| Profile | Rule and primary mapping | Expected controlled transition |
| --- | --- | --- |
| `informative-image-alt` | axe `image-alt`; WCAG 2.2 SC 1.1.1 | The failing target produces the expected violation; the corrected same target supplies the required narrow non-failing observation. |
| `form-input-label` | axe `label`; WCAG 2.2 SC 4.1.2 | The failing target produces the expected violation; the corrected same input supplies the required narrow non-failing observation. |
| `text-contrast` | axe `color-contrast`; WCAG 2.2 SC 1.4.3 | The failing target preserves native contrast measurements; the corrected same target supplies the required native non-failing observation. |

The detailed controlled states, minimized evidence, guidance, manual judgments, and comparison meanings remain governed by [Product scope and glossary](../PRODUCT_SCOPE_AND_GLOSSARY.md) and [Evidence and review workflow](../EVIDENCE_AND_REVIEW_WORKFLOW.md).

### Fixed executions and shared checks

| Manifest part | Minimum content |
| --- | --- |
| Local generation | One eligible structured-generation execution for each controlled profile using the capacity-screened local configuration: three executions. |
| Groq generation | The same three eligible packages and application-owned output contract using the exact accepted Groq evaluation configuration: three executions. |
| Shared deterministic path | Verify each controlled failing/corrected scanner outcome, complete all-node collection, minimized evidence, gold-passage retrieval, and valid-zero versus failed/incomplete scan behavior once at provider-independent frequency. |
| Shared abstention | Use one incomplete, missing, or conflicting evidence/guidance package; keep the Finding visible and create no provider invocation. |
| Shared review | Exercise `approve`, `edit and accept`, and `reject` while preserving the original proposal, required manual judgments, and decision timestamp. |
| Shared comparison | Exercise the accepted controlled outcomes, including contrast-only `improved`, without inferring accessibility, conformance, or remediation causality. |
| Trusted-URL boundary | Demonstrate one trusted public HTTPS page, basic input rejection, a fresh single-page scan, no crawling or deliberate page interaction, a finite timeout, cleanup, and visible failure. This is not hostile-target qualification. |

The generation count is exactly six. Shared checks do not add generation executions and are not duplicated per provider.

## Compact evaluation rubric

Each case records completion or failure and the applicable observations below. The observations remain separate; the project calculates no aggregate score.

| Observation | Adequate MVP evidence |
| --- | --- |
| Scanner and evidence | Exact three-rule coverage is complete; every expected violation node is retained independently; native `incomplete` observations remain distinct; a failed or coverage-incomplete scan never appears as a valid zero result. |
| Retrieval and citations | The selected Finding retrieves the frozen directly supporting passage; source, version, section, URL, and passage identity resolve; support is not overstated. |
| Structured generation | An eligible call returns the application-owned validated structure with references to the selected Finding's nested evidence, supported citations, qualified explanation, remediation proposal, uncertainty, assumptions, and required manual checks. |
| Abstention and provider behavior | Insufficient evidence or guidance abstains before invocation; provider failure is visible; neither path triggers automatic retry, batching, mode mixing, or fallback. |
| Human review | One reviewer can approve, edit and accept, or reject one proposal while the original proposal, action, feedback or edit, and timestamp remain distinguishable. |
| Comparison | The controlled before/after evidence produces the applicable conservative outcome and rationale; missing or mismatched evidence remains inconclusive or not comparable. |
| Capacity and reporting | The three local cases run sequentially on the reference PC without out-of-memory failure or an unusable interface. Local and Groq observations are reported separately with limitations and without ranking or generalized claims. |

No generated, displayed, or reported text may claim certification, legal compliance, whole-page or whole-site accessibility, or complete success-criterion conformance or non-conformance.

## Derived behavioral scope

**Status: Proposed derived planning view.** The `BHV-*` labels are navigation aids for the concise, non-executable [Gherkin specifications](../../specs/README.md). They create no requirement, decision, test, implementation, or acceptance evidence.

| Example | Essential behavior | Primary authorities |
| --- | --- | --- |
| BHV-01 | Start the local application, analyze one trusted page, and publish one complete list containing every supported-rule Finding while keeping scanner-review observations and failures distinct. | `REQ-AUTH-007`, `REQ-AUTH-008`, `REQ-SCAN-006`, OD-021, ADR-0018 |
| BHV-02 | Select one Finding, inspect its minimized evidence, and retrieve exact versioned guidance without sibling content. | `REQ-EVID-004`, `REQ-EVID-007`, `REQ-RETR-001`, `REQ-RETR-002`, `REQ-RETR-005` |
| BHV-03 | Generate one validated proposal only from complete evidence and supported guidance, otherwise abstain before any provider call. | `REQ-RETR-004`, `REQ-GEN-002`–`REQ-GEN-005`, `REQ-GEN-010` |
| BHV-04 | Apply one explicit immutable Local-or-Groq mode to the run; invoke one selected Finding at a time; expose failure without provider mixing, batching, or fallback. | `REQ-LLM-002`–`REQ-LLM-005`, `REQ-LLM-008`, `REQ-LLM-009`, `REQ-LLM-019`, `REQ-LLM-020`, ADR-0014, ADR-0020 |
| BHV-05 | Require an individual approve, edit-and-accept, or reject decision before one proposal becomes an accepted plan. | `REQ-REV-001`, `REQ-REV-008`, `REQ-REV-009` |
| BHV-06 | Rescan in a distinct run and compare exact-locator evidence conservatively without making a conformance claim. | `REQ-EVID-010`, `REQ-COMP-004`, `REQ-COMP-005`, `REQ-COMP-007`, `REQ-COMP-008` |
| BHV-07 | Preserve complete local evidence across downstream failure, reopen its one validated aggregate, and use a separate run for another Analyze action or an intentional rescan. | `REQ-EVID-011`, ADR-0021, and the accepted information lifecycle |
| BHV-08 | Keep deterministic evidence, retrieved guidance, AI interpretation, human work, and limitations visibly distinct; never modify code automatically. | `REQ-EVID-004`, `REQ-GEN-003`–`REQ-GEN-006` |

## Explicit non-goals

This evaluation does not add production hostile-target security, authenticated targets, crawling, broader rule coverage, combined prompts or proposals, queues, agents, provider comparison, statistical qualification, generalized model or hardware support, packaging, release evidence, or automatic source-code modification.

Exact implementation literals may remain open while the documentation-only feature files exist because those files do not execute or claim readiness. The directly applicable evaluation inputs must be frozen before model outputs are inspected, not because the planning specification exists.

## Documentation navigation

- Up: [Evaluation and release requirements](README.md)
- [Documentation-only Gherkin specifications](../../specs/README.md)
- Next: [Release inventory, evidence, and claims requirements](RELEASE_INVENTORY_EVIDENCE_AND_CLAIMS.md)
- [Project requirements index](../../PROJECT_REQUIREMENTS.md)
- [Project documentation index](../../README.md)
