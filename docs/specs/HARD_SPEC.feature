# Status: Proposed derived planning hard specification; specified, not executed.
# Authority: Derived from the canonical requirements, operating decisions,
# and accepted ADRs linked from docs/specs/README.md.
# "Hard" means a future implementation must not violate an applicable Accepted
# product or workflow constraint. Source status always controls:
# @proposed_source scenarios remain Proposed and @deferred_scope scenarios
# preserve exclusions only.
# This portfolio specification does not promise safe processing of hostile URLs,
# private or authenticated targets, SSRF isolation, DNS/IP filtering, redirect
# re-attestation, connection-level egress control, or production security.
# It creates no requirement or decision and is not implementation, an executable
# test, acceptance evidence, development authorization, or proof of conformance.

@HARD_SPEC @planned
Feature: Hard boundaries for the evidence-first accessibility-analysis MVP
  A future implementation preserves the smallest product invariants needed to
  demonstrate deterministic scanning, minimized evidence, curated retrieval,
  structured generation, individual review, and conservative comparison.
  The developer deliberately supplies one public HTTPS URL and accepts it as
  trusted input; hostile or untrusted target handling remains outside the MVP.
  Every scenario remains subject to its cited authority and recorded status.

  @HS-001 @REQ-AUTH-007 @REQ-AUTH-008 @REQ-SEC-026 @REQ-SEC-027 @REQ-QUAL-010 @OD-021 @ADR-0018
  Rule: One trusted developer-supplied URL defines the scan target

    Scenario: Start from one deliberately selected public HTTPS URL
      Given the developer has chosen one public HTTPS URL that they are permitted and willing to trust
      When the developer enters that URL and starts analysis
      Then one PageAnalysisRun uses that URL as its only page target
      And provider selection does not invoke a model or alter the deterministic scan

    Scenario Outline: Reject an unusable URL input before navigation
      Given the URL field contains "<condition>"
      When the developer starts analysis
      Then the application shows a visible input failure
      And it starts no browser scan or provider invocation

      Examples:
        | condition                       |
        | no URL                          |
        | invalid URL syntax              |
        | more than one URL               |
        | a scheme other than HTTPS       |
        | embedded URL credentials        |

    Scenario: State the unsupported trust boundary
      Given the URL is developer-supplied trusted input
      When the MVP scope is described
      Then the developer is identified as responsible for choosing a page they may analyze and trust
      And private, authenticated, hostile, and untrusted targets are identified as unsupported
      And the application does not claim SSRF protection, DNS or IP filtering, redirect isolation, or hostile-page safety
      And redirects and subresources are not presented as qualified by a production network-security boundary

  @HS-002 @REQ-AUTH-008 @REQ-SCAN-006 @REQ-SEC-026 @REQ-SEC-027 @REQ-QUAL-012 @OD-021 @ADR-0018
  Rule: One fresh browser scan remains one page and never becomes a crawler

    Scenario: Evaluate only the submitted main document
      Given one trusted developer-supplied URL is ready for scanning
      When the deterministic scan runs
      Then a fresh non-persistent browser context loads the submitted page
      And the main document is evaluated with exactly "image-alt", "label", and "color-contrast"
      And subframes are not scanned
      And no prior browser profile, cookies, storage, extensions, permissions, or ambient credentials are imported
      And downloads are disabled for that scan

    Scenario Outline: Do not expand through page content
      Given the submitted page contains "<page capability>"
      When the deterministic scan encounters it
      Then the application does not deliberately activate or follow it
      And it does not submit a form, upload or download a file, or open another scan target
      And it does not discover, enqueue, or scan another page

      Examples:
        | page capability        |
        | a link                 |
        | a form or control      |
        | a file-upload control  |
        | a download             |
        | an embedded frame      |

    Scenario: Treat ordinary redirects and page dependencies as navigation inputs
      Given the submitted page redirects or requests styles, fonts, images, or scripts during ordinary loading
      When ordinary managed-browser navigation processes them
      Then redirects and dependencies do not become separate scan targets
      And they are not retained as page captures
      And their loading does not imply a production network-isolation guarantee

    Scenario Outline: Close temporary browser state
      Given a temporary browser context exists for one scan
      When the scan ends through "<terminal path>"
      Then the page, context, and managed browser are closed
      And transient raw browser and scanner material is not made durable

      Examples:
        | terminal path                 |
        | successful completion         |
        | page-load or scanner failure  |
        | navigation timeout            |
        | application shutdown          |

  @HS-004 @REQ-SCAN-001 @REQ-SCAN-006 @REQ-SCAN-007 @REQ-EVID-009 @REQ-QUAL-010 @REQ-QUAL-012 @REQ-QUAL-019 @REQ-UX-010 @ADR-0018
  Rule: Only a complete exact-three-rule collection can be published

    Scenario: Publish every validated native result in its correct collection
      Given the submitted page loaded and axe executed exactly the three supported rules
      When the complete runtime-validated result is normalized
      Then every violation node is published as an independent Finding
      And every relevant native incomplete node is published separately as a ScannerReviewObservation
      And no reported result is silently merged, dropped, or truncated

    Scenario: Permit a zero-finding result only after complete collection
      Given page loading, exact rule coverage, and result validation are complete
      And no supported rule returned a violation node
      When the scan completes
      Then the result is a valid complete zero-finding scan
      And any ScannerReviewObservation remains separately visible
      And the result is not described as proof of accessibility or conformance

    Scenario Outline: Fail rather than publish a partial or false-zero result
      Given scan collection encounters "<failure>"
      When the scan operation terminates
      Then the operation is failed or coverage-incomplete
      And no complete finding list or valid zero-finding result is published
      And no generation provider is invoked
      And the temporary browser context is closed

      Examples:
        | failure                        |
        | page-load failure              |
        | the finite navigation timeout  |
        | missing expected rule coverage |
        | unexpected rule execution      |
        | malformed scanner output       |
        | scanner execution failure      |

  @HS-006 @REQ-EVID-008 @REQ-SEC-002 @REQ-SEC-003 @REQ-SEC-007 @REQ-SEC-021 @ADR-0016
  Rule: Evidence and provider input remain minimized

    Scenario Outline: Exclude unnecessary content from durable run data
      Given transient page, scanner, or provider data contains "<content>"
      When the local service crosses the durable-record boundary
      Then that content is excluded from Finding evidence and run diagnostics
      And it is excluded from public portfolio material unless separately approved as non-sensitive evidence

      Examples:
        | content                                      |
        | response bodies or raw or full HTML          |
        | arbitrary page text or hidden content        |
        | DOM or accessibility-tree snapshots          |
        | screenshots, traces, or network logs         |
        | cookies, credentials, or authentication data |
        | form values or arbitrary attributes          |
        | the combined raw axe result                  |
        | raw provider requests or responses           |

    Scenario: Keep page identity outside finding and provider content
      Given a scan has a normalized submitted and final page identity
      When finding evidence, retrieval input, or provider input is assembled
      Then page identity remains only in permitted run provenance
      And it does not enter Finding evidence or provider input

    Scenario: Prefer project-owned evidence for public demonstrations
      Given a retained run contains minimized evidence
      When material is selected for a public portfolio demonstration
      Then project-owned synthetic evidence is used by default
      And other evidence is included only after separate approval as minimized and non-sensitive

  @HS-007 @REQ-SCAN-006 @REQ-EVID-007 @REQ-EVID-009 @REQ-RETR-005 @REQ-GEN-010 @REQ-REV-008 @REQ-UX-010 @REQ-UX-011 @REQ-QUAL-019 @REQ-QUAL-020 @OD-021
  Rule: Findings and their downstream workflows remain independent

    Scenario: Keep scanner-review observations outside the finding workflow
      Given a complete result contains Findings and distinct ScannerReviewObservations
      When downstream workflow eligibility is assigned
      Then each Finding remains independently addressable
      And a ScannerReviewObservation cannot enter retrieval, generation, proposal review, or accepted-plan state

    Scenario: Process only one user-selected finding
      Given all Findings remain visible in one results list
      When the user selects one Finding for downstream work
      Then retrieval, generation, and review use only that Finding and its references
      And no sibling content enters a combined query, prompt, proposal, or bulk action
      And completion, abstention, or failure leaves every sibling state unchanged

  @HS-008 @REQ-RETR-004 @REQ-RETR-005 @REQ-GEN-002 @REQ-GEN-003 @REQ-GEN-004 @REQ-GEN-010 @REQ-LLM-005 @REQ-QUAL-002 @REQ-QUAL-010 @REQ-QUAL-020
  Rule: Retrieval and evidence sufficiency gate every model call

    Scenario Outline: Abstain before invocation when support is insufficient
      Given the selected Finding remains visible with its minimized evidence
      And generation eligibility is "<condition>"
      When the application applies the deterministic eligibility gate
      Then the selected Finding records abstention, its reason, and manual-review direction
      And no ProviderInvocation, provider-call provenance, or remediation proposal is created
      And the completed scan and sibling states remain available

      Examples:
        | condition                    |
        | required evidence incomplete |
        | retrieval incomplete         |
        | retrieval missing            |
        | retrieval conflicting        |

    Scenario: Keep retrieval execution failure distinct from support
      Given the selected Finding and minimized evidence are retained
      When retrieval fails before a completed support state exists
      Then the FindingWorkflow fails without a support state
      And the failure is not represented as evidence-sufficiency abstention
      And no provider is invoked and sibling states remain unchanged

    Scenario: Reject an invalid generated candidate before human review
      Given one eligible Finding produced a provider candidate
      When runtime, structure, evidence-reference, citation, grounding, or prohibited-claim validation fails
      Then the candidate does not enter pending review
      And the failure remains visible without changing the completed scan or sibling Findings

  @HS-009 @REQ-LLM-001 @REQ-LLM-002 @REQ-LLM-003 @REQ-LLM-004 @REQ-LLM-005 @REQ-LLM-006 @REQ-LLM-007 @REQ-LLM-008 @REQ-LLM-009 @REQ-LLM-016 @REQ-LLM-018 @REQ-SEC-004 @REQ-SEC-005 @REQ-SEC-013 @REQ-SEC-014 @REQ-SEC-015 @REQ-SEC-016 @REQ-SEC-027 @REQ-QUAL-002 @REQ-QUAL-020 @OD-021 @ADR-0014
  Rule: Provider choice, disclosure, invocation, and failure remain explicit

    Scenario Outline: Apply one immutable provider mode to every invocation in a run
      Given the user selected "<mode>" before starting the PageAnalysisRun
      When the scan runs and one selected eligible Finding later reaches generation
      Then mode selection itself caused no provider probe, call, or invocation provenance
      And the explicit Finding invocation uses only the "<adapter>" adapter
      And that mode and exact model remain unchanged throughout the run
      And mode selection does not alter scanning, evidence, corpus, retrieval, or validation

      Examples:
        | mode  | adapter                        |
        | Local | configured local-model adapter |
        | Groq  | approved Groq adapter          |

    Scenario: Keep Local generation in the selected local boundary
      Given the PageAnalysisRun uses Local mode
      And one selected Finding is eligible for generation
      When the user prepares its explicit invocation
      Then the application identifies Local mode and the exact selected model
      And the browser UI gains no direct model-runtime or provider authority
      And no hosted fallback is available
      And the user explicitly starts that finding-specific invocation

    Scenario: Disclose and minimize each Groq invocation
      Given the PageAnalysisRun uses Groq mode
      And one selected Finding is eligible for generation
      When the user prepares its explicit invocation
      Then a finding-specific disclosure identifies Groq, the exact model, and destination
      And it identifies the minimized evidence and retrieved-guidance categories to be sent
      And the payload contains only that Finding's permitted evidence, guidance, instructions, and output contract
      And it excludes page identity, raw page content, sibling Findings, prior review history, and credentials
      And the API credential remains available only to the local service
      And the user explicitly starts that finding-specific invocation

    Scenario Outline: Fail visibly without retry or fallback
      Given one selected Finding reaches "<failure>"
      When the generation attempt terminates
      Then the FindingWorkflow shows a distinguishable failure rather than abstention
      And required input is not silently truncated or resubmitted
      And the provider, model, and mode do not change
      And no automatic retry or cross-provider fallback occurs
      And retry, regeneration, or provider change requires a new linked PageAnalysisRun

      Examples:
        | failure                         |
        | provider readiness failure      |
        | input does not fit safely       |
        | authentication or quota failure |
        | network or provider failure     |
        | invalid provider response       |

  @HS-010 @REQ-REV-001 @REQ-REV-008 @OD-021
  Rule: No remediation becomes accepted without one finding-specific human decision

    Scenario Outline: Apply one permitted decision to one validated proposal
      Given one validated proposal is pending review for one Finding
      And every prerequisite applicable to the selected decision is satisfied
      When the reviewer chooses "<decision>"
      Then the decision applies only to that proposal and Finding
      And no sibling Finding or page-level accepted-plan state changes

      Examples:
        | decision        |
        | approve         |
        | edit and accept |
        | reject          |

  @HS-011 @REQ-EVID-001 @REQ-QUAL-001 @REQ-QUAL-002 @REQ-QUAL-010 @REQ-QUAL-011 @REQ-QUAL-012 @REQ-QUAL-020 @REQ-LLM-007 @REQ-SEC-006 @REQ-SEC-016 @ADR-0016 @OD-021
  Rule: Durable runs are validated, immutable, retry-safe, and exactly deletable

    Scenario: Preserve an earlier complete result through a later child failure
      Given a complete scan and its minimized Finding evidence are durable
      When retrieval, generation, provider execution, review, comparison, interruption, or shutdown fails later
      Then the earlier complete scan, evidence, and sibling states remain unchanged
      And an incomplete child result is not treated as durable completion

    Scenario: Reject malformed persisted data when reopening a run
      Given a retained canonical run crosses the persisted-data read boundary
      When runtime validation finds malformed or semantically invalid data
      Then reopening fails visibly
      And the application does not silently reconstruct or repair a complete run from it

    Scenario: Create immutable lineage for retry, regeneration, provider change, and rescan
      Given an earlier PageAnalysisRun exists
      When the user explicitly retries, regenerates, changes provider mode, or rescans
      Then a new linked PageAnalysisRun is created
      And the earlier run, evidence, proposal, review, and failure records are not overwritten

    Scenario: Record ProviderInvocation only for an attempted call
      Given a PageAnalysisRun records one global provider mode
      When a Finding is unprocessed, abstains, or fails before a provider request is attempted
      Then that Finding has no ProviderInvocation, request, response, or usage provenance
      And the run-level mode is not presented as provider-call evidence

    Scenario: Delete exactly one local run
      Given the user selects one retained PageAnalysisRun for deletion
      When the local service deletes that run
      Then only that run and its owned child records are removed
      And other runs and the shared corpus and index remain unchanged
      And the application does not claim to delete provider-controlled records

  @HS-012 @REQ-QUAL-012 @REQ-QUAL-019 @REQ-COMP-004 @REQ-COMP-005 @OD-021 @ADR-0018
  Rule: Comparison is conservative and never upgrades missing evidence into proof

    Scenario: Reject comparison from an invalid source scan
      Given the baseline or later scan is failed, invalid, or coverage-incomplete
      When comparison is requested
      Then the comparison fails visibly
      And no pair or child finding outcome is emitted

    Scenario: Require inspectable evidence for every displayed outcome
      Given a comparison outcome is displayed
      When the user inspects it
      Then the result shows its matching rationale and before-and-after deterministic evidence
      And ambiguity is never forced into a match
      And the outcome makes no accessibility, conformance, or certification claim

    @controlled_evaluation @REQ-EVID-002 @REQ-COMP-002 @OD-008 @OD-019
    Scenario: Correlate controlled targets through their stable evaluation identity
      Given two controlled-fixture scans are eligible for comparison
      When one target is correlated across the declared revisions
      Then correlation uses the scenario, exact rule, stable fixture-target key, state role, and minimized evidence
      And missing or ambiguous identity never produces a forced match

    @proposed_source @REQ-EVID-010 @REQ-COMP-007 @REQ-COMP-008 @OD-019
    Scenario Outline: Classify a comparable page pair conservatively
      Given both scans are complete and materially comparable
      And one target has "<evidence transition>"
      When the applicable descriptor correlates that target uniquely
      Then its scanner-evidence outcome is "<outcome>"
      And the outcome does not imply that a human remediation caused the change

      Examples:
        | evidence transition                                                     | outcome      |
        | binary-rule failure followed by the same correlated failure             | persistent   |
        | contrast failure followed by a higher still-failing contrast margin     | improved     |
        | contrast failure followed by an equal failing contrast margin           | persistent   |
        | contrast failure followed by a lower failing contrast margin             | regressed    |
        | baseline failure followed by a unique same-target native non-failing observation | resolved |
        | retained non-failing baseline followed by a correlated violation        | regressed    |
        | missing, changed, duplicate, ambiguous, or conflicting target identity  | inconclusive |
        | absence or target removal without positive evidence                     | inconclusive |
        | later-only unmatched Finding                                             | inconclusive |

    @proposed_source @REQ-COMP-007 @REQ-COMP-008
    Scenario: Decline a materially different scan pair
      Given both scans are complete
      But a material page, rule, environment, evidence, measurement, or coverage prerequisite differs
      When pair comparability is evaluated
      Then the pair is "not comparable"
      And no child outcome is inferred

  @HS-013 @REQ-INST-003 @REQ-INST-004 @REQ-INST-005 @REQ-INST-006 @REQ-INST-007 @REQ-INST-013 @REQ-INST-014 @REQ-QUAL-009 @ADR-0004 @ADR-0005
  Rule: Local-model setup remains explicit and separate from analysis

    Scenario: Preserve scanning when local generation is unavailable
      Given the selected local runtime or model is unavailable
      When the application checks local-generation readiness
      Then Local generation is unavailable for that run
      And scanning, evidence inspection, and retained local records remain usable
      And the application neither calls Groq nor silently installs or updates a runtime

    Scenario: Keep setup and mode selection side-effect free
      Given the user is inspecting provider or local-model setup
      When no explicit setup or finding-generation action is confirmed
      Then no model is downloaded or invoked and no setup data is transmitted
      And no provider mode is selected or changed by inspection alone

    Scenario: Exclude local model configurations outside the reference-PC capacity
      Given one local model configuration is clearly outside the documented reference-PC capacity
      When evaluation candidates are selected
      Then that configuration is excluded without download
      And the result creates no general hardware-support or end-user recommendation claim

    Scenario: Require consent before runtime-owned model acquisition
      Given an approved local model profile is not installed
      When the user asks the selected runtime to acquire it
      Then the UI shows its source, license reference, expected transfer size, storage, and practical hardware guidance
      And acquisition starts only after affirmative consent
      And model artifacts remain outside Git and the application repository

    @deferred_scope @REQ-INST-001 @REQ-INST-008 @REQ-INST-009 @REQ-INST-010 @REQ-INST-011 @REQ-INST-012 @REQ-INST-015 @REQ-INST-016 @ADR-0015
    Scenario: Do not infer packaging or a general model manager from the MVP
      Given the developer-run MVP can use a selected local runtime
      When its delivery boundary is described
      Then no installer, desktop wrapper, launcher, updater, or uninstaller is claimed
      And no application-owned general model store or model manager is implied

  @HS-014 @REQ-INST-002 @REQ-SEC-005 @REQ-SEC-026 @REQ-SEC-027 @REQ-QUAL-013 @ADR-0012 @ADR-0015 @ADR-0018
  Rule: The local browser interface remains loopback-only and unprivileged

    Scenario: Keep privileged capabilities in the local service
      Given the user opens the application in an installed Chrome or Edge browser
      When the interface requests application behavior
      Then browser code receives no provider credential
      And it has no direct filesystem, process, Playwright, provider, runtime, or vector-store authority
      And the local service remains bound to its enumerated loopback address

    Scenario: Display external records as application content
      Given scanner, corpus, provider, or persisted values are displayed
      When the browser renders those values
      Then strings use ordinary text rendering rather than untrusted HTML execution
      And they remain distinguishable from application controls
      And they do not receive credentials or privileged application capabilities

  @HS-015 @REQ-EVAL-001 @REQ-EVAL-002 @REQ-EVAL-003 @REQ-EVAL-006 @REQ-EVAL-008 @REQ-EVAL-009 @REQ-GEN-006 @REQ-COMP-005 @REQ-SEC-007 @OD-019 @OD-021 @ADR-0014 @ADR-0018
  Rule: Evaluation and public claims stay inside the portfolio MVP boundary

    @controlled_evaluation
    Scenario Outline: Run exactly the fixed six happy generation cases
      Given the canonical controlled package for "<profile>" is proposal-eligible
      When it is evaluated once in "<mode>" mode
      Then the shared application-owned proposal contract is used
      And the result is attributed only to that exact configuration
      And no combined prompt, provider ranking, or provider-comparison conclusion is created

      Examples:
        | profile               | mode  |
        | informative-image-alt | Local |
        | form-input-label      | Local |
        | text-contrast         | Local |
        | informative-image-alt | Groq  |
        | form-input-label      | Groq  |
        | text-contrast         | Groq  |

    @controlled_evaluation @REQ-SCAN-004 @REQ-EVAL-004 @REQ-EVAL-005 @REQ-EVAL-007
    Scenario: Preserve a frozen evaluation package and its evidence history
      Given the controlled inputs and expected deterministic outcomes are frozen before model review
      When a material input or expected outcome changes
      Then a new version and new evidence are created
      And affected cases are rerun without rewriting earlier observations

    Scenario: Keep provider-independent evaluation independent
      Given scan, evidence, retrieval, abstention, review, comparison, and no-call behavior must be evaluated
      When the fixed evaluation is assembled
      Then each provider-independent case runs once rather than once per provider
      And it creates no provider invocation unless its own scenario explicitly requires one
      And it includes no hostile-URL or production URL-security qualification suite

    Scenario: Prohibit unsupported product and remediation claims
      Given the product displays a scan, Finding, proposal, review decision, or comparison
      When that result is explained or published
      Then it does not claim certification, legal compliance, whole-page or site accessibility, or complete success-criterion conformance or non-conformance
      And it does not claim a finding is fixed solely because automated evidence changed
      And it does not represent AI output as an automatic source-code modification
      And evaluation evidence does not qualify a release dependency, provider, hardware class, or security boundary

    @deferred_scope @REQ-LLM-012 @REQ-LLM-017 @REQ-UX-007 @REQ-UX-013 @REQ-SEC-027
    Scenario: Preserve the explicitly deferred product surface
      Given the bounded portfolio MVP is being described
      When a capability outside the accepted scope is considered
      Then authenticated, private, hostile, or untrusted targets, production URL-security guarantees, SSRF protection, DNS or IP filtering, redirect re-attestation, connection-level egress control, crawling, discovery, multiple input pages, broader rules, bulk workflows, queues, agents, accounts, collaboration, generic remote endpoints, hosted telemetry, databases, generalized export, packaging, and release qualification remain outside the MVP
      And no deferred capability is represented as implemented, committed, or required by this hard specification
