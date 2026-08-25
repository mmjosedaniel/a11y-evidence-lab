# Evaluation and acceptance requirements

## Authority and use

This document is a focused canonical module within [Evaluation and release requirements](README.md) and the authoritative requirements baseline indexed by [Project requirements](../../PROJECT_REQUIREMENTS.md). The index defines status vocabulary, priority semantics, ID stability, and precedence. This file describes planned behavior, not implemented behavior; each identified row's recorded status controls.

## Decision history

OD-009 was resolved on 2026-08-25. It replaces the earlier Proposed 9–12-case pilot and formal qualification direction with the Accepted compact, fixed, non-promotable MVP manifest below. The manifest demonstrates integration; it does not produce statistical evidence, a provider leaderboard, a support matrix, a release qualification, or a generalized product-quality claim.

OD-017 defers the formal qualification and release requirements that were previously Proposed. Their stable IDs remain below so that the planning history is explicit.

## Evaluation requirements

| ID | Requirement | Priority | Status | Planned verification |
| --- | --- | --- | --- | --- |
| REQ-EVAL-001 | The fixed MVP manifest must contain one happy structured-generation case for each of the three accepted scenarios in local mode and the same three cases in Groq mode: six generation executions total. Scenario-owned deterministic scan, evidence, retrieval, abstention, review-transition, and comparison checks run once and are not duplicated per generation provider. | Must | Accepted | Manifest inspection |
| REQ-EVAL-002 | Scanner fidelity, evidence completeness, retrieval relevance, citation validity and support, generated-answer groundedness, remediation usefulness, abstention, review transitions, comparison accuracy, and prohibited claims must be evaluated as distinct observations. | Must | Accepted | Fixed-case report inspection |
| REQ-EVAL-003 | Each scenario must map its deterministic finding and minimized evidence to at least one directly supporting passage in the accepted curated corpus. Gold passage IDs and locators are fixed before model output is observed. | Must | Accepted | Gold-passage mapping inspection |
| REQ-EVAL-004 | Each recorded case must identify its exact scenario/fixture state, rule/scan profile, corpus snapshot, retrieval configuration, prompt/output contract, provider mode, and selected model/runtime configuration, while keeping traces local and content-safe. | Must | Accepted | Case-provenance inspection |
| REQ-EVAL-005 | A material change to a fixture's controlled content or expected rule result, scanner/rule profile, corpus snapshot, retrieval configuration, prompt/output contract, provider adapter, model configuration, or comparison rule must rerun the affected fixed cases. It creates new evidence and does not rewrite the prior result. | Must | Accepted | Change-to-case traceability inspection |
| REQ-EVAL-006 | The manifest uses one capacity-screened local evaluation candidate and the one exact Groq model selected by the provider decision. Their inclusion validates only the bounded portfolio paths; it does not promote either model, runtime, scanner, retrieval component, or provider to a release-qualified dependency. | Must | Accepted | Candidate/status wording inspection |
| REQ-EVAL-007 | The fixed case inputs, expected deterministic outcomes, acceptable supporting passages, proposal rubric, prohibited claims, and failure interpretation must be frozen before either model's output is reviewed. One reviewer may apply the compact rubric. Statistical confidence, percentages inferred from the small set, multiple reviewers, inter-rater agreement, severity weighting, and broader stratification are excluded. | Must | Accepted | Pre-execution manifest freeze inspection |
| REQ-EVAL-008 | Each provider's three happy cases must return the same application-owned structured proposal contract and pass runtime validation. An invalid or failed response fails that case; it must not trigger automatic fallback. The evidence-sufficiency abstention check is deterministic, occurs before provider invocation, and therefore runs once rather than once per provider. | Must | Accepted | Structured-result, abstention, and no-fallback inspection |
| REQ-EVAL-009 | Local and Groq results must be reported in separate sections against the same three happy case definitions. The report may confirm that each path completed and record its limitations, but it must not rank providers, aggregate them into one score, or claim comparative model quality. | Must | Accepted | Non-comparative report inspection |
| REQ-EVAL-010 | A formal versioned qualification authority with candidate promotion, statistical gates, immutable official-run governance, and generalized interpretation policy is deferred until the project intends to make a support or release claim. | Could | Deferred | Later qualification decision |
| REQ-EVAL-011 | Formal qualification states, conjunctive release gates, multi-reviewer adjudication, and support-selection rules are deferred. A fixed MVP case records only completion/failure and its separate bounded observations. | Could | Deferred | Later qualification decision |
| REQ-EVAL-012 | Release-grade provenance binding full artifact digests, package locks, complete hardware profiles, signed evidence, and qualification authorities is deferred. The minimal MVP provenance required by `REQ-EVAL-004` remains Accepted. | Could | Deferred | Packaging or release decision |
| REQ-EVAL-013 | Provider-profile support qualification, availability commitments, cost qualification, installer inclusion, and signed public publication are deferred and remain separate future decisions. Success in the compact manifest must not imply any of them. | Could | Deferred | Provider support or release decision |

