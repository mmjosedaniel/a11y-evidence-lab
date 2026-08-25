# Controlled-fixture execution and security evaluation assessment

## Authority, status, and scope

**Document status: Proposed evaluation architecture assessment.** [ADR-0017](../../decisions/ADR-0017-authorized-public-page-scan-boundary.md) replaces controlled fixtures as the runtime target boundary but retains them as the deterministic evaluation baseline. ADR-0008, ADR-0009, and ADR-0011 retain their evaluation-baseline scope; no exact fixture or technical detail becomes accepted by association.

Assessment date: 2026-08-23. Expanded to the three-scenario portfolio slice on 2026-08-24.

This assessment owns the proposed project-owned controlled-fixture execution, expected observations, Step 1 handoff, failure, and zero-egress security profile used to evaluate the [authorized deterministic web scan assessment family](README.md). It owns no requirement ID or status, changes no ADR scope, and does not define the product's runtime target intake. Runtime public-page behavior is assessed separately in [Authorized public-page execution and security](AUTHORIZED_PUBLIC_PAGE_EXECUTION_AND_SECURITY.md).

Canonical behavior remains in [Evidence and review workflow requirements — Target authorization and scanning](../../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#target-authorization-and-scanning), [Privacy and security requirements](../../../requirements/quality-security-and-operations/PRIVACY_AND_SECURITY.md), and [Reliability, reproducibility, and operations requirements](../../../requirements/quality-security-and-operations/RELIABILITY_REPRODUCIBILITY_AND_OPERATIONS.md).

## Smallest deterministic evaluation set

The fixed portfolio evaluation should demonstrate exactly three accessibility rule families through the complete product pipeline, not broad scanner coverage. Each row is one logical controlled case with a failing and corrected state. These six states do not imply six projects, pages, or files; physical layout remains an implementation detail.

| Scenario profile | Failing revision | Corrected revision | Expected automated observations |
| --- | --- | --- | --- |
| `informative-image-alt` | One informative synthetic product image has no `alt` attribute. | The same image has a manually reviewed, context-appropriate alternative. | Exactly one **image-alt** violation, then a same-target native pass. Direct mapping: WCAG 2.2 SC 1.1.1. |
| `form-input-label` | Visible text `Email address` is adjacent to one visible `<input type="email">` but is not programmatically associated, and no other accessible-name mechanism is present. | The same input has the visible label `Email address` explicitly associated through matching `for` and `id` values. | Exactly one **label** violation, then a same-target native pass. Direct mapping: WCAG 2.2 SC 4.1.2; the axe rule does not itself test SC 3.3.2 or the whole success criterion/page. |
| `text-contrast` | One 16 CSS px, weight-400 normal-text target is rendered as foreground `#888888` on background `#ffffff`. | The same target retains its typography and is rendered as foreground `#767676` on background `#ffffff`. | Exactly one **color-contrast** violation, then a same-target native pass under the fixed profile. Direct mapping: WCAG 2.2 SC 1.4.3. |

All three cases and both states are project-owned, synthetic, publicly shareable, and static. They contain no script, frame, form submission, external resource, credential, or personal data; image bytes are embedded. Before evaluation, each case's state content, expected rule result, stable fixture-target key, and browser/rule profile are frozen. The deterministic manifest may exercise each logical case independently so a failure is attributable to one rule family. This is an evaluation arrangement, not the runtime public-page scan shape, which performs one exact three-rule page scan and may return multiple findings.

The corrected results prove only the selected axe rule outcomes under the recorded profile. They do not prove alternative-text appropriateness, label accuracy or instruction sufficiency, text readability in every condition, whole-success-criterion satisfaction, page accessibility, or WCAG conformance. Later generation and review must preserve those distinctions and require the scenario-specific manual checks.

| Scenario | Required later manual judgment |
| --- | --- |
| `informative-image-alt` | Confirm that the proposed alternative communicates the informative image's purpose in the fixture context. |
| `form-input-label` | Confirm that `Email address` accurately and clearly identifies the intended input, remains visibly available, activates the associated input as expected, and is accompanied by any necessary instructions. |
| `text-contrast` | Confirm that the target is ordinary text in the intended visual context and remains understandable under relevant visual conditions not established by the one automated measurement. |

Ambiguous variants, any fourth rule family, broader rule sets, and extra fixture permutations remain outside the compact evaluation manifest. Public-page admission and hostile-network behavior are evaluated under the separate runtime assessment; authenticated pages and crawling remain out of scope.

## Minimal component boundary

The controlled evaluation flow is:

**Chrome or Edge → loopback React presentation → local TypeScript service → authorization module → scan module → Playwright-managed Chromium → transient native scanner observation → evidence-capture module**

The authorization, scan, and evidence-capture components are ordinary modules in one local TypeScript service on the developer's machine. The user opens its loopback interface in Chrome or Edge. The React renderer can request an allowed scan and display application-owned projections, but it never receives filesystem, secret, local-model-runtime, browser-automation, or raw page/scanner authority. Playwright launches and cleans up its separate managed Chromium process as part of normal browser automation. No installer, desktop wrapper, or embedded webview is part of the MVP.

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
- The enclosing workflow-run ID and internal scan-execution ID created after successful admission.

A missing confirmation or unknown fixture ID rejects the request before Chromium launches. The interface accepts no arbitrary URL, filesystem path, uploaded HTML, browser option, header, cookie, or credential.

This attestation is intentionally small because the project owns the fixture. It must not be reused as the runtime public-page admission policy; ADR-0017 and the public-page assessment own that boundary.

## Proposed deterministic browser profile

OD-003 accepts freezing the scenario content, expected result, target key, and browser/rule profile before evaluation. The exact serialized values below remain Proposed architecture detail:

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

- Enclosing workflow-run ID, scan-execution ID, and authorization-attestation facts.
- Scenario profile, fixture ID, revision, content digest, and declared failing or corrected state.
- Scan time and fixed page-state profile.
- Exact Playwright, Chromium, axe adapter, and axe-core identities.
- The one explicit rule resolved from the profile: **image-alt**, **label**, or **color-contrast**.
- Scan-execution start/end facts and the enclosing workflow-operation reference. The workflow remains `running` after a successful Step 1 handoff; a scan-stage failure supplies a bounded reason and fails that workflow operation.
- Coverage facts showing whether the fixture reached readiness and the rule executed.
- The bounded native axe result categories and node data returned for this rule.

The axe value is treated as unknown at the adapter boundary and runtime-validated against the small supported shape before handoff. Minimal TypeScript record definitions do not replace this runtime check. Unsupported categories, unexpected rule IDs, excessive values, or malformed fields fail the enclosing workflow operation; they never publish partial success.

The observation is not a finding record, evidence record, normalized result, fingerprint, redaction record, or persistence envelope. Unredacted native output exists only transiently in memory and is discarded after Step 2 consumes it or the run fails.

## Step 1 and Step 2 ownership

| Step 1: authorized scan | Step 2: evidence capture |
| --- | --- |
| Validate the minimal fixture authorization attestation | Apply the evidence allowlist |
| Resolve the allowed fixture revision | Sanitize and minimize page/scanner content |
| Launch Playwright-managed Chromium and apply the fixed page-state profile | Create redaction information |
| Execute the one pinned axe-core rule selected by the scenario profile | Create finding and evidence records |
| Record the scan-execution disposition, coverage, and tool/configuration provenance | Create normalized finding projections and comparison-ready evidence |
| Runtime-validate and return the transient native observation | Compute evidence identities or digests required by the selected policy |
| Close the page, context, and browser | Publish permitted records through the selected local persistence mechanism |

There is one validation and transformation path: Step 1 validates third-party runtime data without coercing, filtering, or converting it; Step 2 is the only owner of evidence policy and durable domain records. Step 1 must not create an evidence fingerprint or sanitize, normalize, or persist a competing representation.

Physical co-location does not change this logical ownership. Both modules may run consecutively in the same TypeScript process.

## Candidate end-to-end scan sequence

If evaluation is authorized, one scan runs as follows:

1. The user selects one scenario profile and its failing or corrected fixture revision and confirms the authorization statement.
2. The application rejects a missing attestation or unknown fixture before starting work. An admitted request starts one workflow run in `running`, assigns one internal scan-execution ID, and binds both to the already frozen scan profile.
3. The scan module resolves the selected bundled fixture and verifies its recorded content digest.
4. Playwright launches its matching managed Chromium build and creates one fresh context with network requests blocked.
5. The module loads the bundled static HTML, confirms the scenario/revision marker, and runs only the pinned rule resolved by the selected profile.
6. The axe adapter returns its native result; the module verifies the expected rule, supported result shape, result limits, and coverage.
7. The module closes the page, context, and browser, even after timeout or failure and, where possible, during application shutdown.
8. A successful scan execution passes its transient observation directly to Step 2 in memory while the enclosing workflow operation remains `running`. A timed-out, interrupted, stale, malformed, coverage-incomplete, or shutdown-interrupted scan fails the workflow operation and cannot be presented as partial success or a successful zero-finding scan.
9. Step 2 applies the evidence policy, creates durable records, and supplies the finding projection to retrieval.

There is no automatic retry. A user-requested retry creates a new workflow run and never overwrites the failed run.

## Reproducibility basis

Step 1 supports reproducible deterministic scanning by pinning the fixture bytes, page state, browser, scanner, and rule. It should not compare raw axe payload bytes because timestamps, ordering, or diagnostic fields may differ.

For this slice, the compact provider-independent manifest runs each scenario definition once. Those checks verify the frozen expected observations below; they do not establish empirical repeatability or add a statistical test program:

- The single failing check for each profile reaches readiness and reports the frozen selected rule, violation category, one intended finding, and stable fixture subject.
- The single corrected check for each profile reaches readiness and reports the frozen selected-rule pass for the correlated subject without the failing-revision violation.
- The **color-contrast** checks retain the frozen scanner-emitted `fgColor`, `bgColor`, `contrastRatio`, `expectedContrastRatio`, `fontSize`, and `fontWeight` values under the fixed profile. The native bucket remains the rule outcome; Step 1 does not independently recalculate it.
- The combined Step 1 and Step 2 evaluation produces the expected normalized finding and coverage representation for the selected scenario revision and configuration.

Step 2 owns that normalized representation and any fingerprint. Step 1 records the pinned inputs and native observation needed to reproduce it. Formal repeated-run evaluation remains deferred.

## Minimal outcome semantics

Admission, the enclosing workflow-operation state, scan-execution disposition, coverage, and native axe categories are separate:

| Dimension | Meaning |
| --- | --- |
| Admission `rejected` | The attestation or closed scenario/state selection was invalid, so no workflow operation or browser execution was started. |
| Workflow `running` | One admitted workflow owns the current scenario and its bounded scan execution. A successful scan handoff does not complete the workflow. The sequential MVP has no cancellation, queue, or concurrent replacement. |
| Scan observation available | The fixture reached readiness, the configured rule executed over the declared scope, the runtime boundary passed, and the transient observation is available for Step 2. This is an internal stage result, not another operation state. |
| Workflow `failed` | Launch, readiness, coverage, axe execution, validation, timeout, cleanup, or shutdown prevented a complete scan observation. No partial-success workflow result is published. |

An axe **incomplete** result is scanner evidence requiring review; it is not the same as a failed scan execution or workflow operation.

## Minimum fixture security

The synthetic fixture remains untrusted browser content even though the project owns it. The smallest adequate controls are:

- Resolve only the failing or corrected state of the three closed scenarios and verify its frozen content identity; this does not prescribe a physical file count.
- Use static synthetic content with embedded image bytes where needed and no scripts, frames, form submission, or external resources.
- Create a fresh browser context with no credential, storage state, personal profile, extension, or granted permission.
- Block every attempted HTTP, HTTPS, and WebSocket request; an unexpected request fails the enclosing workflow operation with a bounded network-policy reason.
- Keep downloads disabled, set fixed content/result/time bounds, and close the page, context, and browser on every outcome.
- Run the controlled-fixture evaluation with non-loopback egress disabled and verify that the workflow has no external-network dependency.
- Keep raw target and scanner values out of the React renderer and durable storage until Step 2 has minimized and sanitized them.
- Use only synthetic or explicitly approved non-sensitive fixture data in portfolio demonstrations.

This is a controlled-fixture boundary, not a general hostile-web isolation design.

## Relationship to the runtime public-page path

ADR-0017 accepts one attested authorized public HTTPS page as the runtime MVP target. This controlled assessment remains intentionally stricter: it blocks all external egress, freezes the content, and supplies known gold observations. Passing these fixture checks does not prove that the public-page destination, redirect, subresource, hostile-content, resource-bound, or privacy controls work. Those need separate evaluation under [Authorized public-page execution and security](AUTHORIZED_PUBLIC_PAGE_EXECUTION_AND_SECURITY.md).

## Acceptance criteria for the controlled evaluation baseline

The controlled evaluation baseline is adequately defined when a future evaluation can demonstrate that:

- Only the failing or corrected logical state of the three project-owned scenarios can be selected, and each scan requires the recorded attestation.
- One pinned Playwright/Chromium/axe configuration executes exactly one rule resolved from **image-alt**, **label**, or **color-contrast**.
- For every family, the failing revision produces the expected single violation and the corrected revision produces the corresponding same-target passing observation.
- Contrast observations retain the six specified native measurement fields without treating a locally recomputed ratio as the result authority.
- Fixture, page-state, tool, rule, operation, and coverage provenance appear in the transient observation.
- External network access is unnecessary and blocked for the controlled-fixture run.
- Malformed, incomplete, timed-out, interrupted, failed, or stale work never appears as a successful zero-finding result.
- The raw scanner observation remains transient and Step 2 alone creates sanitized, normalized, and durable evidence.
- The compact deterministic checks match the frozen expected observations above without claiming repeated-run, performance, or statistical evidence.
- Scanning works without retrieval, LangChain, an LLM, or any generation provider.
- Results state the tested rule and limitations and make no accessibility, compliance, or certification claim.

## Open decisions and explicit non-goals

The former single `image-alt` evaluation scope is superseded by the three-family evaluation manifest. The fixed-input principle, browser-local service boundary, and minimal runtime-validation boundary still do not accept the exact proposed Playwright values or fixture organization. Evidence retention and canonical filesystem persistence remain owned by Step 2. Installer and distribution packaging remain deferred.

Explicit non-goals are using fixtures as the runtime target selector; authenticated targets; crawler behavior or implementation; cross-browser equivalence; any fourth rule or fixture family; broad WCAG coverage; production concurrency; automatic remediation; and any claim of accessibility conformance. Public-page security controls belong to the adjacent runtime assessment, not this zero-egress fixture profile.

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

- Previous within this workflow step: [Authorized public-page execution and security](AUTHORIZED_PUBLIC_PAGE_EXECUTION_AND_SECURITY.md)
- Up: [Authorized deterministic web scan candidate assessments](README.md)
- Next workflow step: [Accessibility finding and evidence capture assessment](../ACCESSIBILITY_FINDING_EVIDENCE_CAPTURE_ASSESSMENT.md)
- [Architecture index](../../README.md)
- [Project documentation index](../../../README.md)
