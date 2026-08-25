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

## Considered options

1. Use Selenium or WebDriver.
2. Use a browser extension or manual capture as the primary execution path.
3. Build direct browser-protocol integration.
4. Use Playwright with one pinned Chromium configuration.

## Decision

Use Playwright with a pinned Chromium configuration as the initial browser-automation technology for evaluation only.

- Retain the controlled fixtures as the fixed evaluation baseline and use the same recorded browser, Playwright, viewport, locale, page-state, timing, permission, and relevant browser-flag identities for the qualified public-page path.
- For every public-page run, launch a fresh non-persistent Playwright-managed Chromium context with the browser sandbox enabled, no granted permissions, unrelated extensions, reused profile, ambient credentials, imported storage, or access to an existing Chrome or Edge session. Block service workers, downloads, popups, additional page targets, subframe scanning, file access, WebSockets, and other unapproved network mechanisms. Destroy the context and browser after completion, failure, timeout, or shutdown.
- Permit public-page networking only through the non-bypassable loopback egress gate owned by the local application service. Initial navigation, fresh DNS results, redirects, and subresources must be mediated and revalidated; any browser network channel that the gate cannot contain is blocked.
- Record the attested entry target identity, validated navigation chain, bounded subresource-policy outcome, browser/scanner configuration, coverage disposition, execution status, and material sources of nondeterminism without retaining excluded raw content or secrets. A redirect that changes the attested target identity stops the run and requires a new attestation rather than silently broadening it.
- Keep the accessibility scanner behind a separate scan adapter so browser automation can be tested or replaced independently.
- Validate deterministic fixture loading, the authorized public-page egress boundary, DNS and redirect handling, subresource mediation, timeouts, abort and crash cleanup, hard resource limits, scanner handoff, and sanitization boundaries. Validate interactive cancellation only if a later stage introduces it.
- Do not implement or represent public-page scanning as qualified until the threat model, in-bounds request policy, redirect policy, public-address rules, numeric limits, cleanup contract, and adversarial cases required by ADR-0017 are frozen and pass. Any uncertain network or resource state fails closed.

Promoting Playwright to a release stack is Deferred. Under the 2026-08-25 clarifications, the MVP evaluation requires only the single-run frozen controlled-fixture observations, network-policy, cleanup, evidence, and practical-resource observations; repeated-run evaluation, packaging, browser-update ownership, broad application-accessibility qualification, and sustained-resource release gates require a later decision.

## Consequences

- Page execution and browser state can be pinned and reproduced independently of generation.
- The evaluation setup must use the matching recorded Playwright-managed browser build. The original requirement to package or provision a release browser and maintain an application-owned security-update process is Deferred for the MVP under the 2026-08-25 amendment.
- Browser behavior and Playwright upgrades can change evidence and require regression testing.
- The public-page path introduces a security-critical egress and resource-containment obligation that controlled fixtures did not require. Authenticated targets, interaction automation, crawling, browser-profile reuse, and cross-browser support remain separate decisions.

## Primary references

- [Playwright documentation](https://playwright.dev/docs/library)
- [Playwright TypeScript support](https://playwright.dev/docs/test-typescript)
- [Playwright browser-context isolation](https://playwright.dev/docs/browser-contexts)
- [Playwright network controls](https://playwright.dev/docs/network)

## Related decisions and requirements

- [Authorized deterministic web scan candidate assessments](../candidates/authorized-scan/README.md) — Proposed selection and execution detail; it does not change this ADR's evaluation-only scope.
- [ADR-0009: axe-core as the initial accessibility scanner](ADR-0009-axe-core-as-initial-accessibility-scanner.md)
- [ADR-0011: TypeScript as the initial application language](ADR-0011-typescript-as-initial-application-language.md)
- [ADR-0017: Authorized public-page scan boundary](ADR-0017-authorized-public-page-scan-boundary.md)
- [Evidence and review workflow requirements](../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md): `REQ-AUTH-*` and `REQ-SCAN-*`
- [Reliability, reproducibility, and operations requirements](../../requirements/quality-security-and-operations/RELIABILITY_REPRODUCIBILITY_AND_OPERATIONS.md): `REQ-QUAL-*`
- [Privacy and security requirements](../../requirements/quality-security-and-operations/PRIVACY_AND_SECURITY.md): `REQ-SEC-*`
