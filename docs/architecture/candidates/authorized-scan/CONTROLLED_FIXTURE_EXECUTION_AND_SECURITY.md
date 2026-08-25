# Authorized deterministic web scan controlled-fixture execution and security assessment

## Authority, status, and scope

**Document status: Proposed architecture assessment.** ADR-0008, ADR-0009, and ADR-0011 retain their accepted evaluation-baseline scope; no part of this assessment becomes accepted by association.

Assessment date: 2026-08-23. Expanded to the three-scenario portfolio slice on 2026-08-24.

This assessment owns the proposed controlled-fixture execution, authorization, Step 1 handoff, failure, and minimum security boundary for the [authorized deterministic web scan assessment family](README.md). It owns no requirement ID or status, changes no ADR scope, and does not authorize implementation or live-page scanning.

Canonical behavior remains in [Evidence and review workflow requirements — Target authorization and scanning](../../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#target-authorization-and-scanning), [Privacy and security requirements](../../../requirements/quality-security-and-operations/PRIVACY_AND_SECURITY.md), and [Reliability, reproducibility, and operations requirements](../../../requirements/quality-security-and-operations/RELIABILITY_REPRODUCIBILITY_AND_OPERATIONS.md).

## Smallest portfolio scenario set

The first vertical slice should demonstrate exactly three accessibility scenarios through the complete product pipeline, not broad scanner coverage. Each row is a separate logical fixture family with one failing and one corrected revision.

| Scenario profile | Failing revision | Corrected revision | Expected automated observations |
| --- | --- | --- | --- |
| `informative-image-alt` | One informative synthetic product image has no `alt` attribute. | The same image has a manually reviewed, context-appropriate alternative. | Exactly one **image-alt** violation, then a same-target native pass. Direct mapping: WCAG 2.2 SC 1.1.1. |
| `form-input-label` | Visible text `Email address` is adjacent to one visible `<input type="email">` but is not programmatically associated, and no other accessible-name mechanism is present. | The same input has the visible label `Email address` explicitly associated through matching `for` and `id` values. | Exactly one **label** violation, then a same-target native pass. Direct mapping: WCAG 2.2 SC 4.1.2; the axe rule does not itself test SC 3.3.2 or the whole success criterion/page. |
| `text-contrast` | One 16 CSS px, weight-400 normal-text target is rendered as foreground `#888888` on background `#ffffff`. | The same target retains its typography and is rendered as foreground `#767676` on background `#ffffff`. | Exactly one **color-contrast** violation, then a same-target native pass under the fixed profile. Direct mapping: WCAG 2.2 SC 1.4.3. |

All six revisions are project-owned, synthetic, publicly shareable, and static. They contain no script, frame, form submission, external resource, credential, or personal data; image bytes are embedded. One scan operation selects exactly one scenario profile and one revision, runs only the rule named by that profile, and expects one intended target. The application does not combine the three pages or rules into one scan.

The corrected results prove only the selected axe rule outcomes under the recorded profile. They do not prove alternative-text appropriateness, label accuracy or instruction sufficiency, text readability in every condition, whole-success-criterion satisfaction, page accessibility, or WCAG conformance. Later generation and review must preserve those distinctions and require the scenario-specific manual checks.

| Scenario | Required later manual judgment |
| --- | --- |
| `informative-image-alt` | Confirm that the proposed alternative communicates the informative image's purpose in the fixture context. |
| `form-input-label` | Confirm that `Email address` accurately and clearly identifies the intended input, remains visibly available, activates the associated input as expected, and is accompanied by any necessary instructions. |
| `text-contrast` | Confirm that the target is ordinary text in the intended visual context and remains understandable under relevant visual conditions not established by the one automated measurement. |

Ambiguous variants, any fourth scenario, broader rule sets, arbitrary URLs, live or authenticated target pages, and crawling remain deferred until demonstrated product need.

## Minimal component boundary

The proposed flow is:

**React presentation → local TypeScript application → authorization module → scan module → Playwright-managed Chromium → transient native scanner observation → evidence-capture module**

The authorization, scan, and evidence-capture components are ordinary modules in one local TypeScript application process. The React renderer can request an allowed scan and display application-owned projections, but it never receives browser-automation authority or raw page/scanner objects. Playwright launches and cleans up its managed Chromium process as part of normal browser automation.

The initial slice does not introduce:

- An application-owned child worker or IPC protocol.
- Process-tree supervision, Job Objects, restart handshakes, or a worker capability protocol.
- A fixture web server, policy proxy, or microservice.
- Concurrent scans, queues, distributed work, or production orchestration.

These mechanisms can be reconsidered only if a measured security, reliability, or scale requirement cannot be met by the single-process design.

## Minimal authorization attestation

The interface should present only the three scenario families and their failing or corrected revisions from a closed project-owned list. Before each scan, the user confirms:

> I confirm that this project-owned controlled fixture is authorized for this scan.

The scan admission record needs only:

- The selected scenario profile, fixture ID, and revision.
- The authorization-statement version.
- An affirmative confirmation.
- The confirmation time.
- The scan-run ID created after successful admission.

A missing confirmation or unknown fixture ID rejects the request before Chromium launches. The interface accepts no arbitrary URL, filesystem path, uploaded HTML, browser option, header, cookie, or credential.

This attestation is intentionally small for a single-user portfolio fixture. Live targets need a different, accepted authorization and threat model.

## Proposed deterministic browser profile

The exact serialized configuration remains Proposed under OD-003. The first evaluation needs only these fixed facts:

| Concern | Proposed value |
| --- | --- |
| Browser | Exact Playwright-managed Chromium artifact; headless with its sandbox explicitly enabled |
| Context | One fresh non-persistent context for each scan |
| Viewport | 1280 by 720 |
| Locale and timezone | en-US and UTC |
| Color preferences | Light color scheme, no forced colors |
| Permissions and state | No granted permissions, storage state, credential, extension, or personal profile |
| Networking | Abort every HTTP, HTTPS, and WebSocket request; the fixture requires none |
| Fixture loading | Load the selected bundled static HTML through Playwright page-content loading |
| Readiness | Page-content loading completed and one fixed fixture marker is present |
| Scanner | Pinned axe-core adapter and resolved axe-core version |
| Rule | Exactly one rule resolved from the selected closed profile: **image-alt**, **label**, or **color-contrast** |
| Bounds | One page, one rule, fixed fixture-size limit, fixed result-size limit, and explicit timeout |

Do not use a sleep or a network-idle heuristic as readiness. Do not use a custom browser executable, persistent profile, extension, or unsafe sandbox-disabling option.

This profile is enough for the three static scenarios. It does not claim to represent real navigation, server behavior, authenticated state, cross-frame behavior, or live-page networking.

## Conceptual transient scanner observation

Step 1 should return one small in-memory observation. This is a conceptual boundary, not an implementation schema.

It contains:

- Scan-run ID and the authorization-attestation facts.
- Scenario profile, fixture ID, revision, content digest, and declared failing or corrected state.
- Scan time and fixed page-state profile.
- Exact Playwright, Chromium, axe adapter, and axe-core identities.
- The one explicit rule resolved from the profile: **image-alt**, **label**, or **color-contrast**.
- Scan-operation status and, when applicable, a bounded failure reason.
- Coverage facts showing whether the fixture reached readiness and the rule executed.
- The bounded native axe result categories and node data returned for this rule.

The axe value is treated as unknown at the adapter boundary and runtime-validated against the small supported shape before handoff. Unsupported categories, unexpected rule IDs, excessive values, or malformed fields make the scan incomplete or failed.

The observation is not a finding record, evidence record, normalized result, fingerprint, redaction record, or persistence envelope. Unredacted native output exists only transiently in memory and is discarded after Step 2 consumes it or the run fails.

## Step 1 and Step 2 ownership

| Step 1: authorized scan | Step 2: evidence capture |
| --- | --- |
| Validate the minimal fixture authorization attestation | Apply the evidence allowlist |
| Resolve the allowed fixture revision | Sanitize and minimize page/scanner content |
| Launch Playwright-managed Chromium and apply the fixed page-state profile | Create redaction information |
| Execute the one pinned axe-core rule selected by the scenario profile | Create finding and evidence records |
| Record execution status, coverage, and tool/configuration provenance | Create normalized finding projections and comparison-ready evidence |
| Runtime-validate and return the transient native observation | Compute evidence identities or digests required by the selected policy |
| Close the page, context, and browser | Publish permitted records through the selected local persistence mechanism |

There is one validation and transformation path: Step 1 validates third-party runtime data without coercing, filtering, or converting it; Step 2 is the only owner of evidence policy and durable domain records. Step 1 must not create an evidence fingerprint or sanitize, normalize, or persist a competing representation.

Physical co-location does not change this logical ownership. Both modules may run consecutively in the same TypeScript process.

## Candidate end-to-end scan sequence

If evaluation is authorized, one scan runs as follows:

1. The user selects one scenario profile and its failing or corrected fixture revision and confirms the authorization statement.
2. The application rejects a missing attestation or unknown fixture, then creates one scan-run ID and freezes the fixed scan profile.
3. The scan module resolves the selected bundled fixture and verifies its recorded content digest.
4. Playwright launches its matching managed Chromium build and creates one fresh context with network requests blocked.
5. The module loads the bundled static HTML, confirms the scenario/revision marker, and runs only the pinned rule resolved by the selected profile.
6. The axe adapter returns its native result; the module verifies the expected rule, supported result shape, result limits, and coverage.
7. The module closes the page, context, and browser, even after timeout or failure and, where possible, during application shutdown.
8. A completed run passes its transient observation directly to Step 2 in memory. A timed-out, interrupted, stale, malformed, incomplete, or failed run cannot be presented as a successful zero-finding scan.
9. Step 2 applies the evidence policy, creates durable records, and supplies the finding projection to retrieval.

There is no automatic retry. A user-requested retry is a new scan run.

## Repeatability meaning

Step 1 supports deterministic scanning by pinning the fixture bytes, page state, browser, scanner, and rule. It should not compare raw axe payload bytes because timestamps, ordering, or diagnostic fields may differ.

For this slice, repeatability means:

- Repeated failing runs for each profile reach readiness and report the same selected rule, violation category, one intended finding, and stable fixture subject.
- Repeated corrected runs for each profile reach readiness and report the same selected-rule pass for the correlated subject without the failing-revision violation.
- Repeated **color-contrast** runs retain the same scanner-emitted `fgColor`, `bgColor`, `contrastRatio`, `expectedContrastRatio`, `fontSize`, and `fontWeight` values under the fixed profile. The native bucket remains the rule outcome; Step 1 does not independently recalculate it.
- The combined Step 1 and Step 2 evaluation produces the same normalized finding and coverage representation for the same scenario revision and configuration.

Step 2 owns that normalized representation and any fingerprint. Step 1 records the pinned inputs and native observation needed to reproduce it.

## Minimal outcome semantics

Scan-operation status and native axe categories are separate:

| Operation status | Meaning |
| --- | --- |
| Rejected | Admission failed, such as missing attestation or unknown fixture; Chromium did not start. |
| Completed | The fixture reached readiness and the configured rule executed over the declared scope. The native result may contain a violation, pass, inapplicable result, or axe incomplete result. |
| Incomplete | Some browser or coverage work occurred, but readiness or the declared rule scope was not established. It must not appear as zero findings. |
| Failed | Chromium could not launch, fixture loading failed, axe execution failed, runtime validation failed, the timeout elapsed, or required cleanup failed. Application shutdown publishes no completed result. |

An axe **incomplete** result is scanner evidence requiring review; it is not the same as an incomplete scan operation.

## Minimum fixture security

The synthetic fixture remains untrusted browser content even though the project owns it. The smallest adequate controls are:

- Resolve only the six allowed revisions across the three closed fixture families and verify their content digests.
- Use static synthetic content with embedded image bytes where needed and no scripts, frames, form submission, or external resources.
- Create a fresh browser context with no credential, storage state, personal profile, extension, or granted permission.
- Block every attempted HTTP, HTTPS, and WebSocket request; an unexpected request makes the run incomplete.
- Keep downloads disabled, set fixed content/result/time bounds, and close the page, context, and browser on every outcome.
- Run the controlled-fixture evaluation with non-loopback egress disabled and verify that the workflow has no external-network dependency.
- Keep raw target and scanner values out of the React renderer and durable storage until Step 2 has minimized and sanitized them.
- Use only synthetic or explicitly approved non-sensitive fixture data in portfolio demonstrations.

This is a controlled-fixture boundary, not a general hostile-web isolation design.

## Deferred live-page boundary

Live or user-selected pages, arbitrary URLs, authenticated target states, crawling, and a crawler implementation are outside the MVP and this assessment. They require demonstrated product need and a separate accepted scope, authorization, privacy, and threat-model decision before architecture work begins. This document intentionally specifies none of those mechanisms.

## Acceptance criteria for the planned step

The first workflow step is adequately defined for the portfolio slice when a future evaluation can demonstrate that:

- Only the six project-owned revisions in the three closed scenario families can be selected, and each scan requires the recorded attestation.
- One pinned Playwright/Chromium/axe configuration executes exactly one rule resolved from **image-alt**, **label**, or **color-contrast**.
- For every family, the failing revision produces the expected single violation and the corrected revision produces the corresponding same-target passing observation.
- Contrast observations retain the six specified native measurement fields without treating a locally recomputed ratio as the result authority.
- Fixture, page-state, tool, rule, operation, and coverage provenance appear in the transient observation.
- External network access is unnecessary and blocked for the controlled-fixture run.
- Malformed, incomplete, timed-out, interrupted, failed, or stale work never appears as a successful zero-finding result.
- The raw scanner observation remains transient and Step 2 alone creates sanitized, normalized, and durable evidence.
- Repeated runs meet the semantic repeatability definition above.
- Scanning works without retrieval, LangChain, an LLM, or any generation provider.
- Results state the tested rule and limitations and make no accessibility, compliance, or certification claim.

## Open decisions and explicit non-goals

The former single `image-alt` scenario scope is superseded by the accepted three-scenario product decision; this assessment still does not accept its proposed execution details. OD-003 must accept the exact fixtures and browser profiles, OD-014 must select the runtime and browser ownership needed for an authorized stage, and OD-015 must decide the minimum runtime-validation authority. Evidence retention and persistence remain owned by Step 2 and their applicable open decisions; packaging is deferred until distribution enters scope.

Explicit non-goals are arbitrary, live, or authenticated target pages; crawler behavior or implementation; cross-browser equivalence; any fourth rule or fixture family; broad WCAG coverage; production concurrency; browser-worker isolation; process supervision; automatic remediation; and any claim of accessibility conformance.

## Primary sources

The shared browser and scanner sources are listed in [Technology selection — Primary sources](TECHNOLOGY_SELECTION.md#primary-sources).

- [W3C Understanding Success Criterion 1.1.1: Non-text Content](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html)
- [W3C ACT rule: Form field has non-empty accessible name](https://www.w3.org/WAI/standards-guidelines/act/rules/e086e5/)
- [W3C Understanding Success Criterion 4.1.2: Name, Role, Value](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html)
- [W3C Understanding Success Criterion 1.4.3: Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- [axe-core 4.13.0 rule descriptions](https://github.com/dequelabs/axe-core/blob/v4.13.0/doc/rule-descriptions.md)
- [Playwright page content API](https://playwright.dev/docs/api/class-page#page-set-content)
- [Playwright browser-context isolation](https://playwright.dev/docs/browser-contexts)
- [Playwright network interception](https://playwright.dev/docs/network)

## Documentation navigation

- Previous within this workflow step: [Technology selection](TECHNOLOGY_SELECTION.md)
- Up: [Authorized deterministic web scan candidate assessments](README.md)
- Next workflow step: [Accessibility finding and evidence capture assessment](../ACCESSIBILITY_FINDING_EVIDENCE_CAPTURE_ASSESSMENT.md)
- [Architecture index](../../README.md)
- [Project documentation index](../../../README.md)
