# Deferred hostile-URL and public-page hardening assessment

## Authority, status, and scope

**Document status: Deferred post-MVP architecture research.** [ADR-0018](../../decisions/ADR-0018-trusted-operator-url-boundary.md) supersedes the production-oriented boundary in [ADR-0017](../../decisions/ADR-0017-authorized-public-page-scan-boundary.md). The current portfolio MVP treats one operator-entered public HTTPS URL as trusted developer input. Authorization and trust are supported-use assumptions stated through a visible limitation notice, not a separate application attestation workflow.

Assessment date: 2026-08-25. Deferred for the portfolio MVP on 2026-08-27.

This assessment is preserved only to identify work that might become relevant if a later product accepts untrusted targets or claims safe general-Internet scanning. Nothing here is a current requirement, implementation authorization, release claim, or prerequisite for the trusted-input portfolio slice. A future decision must revisit the threat model and choose applicable controls rather than treating this assessment or ADR-0017 as automatically active.

## Current portfolio boundary

The accepted MVP path is intentionally small:

1. The local developer enters one public HTTPS URL. The interface states that only pages the operator is authorized to analyze and trusts are supported.
2. The service parses the URL and rejects malformed input or embedded credentials; it does not prove public reachability or classify network destinations.
3. Playwright opens the page in a fresh non-persistent managed Chromium context with no imported cookies, storage, credentials, extensions, permissions, or personal profile.
4. The scan uses one finite navigation timeout, performs no application-directed interaction or download, and closes the page, context, and browser after every outcome.
5. One atomic axe-core execution scans the top-level main document for exactly `image-alt`, `label`, and `color-contrast` and preserves all returned violation nodes plus separate native `incomplete` observations.
6. Navigation, browser, scanner, malformed-result, timeout, interrupted-collection, or cleanup failure remains visible and cannot be reported as a complete zero-finding result.

The scan does not authenticate, reuse a user browser profile, click controls, submit forms, upload or download files, discover links as targets, crawl, scan multiple pages, or broaden the rule set. Browser redirects and subresources use normal managed-browser behavior. The MVP makes no hostile-page containment, SSRF-resistance, or arbitrary-URL safety claim.

## Why hardening is deferred

The project is a developer-operated portfolio demonstration of deterministic evidence capture, curated RAG and LangChain integration, structured generation, human review, and rescan comparison. A non-bypassable network boundary and adversarial browser qualification would be substantial product-security work that does not demonstrate those primary objectives.

Fresh-context hygiene remains worthwhile because it is simple and prevents accidental reuse of the developer's normal authenticated browser state. It must not be described as proof that a malicious page cannot attack the local machine or reach other network destinations.

## Possible later hardening areas

The following areas are research candidates only after a new product need and accepted threat model exist:

| Area | Question a later decision must answer |
| --- | --- |
| Target admission | Which schemes, ports, host forms, redirects, and authenticated or private destinations are supported? |
| Destination policy | Is SSRF prevention required, and how are DNS results, special-purpose addresses, rebinding, and hostname verification handled? |
| Connection mediation | Can every browser redirect, subresource, worker, and alternate channel be forced through one application-owned enforcement point? |
| Browser isolation | Is a managed context sufficient, or is a separate process, operating-system sandbox, container, or remote browser required? |
| Resource containment | Which request, transfer, duration, DOM, scanner-result, storage, and process limits are justified by measured behavior? |
| Rendering fidelity | How do blocked or altered resources affect contrast, element presence, accessible names, and completeness claims? |
| Qualification | Which adversarial URLs, redirects, DNS changes, subresources, downloads, popups, workers, cleanup failures, and limit boundaries prove the selected design? |
| Distribution | Which warnings, support boundaries, updates, incident handling, and security claims are appropriate for non-developer users? |

Potential mechanisms include an application-owned policy proxy, browser/network interception, address classification, DNS pinning, stricter browser-process isolation, and explicit resource ceilings. None is recommended or selected for the current MVP. A later assessment must verify the capabilities and limitations of the exact browser version and mechanism it proposes.

## Trigger for reconsideration

Reopen this assessment only when at least one of these conditions is accepted into product scope:

- URLs can be supplied by someone other than the trusted local operator;
- the service is exposed beyond the developer's loopback environment;
- private, authenticated, or interaction-driven pages are supported;
- the product is distributed to non-developers;
- safe handling of arbitrary or hostile pages becomes a stated product claim; or
- observed failures show that a lightweight reliability limit is necessary for the portfolio demonstration itself.

A trigger permits evaluation; it does not select a mechanism. The project must create a new ADR before adopting a production hardening boundary.

## Relationship to the evidence workflow

This deferral changes only the scan-target threat assumption. It does not relax the evidence-first workflow:

- Step 1 still returns one validated transient three-rule observation or a visible failure.
- Step 2 still owns evidence allowlisting, sanitization, minimized durable records, and one finding per retained violation node.
- Retrieval and generation still operate on one selected finding, and insufficient evidence still abstains before a provider call.
- Groq payload minimization, credentials, no automatic fallback, model-output validation, human review, and conservative comparison remain unchanged.
- The three project-owned failing and corrected profiles remain the reproducible evaluation baseline.

Public-page variability, redirects, experiments, consent views, localization, and dynamic rendering may make two scans differ without a remediation. A complete result for three rules is never a whole-page accessibility, WCAG-conformance, certification, or legal-compliance conclusion.

## Explicit non-goals for the current MVP

- Implementing an egress proxy, SSRF filter, DNS/IP classifier, rebinding defense, redirect re-attestation, or per-subresource policy.
- Freezing a production request, transfer, memory, DOM, result-size, or storage limit manifest.
- Building an adversarial URL suite, malware-analysis environment, crawler sandbox, remote browser, worker pool, or browser supervisor.
- Claiming universal page compatibility, hostile-page isolation, safe arbitrary-URL handling, or release-grade browser security.
- Changing the exact three-rule scan, evidence minimization, provider, review, or comparison boundaries.

## Primary sources for later reconsideration

- [WHATWG URL Standard](https://url.spec.whatwg.org/)
- [OWASP Server-Side Request Forgery Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html)
- [IANA IPv4 Special-Purpose Address Registry](https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry.xhtml)
- [IANA IPv6 Special-Purpose Address Registry](https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry.xhtml)
- [Playwright browser-context isolation](https://playwright.dev/docs/browser-contexts)
- [Playwright network controls](https://playwright.dev/docs/network)
- [Playwright navigations](https://playwright.dev/docs/navigations)

## Documentation navigation

- Current scan technology proposal: [Technology selection](TECHNOLOGY_SELECTION.md)
- Up: [Authorized deterministic web scan candidate assessments](README.md)
- Evaluation baseline: [Controlled-fixture execution and security](CONTROLLED_FIXTURE_EXECUTION_AND_SECURITY.md)
- Current decision: [ADR-0018: Trusted operator URL boundary for the portfolio MVP](../../decisions/ADR-0018-trusted-operator-url-boundary.md)
- Superseded decision history: [ADR-0017: Authorized public-page scan boundary](../../decisions/ADR-0017-authorized-public-page-scan-boundary.md)
- Next workflow step: [Accessibility finding and evidence capture assessment](../ACCESSIBILITY_FINDING_EVIDENCE_CAPTURE_ASSESSMENT.md)
- [Architecture index](../../README.md)
- [Project documentation index](../../../README.md)
