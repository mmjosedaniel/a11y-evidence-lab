# Status: Proposed derived planning hard specification; specified, not executed.
# Authority: Derived from the canonical requirements, operating decisions,
# and accepted ADRs linked from docs/specs/README.md.
# "Hard" means a future implementation must not violate an applicable Accepted
# source constraint. Source status always controls: @proposed_source scenarios
# remain Proposed and @deferred_scope scenarios preserve exclusions only.
# This file selects no open numeric limit, correlation field, security mechanism,
# fixture literal, schema property, package, command, or implementation design.
# It creates no requirement or decision and is not implementation, an executable
# test, acceptance evidence, development authorization, or proof of conformance.

@HARD_SPEC @planned
Feature: Hard boundaries for the evidence-first accessibility-analysis MVP
  A future implementation fails closed at authorization, network, evidence,
  provider, review, persistence, and comparison boundaries while keeping the
  exact three-rule public-page workflow bounded and independently reviewable.
  Every scenario remains subject to its cited authority and recorded status.

  @HS-001 @REQ-AUTH-005 @REQ-AUTH-006 @REQ-SEC-001 @REQ-SEC-009 @REQ-SEC-022 @REQ-SEC-023 @REQ-QUAL-010 @OD-020 @ADR-0017
  Rule: Public-target admission fails closed before browser analysis

    Scenario: Require an explicit single-page authorization attestation
      Given the user has not attested authorization for exactly one page
      When the user attempts to start analysis
      Then no PageAnalysisRun becomes active
      And no target connection, browser scan, retrieval, or provider invocation starts

    Scenario Outline: Reject a target outside the accepted public-page boundary
      Given the user has supplied a target with "<condition>"
      When the local service applies the accepted target-admission policy
      Then target admission is rejected before a browser target connection
      And no partial scan result or provider invocation is created
      And the rejection is not represented as a valid zero-finding result

      Examples:
        | condition                                      |
        | invalid or ambiguous URL syntax                |
        | a scheme other than HTTPS                      |
        | a non-default port                             |
        | embedded credentials or imported session state |
        | more than one requested page                   |
        | a non-public or uncertain A or AAAA answer     |

    Scenario: Re-admit every redirect destination
      Given an admitted page navigation receives a redirect
      When the redirect destination is resolved under the accepted policy
      Then every destination and address answer is checked before connection
      And a denied or uncertain destination stops the scan without partial success
      And a redirect that changes the attested page identity stops for new attestation

  @HS-002 @REQ-AUTH-006 @REQ-SCAN-006 @REQ-SEC-009 @REQ-SEC-024 @REQ-SEC-025 @REQ-QUAL-012 @OD-020 @ADR-0017
  Rule: One page scan never becomes crawling or page interaction

    Scenario: Evaluate only the admitted main document
      Given one public page has passed target admission
      When the deterministic scan runs
      Then the main document is evaluated with exactly "image-alt", "label", and "color-contrast"
      And subframes are not scanned
      And no other page or rule becomes an analysis target

    Scenario Outline: Do not expand scope through page content
      Given the admitted page contains "<page capability>"
      When the scan encounters that capability
      Then the application does not interact with it or scan content outside the admitted main document
      And it does not treat any destination as another target
      And the scan does not discover or enqueue another page

      Examples:
        | page capability        |
        | a link                 |
        | a form or control      |
        | a file-upload control  |
        | a download             |
        | an embedded frame      |

    Scenario: Keep rendering subresources bounded and non-analytical
      Given the admitted main document requests a rendering subresource
      When that request passes the accepted network and resource policies
      Then the resource may support main-document rendering only
      And it does not become a discovered page, scan target, or retained page capture

  @HS-003 @REQ-SEC-001 @REQ-SEC-011 @REQ-SEC-022 @REQ-SEC-023 @REQ-SEC-024 @REQ-QUAL-013 @ADR-0015 @ADR-0017
  Rule: Managed-browser networking and state cannot bypass the application boundary

    Scenario: Gate every browser network destination and connection
      Given the managed browser is processing an admitted page
      When initial navigation, a redirect, a subresource, or a fresh connection is requested
      Then the request traverses the application-owned connection-level egress gate
      And all A and AAAA answers are revalidated under the accepted policy
      And the connection remains bound to an admitted address with HTTPS hostname and certificate verification
      And denial or uncertainty fails closed without partial success

    Scenario Outline: Deny an unapproved browser channel
      Given untrusted page content attempts "<channel>"
      When the managed browser handles the attempt
      Then the channel is denied by the accepted browser policy
      And it cannot bypass the egress gate, expand scan scope, or contribute data through that channel

      Examples:
        | channel                         |
        | service-worker networking       |
        | a popup or additional target    |
        | a WebSocket connection          |
        | local file access               |
        | a download                      |
        | an unapproved network-capable path |

    Scenario: Isolate every scan in fresh browser state
      Given a PageAnalysisRun is ready to launch its scan
      When the local service creates the managed-browser context
      Then the context is fresh, non-persistent, sandboxed, and has no granted permissions
      And it receives no prior profile, cookies, storage, ambient credentials, or imported state

  @HS-004 @REQ-SCAN-001 @REQ-SCAN-006 @REQ-SCAN-007 @REQ-EVID-009 @REQ-QUAL-010 @REQ-QUAL-012 @REQ-QUAL-014 @REQ-QUAL-019 @REQ-UX-010 @ADR-0017
  Rule: Only a complete bounded exact-three-rule collection can be published

    Scenario: Publish every validated native result in its correct collection
      Given the admitted main document reached the accepted readiness condition
      And axe executed exactly the three supported rules over the declared scope
      When the complete runtime-validated result is normalized within the accepted bounds
      Then every violation node is published as an independent Finding
      And every relevant native incomplete node is published separately as a ScannerReviewObservation
      And no result is merged, dropped, or silently truncated

    Scenario: Permit a zero-finding result only after complete collection
      Given readiness, exact rule coverage, runtime validation, and bounded collection are complete
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

      Examples:
        | failure                          |
        | readiness failure                |
        | missing expected rule coverage   |
        | unexpected rule execution        |
        | malformed scanner output         |
        | truncated or silently lost output |
        | an accepted resource or result bound breach |
        | timeout or shutdown              |

    @proposed_source @REQ-QUAL-017
    Scenario Outline: Exercise each future frozen bound at its edges
      Given the owning authority has frozen one accepted bound without changing this file
      When an otherwise valid operation reaches "<position>" for that bound
      Then the operation has "<boundary result>"
      And an over-bound case never becomes partial success

      Examples:
        | position          | boundary result                                      |
        | below the limit   | no failure solely because of that bound              |
        | exactly the limit | the result selected by the future frozen bound policy |
        | maximum plus one  | a visible fail-closed result and complete cleanup     |

  @HS-005 @REQ-INST-002 @REQ-SEC-024 @REQ-QUAL-012 @REQ-QUAL-014 @ADR-0015 @ADR-0017
  Rule: Browser work and transient data end on every terminal path

    Scenario Outline: Clean up one managed-browser operation
      Given browser work has started for one PageAnalysisRun
      When the operation ends through "<terminal path>"
      Then its page, context, and browser resources are closed
      And transient raw browser and scanner material is not made durable
      And failed or uncertain cleanup cannot be reported as complete success

      Examples:
        | terminal path                    |
        | successful scan completion       |
        | admission or network denial      |
        | navigation or scanner failure    |
        | a resource or result bound breach |
        | timeout                          |
        | application shutdown             |

    Scenario: Stop the local application cleanly
      Given the local service is running
      When the developer activates its clean stop path
      Then active owned work terminates under the accepted failure and cleanup boundary
      And the service does not leave a scan reported as partially completed

  @HS-006 @REQ-EVID-008 @REQ-SEC-002 @REQ-SEC-003 @REQ-SEC-007 @REQ-SEC-021 @ADR-0016 @ADR-0017
  Rule: Page and provider data is minimized before durable or public use

    Scenario Outline: Exclude prohibited content from durable run data
      Given transient page, scanner, or provider data contains "<content>"
      When the local service crosses the durable-record boundary
      Then that content is excluded from Finding evidence and run diagnostics
      And it is excluded from any public portfolio artifact unless separately approved as non-sensitive minimized evidence

      Examples:
        | content                                |
        | response bodies or raw or full HTML    |
        | arbitrary page text or hidden content  |
        | DOM or accessibility-tree snapshots    |
        | screenshots, traces, or network logs   |
        | cookies, credentials, or authentication data |
        | form values or arbitrary attributes    |
        | the combined raw axe result             |
        | raw provider requests or responses      |

    Scenario: Keep the target identity at run provenance only
      Given a public-page scan has a normalized target identity
      When finding evidence, retrieval input, or a provider payload is assembled
      Then the target identity remains only in permitted authorization and run provenance
      And it does not enter Finding evidence, ProviderInvocation content, or provider input

    Scenario: Limit public demonstrations to safe evidence
      Given a run contains minimized evidence from a public page
      When material is selected for a public demonstration
      Then project-owned synthetic evidence is used by default
      And other evidence is included only after separate approval as minimized and non-sensitive

    @proposed_source @REQ-SCAN-005
    Scenario: Apply the future versioned scanner allowlist before persistence
      Given the owning authority has frozen the rule-specific allowlist and sanitization policy
      When transient scanner output is normalized
      Then only allowed minimized fields cross the durable boundary
      And the record identifies the policy version and applicable omitted, transformed, or withheld categories

  @HS-007 @REQ-SCAN-006 @REQ-EVID-007 @REQ-EVID-009 @REQ-RETR-005 @REQ-GEN-010 @REQ-REV-008 @REQ-UX-010 @REQ-UX-011 @REQ-QUAL-019 @REQ-QUAL-020 @OD-020 @ADR-0017
  Rule: Findings and their downstream workflows remain independent

    Scenario: Keep ScannerReviewObservations outside FindingWorkflow
      Given a complete result contains Findings and distinct ScannerReviewObservations
      When downstream workflow eligibility is assigned
      Then each Finding remains independently addressable
      And a ScannerReviewObservation cannot enter retrieval, generation, proposal review, or accepted-plan state

    Scenario: Process only one user-selected FindingWorkflow
      Given all Findings remain visible in the results list
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
      Then the selected Finding records abstention and manual-review direction
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
      Then the selected FindingWorkflow fails without a support state
      And the failure is not represented as evidence-sufficiency abstention
      And no provider is invoked and sibling states remain unchanged

    Scenario: Reject an invalid generated candidate before human review
      Given one eligible Finding produced a provider candidate
      When runtime, schema, evidence-reference, citation, grounding, or prohibited-claim validation fails
      Then the candidate does not enter pending review
      And the failure remains visible without changing the completed scan or sibling Findings

    @proposed_source @REQ-GEN-007
    Scenario: Treat page and corpus instructions as untrusted data
      Given page or retrieved content attempts to alter system rules, invoke tools, or expand the workflow
      When retrieval or generation processes that content
      Then the application does not grant the instruction authority
      And the approved evidence, provider, output, and no-tool boundaries remain unchanged

    @proposed_source @REQ-GEN-001 @REQ-GEN-009 @REQ-REV-007
    Scenario: Preserve the bounded content of a deterministic abstention
      Given eligibility fails before a provider invocation
      When the abstention record is created
      Then it identifies the Finding, evidence, support or conflict, missing information, reason, and manual direction
      And it contains no remediation conclusion and cannot become an accepted plan

  @HS-009 @REQ-LLM-001 @REQ-LLM-002 @REQ-LLM-003 @REQ-LLM-004 @REQ-LLM-005 @REQ-LLM-006 @REQ-LLM-007 @REQ-LLM-008 @REQ-LLM-009 @REQ-LLM-016 @REQ-LLM-018 @REQ-SEC-004 @REQ-SEC-005 @REQ-SEC-013 @REQ-SEC-014 @REQ-SEC-015 @REQ-SEC-016 @REQ-SEC-019 @REQ-QUAL-002 @REQ-QUAL-020 @OD-020 @ADR-0014
  Rule: Provider choice, disclosure, egress, and failure remain explicit

    Scenario Outline: Apply one immutable provider mode to every invocation in a run
      Given the user selected "<mode>" before starting the PageAnalysisRun
      When the scan runs and one selected eligible Finding later reaches generation
      Then mode selection itself caused no provider probe, call, or invocation provenance
      And the explicit Finding invocation uses only the "<adapter>" adapter
      And that mode and exact model remain unchanged throughout the run
      And mode selection does not alter scanner, corpus, embedding, retrieval, evidence, or validation configuration

      Examples:
        | mode  | adapter                        |
        | Local | configured local-model adapter |
        | Groq  | approved Groq adapter          |

    Scenario: Keep Local generation inside the approved local boundary
      Given the PageAnalysisRun uses Local mode
      And one selected Finding is eligible for generation
      When the user prepares its explicit invocation
      Then the application identifies Local mode and the exact selected model
      And it states that model input remains within the approved local or loopback generation boundary
      And the browser UI gains no direct model-runtime or provider authority
      And no hosted fallback is available
      And the user explicitly starts this finding-specific invocation

    Scenario: Disclose and minimize every Groq invocation
      Given the PageAnalysisRun uses Groq mode
      And one selected Finding is eligible for generation
      When the user prepares its explicit invocation
      Then a fresh finding-specific disclosure identifies Groq, the exact model, and approved destination
      And it identifies the minimized evidence and retrieved-guidance categories to be sent
      And it identifies provider-controlled service and retention conditions, credential handling, and bounded failures
      And the payload contains only the selected Finding's permitted minimized facts, guidance, instructions, and output contract
      And it excludes target identity, raw page content, locators, sibling Findings, prior review history, and credentials
      And the API credential remains available only to the local service
      And scan authorization alone does not authorize the Groq request
      And the user explicitly starts this finding-specific invocation
      And Groq is not described as permanently available, unlimited, or cost-free

    Scenario Outline: Fail visibly without retry, fallback, or mutation
      Given one selected Finding reaches "<failure>"
      When the generation attempt terminates
      Then the FindingWorkflow shows a distinguishable failure rather than abstention
      And required input is not silently truncated or resubmitted
      And the provider, model, and mode do not change
      And no automatic retry or cross-provider fallback occurs
      And any explicit retry, regeneration, or provider change requires a new linked PageAnalysisRun

      Examples:
        | failure                         |
        | provider readiness failure      |
        | unsafe or oversized input       |
        | authentication or quota failure |
        | network or provider failure     |
        | invalid provider response       |

    @REQ-LLM-010 @REQ-GEN-010
    Scenario: Use non-sensitive synthetic content for a provider connection check
      Given the user explicitly requests a provider connection check
      When the local service performs the check
      Then the check transmits no target evidence, corpus passage, prompt, or run record
      And the result creates no finding-specific ProviderInvocation

  @HS-010 @REQ-REV-001 @REQ-REV-008 @OD-020
  Rule: No remediation becomes accepted without one person's finding-specific decision

    Scenario Outline: Apply one permitted human decision to one validated proposal
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

    @proposed_source @REQ-REV-002 @REQ-REV-003 @REQ-REV-004
    Scenario: Preserve review history without automatic regeneration
      Given a reviewer edits and accepts or rejects a proposal
      When the decision is recorded
      Then the original proposal, reviewer-authored successor or feedback, action, actor, and timestamp remain distinguishable
      And a rejected proposal never appears as an accepted plan
      And rejection does not regenerate content or change the corpus

    @proposed_source @REQ-REV-005 @REQ-REV-006
    Scenario Outline: Gate acceptance with every blocking manual check
      Given one proposal has a blocking manual check with "<check result>"
      When the reviewer attempts to accept the proposal
      Then acceptance is "<acceptance>"

      Examples:
        | check result                    | acceptance                                 |
        | completed and supports          | allowed for that check                      |
        | not applicable with a rationale | allowed for that check                      |
        | pending                         | blocked                                     |
        | completed and contradicts       | blocked                                     |
        | completed and inconclusive      | blocked                                     |
        | not applicable without rationale | blocked                                    |

  @HS-011 @REQ-EVID-001 @REQ-QUAL-001 @REQ-QUAL-002 @REQ-QUAL-010 @REQ-QUAL-011 @REQ-QUAL-012 @REQ-QUAL-020 @REQ-LLM-007 @REQ-SEC-006 @REQ-SEC-016 @ADR-0016 @OD-020
  Rule: Durable runs are validated, immutable, retry-safe, and exactly deletable

    Scenario: Preserve an earlier complete result through a later child failure
      Given a complete scan and its minimized Finding evidence are durable
      When retrieval, generation, provider execution, review, comparison, interruption, or shutdown fails later
      Then the earlier complete scan, evidence, and sibling states remain unchanged
      And an incomplete child result is not treated as durable completion

    Scenario: Reject malformed persisted JSON when reopening a run
      Given a retained run record crosses the persisted-JSON read boundary
      When runtime validation finds malformed or semantically invalid canonical data
      Then reopening fails visibly
      And the application does not reconstruct or silently repair a complete run from that record

    Scenario: Create immutable lineage for workflow retry, regeneration, provider change, and rescan
      Given an earlier PageAnalysisRun exists
      When the user explicitly retries a scan or FindingWorkflow, regenerates, changes provider mode, or rescans
      Then a new linked PageAnalysisRun is created
      And the earlier run, evidence, proposal, review, and failure records are not overwritten or resumed in place

    @REQ-LLM-005 @REQ-GEN-010
    Scenario: Record ProviderInvocation only for an attempted call
      Given a PageAnalysisRun records one global provider mode
      When a Finding is unprocessed, abstains, or fails before a provider request is attempted
      Then that Finding has no ProviderInvocation, request, response, or usage provenance
      And the run-level mode is not presented as provider-call evidence

    Scenario: Delete exactly one local run
      Given the user selects one retained PageAnalysisRun for deletion
      When the local service deletes that run
      Then only that run directory and its owned children are removed
      And other runs and the shared corpus and index remain unchanged
      And the application does not claim to delete provider-controlled records

  @HS-012 @REQ-QUAL-012 @REQ-QUAL-019 @REQ-COMP-004 @REQ-COMP-005 @OD-020 @ADR-0017
  Rule: Comparison is conservative and never upgrades missing evidence into proof

    @proposed_source @REQ-COMP-007 @REQ-COMP-008
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
    Scenario: Correlate controlled targets only through their stable evaluation identity
      Given two controlled-fixture scans are eligible for comparison
      When one target is correlated across the declared revisions
      Then correlation uses the scenario, exact rule, stable fixture-target key, state role, and minimized evidence
      And a locator or display position cannot replace the stable project-owned key
      And missing or ambiguous identity never produces a forced match

    @proposed_source @REQ-EVID-010 @REQ-COMP-007 @REQ-COMP-008 @OD-019
    Scenario Outline: Classify a complete comparable public-page pair conservatively
      Given both scans are complete and materially comparable under the future frozen policy
      And one target has "<evidence transition>"
      When the future versioned descriptor correlates that target uniquely
      Then its scanner-evidence outcome is "<outcome>"
      And the outcome does not imply that a human remediation caused the change

      Examples:
        | evidence transition                                                   | outcome      |
        | binary-rule failure followed by the same correlated failure           | persistent   |
        | contrast failure followed by a higher still-failing contrast margin   | improved     |
        | contrast failure followed by an equal failing contrast margin         | persistent   |
        | contrast failure followed by a lower failing contrast margin          | regressed    |
        | baseline failure plus complete later coverage and one unique same-target native non-failing observation | resolved |
        | retained non-failing baseline followed by a correlated violation      | regressed    |
        | target descriptor missing, duplicate, changed, ambiguous, or conflicting while pair prerequisites align | inconclusive |
        | absence, target removal, or locator failure without positive evidence | inconclusive |
        | later-only unmatched Finding                                          | inconclusive |

    @proposed_source @REQ-COMP-007 @REQ-COMP-008
    Scenario: Reject a materially different public-page scan pair
      Given both scans are complete
      But a material page, authorization, rule, environment, evidence, measurement, or coverage prerequisite differs
      When pair comparability is evaluated
      Then the pair is "not comparable"
      And no child outcome is inferred
      And no later-only Finding is labeled "new" or "regressed" without an accepted correlation

  @HS-013 @REQ-INST-003 @REQ-INST-004 @REQ-INST-005 @REQ-INST-006 @REQ-INST-007 @REQ-INST-013 @REQ-INST-014 @REQ-QUAL-009 @ADR-0004 @ADR-0005
  Rule: Local-model setup remains explicit, bounded, and separate from analysis

    Scenario: Preserve scanning when local generation is unavailable
      Given the selected local runtime, model, or mandatory capability is unavailable
      When the application establishes local-generation readiness
      Then Local generation is unavailable for that run
      And scanning, evidence inspection, and retained local records remain usable
      And the application neither calls Groq nor silently installs or updates a runtime

    Scenario: Keep setup and mode selection side-effect free
      Given the user is inspecting provider or local-model setup
      When no explicit setup action or finding-specific generation action is confirmed
      Then no model is downloaded or invoked and no setup data is transmitted
      And no provider mode is selected or changed by setup inspection alone

    Scenario: Require disclosure and consent before runtime-owned model acquisition
      Given an approved local model profile is not installed
      When the user asks the selected runtime to acquire it
      Then the UI shows purpose, source, license reference, exact tag and available digest
      And it shows expected transfer size, estimated storage, known runtime-owned location, and practical hardware guidance
      And acquisition starts only after affirmative consent
      And browser input supplies only the approved profile and explicit intent, never an arbitrary URL, hash, path, or destination
      And large generation and embedding model artifacts remain outside Git, the application repository, and any future base installer

    Scenario Outline: Apply the reference-PC capacity gate before candidate admission
      Given one local model configuration is "<capacity classification>"
      When the accepted reference-PC capacity gate is applied
      Then the allowed action is "<action>"
      And the result creates no release, hardware-support, or general end-user recommendation claim

      Examples:
        | capacity classification        | action                                                    |
        | clearly over the metadata envelope | exclude it without download                           |
        | borderline                     | permit only the bounded on-device preflight               |
        | passed the complete gate        | admit it only as a bounded evaluation candidate            |

    Scenario Outline: Preserve the minimal local-model state boundary
      Given the approved local profile is in "<state>"
      When the application presents local-model readiness
      Then the state is represented as "<state>" without implying another lifecycle state
      And downloading does not select generation mode
      And failed does not activate a partial model
      And retry requires an explicit user action

      Examples:
        | state         |
        | not installed |
        | downloading   |
        | ready         |
        | failed        |

    @deferred_scope @REQ-INST-001 @REQ-INST-008 @REQ-INST-009 @REQ-INST-010 @REQ-INST-011 @REQ-INST-012 @REQ-INST-015 @REQ-INST-016 @ADR-0015
    Scenario: Do not infer packaging or a general model manager from the MVP
      Given the developer-run MVP supports selected-runtime model acquisition
      When its delivery boundary is described
      Then no installer, desktop wrapper, launcher, updater, or uninstaller is claimed
      And no application-owned downloader, import system, model store, or direct runtime-store deletion is implied

  @HS-014 @REQ-INST-002 @REQ-SEC-002 @REQ-SEC-018 @REQ-SEC-019 @REQ-QUAL-013 @ADR-0012 @ADR-0015
  Rule: The local browser interface remains loopback-only and unprivileged

    Scenario: Reject an untrusted request to the local service
      Given the service binds only its enumerated loopback addresses
      When a request has an unapproved Host, Origin, cross-site context, DNS-rebinding condition, or missing accepted request-forgery proof
      Then the local service rejects the request
      And no state-changing or privileged operation is performed

    Scenario: Keep privileged capabilities out of browser code
      Given the user opens the application in an installed Chrome or Edge browser
      When the interface requests application behavior
      Then browser code receives no provider credential
      And it has no direct filesystem, process, Playwright, egress-policy, provider, runtime, or vector-store authority
      And startup failure never exposes a false ready address

    Scenario: Render untrusted records as inert content
      Given target, scanner, corpus, provider, or persisted content is untrusted
      When the browser UI displays that content
      Then it is presented as inert data under application-owned local assets and content policy
      And it receives no privileged capability, credential, automatic navigation, or executable authority

    @proposed_source @REQ-SEC-020
    Scenario: Project untrusted records through a closed view model
      Given the owning renderer policy defines an application-owned closed view model
      When an untrusted record is projected into the interface
      Then untrusted HTML, srcdoc, executable URLs, automatic navigation, untrusted DOM identifiers, and object spreading are not rendered
      And unavailable actions remain inert with an accessible explanation

    @proposed_source @REQ-A11Y-001 @REQ-A11Y-002 @REQ-A11Y-003 @REQ-A11Y-004 @REQ-A11Y-008 @REQ-A11Y-009 @REQ-A11Y-010
    Scenario Outline: Keep every core result interaction perceivable and operable
      Given the interface displays "<interaction>"
      When a keyboard or assistive-technology user operates the workflow
      Then the interaction has logical focus, stable accessible naming, meaningful state, and non-color identification
      And passive updates preserve focus and announce material changes without losing the user's place
      And perceived interaction state, not DOM presence alone, is the verification boundary

      Examples:
        | interaction                                      |
        | URL entry, attestation, mode selection, and Analyze |
        | complete grouped Findings and ScannerReviewObservations |
        | one selected Finding detail and return to its list position |
        | evidence, guidance, sufficiency, and citation inspection |
        | proposal review and blocking manual checks       |
        | errors, abstention, retry, and comparison         |

    @proposed_source @REQ-A11Y-005
    Scenario: Isolate deliberately inaccessible controlled content
      Given a project-owned failing fixture is displayed for evaluation
      When the application presents it near its own interface
      Then the fixture is isolated and preceded by a clear warning
      And it does not make the surrounding application interface unusable

  @HS-015 @REQ-EVAL-001 @REQ-EVAL-002 @REQ-EVAL-003 @REQ-EVAL-006 @REQ-EVAL-008 @REQ-EVAL-009 @REQ-GEN-006 @REQ-COMP-005 @REQ-SEC-007 @OD-019 @OD-020 @ADR-0014 @ADR-0017
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
      Given scan, evidence, retrieval, abstention, review, comparison, URL-security, and no-call behavior must be evaluated
      When the fixed evaluation is assembled
      Then each provider-independent case runs once rather than once per provider
      And it creates no provider invocation unless its own scenario explicitly requires one

    Scenario: Prohibit unsupported product and remediation claims
      Given the product displays a scan, Finding, proposal, review decision, or comparison
      When that result is explained or published
      Then it does not claim certification, legal compliance, whole-page or site accessibility, or complete success-criterion conformance or non-conformance
      And it does not claim a finding is fixed solely because automated evidence changed
      And it does not represent AI output as an automatic source-code modification
      And evaluation evidence does not qualify a release dependency, supported provider, hardware class, or statistical performance claim

    @deferred_scope @REQ-LLM-012 @REQ-LLM-017 @REQ-UX-007 @REQ-UX-013
    Scenario: Preserve the explicitly deferred product surface
      Given the bounded portfolio MVP is being described
      When a capability outside the accepted scope is considered
      Then authenticated or private targets, crawling, discovery, multiple input pages, broader rules, bulk workflows, queues, agents, accounts, collaboration, generic remote endpoints, hosted telemetry, databases, generalized export, packaging, and release qualification remain outside the MVP
      And no deferred capability is represented as implemented, committed, or required by this hard specification
