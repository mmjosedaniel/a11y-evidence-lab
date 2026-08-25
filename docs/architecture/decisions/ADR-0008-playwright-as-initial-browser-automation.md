# ADR-0008: Playwright as the initial browser automation technology

- **Status:** Accepted for evaluation
- **Decision date:** 2026-08-23

## Context

The product needs repeatable browser execution for authorized controlled fixtures. Browser automation must pin page state and material environment settings, isolate execution, constrain networking and resources, and make scanner evidence reproducible without becoming coupled to a particular accessibility engine.

Playwright provides browser automation, isolated browser contexts, a versioned browser lifecycle, navigation and network controls, and integration paths for accessibility engines. These capabilities are suitable for an initial evaluation but do not establish safe live-target scanning, packaging ownership, or cross-browser equivalence.

## Considered options

1. Use Selenium or WebDriver.
2. Use a browser extension or manual capture as the primary execution path.
3. Build direct browser-protocol integration.
4. Use Playwright with one pinned Chromium configuration.

## Decision

Use Playwright with a pinned Chromium configuration as the initial browser-automation technology for evaluation only.

- Begin with controlled fixtures and pin the browser build, Playwright version, viewport, locale, page-state procedure, timing policy, permissions, and relevant browser flags.
- Use isolated application-controlled contexts without unrelated extensions, profiles, credentials, service workers, or external egress.
- Record navigation, redirects, subresource policy, execution status, and material sources of nondeterminism for each scan.
- Keep the accessibility scanner behind a separate scan adapter so browser automation can be tested or replaced independently.
- Validate deterministic fixture loading, repeatability, timeout and abort cleanup, crash recovery, resource limits, and sanitization boundaries. Validate interactive cancellation only if a later stage introduces it.
- Do not enable live targets until the authorization, redirect, network, browser-isolation, and threat-model gates are accepted.

Promoting Playwright to the release stack requires repeatability, security, application-accessibility, packaging, browser-update, and sustained-resource validation.

## Consequences

- Page execution and browser state can be pinned and reproduced independently of generation.
- The project must package or provision a compatible browser build and maintain a controlled security-update process.
- Browser behavior and Playwright upgrades can change evidence and require regression testing.
- Live targets and cross-browser support remain separate decisions.

## Primary references

- [Playwright documentation](https://playwright.dev/docs/library)
- [Playwright TypeScript support](https://playwright.dev/docs/test-typescript)

## Related decisions and requirements

- [Authorized deterministic web scan candidate assessments](../candidates/authorized-scan/README.md) — Proposed selection and execution detail; it does not change this ADR's evaluation-only scope.
- [ADR-0009: axe-core as the initial accessibility scanner](ADR-0009-axe-core-as-initial-accessibility-scanner.md)
- [ADR-0011: TypeScript as the initial application language](ADR-0011-typescript-as-initial-application-language.md)
- [Evidence and review workflow requirements](../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md): `REQ-AUTH-*`, `REQ-SCAN-003`, and `REQ-SCAN-004`
- [Reliability, reproducibility, and operations requirements](../../requirements/quality-security-and-operations/RELIABILITY_REPRODUCIBILITY_AND_OPERATIONS.md): `REQ-QUAL-010`
- [Privacy and security requirements](../../requirements/quality-security-and-operations/PRIVACY_AND_SECURITY.md): `REQ-SEC-001` and `REQ-SEC-011`
