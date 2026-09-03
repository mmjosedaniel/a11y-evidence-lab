# Status: Derived planning specification; specified, not executed.
# Authority: The linked requirements and decisions control every scenario.
# This file is not implementation, an executable test, acceptance evidence,
# development authorization, or proof that a scenario passes.

@SPEC @planned
Feature: Evidence-first accessibility analysis for one trusted public page
  A frontend developer scans one deliberately supplied public HTTPS page with
  three deterministic rules. The application captures minimized evidence for
  every Finding, then processes one selected Finding at a time through
  retrieval and evidence-sufficiency evaluation. Incomplete evidence or a
  completed but insufficient guidance result ends in a terminal
  application-authored abstention with no provider call or proposal review.
  Retrieval and input-limit errors fail without being mislabeled as
  abstention. An eligible Finding may produce one validated proposal that
  alone enters human review. Any retained baseline Finding may later be
  compared without first completing either downstream branch.

  @SPEC-001 @BHV-01 @REQ-AUTH-007 @REQ-AUTH-008 @REQ-SCAN-005 @REQ-SCAN-006 @REQ-SCAN-007 @REQ-QUAL-001 @REQ-QUAL-012 @REQ-LLM-021 @REQ-UX-003 @REQ-UX-004 @REQ-UX-005 @REQ-UX-010 @REQ-UX-012 @REQ-A11Y-009 @REQ-A11Y-010 @OD-021 @OD-027 @ADR-0018
  Rule: Analyze one trusted page and show the complete supported result

    Scenario: Complete one provider-independent page analysis
      Given the developer-started local application is ready
      And the developer chose one public HTTPS page they are permitted and willing to trust
      And the user selected one global Local-or-Groq generation mode
      When the user activates Analyze once
      Then one fresh non-persistent browser context inspects the entire top-level document in its current rendered state at the configured readiness condition and excludes iframe documents from the scan scope
      And the scan executes exactly "image-alt", "label", and "color-contrast"
      And one complete visible results list groups every returned violation-node Finding by those three rules
      And where results are interpreted, the interface shows the normalized analyzed page identity, one concise exact-three-check and non-certification limitation, and one overview derived from the complete Finding and ScannerReviewObservation collections
      And every Finding uses its whole card as the evidence-selection button and shows a stable human-readable label, concise affected-element summary, programmatic selected state, and direct complete rule-specific evidence without a redundant action label
      And native incomplete observations appear in the same three check groups as Findings with a visible "Needs manual review" tag, a plain-language task, and relevant retained evidence while remaining distinct from Findings
      And the complete three-group Findings collection is presented in one named, visibly bounded, keyboard-focusable panel with a deterministic maximum height and its own vertical scrolling at wide, narrow, and 200-percent zoom presentations
      And deterministic scan Results omit run context, scan context, lifecycle fields, mode, provider, model, no-call text, raw coverage tables, internal Finding IDs, and native check-group names while preserving their canonical data internally
      And a complete zero result is shown only after all three rules complete
      And the parent scan fails visibly, without a completed zero or partial success, when page loading fails, a timeout occurs, a fatal top-level failure in scanner execution, coverage validation, result validation, or evidence capture prevents the complete bounded collection, or the initial complete aggregate cannot be durably written
      And a missing, invalid, or withheld individual allowlisted fact preserves its Finding or ScannerReviewObservation with the concise category or sufficiency reason required by REQ-SCAN-005 instead of failing the parent scan or dropping the item
      And the temporary page, context, and managed browser are closed
      And no provider is invoked by scanning
      And the interface states that the three checks do not establish accessibility, compliance, or certification

    Scenario: Reject unsupported target input before analysis
      Given the submitted target is malformed, contains embedded URL credentials, or uses an unsupported scheme
      When the user activates Analyze
      Then the local service rejects the input with a bounded reason before creating a PageAnalysisRun or starting browser navigation
      And no scan, retrieval, or provider call begins
      And the rejection makes no hostile-target or private-network safety claim

    Scenario: Require an explicit generation mode without ready-state explanation
      Given the Analyze form has no generation mode selected
      And the form shows no selected-mode, model, provider, endpoint, or egress explanation
      When the user activates Analyze with a valid HTTPS target
      Then the form shows "Choose Local or Groq." associated with the generation-mode group
      And no PageAnalysisRun, scan, retrieval, probe, or provider call begins
      When the user selects Local or Groq
      Then the mode validation is removed
      And a known missing Local model or fixed Groq-adapter API URL may show only its nonblocking configuration message

  @SPEC-002 @BHV-02 @REQ-EVID-004 @REQ-EVID-007 @REQ-RETR-001 @REQ-RETR-002 @REQ-RETR-005 @ADR-0022
  Rule: Inspect one Finding and its retrieved guidance

    Scenario: Retrieve guidance for only the selected Finding
      Given a complete scan contains independently addressable Findings
      When the user selects one Finding
      And the application retrieves guidance from the curated corpus
      Then the view keeps its minimized scanner evidence separate from guidance
      And the retrieval identifies its corpus version and support state
      And support is "missing" for zero applicable resolved passages, "incomplete" when some applicable guidance resolves but a required role is absent, "conflicting" for an unresolved curator-declared material conflict, and "supported" only when all required roles resolve without such a conflict
      And every material citation resolves to an exact versioned source passage, section, and URL
      And no sibling Finding or arbitrary page-level content enters the query

  @SPEC-003 @BHV-03 @REQ-RETR-004 @REQ-GEN-001 @REQ-GEN-002 @REQ-GEN-003 @REQ-GEN-004 @REQ-GEN-005 @REQ-GEN-009 @REQ-GEN-010 @REQ-LLM-008 @REQ-SEC-015
  Rule: Generate one grounded proposal or abstain before invocation

    Scenario: Generate one eligible proposal
      Given the selected Finding has complete required evidence
      And its completed retrieval is "supported"
      When the user explicitly starts generation
      Then model-visible generation content contains only that Finding's permitted minimized facts, required guidance passages, and the application-owned instructions and output contract
      And the adapter-owned protocol envelope adds only the fixed destination and exact model routing, strict structured-output schema, bounded material generation controls, and required transport authentication, with no arbitrary metadata, custom headers, or user-controlled protocol values
      And the returned candidate must pass structure, evidence-reference, citation-resolution, and prohibited-claim validation
      And a valid proposal states its finding summary, user-impact explanation, remediation approach, citations, evidence sufficiency, confidence, uncertainty, assumptions, blocking pre-acceptance manual judgment, and non-blocking post-change verification reminder
      And the proposal enters pending review only for that Finding

    Scenario: Abstain when evidence or guidance is insufficient
      Given the selected Finding remains visible
      And its required evidence is incomplete or its completed retrieval support state is "incomplete", "missing", or "conflicting"
      When the application applies the deterministic evidence-sufficiency gate
      Then the selected Finding detail shows a terminal application-authored abstention
      And the abstention record references its available evidence and any retrieval result
      And the detail clearly states the applicable sufficiency state, missing or conflicting information, abstention reason, confirmation that no provider was called, and manual-investigation guidance
      And the abstention does not duplicate referenced records or contain a remediation conclusion
      And no ProviderInvocation or approve/edit-and-accept/reject review decision is created
      And sibling Finding states remain unchanged

    Scenario: Fail retrieval without assigning a support state
      Given the selected Finding remains visible
      When retrieval execution or passage-integrity validation fails
      Then that Finding workflow fails with no retrieval support state
      And the result is not recorded as an evidence-sufficiency abstention
      And no ProviderInvocation or approve/edit-and-accept/reject review decision is created
      And the completed scan, minimized evidence, and sibling Finding states remain unchanged

    Scenario: Fail before invocation when required input does not fit
      Given the selected Finding has complete required evidence and "supported" retrieval
      But its required evidence, guidance, citations, or system constraints cannot fit without truncation
      When the application checks context fit
      Then that Finding workflow fails before provider invocation with a content-safe limiting-capability reason
      And the result is not recorded as an evidence-sufficiency abstention
      And the completed scan, minimized evidence, and sibling Finding states remain unchanged

  @SPEC-004 @BHV-04 @REQ-GEN-008 @REQ-LLM-002 @REQ-LLM-003 @REQ-LLM-004 @REQ-LLM-005 @REQ-LLM-007 @REQ-LLM-009 @REQ-LLM-019 @REQ-LLM-021 @REQ-SEC-004 @REQ-SEC-016 @ADR-0014 @ADR-0020 @ADR-0023
  Rule: One explicit provider mode applies to the whole analysis

    Scenario: Use one mode without mixing or fallback
      Given the PageAnalysisRun began in an explicitly selected Local or Groq mode
      And provider disclosure and the selected provider and exact model become visible when generation becomes relevant
      And the run context records that immutable mode, provider, and exact model without treating the configuration as a ProviderInvocation
      And one selected Finding is eligible for generation
      When the user explicitly starts that Finding's invocation
      Then only the selected adapter and provider receive the permitted minimized package for that one Finding
      And the attempted call creates one nested ProviderInvocation that references the run provider/model context and the owning Finding's corpus and cited-passage context and records the adapter identifier/version, non-secret endpoint identity, bounded material generation parameters, prompt/output-contract provenance, non-secret outcome, and validation result
      And request time, runtime/model revision, and safe usage metadata are recorded only when available, while credentials, raw request/response payloads, hidden reasoning, and new child identifiers are excluded
      And retrieval in either mode embeds corpus and privacy-safe query text only through the approved loopback model, keeps vectors in process, and uses no hosted embedding or vector service
      And Local generation exchanges prompts and responses only through the approved loopback runtime while Groq uses only its accepted minimized external payload
      And mode selection changes none of the scanner, corpus snapshot, embedding, retrieval, evidence, or validation configuration
      And the run's provider and model remain unchanged

    Scenario: Fail before invocation when the selected prerequisite is missing
      Given one selected Finding is eligible for generation in the run's immutable mode
      When the user starts generation but that mode's fixed runtime, model, adapter configuration, or credential prerequisite is missing
      Then that Finding workflow shows a bounded missing-prerequisite failure before any provider request
      And no ProviderInvocation or proposal-review decision is created
      And the completed scan, minimized evidence, and sibling Finding states remain unchanged
      And there is no automatic retry, provider change, or fallback
      And any later attempt uses the ordinary Analyze flow to create a new independent PageAnalysisRun with a new explicit global mode choice

    Scenario: Keep an attempted-call failure bounded and visible
      Given one selected Finding is eligible and the selected mode's fixed prerequisites are present
      When one provider call is attempted and authentication, quota or rate limit, network or provider, or response-validation failure occurs
      Then its nested ProviderInvocation retains the compact non-secret actual-call provenance
      And that Finding workflow shows the applicable bounded failure category without a proposal-review decision
      And the completed scan, minimized evidence, and sibling Finding states remain unchanged
      And there is no automatic retry, provider change, or fallback
      And any later attempt, or use of the other provider, requires the ordinary Analyze flow and a new independent PageAnalysisRun with a new explicit global mode choice

  @SPEC-005 @BHV-05 @REQ-GEN-002 @REQ-REV-001 @REQ-REV-008 @REQ-REV-009
  Rule: A person decides each proposal independently

    Scenario Outline: Record one permitted review decision
      Given one validated proposal is pending review for one Finding
      When the reviewer chooses "<decision>"
      Then the review result is "<result>"
      And the original proposal remains distinguishable from reviewer-authored content
      And approval or edit-and-accept is permitted only after the reviewer confirms that every material claim in the resulting proposal has the required support from cited guidance, recorded scanner evidence, or both
      And any unsupported material claim must be resolved through the submitted edit or the proposal is rejected
      And the blocking pre-acceptance manual judgment is recorded
      And approval or edit-and-accept is permitted only when that judgment supports the resulting proposal or is explicitly not applicable with a reason
      And an unresolved or contradictory judgment must be resolved through the submitted edit or the proposal is rejected
      And the post-change verification reminder remains visible but is not completed during this review and does not block the decision
      And the action and decision timestamp are recorded
      And no sibling Finding changes state

      Examples:
        | decision        | result                            |
        | approve         | the original proposal is accepted |
        | edit and accept | the reviewer edit is accepted      |
        | reject          | no remediation plan is accepted    |

  @SPEC-006 @BHV-06 @REQ-EVID-010 @REQ-COMP-004 @REQ-COMP-005 @REQ-COMP-006 @REQ-COMP-007 @REQ-COMP-008
  Rule: Compare two complete runs conservatively

    Scenario Outline: Classify evidence conservatively
      Given a complete baseline run and a complete later run
      When the comparison observes "<condition>"
      Then the comparison result is "<outcome>"
      And it shows pair comparability, rationale, and all available evidence, plus a target-match disposition only when the pair is comparable and a current target reference and after-evidence only when one unique later target matches
      And a missing, changed, duplicate, or ambiguous later match is inconclusive without a fabricated current target or after-evidence
      And a materially mismatched pair is not comparable and performs no target correlation
      And proposal state, review decisions, and manual judgments are context only; they neither gate nor alter comparability or the outcome
      And it states limitations and any non-blocking post-change verification reminders
      And it makes no accessibility, conformance, certification, or remediation-causality claim
      And any later-only unmatched Finding remains visible without a "new" or "regressed" classification

      Examples:
        | condition                                                                                          | outcome        |
        | one public-page baseline Finding has a unique exact same-rule-and-locator later non-failing match | resolved       |
        | one uniquely matched exact-rule-and-locator color-contrast baseline Finding has a higher comparable failing margin | improved   |
        | one uniquely matched exact-rule-and-locator image-alt or label baseline Finding remains failing, or one such contrast match has an equal failing margin | persistent |
        | one uniquely matched exact-rule-and-locator color-contrast baseline Finding has a lower comparable failing margin | regressed  |
        | the later target is missing or changed, or the rule-and-locator match is duplicate or otherwise ambiguous | inconclusive |
        | the page or scan profiles differ materially                                                       | not comparable |

  @SPEC-007 @BHV-07 @REQ-EVID-011 @REQ-COMP-006 @REQ-QUAL-002 @REQ-QUAL-010 @REQ-UX-014 @ADR-0021 @OD-026
  Rule: Preserve earlier local evidence

    Scenario: Preserve completed evidence after downstream work
      Given a completed PageAnalysisRun is stored in one local "run.json" with a top-level format version
      When retrieval, generation, review, comparison, or bounded failure data is recorded
      Then the completed scan evidence and every sibling Finding's data remain unchanged
      And the completed scan, minimized evidence, and downstream state remain durable
      And every application-owned read of "run.json" validates it before the stored work is used
      And another analysis uses an independent run identifier
      And an intentional rescan may reference the baseline run identifier
      And the MVP exposes no manual Run ID, retained-run reopen, deep-link load, or automatic reload-restoration action

  @SPEC-008 @BHV-08 @REQ-EVID-004 @REQ-GEN-003 @REQ-GEN-004 @REQ-GEN-005 @REQ-GEN-006 @REQ-COMP-005 @REQ-UX-002
  Rule: Keep evidence layers and limitations understandable

    Scenario: Present bounded evidence without automatic remediation claims
      Given a Finding has scanner evidence, retrieved guidance, AI interpretation, and human work
      When the user inspects its workflow or comparison
      Then each information source and human decision is visibly distinguished without relying only on color
      And evidence sufficiency remains distinct from model confidence
      And blocking pre-acceptance judgments, non-blocking post-change verification reminders, and limitations remain visible
      And the product does not claim certification, legal compliance, whole-page conformance, or complete success-criterion conformance or non-conformance
      And it does not modify or claim to have modified source code automatically
