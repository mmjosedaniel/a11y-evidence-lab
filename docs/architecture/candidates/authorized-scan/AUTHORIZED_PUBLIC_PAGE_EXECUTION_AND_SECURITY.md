# Authorized public-page execution and security assessment

## Authority, status, and scope

**Document status: Proposed architecture assessment.** [ADR-0017](../../decisions/ADR-0017-authorized-public-page-scan-boundary.md) owns the accepted MVP policy: one explicitly attested authorized public HTTPS page, one atomic scan limited to `image-alt`, `label`, and `color-contrast`, and no crawling or authenticated/private target support. This assessment proposes the smallest technical shape for enforcing that policy. It owns no requirement or ADR status, authorizes no implementation, and does not accept an exact network library, proxy, browser flag, numeric limit, or release dependency.

Assessment date: 2026-08-25.

Canonical behavior remains in [Evidence and review workflow requirements — Target authorization and scanning](../../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#target-authorization-and-scanning), [Privacy and security requirements](../../../requirements/quality-security-and-operations/PRIVACY_AND_SECURITY.md), and [Reliability, reproducibility, and operations requirements](../../../requirements/quality-security-and-operations/RELIABILITY_REPRODUCIBILITY_AND_OPERATIONS.md).

## Recommended minimal boundary

Keep the user-facing application local while treating the scanned page as hostile network content:

**Chrome or Edge UI → loopback local service → admission and destination policy → Playwright-managed Chromium → bounded public HTTPS egress → transient axe result → evidence capture**

The local service remains the only application backend and owns admission, browser lifecycle, scan configuration, and durable records. The browser UI sends the requested URL and attestation to the local service; it never receives Playwright, network-policy, filesystem, provider, or credential authority.

The implementation needs one application-owned egress enforcement point that can validate actual destinations for the initial request, redirects, and permitted subresources. A small local policy proxy or an equivalently enforceable browser/network mechanism are candidate implementations. Playwright routing can contribute request controls, but this assessment does not assume URL interception alone prevents DNS rebinding or every browser network path. The exact mechanism remains open and must pass the accepted threat-model checks before the public-page path can be considered safe.

No worker pool, general web proxy product, crawler service, remote browser, or distributed sandbox is proposed.

## Admission contract

Before a workflow operation or Chromium process starts, the local service should require:

- one user-entered URL;
- the displayed normalized target;
- an affirmative authorization attestation with statement version and application-recorded time; and
- acknowledgement that the scan covers one public page and only the three named automated rules.

The smallest proposed admission policy is:

- parse with one standards-conforming URL implementation;
- require HTTPS, a host name, and the accepted default destination port 443 only; reject user information, fragments as target identity, credentials, every other port, and every non-HTTPS scheme;
- reject IP-literal hosts in the first implementation and require every resolved address to be globally reachable under the accepted address policy;
- reject loopback, private-use, link-local, carrier-grade NAT, documentation, benchmark, multicast, unspecified, reserved, and cloud-metadata destinations for both IPv4 and IPv6;
- normalize the URL once, keep the raw submission transient, retain only the approved normalized-requested and validated-final identities under the privacy policy, and display the normalized target before confirmation; and
- reject malformed, unsupported, or policy-ambiguous input rather than repairing it silently.

Port 443 is the accepted MVP boundary in ADR-0017. Internationalized-domain handling, query-string retention policy, and the exact public-address classifier remain Proposed details to freeze before implementation. Public availability is not proof of authorization or non-sensitivity; the attestation records the user's assertion and creates no legal determination.

## Navigation and egress policy

The admitted scan should use one fresh, non-persistent Chromium context with no stored identity or authority:

- no cookies or storage state supplied by the application;
- no custom request headers, HTTP authentication, client certificates, extensions, personal profile, or granted permissions;
- service workers blocked;
- downloads, popups, new tabs, external-protocol launches, geolocation, notifications, clipboard access, and form submission outside the passive page load blocked;
- each redirect re-parsed and re-authorized before following, with a fixed maximum redirect count;
- every permitted network destination resolved and checked against the public-address policy at the enforcement point, not trusted from the URL string alone;
- only the one top-level page becomes a scan target; links, frames, canonical URLs, scripts, and page content cannot add targets; and
- WebSocket, WebTransport, peer-to-peer, and other unneeded channels blocked.

The narrowest resource policy is same-origin HTTPS subresources only, with every destination still checked. That policy is a proposal, not an accepted product fact: many public pages depend on cross-origin styles, images, or fonts. If a blocked resource could materially affect rule evidence, the scan must fail or be marked coverage-incomplete; it must not claim a complete finding list from a materially altered render. Supporting enumerated cross-origin public resources requires a later explicit profile value and the same destination checks, not a permissive wildcard.

Unexpected navigation, a blocked material resource, an unhandled dialog, or an attempted download is a bounded scan-policy outcome. The page cannot grant itself broader access through markup or script.

## Deterministic page and scan profile

Public content cannot be frozen like a project-owned fixture. Reproducibility therefore means recording material inputs and refusing to overstate repeatability, not claiming that the URL will render identical content later.

| Concern | Proposed minimum |
| --- | --- |
| Browser | Exact Playwright-managed Chromium artifact with sandbox enabled |
| Context | One fresh non-persistent context per scan |
| Viewport, locale, timezone, color preferences | One frozen MVP profile recorded with the scan |
| Navigation | One admitted HTTPS top-level navigation under the redirect and egress policy |
| Final page identity | Requested URL reference, normalized admitted URL, final normalized URL, and accepted redirect chain; sensitive query material minimized under policy |
| Readiness | One explicit bounded readiness procedure; do not treat an arbitrary sleep or `networkidle` alone as proof of stable page state |
| Scanner | Pinned axe adapter and resolved axe-core version |
| Rules | Exactly `image-alt`, `label`, and `color-contrast` in one atomic axe execution |
| Result scope | Every violation node for those rules in the accepted top-level main-document scope, plus separate native incomplete observations and explicit frame exclusion |
| Bounds | Frozen limits for redirects, requests, response bytes, duration, main-document DOM/result size, findings, encountered frames, and cleanup |

ADR-0017 and OD-020 limit the MVP scan to the main document. Iframe scanning remains Deferred. The UI must show frame and resource coverage so a main-document scan is not mistaken for complete page coverage.

## Atomic scan and result-envelope semantics

One admitted browser execution produces one page-level transient observation:

- scan and authorization IDs;
- requested, normalized, and final-page identity references;
- attestation facts;
- browser, viewport, locale, readiness, destination-policy, redirect, resource-coverage, scanner, and exact three-rule identities;
- start, end, and cleanup disposition;
- native axe result categories and node data for the three rules within the accepted result envelope; and
- explicit omission, blocked-resource, limit, and incomplete-coverage facts.

The axe value is unknown third-party data and must pass a small runtime boundary before Step 2. An unexpected rule, malformed node, unsupported category, missing coverage fact, excessive count/size, or result truncation fails the page-scan handoff. The product either exposes every in-envelope violation-node finding or reports a failed scan with its coverage-incomplete reason; it never silently truncates while claiming to list all findings.

Native axe `incomplete` observations remain scanner results requiring attention. They are not violations, passes, workflow failures, or evidence-sufficiency states. A page may have valid violation findings and separate incomplete observations in the same successful scan.

## Execution sequence

1. Parse and validate the requested URL without launching Chromium.
2. Display the normalized target and obtain explicit authorization attestation.
3. Create the immutable scan/operation identity and frozen scan profile.
4. Launch managed Chromium and a fresh context with the accepted restrictions.
5. Navigate through the bounded destination and redirect enforcement point.
6. Apply the explicit readiness and resource-coverage procedure.
7. Run one axe scan with the exact three-rule allowlist.
8. Validate the complete page-level result envelope and record cleanup.
9. Hand the transient observation to Step 2 in memory. Step 2 creates the minimized page-scan and per-finding records.
10. Close the page, context, and browser on success, rejection, timeout, failure, or shutdown.

There is no automatic retry. A retry creates a new immutable operation. Scan success does not invoke retrieval or a provider and does not automatically process any finding.

## Failure and bounds

The exact numeric values remain open, but the categories are part of the minimum safe design:

- URL and address admission;
- redirect count and destination changes;
- request count, permitted methods, response bytes, and total transferred bytes;
- navigation, readiness, axe execution, and total-operation time;
- frame count and accepted frame scope;
- DOM/result-envelope and violation-node counts;
- browser process memory or other practical resource guard; and
- cleanup completion.

Crossing a bound fails closed with a content-safe reason. No partial list is published as complete. Previously durable minimized evidence from a different run remains intact. Quantitative values should be selected and frozen from implementation evidence; this assessment does not invent universal production limits.

## Step ownership

| Step 1 owns | Step 2 owns |
| --- | --- |
| URL admission and authorization attestation | Rule-specific page-content allowlists and sanitization |
| Destination, redirect, subresource, and browser policy | One finding record per retained violation node |
| Browser/readiness/coverage execution | Per-finding minimized source evidence and normalized projection |
| One exact three-rule axe execution | Minimized incomplete-observation records |
| Complete transient result-envelope validation | Durable page-scan publication and omission/redaction summary |
| Browser cleanup and bounded failure | Comparison-safe locator/descriptor evidence within the privacy policy |

Step 1 must not persist raw HTML, screenshots, DOM/accessibility trees, browser traces, cookies, page storage, network bodies, or the native axe payload. Step 2 must not reinterpret a failed or coverage-incomplete scan as successful.

## Evaluation relationship

The separate [controlled-fixture assessment](CONTROLLED_FIXTURE_EXECUTION_AND_SECURITY.md) remains the deterministic provider-independent baseline. It verifies the exact rule mappings, expected failing/corrected observations, evidence allowlists, and comparison semantics without live-page nondeterminism. Public-page evaluation adds admission, egress, hostile-content, bound, and incomplete-coverage cases; it does not replace the controlled gold cases or turn one third-party page into a stable evaluation fixture.

## Risks and limitations

- A public host can resolve differently between checks, redirect to a forbidden destination, or trigger requests from page script.
- Blocking resources can materially change contrast, element presence, or accessible-name computation.
- Dynamic rendering, experiments, consent views, localization, and time-sensitive content can make two scans differ without a remediation.
- Page content can contain prompt-injection text or sensitive data even when it is publicly reachable.
- A complete result for the three rules still covers only the accepted browser/frame/profile scope and a subset of accessibility barriers.
- The same URL and configuration do not prove the same content state or deployment causality.

## Explicit non-goals

- HTTP, local files, uploaded HTML, private or authenticated pages, cookies, custom headers, client certificates, user profiles, or credentials.
- Multiple target URLs, links-as-targets, crawling, sitemaps, route discovery, SPA task scripts, form interactions, or page inventories.
- Cross-browser/mobile coverage, a second scanner, broader axe rules, custom rules, or whole-WCAG coverage.
- Automatic downstream processing, combined prompts or proposals, bulk review, concurrency, queues, scheduled monitoring, CI, alerts, or dashboards.
- General hostile-browser hosting, malware analysis, universal site compatibility, or release-grade sandbox certification.
- Accessibility, compliance, certification, legal, or whole-page conclusions.

## Planning acceptance criteria

This assessment is adequate when a future implementation evaluation can show that:

1. a missing attestation or inadmissible URL starts no browser work;
2. the requested, normalized, redirected, and final destinations remain inside the accepted public HTTPS policy;
3. one fresh context executes exactly the three allowed rules over the recorded top-level main-document and resource scope, with iframe documents explicitly excluded;
4. every in-envelope violation node reaches Step 2 while incomplete observations stay distinct;
5. blocked material resources, unsupported behavior, malformed output, truncation, timeout, or exceeded bounds cannot appear as a complete scan;
6. raw browser/page/scanner data remains transient and Step 2 alone creates durable minimized records;
7. scanning works without retrieval, LangChain, a language model, or either generation provider; and
8. the result states coverage and limitations without an accessibility or conformance claim.

## Primary sources

- [ADR-0017: Authorized public-page scan boundary](../../decisions/ADR-0017-authorized-public-page-scan-boundary.md)
- [WHATWG URL Standard](https://url.spec.whatwg.org/)
- [IANA IPv4 Special-Purpose Address Registry](https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry.xhtml)
- [IANA IPv6 Special-Purpose Address Registry](https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry.xhtml)
- [Playwright browser-context isolation](https://playwright.dev/docs/browser-contexts)
- [Playwright network interception](https://playwright.dev/docs/network)
- [Playwright `BrowserContext.route`](https://playwright.dev/docs/api/class-browsercontext#browser-context-route)
- [Playwright downloads](https://playwright.dev/docs/downloads)
- [Playwright navigations](https://playwright.dev/docs/navigations)
- [axe-core API and result categories](https://github.com/dequelabs/axe-core/blob/v4.13.0/doc/API.md)
- [Playwright accessibility-testing guidance](https://playwright.dev/docs/accessibility-testing)

## Documentation navigation

- Previous: [Technology selection](TECHNOLOGY_SELECTION.md)
- Up: [Authorized deterministic web scan candidate assessments](README.md)
- Evaluation baseline: [Controlled-fixture execution and security](CONTROLLED_FIXTURE_EXECUTION_AND_SECURITY.md)
- Next workflow step: [Accessibility finding and evidence capture assessment](../ACCESSIBILITY_FINDING_EVIDENCE_CAPTURE_ASSESSMENT.md)
- [Architecture index](../../README.md)
- [Project documentation index](../../../README.md)
