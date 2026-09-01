# Evaluation and acceptance requirements

## Authority and use

This document is a focused canonical module within [Evaluation and release requirements](README.md) and the authoritative requirements baseline indexed by [Project requirements](../../PROJECT_REQUIREMENTS.md). The index defines status vocabulary, priority semantics, ID stability, and precedence. This file describes planned behavior, not implemented behavior; each identified row's recorded status controls.

## Decision history

OD-009 was resolved on 2026-08-25. It replaces the earlier Proposed 9–12-case pilot and formal qualification direction with the Accepted compact, fixed, non-promotable MVP manifest below. The manifest demonstrates integration; it does not produce statistical evidence, a provider leaderboard, a support matrix, a release qualification, or a generalized product-quality claim.

OD-017 defers the formal qualification and release requirements that were previously Proposed. Their stable IDs remain below so that the planning history is explicit.

[OD-021](../DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-021--trusted-operator-url-boundary-for-the-portfolio-mvp) retains one developer-supplied public HTTPS page as the runtime target while replacing the earlier production-style URL-security gate with an explicit trusted-input portfolio boundary. [ADR-0018](../../architecture/decisions/ADR-0018-trusted-operator-url-boundary.md) supersedes ADR-0017 for the MVP. Hostile, private, authenticated, and otherwise untrusted targets, plus production SSRF, DNS/IP, redirect, and connection-level egress guarantees, are unsupported and deferred. The three project-owned profiles remain the canonical evaluation baseline, live pages do not become evaluation-gold inputs, and the fixed six generation executions do not change.

[OD-022](../DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-022--portfolio-mvp-yagni-simplification) replaces duplicated behavioral narratives and exhaustive hard-specification matrices with the compact derived views below and in `docs/specs/`. It also narrows provider disclosure, persistence, review, and public-page correlation through their owning requirements and ADRs. It does not change the fixed six generation executions or turn them into a provider comparison. The comparison clarification below preserves OD-019's controlled outcome set and positive-to-violation binary regression case while making explicit that public runtime comparison always begins with a baseline Finding.

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
| REQ-EVAL-010 | A formal versioned qualification authority with candidate promotion, statistical gates, immutable official-run governance, and generalized interpretation policy is deferred until the project intends to make a support or release claim. | May | Deferred | Later qualification decision |
| REQ-EVAL-011 | Formal qualification states, conjunctive release gates, multi-reviewer adjudication, and support-selection rules are deferred. A fixed MVP case records only completion/failure and its separate bounded observations. | May | Deferred | Later qualification decision |
| REQ-EVAL-012 | Release-grade provenance binding full artifact digests, package locks, complete hardware profiles, signed evidence, and qualification authorities is deferred. The minimal MVP provenance required by `REQ-EVAL-004` remains Accepted. | May | Deferred | Packaging or release decision |
| REQ-EVAL-013 | Provider-profile support qualification, availability commitments, cost qualification, installer inclusion, and signed public publication are deferred and remain separate future decisions. Success in the compact manifest must not imply any of them. | May | Deferred | Provider support or release decision |

## Fixed MVP manifest

The manifest is deliberately limited to the evidence needed to demonstrate one end-to-end portfolio slice.

### Freeze boundary

- Before implementation begins, record the accepted product boundary and each profile's expected native failing and corrected scanner outcome.
- Exact fixture literals, physical layout, timeout value, filenames, record fields, and implementation configuration may be selected during the applicable implementation slice; they are not separate pre-development gates.
- Before inspecting any Local or Groq model output, freeze the exact controlled inputs, stable target keys, scan profiles, gold passages, minimized evidence-and-guidance input packages, output contract, rubric, prohibited claims, and failure interpretation.
- A material change after model output has been inspected creates a new manifest version and new evidence; it never rewrites the earlier observation.

This section constrains later evaluation but does not authorize implementation.

