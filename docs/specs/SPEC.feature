# Status: Proposed derived planning specification; specified, not executed.
# Authority: Derived from the canonical requirements, operating decisions,
# and accepted ADRs linked from docs/specs/README.md.
# This file creates no requirement or decision and is not implementation,
# an executable test, acceptance evidence, or proof that a scenario passes.

@SPEC @planned
Feature: Evidence-first accessibility analysis for one authorized public page
  A frontend developer analyzes one authorized public HTTPS page with three
  deterministic accessibility rules, can inspect any resulting finding, and
  processes one selected finding at a time through evidence, retrieval,
  generation or abstention, human review, and later comparison.
  Open implementation values remain governed by their owning authorities.

  @SPEC-001 @BHV-01 @REQ-INST-002 @REQ-INST-005 @ADR-0015
  Rule: The developer can start and reach the local application

    Scenario: Open a ready local application
      Given the developer has started the application-owned local service
      And the service reports its enumerated loopback address as ready
      When the developer opens that address in an installed Chrome or Edge browser
      Then the browser displays the A11y Evidence Lab interface
      And the browser remains an unprivileged interface to the local service
      And deterministic scanning remains available without invoking a generation provider
      And the service provides a clean stop path

    Scenario: Show a visible startup failure
      Given the local service cannot reach its required startup readiness
      When the developer starts the service
      Then the service reports a visible startup failure
      And it does not report a ready application address

  @SPEC-002 @BHV-01 @REQ-AUTH-005 @REQ-AUTH-006 @REQ-SCAN-001 @REQ-SCAN-006 @REQ-SCAN-007 @REQ-UX-010 @OD-020 @ADR-0017
  Rule: The user can analyze one authorized page and see every supported finding

    Scenario Outline: Start one provider-independent page analysis
      Given the local application is ready
      And the user is authorized to analyze one non-authenticated public HTTPS page
      When the user enters that page URL
      And the user attests that the page is authorized for this analysis
      And the user selects the global "<mode>" generation mode
      And the user activates Analyze once
      Then the application creates one PageAnalysisRun for that page
      And one scan evaluates exactly "image-alt", "label", and "color-contrast"
      And provider selection does not invoke a model or alter the deterministic scan

      Examples:
        | mode  |
        | Local |
        | Groq  |

    Scenario: List every finding reported by the three supported rules
      Given a complete scan reports violation nodes for one or more supported rules
      When the application presents the scan results
      Then every reported violation node appears as an independent finding in one list
      And findings from all three supported rules may appear in that list
      And the list groups findings by supported rule
      And no finding is merged, suppressed, or replaced by a page-level summary
      And each item shows a stable label, rule, target summary, workflow status, and detail action
      And each finding remains independently selectable for later workflow steps
      And native scanner incomplete observations appear separately from findings

    Scenario: Present a complete scan with no findings
      Given the scanner completed the exact three-rule collection within the accepted boundary
      And none of the three supported rules reported a violation node
      When the application presents the scan results
      Then it shows a complete result with zero findings
      And it keeps any native scanner incomplete observations separately visible
      And it does not present the zero count as proof of accessibility or conformance

    Scenario: Keep an incomplete scan distinct from a complete result
      Given the accepted scan boundary cannot establish complete three-rule collection
      When the scan operation ends
      Then the application shows a failed or coverage-incomplete scan state
      And it does not publish a complete zero-finding or partial finding list
      And the scan failure does not invoke a generation provider

  @SPEC-003 @BHV-02 @REQ-EVID-004 @REQ-EVID-007 @REQ-EVID-008 @REQ-RETR-001 @REQ-RETR-002 @REQ-RETR-005
  Rule: The user can inspect one finding's evidence and supporting guidance

    Scenario: Inspect minimized deterministic evidence for one finding
      Given a complete scan contains an independent finding
      When the user selects that finding
      Then the application shows its supported rule and scanner observation
      And it shows the minimized rule-specific evidence retained for that finding
      And it shows the finding and scan provenance needed to interpret the evidence
      And it shows the run's immutable global provider context
      And it shows whether that finding has a ProviderInvocation
      And it keeps the deterministic evidence separate from later guidance and interpretation

    Scenario: Retrieve and inspect versioned guidance for one finding
      Given the user selected one finding with its minimized evidence
      When the application retrieves guidance from the curated corpus
      Then the result identifies its corpus snapshot and support state
      And each retrieved passage preserves its source, version, section, and URL
      And the user can inspect the exact passage supporting a material citation
      And the retrieval contains no sibling finding or combined page-level query

    Scenario: Distinguish retrieval execution failure from unsupported guidance
      Given the selected finding and its minimized evidence are retained
      When retrieval fails before producing a completed guidance-support state
      Then the selected finding workflow shows a retrieval failure
      And it records neither a guidance-support state nor evidence-sufficiency abstention
      And it preserves the completed scan, minimized evidence, and sibling finding states
      And it does not invoke a generation provider

  @SPEC-004 @BHV-02 @BHV-03 @REQ-RETR-004 @REQ-GEN-002 @REQ-GEN-003 @REQ-GEN-004 @REQ-GEN-005 @REQ-GEN-010
  Rule: One selected finding can produce a grounded proposal or deterministic abstention

    Scenario: Generate one evidence-supported remediation proposal
      Given the selected finding has complete required evidence
      And its completed retrieval has the support state "supported"
      When the user explicitly starts generation for that finding
      Then only that finding's minimized evidence and supporting guidance enter generation
      And the application validates the returned proposal before review
      And the proposal identifies the finding summary and evidence references
      And the proposal contains a user-impact explanation and remediation approach
      And the proposal contains material citations, categorical confidence, and uncertainty
      And the proposal states assumptions and required manual checks
      And the proposal enters pending review for only that finding

    Scenario Outline: Abstain before provider invocation when support is insufficient
      Given the selected finding remains visible with its deterministic evidence
      And its generation eligibility is "<condition>"
      When the application evaluates whether generation may proceed
      Then it records deterministic abstention for that finding
      And it records the reason and required manual-review direction
      And it creates no provider invocation provenance for that finding
      And it creates no remediation conclusion
      And sibling findings keep their independent states

      Examples:
        | condition                    |
        | required evidence incomplete |
        | guidance incomplete         |
        | guidance missing            |
        | guidance conflicting        |

  @SPEC-005 @BHV-04 @REQ-LLM-002 @REQ-LLM-005 @REQ-LLM-006 @REQ-LLM-018 @REQ-SEC-005 @REQ-SEC-016 @ADR-0014
  Rule: One explicit generation mode applies to the whole analysis

    Scenario Outline: Use the selected mode for each eligible finding invocation
      Given the user started the PageAnalysisRun in "<mode>" mode
      And the run contains more than one independently eligible finding
      When the user explicitly starts generation for each selected finding in turn
      Then every invocation in that run uses the adapter identified as "<adapter>"
      And the global mode remains unchanged throughout the run
      And each invocation contains only its one selected finding

      Examples:
        | mode  | adapter                       |
        | Local | configured local-model adapter |
        | Groq  | approved Groq adapter         |

    Scenario: Confirm the local disclosure before one local invocation
      Given the PageAnalysisRun uses Local mode
      And the selected finding is eligible for generation
      When the user prepares to invoke the configured local model for that finding
      Then the application identifies Local mode and the exact selected model
      And it states that model input remains within the approved local generation boundary
      And it states that no hosted fallback is available
      And the user explicitly starts that finding-specific invocation

    Scenario: Confirm the Groq disclosure before one remote invocation
      Given the PageAnalysisRun uses Groq mode
      And the selected finding is eligible for generation
      When the user prepares to invoke Groq for that finding
      Then the application identifies Groq, the exact model, and the destination
      And it identifies the minimized evidence and guidance categories to be sent
      And it identifies provider-controlled service and retention conditions
      And it identifies credential handling and bounded failure behavior
      And the user explicitly starts that finding-specific invocation

    Scenario: Keep provider or input-fit failure visible without changing modes
      Given one selected finding is ready for an explicit generation attempt
      When provider readiness, safe input fit, execution, or response validation fails
      Then that selected finding workflow shows a distinguishable failure
      And the failure is not reported as evidence-sufficiency abstention
      And the completed scan, minimized evidence, and sibling finding states remain available
      And no automatic retry or cross-provider fallback occurs
      And retry, regeneration, or provider change requires a new linked PageAnalysisRun

  @SPEC-006 @BHV-05 @REQ-REV-001 @REQ-REV-008 @OD-020
  Rule: A person decides each generated proposal independently

    Scenario: Approve the original proposal
      Given one validated proposal is pending review for one finding
      When the reviewer approves the original proposal
      Then that proposal becomes the accepted remediation plan for its finding
      And the decision records its action and timestamp
      And no sibling finding changes state

    Scenario: Edit and accept a proposal
      Given one validated proposal is pending review for one finding
      When the reviewer edits the proposal and explicitly accepts the edited successor
      Then the reviewer-authored successor becomes the accepted remediation plan
      And the original AI proposal remains distinguishable from the accepted edit
      And the decision records its action and timestamp
      And the decision applies only to that finding

    Scenario: Reject a proposal
      Given one validated proposal is pending review for one finding
      When the reviewer rejects the proposal
      Then no accepted remediation plan is created from that proposal
      And the original proposal and rejection feedback remain identifiable
      And the decision records its action and timestamp
      And the rejection remains evaluation feedback rather than automatic ground truth
      And the rejection applies only to that finding

  @SPEC-007 @BHV-06 @REQ-COMP-004 @REQ-COMP-005 @REQ-COMP-007 @REQ-COMP-008 @OD-019 @OD-020
  Rule: The user can rescan and compare evidence conservatively

    Scenario: Create a distinct later scan for comparison
      Given a baseline PageAnalysisRun contains a complete scan
      And the authorized page may have changed since that scan
      When the user starts another analysis of the page
      Then the application creates a distinct immutable PageAnalysisRun
      And comparison first determines whether the two complete scans are comparable

    Scenario Outline: Classify one correlated finding from comparable scans
      Given the baseline and later scans are comparable
      And one supported target has the evidence transition "<transition>"
      When the application compares that target's deterministic evidence
      Then the finding comparison outcome is "<outcome>"
      And the result shows its correlation rationale and before-and-after evidence
      And the result states its limitations and required follow-up checks
      And the result does not claim that the page is accessible or conformant

      Examples:
        | transition                                                | outcome      |
        | image or label violation to complete later rule coverage and one unique same-target native non-failing observation | resolved |
        | contrast violation to complete later rule coverage and one unique same-target native non-failing observation | resolved |
        | image or label violation to correlated violation          | persistent  |
        | correlated non-failing evidence to violation              | regressed   |
        | contrast violation to a higher still-failing contrast margin | improved  |
        | contrast violation to an equal failing contrast margin    | persistent  |
        | contrast violation to a lower failing contrast margin     | regressed   |
        | insufficient evidence for a unique correlation            | inconclusive |
        | baseline violation absent later without its required positive observation | inconclusive |
        | later-only finding without a unique baseline counterpart  | inconclusive |

    Scenario: Decline a comparison for materially different scans
      Given two complete scans differ in a material comparability property
      When the application evaluates the scan pair
      Then the pair result is "not comparable"
      And no child finding outcome is inferred for that pair

    Scenario: Decline comparison when a source scan is incomplete
      Given either source scan is invalid or coverage-incomplete
      When the application attempts to compare the scans
      Then the comparison operation fails visibly
      And it emits no pair or child comparison outcome

  @SPEC-008 @BHV-07 @REQ-EVID-001 @REQ-EVID-006 @REQ-QUAL-012 @ADR-0016
  Rule: The user can preserve and reopen immutable local run history

    Scenario: Reopen a completed local run
      Given a PageAnalysisRun was durably completed and retained locally
      When the user reopens that run
      Then the application reconstructs its validated complete scan
      And it shows the complete finding collection and scanner review observations
      And it shows each processed finding's independent workflow state
      And optional derived reporting does not replace the canonical structured record

    Scenario: Repeat an analysis without overwriting prior evidence
      Given an earlier PageAnalysisRun exists for a page
      When the user starts another analysis of that page
      Then the application creates a new linked PageAnalysisRun
      And the earlier scan, evidence, proposal, review, and comparison records remain unchanged

  @SPEC-009 @BHV-08 @REQ-EVID-004 @REQ-GEN-005 @REQ-GEN-006 @REQ-UX-002 @REQ-UX-003 @REQ-UX-010 @REQ-UX-011 @REQ-COMP-005
  Rule: The interface keeps evidence layers and limitations understandable

    Scenario: Distinguish each source of information
      Given a selected finding has evidence, retrieved guidance, an AI proposal, and human review
      When the user inspects that finding workflow
      Then deterministic page evidence is identified as scanner evidence
      And retrieved passages are identified as curated guidance
      And evidence sufficiency is identified separately from model confidence
      And generated explanation and remediation are identified as AI interpretation
      And reviewer edits, decisions, and manual checks are identified as human work
      And those distinctions do not rely only on color

    Scenario: Present bounded outcomes without certification claims
      Given the application displays findings, proposals, or comparison outcomes
      When the user interprets the displayed result
      Then the interface states the supported three-rule and main-document scope
      And it states material evidence, coverage, and manual-check limitations
      And it does not claim accessibility certification, legal compliance, or whole-page conformance
      And it does not represent a proposal as an automatic source-code change

  @SPEC-010 @controlled_evaluation @REQ-SCAN-002 @REQ-SCAN-004 @REQ-EVAL-001 @REQ-EVAL-003 @REQ-EVAL-006 @REQ-EVAL-009 @OD-019 @OD-020
  Rule: The portfolio uses three controlled profiles as its fixed evaluation baseline

    Scenario Outline: Preserve each supported profile and its primary guidance mapping
      Given the controlled profile "<profile>" has the failing state "<failingState>"
      And it has the corrected state "<correctedState>"
      When its failing state is scanned with the exact three-rule profile
      Then its intended target produces a deterministic "<rule>" finding
      When its corrected state is scanned under the same material profile
      Then its intended target has the required native non-failing observation
      And the retained evidence identifies "<evidence>"
      And the profile retrieves guidance for WCAG 2.2 "<criterion>"
      And human review addresses "<manualJudgment>"
      And the automated result is not treated as a complete success-criterion determination

      Examples:
        | profile               | failingState                              | correctedState                                  | rule           | evidence                                                                         | criterion | manualJudgment                                                        |
        | informative-image-alt | informative image without a text alternative | same image with a context-appropriate alternative | image-alt      | image and text-alternative facts                                                  | 1.1.1     | the image purpose, context, and equivalent alternative                           |
        | form-input-label      | input without an accessible label          | same input with an associated visible label     | label          | input type and accessible-name association facts without the input value          | 4.1.2     | label clarity, accuracy, association, and any required instructions               |
        | text-contrast         | normal text with a native failing contrast result | same target with a native non-failing result | color-contrast | foreground, background, measured and expected ratios, font size, and font weight | 1.4.3     | text classification, exceptions, background assumptions, and omitted states      |

    Scenario Outline: Exercise each happy generation case in each accepted mode
      Given the controlled "<profile>" package is eligible for generation
      When that package is evaluated once in "<mode>" mode
      Then the result uses the shared application-owned proposal contract
      And the observation is reported only for that exact configuration
      And it is not used to rank providers or claim release qualification

      Examples:
        | profile               | mode  |
        | informative-image-alt | Local |
        | form-input-label      | Local |
        | text-contrast         | Local |
        | informative-image-alt | Groq  |
        | form-input-label      | Groq  |
        | text-contrast         | Groq  |
