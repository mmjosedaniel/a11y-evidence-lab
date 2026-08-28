# Status: Derived planning hard specification; specified, not executed.
# "Hard" means a future implementation must not violate an applicable Accepted
# source constraint. This file creates no authority, test, implementation,
# development authorization, or proof of conformance.

@HARD_SPEC @planned
Feature: Non-negotiable boundaries for the portfolio MVP
  A future implementation preserves the smallest constraints needed to
  demonstrate deterministic scanning, minimized evidence, curated retrieval,
  structured generation, human review, and conservative comparison.

  @HS-001 @REQ-AUTH-007 @REQ-AUTH-008 @REQ-SEC-026 @OD-021 @ADR-0018
  Rule: One trusted page never becomes a crawler

    Scenario: Keep analysis to one fresh scan of the top-level document
      Given the target-entry view states that only a non-authenticated public HTTPS page the developer is permitted and willing to trust is supported, and that hostile, private, or authenticated targets are unsupported
      And the developer supplies one valid public HTTPS URL they are permitted and willing to trust
      When the user starts one PageAnalysisRun
      Then the entire top-level document in its current rendered state at the configured readiness condition is the scan target and iframe documents are not scanned
      And a fresh non-persistent browser context imports no personal profile, cookies, credentials, or authentication state
      And the application does not follow links as targets, submit forms, upload files, permit downloads, deliberately interact with controls, or crawl
      And a finite timeout applies
      And the temporary page, context, and managed browser close after success or failure
      And the product makes no hostile-target, SSRF, or private-network safety claim
      And the result view repeats the trusted-input, unsupported-target, exact-three-rule, and non-certification limitations

    Scenario: Reject unsupported target input before analysis
      Given the submitted target is malformed, contains embedded URL credentials, or uses an unsupported scheme
      When the user requests one PageAnalysisRun
      Then the local service rejects the input with a bounded reason before creating the run or starting browser navigation
      And no scan or provider call begins
      And the rejection makes no hostile-target or private-network safety claim

  @HS-004 @REQ-SCAN-005 @REQ-SCAN-006 @REQ-SCAN-007 @REQ-EVID-009 @REQ-QUAL-001 @REQ-QUAL-012 @REQ-QUAL-019
  Rule: Only a complete exact-three-rule result may be published

    Scenario: Preserve every returned node without false zero or partial success
      Given navigation reaches the configured readiness condition
      When axe executes exactly "image-alt", "label", and "color-contrast"
      Then every returned violation node becomes an independent Finding
      And every returned native incomplete node remains a separate ScannerReviewObservation
      And no ScannerReviewObservation enters retrieval, generation, proposal review, or an accepted plan
      And a complete zero result requires validated coverage for all three rules
      And no complete or valid-zero result is published when coverage is missing, top-level output is malformed, a timeout occurs, a fatal top-level failure in scanner execution, result validation, or evidence capture prevents the complete bounded collection, or the initial complete aggregate cannot be durably written
      And a missing, invalid, or withheld individual allowlisted fact preserves its Finding or ScannerReviewObservation with the concise category or sufficiency reason required by REQ-SCAN-005 instead of failing the parent scan or dropping the item
      And provider selection neither changes the scan nor invokes a model

  @HS-006 @REQ-SCAN-005 @REQ-EVID-004 @REQ-EVID-008 @REQ-COMP-006 @REQ-SEC-003 @REQ-SEC-015 @ADR-0021
  Rule: Durable data and provider input remain minimized

    Scenario: Keep only the information required at each boundary
      Given transient scanner and page material exists for one Finding
      When evidence is persisted, downstream data is added, or one eligible provider request is assembled
      Then the durable aggregate contains only permitted application-owned provenance, minimized evidence, and workflow data
      And adding downstream data does not change completed scan evidence or a sibling Finding's data
      And model-visible generation content contains only that Finding's permitted minimized facts, required guidance passages, and application-owned instructions and output contract
      And the adapter-owned protocol envelope adds only the fixed destination and exact model routing, strict structured-output schema, bounded material generation controls, and required transport authentication, with no arbitrary metadata, custom headers, or user-controlled protocol values
      And credentials remain service-owned and never enter model-visible content, browser code, persisted data, or diagnostics
      And neither layer contains page identity, locator, sibling Findings, target-page credentials or headers, raw page material, or raw native scanner payloads
      And the durable aggregate retains no credentials, raw page or scanner material, or raw provider request or response payloads
      And scanner evidence, guidance, AI interpretation, and human work remain distinguishable
      And comparison uses complete baseline and later scan evidence without requiring or changing a proposal, review decision, or manual judgment

  @HS-008 @REQ-RETR-004 @REQ-RETR-005 @REQ-GEN-001 @REQ-GEN-002 @REQ-GEN-003 @REQ-GEN-004 @REQ-GEN-009 @REQ-GEN-010 @REQ-LLM-008
  Rule: Evidence sufficiency and context fit gate every model call

    Scenario: Invoke a model only for one eligible Finding
      Given one selected Finding remains visible with its minimized evidence
      When the deterministic generation gate is evaluated
      Then a provider call is permitted only when required evidence is complete and completed retrieval is "supported"
      And retrieval support is "missing" for zero applicable resolved passages, "incomplete" when some applicable guidance resolves but a required role is absent, "conflicting" for an unresolved curator-declared material conflict, and "supported" only when all required roles resolve without such a conflict
      And incomplete evidence or incomplete, missing, or conflicting guidance visibly renders a terminal application-authored abstention that references rather than duplicates available evidence and any retrieval result, records the applicable sufficiency state, reason, missing or conflicting information, confirmation that no provider was called, and manual-investigation guidance, and contains no remediation conclusion
      And an abstention creates no ProviderInvocation or approve/edit-and-accept/reject review decision
      And retrieval execution or passage-integrity failure fails the Finding workflow with no support state and is not recorded as abstention
      And required input that cannot fit without truncation fails before invocation with a content-safe reason and is not recorded as abstention
      And no sibling Finding is included or changed

  @HS-009 @REQ-GEN-008 @REQ-LLM-002 @REQ-LLM-003 @REQ-LLM-004 @REQ-LLM-005 @REQ-LLM-007 @REQ-LLM-009 @REQ-LLM-019 @REQ-LLM-020 @REQ-SEC-004 @REQ-SEC-016 @ADR-0014 @ADR-0020 @ADR-0023
  Rule: Provider mode never mixes, batches, or falls back

    Scenario Outline: Keep one immutable provider mode
      Given the PageAnalysisRun began in "<mode>" mode after its one run-level disclosure
      And the selected provider and exact model remain visibly labeled
      And the run context records that immutable mode, provider, and exact model without treating the configuration as a ProviderInvocation
      When the user explicitly invokes one eligible selected Finding
      Then only the "<adapter>" adapter and selected provider receive the permitted minimized package for that one Finding
      And the attempted call creates one nested ProviderInvocation that references the run provider/model context and the owning Finding's corpus and cited-passage context and records the adapter identifier/version, non-secret endpoint identity, bounded material generation parameters, prompt/output-contract provenance, non-secret outcome, and validation result
      And request time, runtime/model revision, and safe usage metadata are recorded only when available, while credentials, raw request/response payloads, hidden reasoning, and new child identifiers are excluded
      And retrieval in either mode embeds corpus and privacy-safe query text only through the approved loopback model, keeps vectors in process, and uses no hosted embedding or vector service
      And Local generation exchanges prompts and responses only through the approved loopback runtime while Groq uses only its accepted minimized external payload
      And mode selection changes none of the scanner, corpus snapshot, embedding, retrieval, evidence, or validation configuration
      And the run's provider and model remain unchanged
      And there is no separate provider preflight or repeated per-finding disclosure gate

      Examples:
        | mode  | adapter                        |
        | Local | configured local-model adapter |
        | Groq  | approved Groq adapter          |

    Scenario: Missing prerequisites never become an invocation
      Given one selected Finding is eligible in the run's immutable provider mode
      When generation is requested but that mode's fixed runtime, model, adapter configuration, or credential prerequisite is missing
      Then the Finding workflow shows a bounded missing-prerequisite failure before any provider request
      And no ProviderInvocation or proposal-review decision is created
      And completed scan evidence and sibling Finding states remain unchanged
      And there is no automatic retry, provider change, or fallback
      And any later attempt uses the ordinary Analyze flow and a new independent PageAnalysisRun

    Scenario: Attempted-call failures retain bounded provenance
      Given one selected Finding is eligible and the selected mode's fixed prerequisites are present
      When one provider call is attempted and authentication, quota or rate limit, network or provider, or response-validation failure occurs
      Then one ProviderInvocation retains the compact non-secret actual-call provenance
      And the Finding workflow shows the applicable bounded failure category without a proposal-review decision
      And completed scan evidence and sibling Finding states remain unchanged
      And there is no automatic retry, provider change, or fallback
      And any later attempt, or use of the other provider, requires the ordinary Analyze flow and a new independent PageAnalysisRun

  @HS-010 @REQ-GEN-002 @REQ-REV-001 @REQ-REV-008 @REQ-REV-009
  Rule: No proposal becomes accepted without one human decision

    Scenario Outline: Apply one decision to one Finding
      Given one validated proposal is pending review for one Finding
      When the reviewer chooses "<decision>"
      Then the result is "<result>"
      And the original proposal remains distinguishable from reviewer-authored content
      And approval or edit-and-accept is permitted only after the reviewer confirms that every material claim in the resulting proposal has the required support from cited guidance, recorded scanner evidence, or both
      And any unsupported material claim must be resolved through the submitted edit or the proposal is rejected
      And the blocking pre-acceptance manual judgment is recorded
      And approval or edit-and-accept is permitted only when that judgment supports the resulting proposal or is explicitly not applicable with a reason
      And an unresolved or contradictory judgment must be resolved through the submitted edit or the proposal is rejected
      And the post-change verification reminder remains visible but is not completed during this review and does not block the decision
      And no sibling Finding or page-level plan changes

      Examples:
        | decision        | result                            |
        | approve         | the original proposal is accepted |
        | edit and accept | the reviewer edit is accepted      |
        | reject          | no remediation plan is accepted    |

  @HS-015 @REQ-EVAL-001 @REQ-EVAL-006 @REQ-EVAL-009 @REQ-GEN-006 @REQ-COMP-005
  Rule: Portfolio evidence never becomes an automatic remediation or broad claim

    Scenario: Keep outputs inside the bounded portfolio purpose
      Given the product displays a scan, proposal, review decision, comparison, or evaluation result
      When that result is interpreted or reported
      Then it does not claim certification, legal compliance, whole-page or whole-site accessibility, or complete success-criterion conformance or non-conformance
      And it does not modify or claim to have modified source code automatically
      And the fixed Local and Groq observations are not ranked or presented as a provider comparison
      And the six generation executions neither qualify a dependency nor establish general provider, model, or hardware support
