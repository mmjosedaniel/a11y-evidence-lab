# ADR-0008: Playwright as the initial browser automation technology

- **Status:** Accepted for evaluation
- **Decision date:** 2026-08-23

## Context

The product needs repeatable browser execution for authorized controlled fixtures. Browser automation must pin page state and material environment settings, isolate execution, constrain networking and resources, and make scanner evidence reproducible without becoming coupled to a particular accessibility engine.

Playwright provides browser automation, isolated browser contexts, a versioned browser lifecycle, navigation and network controls, and integration paths for accessibility engines. These capabilities are suitable for an initial evaluation but do not establish safe live-target scanning, packaging ownership, or cross-browser equivalence.

### MVP distribution amendment recorded 2026-08-25

ADR-0015 and OD-014 replace the original distributable-browser assumption for the portfolio MVP. The developer-run evaluation may provision Playwright's matching managed Chromium through the evaluated development setup, but it does not package a browser or define application-owned browser updates, signing, repair, or release support. OD-017 also defers release qualification. The original packaging and controlled security-update direction remains preserved below as future decision history and requires a new distribution decision before it applies.

### MVP manifest-count clarification recorded 2026-08-25

The compact manifest runs each frozen failing/corrected scenario definition once and checks its expected browser observation. The original repeated-run validation language below remains future evaluation history; formal repetitions and empirical repeatability claims are Deferred for this MVP. Pinning and provenance still provide the basis for reproduction without adding repeated executions to the accepted manifest.

### Authorized public-page amendment recorded 2026-08-25

[ADR-0017](ADR-0017-authorized-public-page-scan-boundary.md) accepts one explicitly attested public HTTPS URL per `PageAnalysisRun`. It supersedes only this record's earlier synthetic-only/live-target deferral: Playwright remains Accepted for evaluation, the controlled fixtures remain the reproducible evaluation baseline, and authenticated browsing, profile reuse, interaction, crawling, and general Internet automation remain outside the MVP. Public-page execution is permitted only through the application-owned hostile-network boundary and hard fail-closed limits accepted by ADR-0017. The concrete egress-gate mechanism and numeric ceilings require pre-development qualification and are not selected here.

### Trusted operator URL amendment recorded 2026-08-27

[ADR-0018](ADR-0018-trusted-operator-url-boundary.md) supersedes ADR-0017 for the portfolio MVP. The single operator-entered, explicitly authorized public HTTPS URL is treated as trusted input; the MVP does not implement or claim a production security boundary for malicious URLs, DNS changes, redirects, subresources, or page code. Playwright still uses a fresh non-persistent context with no imported browser state, a simple finite navigation timeout, cleanup after every outcome, and no application-driven crawling, clicks, form submissions, uploads, or download workflow. Production-grade untrusted-target containment and adversarial qualification are Deferred.

## Considered options

1. Use Selenium or WebDriver.
2. Use a browser extension or manual capture as the primary execution path.
3. Build direct browser-protocol integration.
4. Use Playwright with one pinned Chromium configuration.

## Decision

Use Playwright with a pinned Chromium configuration as the initial browser-automation technology for evaluation only.

- Retain the controlled fixtures as the fixed evaluation baseline and record the browser, Playwright, viewport, locale, page-state, timing, permission, and relevant browser-flag identities used for the trusted-page path.
- For every trusted-page run, launch a fresh non-persistent Playwright-managed Chromium context with no granted permissions, unrelated extensions, reused profile, ambient credentials, imported storage, or access to an existing Chrome or Edge session. Do not add application-driven clicks, form submissions, uploads, download handling, crawling, or additional analysis targets. Apply one simple finite navigation timeout and destroy the context and browser after completion, failure, or timeout.
- Use ordinary browser navigation for the one trusted operator-entered HTTPS URL. Redirects and subresources loaded as part of that navigation do not become separate analysis targets, and the MVP does not claim that it safely contains a hostile page or proves public reachability.
- Record the entered and final page identities, browser/scanner configuration, coverage disposition, execution status, and material sources of nondeterminism without retaining excluded raw content or secrets.
- Keep the accessibility scanner behind a separate scan adapter so browser automation can be tested or replaced independently.
- Validate deterministic fixture loading, trusted-page navigation, the simple timeout and cleanup behavior, scanner handoff, complete result visibility, and evidence-minimization boundaries. Validate interactive cancellation only if a later stage introduces it.

Promoting Playwright to a release stack is Deferred. The MVP evaluation requires only the single-run frozen controlled-fixture observations plus trusted-page navigation, cleanup, complete-result, evidence, and practical-resource observations. Repeated-run evaluation, hostile-target qualification, packaging, browser-update ownership, broad application-accessibility qualification, and sustained-resource release gates require a later decision.

## Consequences

- Page execution and browser state can be pinned and reproduced independently of generation.
- The evaluation setup must use the matching recorded Playwright-managed browser build. The original requirement to package or provision a release browser and maintain an application-owned security-update process is Deferred for the MVP under the 2026-08-25 amendment.
- Browser behavior and Playwright upgrades can change evidence and require regression testing.
- The trusted-page path is deliberately a portfolio demonstration, not a production-safe untrusted-URL scanner. Authenticated targets, hostile-target containment, interaction automation, crawling, browser-profile reuse, and cross-browser support remain separate decisions.

## Primary references

- [Playwright documentation](https://playwright.dev/docs/library)
- [Playwright TypeScript support](https://playwright.dev/docs/test-typescript)
- [Playwright browser-context isolation](https://playwright.dev/docs/browser-contexts)
- [Playwright network controls](https://playwright.dev/docs/network)

## Related decisions and requirements

- [Authorized deterministic web scan candidate assessments](../candidates/authorized-scan/README.md) — Proposed selection and execution detail; it does not change this ADR's evaluation-only scope.
- [ADR-0009: axe-core as the initial accessibility scanner](ADR-0009-axe-core-as-initial-accessibility-scanner.md)
- [ADR-0011: TypeScript as the initial application language](ADR-0011-typescript-as-initial-application-language.md)
- [ADR-0018: Trusted operator URL boundary](ADR-0018-trusted-operator-url-boundary.md)
- [Evidence and review workflow requirements](../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md): `REQ-AUTH-*` and `REQ-SCAN-*`
- [Reliability, reproducibility, and operations requirements](../../requirements/quality-security-and-operations/RELIABILITY_REPRODUCIBILITY_AND_OPERATIONS.md): `REQ-QUAL-*`
- [Privacy and security requirements](../../requirements/quality-security-and-operations/PRIVACY_AND_SECURITY.md): `REQ-SEC-*`
