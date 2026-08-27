# Status: Proposed derived planning hard specification; specified, not executed.
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

    Scenario: Keep analysis to one fresh main-document scan
      Given the developer supplies one valid public HTTPS URL they are permitted and willing to trust
      When the user starts one PageAnalysisRun
      Then exactly that main document is the scan target
      And a fresh non-persistent browser context imports no personal profile, cookies, credentials, or authentication state
      And the application does not follow links as targets, submit forms, upload files, permit downloads, deliberately interact with controls, or crawl
      And a finite timeout applies
      And the temporary page, context, and managed browser close after success or failure
      And the product makes no hostile-target, SSRF, or private-network safety claim

  @HS-004 @REQ-SCAN-006 @REQ-SCAN-007 @REQ-EVID-009 @REQ-QUAL-019
  Rule: Only a complete exact-three-rule result may be published

    Scenario: Preserve every returned node without false zero or partial success
      Given navigation reaches the configured readiness condition
      When axe executes exactly "image-alt", "label", and "color-contrast"
      Then every returned violation node becomes an independent Finding
      And every returned native incomplete node remains a separate ScannerReviewObservation
      And a complete zero result requires validated coverage for all three rules
      And missing coverage, malformed output, timeout, scanner failure, or evidence-capture failure publishes no complete or valid-zero result
      And provider selection neither changes the scan nor invokes a model

  @HS-006 @REQ-EVID-004 @REQ-EVID-008 @REQ-SEC-003 @REQ-SEC-015
  Rule: Durable data and provider input remain minimized

    Scenario: Keep only the information required at each boundary
      Given transient scanner and page material exists for one Finding
      When evidence is persisted or one eligible provider request is assembled
      Then the durable aggregate contains only permitted application-owned provenance, minimized evidence, and workflow data
      And provider input contains only that Finding's permitted minimized facts, required guidance passages, application-owned instructions and output contract, and non-secret request parameters and metadata
      And provider input excludes page identity, locator, sibling Findings, credentials, raw page material, and raw native scanner payloads
      And the durable aggregate retains no credentials, raw page or scanner material, or raw provider request or response payloads
      And scanner evidence, guidance, AI interpretation, and human work remain distinguishable

  @HS-008 @REQ-RETR-004 @REQ-RETR-005 @REQ-GEN-002 @REQ-GEN-003 @REQ-GEN-004 @REQ-GEN-010
  Rule: Evidence sufficiency gates every model call

    Scenario: Invoke a model only for one eligible Finding
      Given one selected Finding remains visible with its minimized evidence
      When the deterministic generation gate is evaluated
      Then a provider call is permitted only when required evidence is complete and completed retrieval is "supported"
      And incomplete, missing, or conflicting support creates abstention and a manual-review direction
      And an abstention creates no ProviderInvocation
      And no sibling Finding is included or changed

  @HS-009 @REQ-LLM-002 @REQ-LLM-003 @REQ-LLM-004 @REQ-LLM-005 @REQ-LLM-019 @REQ-LLM-020 @ADR-0014 @ADR-0020
  Rule: Provider mode never mixes, batches, or falls back

    Scenario Outline: Keep one immutable provider mode
      Given the PageAnalysisRun began in "<mode>" mode after its one run-level disclosure
      And the selected provider and exact model remain visibly labeled
      When the user explicitly invokes one eligible selected Finding
      Then only the "<adapter>" adapter receives that one Finding
      And the run's provider and model remain unchanged
      And there is no separate provider preflight or repeated per-finding disclosure gate
      And provider failure remains visible without automatic retry or fallback
      And selecting the other provider requires a new PageAnalysisRun

      Examples:
        | mode  | adapter                        |
        | Local | configured local-model adapter |
        | Groq  | approved Groq adapter          |

  @HS-010 @REQ-REV-001 @REQ-REV-008 @REQ-REV-009
  Rule: No proposal becomes accepted without one human decision

    Scenario Outline: Apply one decision to one Finding
      Given one validated proposal is pending review for one Finding
      When the reviewer chooses "<decision>"
      Then the result is "<result>"
      And the original proposal remains distinguishable from reviewer-authored content
      And every required manual judgment is recorded, with an unresolved or contradictory judgment preventing approval
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
