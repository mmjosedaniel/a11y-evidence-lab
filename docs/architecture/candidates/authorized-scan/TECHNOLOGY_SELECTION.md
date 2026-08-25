# Authorized deterministic web scan technology selection assessment

## Authority, status, and scope

**Document status: Proposed architecture assessment.** ADR-0008, ADR-0009, and ADR-0011 retain their accepted evaluation-baseline scope; no part of this assessment becomes accepted by association.

Assessment date: 2026-08-23. Expanded to the three-scenario portfolio slice on 2026-08-24.

This assessment owns the technology-selection portion of the [authorized deterministic web scan assessment family](README.md). It owns no requirement or ADR status and does not authorize implementation or live-page scanning. Canonical behavior remains in [Evidence and review workflow requirements — Target authorization and scanning](../../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#target-authorization-and-scanning).

## Minimal recommendation

Use ordinary TypeScript modules in **one local application service**:

1. An authorization/admission module accepts only a project-owned scenario ID, its failing or corrected fixture revision, and an explicit attestation.
2. A scan module uses the Playwright Library to launch its managed Chromium build and create a fresh browser context.
3. An axe adapter resolves the selected scenario to exactly one pinned rule—**image-alt**, **label**, or **color-contrast**—and returns a transient native axe result.
4. A minimal runtime boundary validates the supported result shape before the in-memory handoff to Step 2.

The user opens the React interface from the service's loopback address in an installed Chrome or Edge browser. That UI browser is distinct from Playwright-managed Chromium, which is necessarily a browser process used only for the controlled scan. The application does not add its own scan worker, IPC protocol, supervisor, policy proxy, desktop wrapper, installer, or additional service boundary for this slice.

The scan stage remains intentionally small. LangChain, retrieval, embeddings, vector storage, LangGraph, LangSmith, and LLM providers do not belong in Step 1; they consume its captured evidence in later stages.

## Technology profile

Exact versions are dated research seeds, not release selections. They must be refreshed and pinned before an authorized evaluation.

| Concern | Minimal candidate | Status and boundary |
| --- | --- | --- |
| Application language | TypeScript with strict independent type checking | **Accepted for evaluation** by [ADR-0011](../../decisions/ADR-0011-typescript-as-initial-application-language.md). |
| Local JavaScript runtime | Node.js 24 LTS; 24.19.0 is the dated seed | **Proposed.** ADR-0011 does not select a runtime. |
| Browser automation | playwright@1.62.1 Library | Playwright with pinned Chromium is **Accepted for evaluation** by [ADR-0008](../../decisions/ADR-0008-playwright-as-initial-browser-automation.md); this exact package version remains Proposed. |
| Browser | Matching Playwright-managed Chromium, headless, sandbox explicitly enabled, in a fresh non-persistent context | The pinned-Chromium evaluation baseline is accepted; exact artifact identity remains Proposed. Packaging, update policy, and release support are Deferred under OD-014 and OD-017. Never use a personal profile or silently fall back to an installed Chrome or Edge. |
| Accessibility scanner | @axe-core/playwright@4.13.0 with the resolved axe-core version recorded | axe-core through its Playwright adapter is **Accepted for evaluation** by [ADR-0009](../../decisions/ADR-0009-axe-core-as-initial-accessibility-scanner.md). |
| Rule selection | Exactly one rule per operation, selected from **image-alt**, **label**, or **color-contrast** by the closed scenario profile | The three-scenario slice is accepted product scope; this exact execution profile remains Proposed. Package defaults and broad WCAG tags do not define the slice. |
| Fixture loading | Three logical fixture definitions, each with a failing and corrected state, loaded as controlled static page content; any image bytes are embedded and no network resource is required | **Proposed.** One operation loads only the selected logical state. The physical projects, pages, or files are implementation details, not an MVP requirement. |
| Runtime validation | Minimal TypeScript record definitions plus a small runtime check for the transient scanner observation | The boundary is accepted in principle; exact validation code or library remains Proposed. Compile-time TypeScript types do not validate axe data at runtime, and no JSON Schema, code-generation, or compatibility framework is required. |
| Application topology | Loopback React UI plus authorization, scan, and evidence modules in one local TypeScript service | The local-service and unprivileged Chrome/Edge loopback topology is **Accepted** by ADR-0015. Co-locating these exact modules in one service is a Proposed YAGNI implementation detail; the browser renders only sanitized projections, and the service owns Playwright and privileged records. |

The scanner configuration should request native violations, incomplete results, passes, and inapplicable results for the one selected rule. Step 1 returns those categories transiently; Step 2 decides which permitted fields become evidence. In particular, a passing observation for the corrected target can support later comparison, but it establishes only the selected rule outcome under the recorded profile. It does not establish that alternative text is contextually appropriate, that a form label is accurate or sufficient for all users, that text is readable in every rendered condition, or that the page satisfies a whole WCAG success criterion.

## Why this is sufficient

### Playwright supplies the deterministic rendered page

Playwright can launch the matching managed browser, create an isolated context, set a fixed viewport and locale, load the bundled static page, block unexpected network requests, and run axe against the rendered DOM. That demonstrates browser automation without building a general browser-execution platform.

The product uses the Playwright Library because scanning is application behavior. A future evaluation may use @playwright/test as test tooling, but the test runner does not need to become the product runtime.

### axe-core supplies source evidence without replacing human review

axe-core provides stable rule identifiers and native result categories. The slice uses three closed profiles, never a broad default run:

- **image-alt:** the failing revision produces one violation for the selected informative image; the corrected revision produces a same-target pass. Its direct mapping is WCAG 2.2 SC 1.1.1.
- **label:** the failing revision produces one violation for the selected email input with no non-empty accessible name; the corrected revision uses an explicit visible `label` associated through matching `for` and `id` values and produces a same-target pass. Current official axe metadata maps this rule to WCAG 2.2 SC 4.1.2, not directly to SC 3.3.2. A pass still needs human review of label purpose, clarity, and visible instructions.
- **color-contrast:** the failing revision produces one violation for 16 CSS px, weight-400 normal text rendered as `#888888` on `#ffffff`; the corrected revision renders the same text as `#767676` on `#ffffff` and produces a same-target pass. Its direct mapping is WCAG 2.2 SC 1.4.3. The native result bucket is the scanner outcome; emitted color, ratio, font-size, font-weight, and expected-ratio values are supporting evidence rather than a second pass/fail calculation.
- Native incomplete results remain distinguishable from violations, passes, and scan-stage or enclosing-workflow failures.

These are automated observations under a recorded configuration, not certification, whole-success-criterion determinations, or findings that a page is accessible or conformant.

### TypeScript keeps the adapter small and visible

TypeScript fits the accepted evaluation baseline and the Playwright ecosystem. It also lets the portfolio show a clear adapter boundary between third-party axe data and application-owned records. Static types do not validate runtime scanner data, so a small runtime check is still required at that external boundary before Step 2 consumes it. A schema framework, code generator, and multiple schema dialects would not add value to this fixed slice.

The initial slice does not need a second application process. Fault isolation, IPC compatibility, process-tree supervision, and restart protocols would add implementation surface without improving the RAG demonstration.

## Responsibilities deliberately excluded

This technology choice does not make Step 1 responsible for:

- Evidence allowlisting, sanitization, redaction, normalization, or fingerprints.
- Finding or evidence record construction.
- Persistence or publication.
- Retrieval, prompting, generation, review, or comparison.
- Arbitrary URL input, live or authenticated target pages, crawling or a crawler implementation, uploaded HTML, or user browser profiles.
- Any rule, fixture, or WCAG coverage beyond the three closed scenario profiles.
- Production-scale browser isolation, parallel scans, or cross-browser coverage.
- Installer, desktop-shell, embedded-webview, or Start-menu integration.

Those boundaries prevent the scan adapter from becoming a second evidence domain.

## Meaningful alternatives

| Alternative | Trade-off |
| --- | --- |
| Playwright route fulfillment on a virtual fixture origin | Adds realistic URL and relative-resource behavior, but also adds a manifest and routing policy. Adopt it only if a selected controlled fixture later requires multiple resources, frames, or navigation that page-content loading cannot represent. |
| Puppeteer with an axe-core adapter | Could perform the same three narrow scans, but it duplicates the already accepted Playwright evaluation direction and adds no portfolio value. Reconsider only if Playwright fails the controlled-fixture evaluation. |

## Primary sources

Time-sensitive version sources were checked on 2026-08-24.

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro)
- [Node.js release status](https://nodejs.org/en/about/previous-releases)
- [Playwright Library](https://playwright.dev/docs/library)
- [Playwright browser management](https://playwright.dev/docs/browsers)
- [Playwright browser-context isolation](https://playwright.dev/docs/browser-contexts)
- [Playwright network interception](https://playwright.dev/docs/network)
- [Playwright accessibility testing](https://playwright.dev/docs/accessibility-testing)
- [Playwright 1.62.1 release](https://github.com/microsoft/playwright/releases/tag/v1.62.1)
- [axe-core 4.13.0 API and result model](https://github.com/dequelabs/axe-core/blob/v4.13.0/doc/API.md)
- [axe-core 4.13.0 rule descriptions](https://github.com/dequelabs/axe-core/blob/v4.13.0/doc/rule-descriptions.md)
- [axe-core 4.13.0 `image-alt` rule metadata](https://github.com/dequelabs/axe-core/blob/v4.13.0/lib/rules/image-alt.json)
- [axe-core 4.13.0 `label` rule metadata](https://github.com/dequelabs/axe-core/blob/v4.13.0/lib/rules/label.json)
- [axe-core 4.13.0 `color-contrast` rule metadata](https://github.com/dequelabs/axe-core/blob/v4.13.0/lib/rules/color-contrast.json)
- [axe-core 4.13.0 contrast evaluator and emitted measurement fields](https://github.com/dequelabs/axe-core/blob/v4.13.0/lib/checks/color/color-contrast-evaluate.js)
- [WCAG 2.2 SC 1.1.1: Non-text Content](https://www.w3.org/TR/WCAG22/#non-text-content)
- [WCAG 2.2 SC 4.1.2: Name, Role, Value](https://www.w3.org/TR/WCAG22/#name-role-value)
- [W3C ACT rule: Form field has non-empty accessible name](https://www.w3.org/WAI/standards-guidelines/act/rules/e086e5/)
- [WCAG 2.2 SC 1.4.3: Contrast (Minimum)](https://www.w3.org/TR/WCAG22/#contrast-minimum)
- [@axe-core/playwright 4.13.0 package](https://github.com/dequelabs/axe-core-npm/tree/v4.13.0/packages/playwright)

## Documentation navigation

- Up: [Authorized deterministic web scan candidate assessments](README.md)
- Next within this workflow step: [Controlled-fixture execution and security](CONTROLLED_FIXTURE_EXECUTION_AND_SECURITY.md)
- [Architecture index](../../README.md)
- [Local MVP feasibility](../../../LOCAL_MVP_FEASIBILITY.md)
- [Project documentation index](../../../README.md)
