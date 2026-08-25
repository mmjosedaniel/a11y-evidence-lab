# Authorized deterministic web scan technology selection assessment

## Authority, status, and scope

**Document status: Proposed architecture assessment.** ADR-0008, ADR-0009, and ADR-0011 retain their accepted evaluation-baseline scope; no part of this assessment becomes accepted by association.

Assessment date: 2026-08-23. Simplified for the portfolio vertical slice on 2026-08-24.

This assessment owns the technology-selection portion of the [authorized deterministic web scan assessment family](README.md). It owns no requirement or ADR status and does not authorize implementation or live-page scanning. Canonical behavior remains in [Evidence and review workflow requirements — Target authorization and scanning](../../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#target-authorization-and-scanning).

## Minimal recommendation

Use ordinary TypeScript modules in **one local application process**:

1. An authorization/admission module accepts only a project-owned fixture ID and an explicit attestation.
2. A scan module uses the Playwright Library to launch its managed Chromium build and create a fresh browser context.
3. An axe adapter runs one pinned rule, **image-alt**, and returns a transient native axe result.
4. A small runtime boundary validates the supported result shape before the in-memory handoff to Step 2.

Playwright-managed Chromium is necessarily a browser process, but the application does not add its own scan worker, IPC protocol, supervisor, policy proxy, or service boundary for this slice.

The scan stage remains intentionally small. LangChain, retrieval, embeddings, vector storage, LangGraph, LangSmith, and LLM providers do not belong in Step 1; they consume its captured evidence in later stages.

## Technology profile

Exact versions are dated research seeds, not release selections. They must be refreshed and pinned before an authorized evaluation.

| Concern | Minimal candidate | Status and boundary |
| --- | --- | --- |
| Application language | TypeScript with strict independent type checking | **Accepted for evaluation** by [ADR-0011](../../decisions/ADR-0011-typescript-as-initial-application-language.md). |
| Local JavaScript runtime | Node.js 24 LTS; 24.19.0 is the dated seed | **Proposed.** ADR-0011 does not select a runtime. |
| Browser automation | playwright@1.62.1 Library | Playwright with pinned Chromium is **Accepted for evaluation** by [ADR-0008](../../decisions/ADR-0008-playwright-as-initial-browser-automation.md); this exact package version remains Proposed. |
| Browser | Matching Playwright-managed Chromium, headless, sandbox explicitly enabled, in a fresh non-persistent context | The pinned-Chromium evaluation baseline is accepted; exact artifact identity, packaging, update policy, and release support remain Proposed. Never use a personal profile or silently fall back to an installed Chrome or Edge. |
| Accessibility scanner | @axe-core/playwright@4.13.0 with the resolved axe-core version recorded | axe-core through its Playwright adapter is **Accepted for evaluation** by [ADR-0009](../../decisions/ADR-0009-axe-core-as-initial-accessibility-scanner.md). |
| Rule selection | Explicit **image-alt** rule only | The scenario is accepted by OD-002; this exact execution profile remains Proposed. Package defaults and broad WCAG tags do not define this slice. |
| Fixture loading | Two bundled static HTML revisions loaded with Playwright page content; image bytes are embedded and no network resource is required | **Proposed.** This is sufficient for the one-document fixture and is not evidence for real navigation or live-page safety. |
| Runtime validation | One small versioned schema for the transient scanner observation | Required by REQ-QUAL-010. The schema authority and validation library remain open under OD-015; no IPC schema is needed. |
| Application topology | Authorization, scan, and evidence modules in one local TypeScript application process | **Proposed YAGNI choice.** The React renderer remains unable to call Playwright directly, as required by REQ-SEC-019. |

The scanner configuration should request native violations, incomplete results, passes, and inapplicable results for **image-alt**. Step 1 returns those categories transiently; Step 2 decides which permitted fields become evidence. In particular, a passing observation for the corrected image can support later comparison, but it does not establish that the alternative text is contextually appropriate.

## Why this is sufficient

### Playwright supplies the deterministic rendered page

Playwright can launch the matching managed browser, create an isolated context, set a fixed viewport and locale, load the bundled static page, block unexpected network requests, and run axe against the rendered DOM. That demonstrates browser automation without building a general browser-execution platform.

The product uses the Playwright Library because scanning is application behavior. A future evaluation may use @playwright/test as test tooling, but the test runner does not need to become the product runtime.

### axe-core supplies source evidence without replacing human review

axe-core provides a stable rule identifier and native result categories. The initial slice needs only one rule:

- The baseline fixture should produce one **image-alt** violation for the selected image.
- The corrected fixture should no longer produce that violation and should include the same subject in the rule's passing result.
- Native incomplete results remain distinguishable from both violations and scan-operation failures.

These are automated observations under a recorded configuration, not a certification or a determination that the page or alternative text is accessible.

### TypeScript keeps the adapter small and visible

TypeScript fits the accepted evaluation baseline and the Playwright ecosystem. It also lets the portfolio show a clear adapter boundary between third-party axe data and application-owned records. Static types do not validate runtime scanner data, so a small runtime check is still required before Step 2 consumes it.

The initial slice does not need a second application process. Fault isolation, IPC compatibility, process-tree supervision, and restart protocols would add implementation surface without improving the RAG demonstration.

## Responsibilities deliberately excluded

This technology choice does not make Step 1 responsible for:

- Evidence allowlisting, sanitization, redaction, normalization, or fingerprints.
- Finding or evidence record construction.
- Persistence or publication.
- Retrieval, prompting, generation, review, or comparison.
- Arbitrary URL input, crawling, authentication, uploaded HTML, or browser profiles.
- Production-scale browser isolation, parallel scans, or cross-browser coverage.

Those boundaries prevent the scan adapter from becoming a second evidence domain.

## Meaningful alternatives

| Alternative | Trade-off |
| --- | --- |
| Playwright route fulfillment on a virtual fixture origin | Adds realistic URL and relative-resource behavior, but also adds a manifest and routing policy. Adopt it only if the selected fixture later requires multiple resources, frames, or navigation that page-content loading cannot represent. |
| Puppeteer with the axe-core adapter | Could perform the same narrow scan, but it duplicates the already accepted Playwright evaluation direction and adds no portfolio value for this scenario. Reconsider only if Playwright fails the controlled-fixture evaluation. |

## Primary sources

Time-sensitive version sources were checked on 2026-08-23.

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
- [@axe-core/playwright 4.13.0 package](https://github.com/dequelabs/axe-core-npm/tree/v4.13.0/packages/playwright)

## Documentation navigation

- Up: [Authorized deterministic web scan candidate assessments](README.md)
- Next within this workflow step: [Controlled-fixture execution and security](CONTROLLED_FIXTURE_EXECUTION_AND_SECURITY.md)
- [Architecture index](../../README.md)
- [Local MVP feasibility](../../../LOCAL_MVP_FEASIBILITY.md)
- [Project documentation index](../../../README.md)
