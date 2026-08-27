# Status: Proposed derived planning specification; specified, not executed.
# Authority: The linked requirements and decisions control every scenario.
# This file is not implementation, an executable test, acceptance evidence,
# development authorization, or proof that a scenario passes.

@SPEC @planned
Feature: Evidence-first accessibility analysis for one trusted public page
  A frontend developer scans one deliberately supplied public HTTPS page with
  three deterministic rules. The application captures minimized evidence for
  every Finding, then processes one selected Finding at a time through
  retrieval, generation or abstention, human review, and later comparison.

  @SPEC-001 @BHV-01 @REQ-AUTH-007 @REQ-AUTH-008 @REQ-SCAN-006 @REQ-SCAN-007 @REQ-UX-004 @REQ-UX-005 @REQ-UX-010 @REQ-UX-012 @OD-021 @ADR-0018
  Rule: Analyze one trusted page and show the complete supported result

    Scenario: Complete one provider-independent page analysis
      Given the developer-started local application is ready
      And the developer chose one public HTTPS page they are permitted and willing to trust
      And the user selected one global Local-or-Groq generation mode
      When the user activates Analyze once
      Then one fresh non-persistent browser context inspects only that top-level main document and excludes iframe documents from the scan scope
      And the scan executes exactly "image-alt", "label", and "color-contrast"
      And one complete visible results list groups every returned violation-node Finding by those three rules
      And every Finding shows a stable label, rule, target summary, workflow status, and detail action
      And native incomplete observations appear in a clearly distinct group rather than as Findings
      And a complete zero result is shown only after all three rules complete
      And loading, timeout, scanner, validation, or collection failure remains visible and never appears as a completed zero or partial success
      And the temporary page, context, and managed browser are closed
      And no provider is invoked by scanning
      And the interface states that crawling, authenticated targets, hostile targets, and whole-page conformance claims are unsupported

  @SPEC-002 @BHV-02 @REQ-EVID-004 @REQ-EVID-007 @REQ-RETR-001 @REQ-RETR-002 @REQ-RETR-005 @ADR-0022
  Rule: Inspect one Finding and its retrieved guidance

    Scenario: Retrieve guidance for only the selected Finding
      Given a complete scan contains independently addressable Findings
      When the user selects one Finding
      And the application retrieves guidance from the curated corpus
      Then the view keeps its minimized scanner evidence separate from guidance
      And the retrieval identifies its corpus version and support state
      And every material citation resolves to an exact versioned source passage, section, and URL
      And no sibling Finding or arbitrary page-level content enters the query

  @SPEC-003 @BHV-03 @REQ-RETR-004 @REQ-GEN-001 @REQ-GEN-002 @REQ-GEN-003 @REQ-GEN-004 @REQ-GEN-005 @REQ-GEN-009 @REQ-GEN-010 @REQ-LLM-008
  Rule: Generate one grounded proposal or abstain before invocation

    Scenario: Generate one eligible proposal
      Given the selected Finding has complete required evidence
      And its completed retrieval is "supported"
      When the user explicitly starts generation
      Then the provider request contains only that Finding's permitted minimized evidence, supporting guidance, application-owned instructions and output contract, and non-secret request parameters and metadata
      And the returned candidate must pass structure, evidence-reference, citation-resolution, and prohibited-claim validation
      And a valid proposal states its finding summary, user-impact explanation, remediation approach, citations, evidence sufficiency, confidence, uncertainty, assumptions, and required manual checks
      And the proposal enters pending review only for that Finding

    Scenario: Abstain when evidence or guidance is insufficient
      Given the selected Finding remains visible
      And its required evidence is incomplete or its retrieval is not "supported"
      When the application applies the deterministic evidence-sufficiency gate
      Then the Finding records references to its available evidence and any retrieval result, the applicable sufficiency state, missing information, abstention reason, and manual-review direction
      And the abstention does not duplicate referenced records or contain a remediation conclusion
      And no provider invocation is created
      And sibling Finding states remain unchanged

    Scenario: Fail before invocation when required input does not fit
      Given the selected Finding has complete required evidence and "supported" retrieval
      But its required evidence, guidance, citations, or system constraints cannot fit without truncation
      When the application checks context fit
      Then that Finding workflow fails before provider invocation with a content-safe limiting-capability reason
      And the result is not recorded as an evidence-sufficiency abstention
      And the completed scan, minimized evidence, and sibling Finding states remain unchanged

  @SPEC-004 @BHV-04 @REQ-GEN-008 @REQ-LLM-002 @REQ-LLM-003 @REQ-LLM-004 @REQ-LLM-005 @REQ-LLM-009 @REQ-LLM-019 @REQ-LLM-020 @REQ-SEC-004 @ADR-0014 @ADR-0020 @ADR-0023
  Rule: One explicit provider mode applies to the whole analysis

    Scenario: Use one mode without mixing or fallback
      Given the PageAnalysisRun began in an explicitly selected Local or Groq mode after its one run-level disclosure
      And the selected provider and exact model remain visibly labeled
      And one selected Finding is eligible for generation
      When the user explicitly starts that Finding's invocation
      Then only the selected provider receives that one Finding
      And the actual call records its provider and model, material generation parameters, prompt/output-contract version, corpus version, owning Finding, and cited passage references without hidden reasoning or new child identifiers
      And retrieval in either mode embeds corpus and privacy-safe query text only through the approved loopback model, keeps vectors in process, and uses no hosted embedding or vector service
      And Local generation exchanges prompts and responses only through the approved loopback runtime while Groq uses only its accepted minimized external payload
      And mode selection changes none of the scanner, corpus snapshot, embedding, retrieval, evidence, or validation configuration
      And the run's provider and model remain unchanged
      And any provider or response failure remains visible without automatic retry or fallback
      And selecting the other provider requires a new PageAnalysisRun

  @SPEC-005 @BHV-05 @REQ-REV-001 @REQ-REV-008 @REQ-REV-009
  Rule: A person decides each proposal independently

    Scenario Outline: Record one permitted review decision
      Given one validated proposal is pending review for one Finding
      When the reviewer chooses "<decision>"
      Then the review result is "<result>"
      And the original proposal remains distinguishable from reviewer-authored content
      And every required manual judgment is recorded consistently with the chosen action
      And the action and decision timestamp are recorded
      And no sibling Finding changes state

      Examples:
        | decision        | result                            |
        | approve         | the original proposal is accepted |
        | edit and accept | the reviewer edit is accepted      |
        | reject          | no remediation plan is accepted    |

  @SPEC-006 @BHV-06 @REQ-EVID-010 @REQ-COMP-004 @REQ-COMP-005 @REQ-COMP-007 @REQ-COMP-008
  Rule: Compare two complete runs conservatively

    Scenario Outline: Classify evidence conservatively
      Given a complete baseline run and a complete later run
      When the comparison observes "<condition>"
      Then the comparison result is "<outcome>"
      And it shows the matching rationale and before-and-after evidence
      And it states limitations and required follow-up checks
      And it makes no accessibility, conformance, certification, or remediation-causality claim
      And any later-only unmatched Finding remains visible without a "new" or "regressed" classification

      Examples:
        | condition                                                                                          | outcome        |
        | one public-page baseline Finding has a unique exact same-rule-and-locator later non-failing match | resolved       |
        | one uniquely matched exact-rule-and-locator color-contrast baseline Finding has a higher comparable failing margin | improved   |
        | one uniquely matched exact-rule-and-locator image-alt or label baseline Finding remains failing, or one such contrast match has an equal failing margin | persistent |
        | one uniquely matched exact-rule-and-locator color-contrast baseline Finding has a lower comparable failing margin | regressed  |
        | target evidence is missing or the rule-and-locator match is not unique                            | inconclusive   |
        | the page or scan profiles differ materially                                                       | not comparable |

  @SPEC-007 @BHV-07 @REQ-EVID-011 @REQ-COMP-006 @REQ-QUAL-002 @REQ-QUAL-010 @ADR-0021
  Rule: Preserve earlier local evidence

    Scenario: Preserve and reopen completed evidence after downstream work
      Given a completed PageAnalysisRun is stored in one local "run.json" with a top-level format version
      When retrieval, generation, review, comparison, or bounded failure data is recorded
      Then the completed scan evidence and every sibling Finding's data remain unchanged
      And the completed scan, minimized evidence, and downstream state remain available when the user reopens that PageAnalysisRun
      And reading "run.json" validates it before presenting the stored work
      And another analysis uses an independent run identifier
      And an intentional rescan may reference the baseline run identifier

  @SPEC-008 @BHV-08 @REQ-EVID-004 @REQ-GEN-003 @REQ-GEN-004 @REQ-GEN-005 @REQ-GEN-006 @REQ-COMP-005 @REQ-UX-002
  Rule: Keep evidence layers and limitations understandable

    Scenario: Present bounded evidence without automatic remediation claims
      Given a Finding has scanner evidence, retrieved guidance, AI interpretation, and human work
      When the user inspects its workflow or comparison
      Then each information source and human decision is visibly distinguished without relying only on color
      And evidence sufficiency remains distinct from model confidence
      And required manual checks and limitations remain visible
      And the product does not claim certification, legal compliance, whole-page conformance, or complete success-criterion conformance or non-conformance
      And it does not modify or claim to have modified source code automatically