## Accepted fixed MVP manifest

The manifest is deliberately small and must be frozen before model outputs are inspected:

| Manifest group | Fixed content | Execution count or rule |
| --- | --- | --- |
| Scenario definitions | `informative-image-alt`, `form-input-label`, and `text-contrast`, each with its controlled failing state, corrected state, expected exact-rule result, stable target key, browser/rule profile, gold guidance passage, and required manual judgment | Three logical scenarios; physical fixture-file layout is an implementation detail |
| Local happy generation | One evidence-sufficient failing-state package per scenario, using the selected capacity-screened local configuration | Three executions |
| Groq happy generation | The same three evidence-sufficient packages and the same application-owned output contract, using the one selected Groq model | Three executions |
| Evidence-sufficiency abstention | One deliberately missing, incomplete, or conflicting guidance package that leaves the finding visible and blocks provider invocation | Run once; provider-independent |
| Deterministic scan and retrieval | Each scenario's failing/corrected expected exact-rule results, required minimized evidence, and gold passage retrieval | Run once per scenario definition; provider-independent |
| Human review semantics | `approve`, `edit`, and `reject`, including preservation of the original proposal and decision timestamp | One compact transition set; not duplicated per provider |
| Deterministic comparison | Each scenario's failing-to-corrected `resolved` check; contrast `improved` using its ordered measure; and representative `persistent`, `regressed`, and `inconclusive` behavior required by the comparison authority | Run once per owned deterministic check; provider-independent |

Freezing means that controlled content, expected scanner outcome, stable target key, scan profile, gold passage, input package, structured-output contract, and rubric are recorded before generation results. It does not require six fixture projects or files.

## Accepted MVP evaluation criteria

- Every one of the six happy generation executions either returns a runtime-validated structured proposal or is recorded as a failed case; no failure is hidden by fallback.
- Every displayed material proposal claim is traceable to the retained deterministic evidence and an exact retrieved passage. Every displayed citation resolves to its recorded corpus snapshot and directly supports the associated claim.
- Every proposal keeps deterministic evidence, retrieved guidance, model interpretation, confidence/uncertainty, assumptions, and required manual checks distinguishable.
- The deliberately insufficient case leaves the deterministic finding visible, records abstention and its reason, and requires manual review without invoking a model.
- Review checks preserve the original model proposal and record the one reviewer's action, edits or rejection feedback, and timestamp. A reviewer decision is feedback, not automatic ground truth.
- Comparison checks apply only the accepted scenario rules. Absence of an automated finding does not prove complete conformance or accessibility; insufficient or mismatched evidence remains `inconclusive`.
- The local happy cases complete sequentially on the reference PC without out-of-memory failure or an unusable single-reviewer interface, and the report records observed limitations. This is practical capacity evidence only, not a latency, thermal, performance, or support claim.
- No generated, displayed, or reported text claims certification, legal compliance, whole-page or whole-site accessibility, or complete success-criterion conformance or non-conformance.
- Local and Groq sections state their limitations separately. No score, ranking, statistical inference, leaderboard, or generalized provider/model conclusion is calculated from this manifest.

## Documentation navigation

- Up: [Evaluation and release requirements](README.md)
- Next: [Release inventory, evidence, and claims requirements](RELEASE_INVENTORY_EVIDENCE_AND_CLAIMS.md)
- [Project requirements index](../../PROJECT_REQUIREMENTS.md)
- [Project documentation index](../../README.md)