RD-003 now supplies the [scan-only literal manifest](../../../evaluation/rd003-scan-v1.json) and six referenced static fixture states. Its [execution record](../../plans/completed/rd-003-scan-evaluation-boundary.md#accepted-setup-and-native-observations--rd003-observations-001) preserves the frozen procedure and first native failing/corrected observations, including same-target positive evidence. Original execution/reviews/cleanup passed; RD-003 is Complete after the authorized network-enabled retry passed clean-start acquisition and strict typechecking, followed by independent S3/integrated reviews, final cleanup, and renewed documentation closure. LF checkout verification passes and the earlier permission denial remains historical. The frozen inputs and retained native outcomes are unchanged. This remains a scan-only evaluation, not application verification. It implements no application, generation, retrieval, comparison, or release behavior and does not change the requirement rows below or above.

### Controlled profiles

| Profile | Rule and primary mapping | Expected controlled transition |
| --- | --- | --- |
| `informative-image-alt` | axe `image-alt`; WCAG 2.2 SC 1.1.1 | The failing target produces the expected violation; the corrected same target supplies the required narrow non-failing observation. |
| `form-input-label` | axe `label`; WCAG 2.2 SC 4.1.2 | The failing target produces the expected violation; the corrected same input supplies the required narrow non-failing observation. |
| `text-contrast` | axe `color-contrast`; WCAG 2.2 SC 1.4.3 | The failing target preserves native contrast measurements; the corrected same target supplies the required native non-failing observation. |

The detailed controlled states, minimized evidence, guidance, manual judgments, and comparison meanings remain governed by [Product scope and glossary](../PRODUCT_SCOPE_AND_GLOSSARY.md) and [Evidence and review workflow](../EVIDENCE_AND_REVIEW_WORKFLOW.md).

### Comparison-only contrast policy vector

The manifest freezes this minimal `text-contrast` policy-test vector solely to exercise the deterministic `improved` branch without adding a third fixture or browser execution:

| Field | Baseline record | Later record |
| --- | --- | --- |
| Shared identity and profile | `text-contrast`; the same stable target key and minimized locator; axe `color-contrast` and retained check identity; the same viewport, browser, scanner, evidence, and measurement profile | Identical to baseline |
| Retained visual facts | `#888888` foreground on `#FFFFFF`; normal text at `16px` and weight `400` | `#7F7F7F` foreground on the same `#FFFFFF`; the same font classification |
| Comparison input bucket and threshold | `violation`; expected ratio `4.5:1` | `violation`; expected ratio `4.5:1` |
| Comparison input measured ratio | `3.54:1` | `4.00:1` |
| Comparison-only margin | `3.54 - 4.50 = -0.96` | `4.00 - 4.50 = -0.50` |

The later margin is strictly higher while both input buckets remain failing, so the expected deterministic result is `improved`, not `resolved`. This is not a retained scanner-evidence record and does not satisfy `REQ-EVID-002`; it contains only the field shapes consumed by the comparison policy and makes no claim that axe emitted these values. The vector creates no third fixture revision, product scenario, browser scan, provider invocation, generation execution, or canonical run-comparison record.

### Fixed executions and shared checks

| Manifest part | Minimum content |
| --- | --- |
| Local generation | One eligible structured-generation execution for each controlled profile using the capacity-screened local configuration: three executions. |
| Groq generation | The same three eligible packages and application-owned output contract using the exact accepted Groq evaluation configuration: three executions. |
| Shared deterministic path | Verify each controlled failing/corrected scanner outcome, complete all-node collection, minimized evidence, gold-passage retrieval, and valid-zero versus failed/incomplete scan behavior once at provider-independent frequency. |
| Shared abstention | Use one frozen `incomplete` retrieval package in which at least one applicable passage resolves but the profile's required remediation-guidance role is absent. Keep the Finding visible and render a terminal application-authored explanation naming that state and missing role, confirmation that no provider was called, and manual-investigation guidance. Create no ProviderInvocation or proposal-review decision. |
| Shared review | For validated proposals only, exercise `approve`, `edit and accept`, and `reject` while preserving the original proposal, requiring confirmation that each material claim in an accepted result has the required support from cited guidance, recorded scanner evidence, or both, resolving unsupported claims through edit or rejection, retaining the blocking pre-acceptance judgment and its approval gate, keeping the post-change verification reminder non-blocking, and recording one final decision timestamp. No per-claim record is created. |
| Shared comparison | Exercise the accepted controlled outcomes without requiring a proposal or review decision. Use the comparison-only same-target/profile still-failing contrast policy vector for `improved`; retain reversed controlled positive/failing evidence for binary `regressed`. Proposal, review, and manual-judgment data are context only and never change calculation. Neither case adds a fixture revision or generation execution, and neither supports accessibility, conformance, scanner-fidelity, or remediation-causality inference. |
| Trusted-URL boundary | Demonstrate one trusted public HTTPS page; compact rejection of malformed input, embedded URL credentials, and unsupported schemes before PageAnalysisRun creation or browser navigation; trusted-input limitations visible at URL entry and results; a fresh scan of the entire top-level document in its current rendered state at the configured readiness condition with iframe documents excluded; no crawling or deliberate page interaction; a finite timeout, cleanup, and visible failure. This is not hostile-target qualification. |

The generation count is exactly six. Shared checks do not add generation executions and are not duplicated per provider.

## Compact evaluation rubric

Each case records completion or failure and the applicable observations below. The observations remain separate; the project calculates no aggregate score.

| Observation | Adequate MVP evidence |
| --- | --- |
| Scanner and evidence | Exact three-rule coverage is complete; every returned violation node is retained independently; controlled scans also match their fixture-specific expected scanner outcomes; native `incomplete` observations remain distinct; a failed or coverage-incomplete scan never appears as a valid zero result. |
| Retrieval and citations | The selected Finding retrieves the frozen directly supporting passage; source, version, section, URL, and passage identity resolve; support is not overstated. |
| Structured generation | An eligible call returns the application-owned validated structure with a Finding summary, references to the selected Finding's nested evidence, user-impact explanation, remediation proposal, supported citations, evidence sufficiency, a separate categorical confidence label with uncertainty, assumptions, a blocking pre-acceptance judgment, and a non-blocking post-change verification reminder. |
| Abstention and provider behavior | The frozen `incomplete` guidance case renders a terminal application-authored abstention before invocation, with the missing required role, a clear reason, confirmation that no provider was called, and manual-investigation guidance. It creates no proposal-review decision. A missing selected-mode prerequisite fails before any request and creates no ProviderInvocation. Once a call is attempted, its nested ProviderInvocation retains the compact non-secret provenance and the Finding workflow shows a bounded authentication, quota/rate-limit, network/provider, or response-validation failure category when applicable. Neither path offers automatic, dedicated, or in-place retry, batching, mode mixing, or fallback. Any later attempt, or use of the other provider, requires the ordinary Analyze flow and a new independent PageAnalysisRun. |
| Human review | For a validated proposal only, one reviewer can approve, edit and accept, or reject while the original proposal, blocking judgment, post-change reminder, action, feedback or edit, and timestamp remain distinguishable. Approval or edit-and-accept requires the reviewer to confirm that each material claim in the resulting proposal has the required support from cited guidance, recorded scanner evidence, or both and requires the blocking judgment to support that result or be explicitly not applicable with a reason. An unsupported claim requires a resolving edit or rejection. This remains one final decision with no per-claim record. |
| Comparison | The controlled before/after evidence produces the applicable conservative outcome and rationale without a proposal or review decision; missing or mismatched evidence remains inconclusive or not comparable. Earlier proposals, review decisions, and manual judgments are context only. Public runtime comparison begins with a baseline Finding, so binary positive-to-violation regression remains controlled-evaluation-only, while exact matched lower-margin `color-contrast` failures may be public `regressed`. |
| Capacity and reporting | The three local cases run sequentially on the reference PC without out-of-memory failure or an unusable interface. Local and Groq observations are reported separately with limitations and without ranking or generalized claims. |

No generated, displayed, or reported text may claim certification, legal compliance, whole-page or whole-site accessibility, or complete success-criterion conformance or non-conformance.

## Derived behavioral scope

**Status: Derived planning view; specified, not executed.** The `BHV-*` labels are navigation aids for the concise, non-executable [Gherkin specifications](../../specs/README.md). They create no requirement, decision, test, implementation, or acceptance evidence.

| Example | Essential behavior | Primary authorities |
| --- | --- | --- |
| BHV-01 | Reject malformed target input, embedded URL credentials, and unsupported schemes before creating a run or navigating; otherwise show the trusted-input limitation at target entry and results, analyze one trusted page in its current rendered state, and publish one complete list containing every supported-rule Finding while keeping scanner-review observations and failures distinct. | `REQ-AUTH-007`, `REQ-AUTH-008`, `REQ-SCAN-006`, `REQ-UX-004`, `REQ-UX-005`, `REQ-UX-010`, `REQ-UX-012`, OD-021, ADR-0018 |
| BHV-02 | Select one Finding, inspect its minimized evidence, and retrieve exact versioned guidance without sibling content. | `REQ-EVID-004`, `REQ-EVID-007`, `REQ-RETR-001`, `REQ-RETR-002`, `REQ-RETR-005`, ADR-0022 |
| BHV-03 | Generate one validated proposal only from complete evidence and completed `supported` guidance. Incomplete evidence or completed `incomplete`, `missing`, or `conflicting` retrieval produces a terminal application-authored abstention that explains the blocking information, confirms no provider call, provides manual-investigation guidance, and never enters proposal review. Retrieval execution or passage-integrity errors fail with no support state and are not abstentions; required input that cannot fit without truncation also fails before invocation. | `REQ-RETR-004`, `REQ-GEN-001`–`REQ-GEN-005`, `REQ-GEN-009`, `REQ-GEN-010`, `REQ-LLM-008` |
| BHV-04 | Apply one explicit immutable Local-or-Groq provider/model context to the run and invoke one selected Finding's permitted minimized package at a time. Missing selected-mode prerequisites fail before any call or ProviderInvocation; attempted calls retain compact non-secret provenance and expose a bounded authentication, quota/rate-limit, network/provider, or response-validation failure category. Never mix or batch providers, add dedicated or in-place retry, or fall back; any later attempt or provider change requires the ordinary Analyze flow and a new independent run. | `REQ-GEN-008`, `REQ-LLM-002`–`REQ-LLM-005`, `REQ-LLM-007`, `REQ-LLM-009`, `REQ-LLM-019`, `REQ-LLM-020`, `REQ-SEC-016`, ADR-0014, ADR-0020, ADR-0023 |
| BHV-05 | Require an individual approve, edit-and-accept, or reject decision before one proposal becomes an accepted plan. Approval or edit-and-accept requires confirmation that each material claim in the resulting proposal has the required support from cited guidance, recorded scanner evidence, or both; unsupported claims require a resolving edit or rejection. Keep the profile's blocking pre-acceptance judgment as the other acceptance gate and its later verification reminder as non-blocking guidance, all within one final decision and without per-claim records. | `REQ-GEN-002`, `REQ-REV-001`, `REQ-REV-008`, `REQ-REV-009` |
| BHV-06 | From any retained baseline Finding, rescan in a distinct run and compare exact-locator evidence conservatively without requiring or changing proposal/review state and without making a conformance claim. | `REQ-EVID-010`, `REQ-COMP-004`–`REQ-COMP-008` |
| BHV-07 | Preserve complete local evidence across downstream failure, validate its one aggregate whenever the application reads it, and use a separate run for another Analyze action or an intentional rescan. User-facing reopening is Deferred. | `REQ-EVID-011`, `REQ-UX-014`, OD-026, ADR-0021, and the accepted information lifecycle |
| BHV-08 | Keep deterministic evidence, retrieved guidance, AI interpretation, human work, and limitations visibly distinct without relying only on color; never modify code automatically. | `REQ-EVID-004`, `REQ-GEN-003`–`REQ-GEN-006`, `REQ-UX-002` |

## Explicit non-goals

This evaluation does not add production hostile-target security, authenticated targets, crawling, broader rule coverage, combined prompts or proposals, queues, agents, provider comparison, statistical qualification, generalized model or hardware support, packaging, release evidence, or automatic source-code modification.

Exact implementation literals may remain open while the documentation-only feature files exist because those files do not execute or claim readiness. The directly applicable evaluation inputs must be frozen before model outputs are inspected, not because the planning specification exists.

## Documentation navigation

- Up: [Evaluation and release requirements](README.md)
- [Documentation-only Gherkin specifications](../../specs/README.md)
- Next: [Release inventory, evidence, and claims requirements](RELEASE_INVENTORY_EVIDENCE_AND_CLAIMS.md)
- [Project requirements index](../../PROJECT_REQUIREMENTS.md)
- [Project documentation index](../../README.md)
