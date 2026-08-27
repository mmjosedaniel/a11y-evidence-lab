# Status: Proposed derived planning specification; specified, not executed.
# Authority: The linked requirements and decisions control every scenario.
# This file is not implementation, an executable test, acceptance evidence,
# development authorization, or proof that a scenario passes.

@SPEC @planned
Feature: Evidence-first accessibility analysis for one trusted public page
  A frontend developer scans one deliberately supplied public HTTPS page with
  three deterministic rules and processes one selected Finding at a time
  through evidence, retrieval, generation or abstention, human review, and
  later comparison.

  @SPEC-001 @BHV-01 @REQ-AUTH-007 @REQ-AUTH-008 @REQ-SCAN-006 @REQ-SCAN-007 @OD-021 @ADR-0018
  Rule: Analyze one trusted page and show the complete supported result

    Scenario: Complete one provider-independent page analysis
      Given the developer-started local application is ready
      And the developer chose one public HTTPS page they are permitted and willing to trust
      And the user selected one global Local-or-Groq generation mode
      When the user activates Analyze once
      Then one fresh non-persistent browser context loads only that main document
      And the scan executes exactly "image-alt", "label", and "color-contrast"
      And every returned violation node appears as an independent Finding
      And native incomplete observations remain separate from Findings
      And a complete zero result is shown only after all three rules complete
      And loading, timeout, scanner, validation, or collection failure never appears as a complete zero or partial result
      And the temporary page, context, and managed browser are closed
      And no provider is invoked by scanning
      And the interface states that crawling, authenticated targets, hostile targets, and whole-page conformance claims are unsupported

  @SPEC-002 @BHV-02 @REQ-EVID-004 @REQ-EVID-007 @REQ-RETR-001 @REQ-RETR-002 @REQ-RETR-005
  Rule: Inspect one Finding and its retrieved guidance

    Scenario: Retrieve guidance for only the selected Finding
      Given a complete scan contains independently addressable Findings
      When the user selects one Finding
      And the application retrieves guidance from the curated corpus
      Then the view keeps its minimized scanner evidence separate from guidance
      And the retrieval identifies its corpus snapshot and support state
      And every material citation resolves to an exact versioned source passage, section, and URL
      And no sibling Finding or arbitrary page-level content enters the query

  @SPEC-003 @BHV-03 @REQ-RETR-004 @REQ-GEN-002 @REQ-GEN-003 @REQ-GEN-004 @REQ-GEN-005 @REQ-GEN-010
  Rule: Generate one grounded proposal or abstain before invocation

    Scenario: Generate one eligible proposal
      Given the selected Finding has complete required evidence
      And its completed retrieval is "supported"
      When the user explicitly starts generation
      Then one provider invocation contains only that Finding's minimized evidence and supporting guidance
      And the returned candidate must pass structure, evidence-reference, citation, grounding, and prohibited-claim validation
      And a valid proposal states its explanation, remediation approach, citations, uncertainty, assumptions, and required manual checks
      And the proposal enters pending review only for that Finding

    Scenario Outline: Abstain when evidence or guidance is insufficient
      Given the selected Finding remains visible
      And generation eligibility is "<condition>"
      When the application applies the deterministic evidence-sufficiency gate
      Then the Finding records abstention and its manual-review direction
      And no provider invocation or remediation conclusion is created
      And sibling Finding states remain unchanged

      Examples:
        | condition                    |
        | required evidence incomplete |
        | guidance incomplete          |
        | guidance missing             |
        | guidance conflicting         |

  @SPEC-004 @BHV-04 @REQ-LLM-002 @REQ-LLM-003 @REQ-LLM-004 @REQ-LLM-005 @REQ-LLM-009 @REQ-LLM-019 @REQ-LLM-020 @ADR-0014 @ADR-0020
  Rule: One explicit provider mode applies to the whole analysis

    Scenario Outline: Use one mode without mixing or fallback
      Given the PageAnalysisRun began in "<mode>" mode after its one run-level disclosure
      And the selected provider and exact model remain visibly labeled
      And one selected Finding is eligible for generation
      When the user explicitly starts that Finding's invocation
      Then only the "<adapter>" adapter is used
      And the invocation contains no sibling Finding
      And the run's provider and model remain unchanged
      And no separate provider probe or repeated disclosure is required
      And any provider or response failure remains visible without automatic retry or fallback
      And selecting the other provider requires a new PageAnalysisRun

      Examples:
        | mode  | adapter                        |
        | Local | configured local-model adapter |
        | Groq  | approved Groq adapter          |

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

    Scenario Outline: Classify only adequately correlated evidence
      Given a complete baseline run and a complete later run
      When the comparison observes "<transition>"
      Then the comparison result is "<outcome>"
      And it shows the matching rationale and before-and-after evidence
      And it states limitations and required follow-up checks
      And it makes no accessibility, conformance, certification, or remediation-causality claim

      Examples:
        | transition                                                   | outcome        |
        | a violation followed by a unique same-target non-failing observation | resolved |
        | a contrast failure followed by a higher comparable failing margin | improved |
        | the same correlated failure in both runs                     | persistent     |
        | a retained non-failing observation followed by a violation   | regressed      |
        | missing or ambiguous target evidence                         | inconclusive   |
        | a material page or scan-profile mismatch                     | not comparable |

  @SPEC-007 @BHV-07 @REQ-EVID-011 @REQ-QUAL-002 @REQ-QUAL-010 @REQ-QUAL-012 @ADR-0021
  Rule: Preserve earlier local evidence

    Scenario: Reopen one aggregate without overwriting an earlier run
      Given a completed PageAnalysisRun is stored in one versioned local "run.json"
      When a downstream stage fails or the user starts another analysis or an intentional rescan
      Then the completed scan, minimized evidence, and sibling states remain available
      And another analysis uses an independent run identifier
      And an intentional rescan may reference the baseline run identifier
      And reopening validates "run.json" before presenting it
      And no child file, Markdown report, retry graph, or audit history is required

  @SPEC-008 @BHV-08 @REQ-EVID-004 @REQ-GEN-005 @REQ-GEN-006 @REQ-COMP-005
  Rule: Keep evidence layers and limitations understandable

    Scenario: Present bounded evidence without automatic remediation claims
      Given a Finding has scanner evidence, retrieved guidance, AI interpretation, and human work
      When the user inspects its workflow or comparison
      Then each information source is visibly distinguished
      And evidence sufficiency remains distinct from model confidence
      And required manual checks and limitations remain visible
      And the product does not claim certification, legal compliance, whole-page conformance, or complete success-criterion conformance or non-conformance
      And it does not modify or claim to have modified source code automatically

  @SPEC-009 @controlled_evaluation @REQ-EVAL-001 @REQ-EVAL-006 @REQ-EVAL-008 @REQ-EVAL-009
  Rule: The fixed evaluation contains exactly six generation executions

    Scenario Outline: Exercise each controlled profile in each accepted mode
      Given the frozen controlled "<profile>" package is eligible for generation
      When it is evaluated once in "<mode>" mode
      Then the shared application-owned proposal contract is used
      And the result is attributed only to that exact configuration
      And the result is not used to rank providers or claim release qualification

      Examples:
        | profile               | mode  |
        | informative-image-alt | Local |
        | form-input-label      | Local |
        | text-contrast         | Local |
        | informative-image-alt | Groq  |
        | form-input-label      | Groq  |
        | text-contrast         | Groq  |
