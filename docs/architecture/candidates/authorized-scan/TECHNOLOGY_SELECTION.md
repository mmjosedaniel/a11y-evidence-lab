# Authorized deterministic web scan technology selection assessment

## Authority, status, and scope

**Document status: Proposed architecture assessment.** [ADR-0017](../../decisions/ADR-0017-authorized-public-page-scan-boundary.md) owns the accepted public-page admission and security policy. ADR-0008, ADR-0009, and ADR-0011 retain their evaluation-baseline scope. This assessment does not authorize implementation, accept exact package versions or numeric limits, or promote a technology to release adoption.

Assessment date: 2026-08-23. Reframed for the authorized-public-page boundary on 2026-08-25.

Canonical behavior remains in [Evidence and review workflow requirements — Target authorization and scanning](../../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#target-authorization-and-scanning). This assessment owns only the proposed technology shape for the [authorized deterministic web scan family](README.md).

## Minimal recommendation

Use ordinary TypeScript modules in one local application service:

1. An admission module accepts one HTTPS page URL on default port 443 and explicit authorization attestation, normalizes it, and applies the accepted public-destination policy before Chromium launches.
2. A scan module uses the Playwright Library with its matching managed Chromium in a fresh non-persistent context.
3. A network-policy boundary validates the initial destination, every redirect, and every permitted subresource destination and fails closed on unsupported or excessive behavior.
4. One axe adapter performs one atomic scan restricted to `image-alt`, `label`, and `color-contrast` and returns all in-envelope violation nodes plus separate native incomplete observations and coverage.
5. A small runtime boundary validates the transient page-scan observation before the in-memory handoff to Step 2.

The user opens the React interface from the local service's loopback address in Chrome or Edge. That UI browser is distinct from Playwright-managed Chromium and has no direct browser-automation authority. LangChain, retrieval, embeddings, vector storage, generation providers, and review do not belong in Step 1.

## Technology profile

Exact versions are dated research seeds. They must be refreshed, pinned, and evaluated after development is authorized.

| Concern | Minimal candidate | Status and boundary |
| --- | --- | --- |
| Application language | TypeScript with strict independent type checking | **Accepted for evaluation** by [ADR-0011](../../decisions/ADR-0011-typescript-as-initial-application-language.md). Runtime validation still applies to external data. |
| Local JavaScript runtime | Node.js 24 LTS; 24.19.0 is the dated seed | **Proposed.** ADR-0011 does not select a runtime or web-service framework. |
| Browser automation | `playwright@1.62.1` Library | Playwright with pinned managed Chromium is **Accepted for evaluation** by [ADR-0008](../../decisions/ADR-0008-playwright-as-initial-browser-automation.md); this version remains Proposed. |
| Browser context | Matching managed Chromium, sandbox enabled, fresh non-persistent context, no personal profile, credentials, extensions, or granted permissions | The isolation direction follows ADR-0017 and ADR-0008. Exact browser artifact, flags, readiness procedure, and cleanup limits remain Proposed. |
| Accessibility scanner | `@axe-core/playwright@4.13.0` with the resolved axe-core version recorded | axe-core through the Playwright adapter is **Accepted for evaluation** by [ADR-0009](../../decisions/ADR-0009-axe-core-as-initial-accessibility-scanner.md). |
| Rule selection | One exact allowlist containing `image-alt`, `label`, and `color-contrast` in one axe execution | The three-rule product boundary is accepted by ADR-0017. Exact adapter options and validation remain Proposed. Broad WCAG tags and package defaults must not expand it. |
| Runtime target | One attested authorized public HTTPS page on default port 443; no authentication or user-supplied browser state | Accepted policy in ADR-0017. Exact URL parser, address classifier, redirect policy, permitted resource policy, and limits remain Proposed. |
| Document scope | The admitted top-level main document only | Accepted product boundary through ADR-0017 and OD-020. Scanning iframe documents remains Deferred; the exact main-document readiness and coverage checks remain Proposed. |
| Evaluation target | Project-owned synthetic failing/corrected cases for all three rule families | Retained as the deterministic evaluation baseline. They do not replace runtime public-page admission or imply broad live-page reproducibility. |
| Runtime validation | Small application-owned TypeScript record definitions and boundary checks | The minimal boundary is accepted in principle; exact code or library remains Proposed. No schema framework or code generation is required. |
| Application topology | Loopback React UI plus admission, scan, network-policy, and evidence modules in one local service | The local-service topology is Accepted by ADR-0015. Co-location remains a YAGNI candidate only if evaluation proves that ADR-0017's destination and egress policy can be enforced safely. |

The scan requests the native axe result categories needed to distinguish violations, incomplete observations, passes, and inapplicable results. Step 1 keeps the full validated native result transient. Step 2 retains every allowed violation-node finding, only the positive observations needed for later comparison, and separately minimized incomplete observations. An incomplete axe result is not a scan failure; a missing or truncated page-scan envelope is.

## Why this is sufficient

### Playwright supplies bounded rendered-page execution

Playwright supplies a managed browser, isolated contexts, navigation, request interception, and cleanup hooks. The implementation must still demonstrate the accepted destination, redirect, DNS/address, subresource, download, popup, service-worker, time, byte, and result-envelope controls. Request interception is an enforcement mechanism to evaluate, not proof that every network path is contained.

The product uses the Playwright Library because scanning is application behavior. `@playwright/test` may later be used for executable tests, but it need not become the product runtime.

### axe-core supplies the exact three-rule source result

One axe execution over the admitted page avoids three redundant navigations while keeping coverage closed. Each native violation node becomes an independent candidate finding. Rule-level grouping is presentation; it must not merge unrelated targets into one proposal. The three rule mappings remain:

- `image-alt` → WCAG 2.2 SC 1.1.1;
- `label` → WCAG 2.2 SC 4.1.2; and
- `color-contrast` → WCAG 2.2 SC 1.4.3.

These mappings provide retrieval vocabulary. A rule result does not establish complete success-criterion non-conformance or page accessibility.

### TypeScript keeps the boundary inspectable

TypeScript aligns with Playwright and the accepted language evaluation baseline. Compile-time types do not validate axe results, URLs, persisted JSON, or third-party responses at runtime, so small application-owned checks remain necessary. A worker protocol, schema platform, code generator, or general scanner framework adds no value to this fixed page/rule scope.

## Responsibilities deliberately excluded

Step 1 does not own:

- evidence allowlisting, page-content sanitization, finding persistence, or per-finding normalized evidence;
- corpus ingestion, retrieval, prompting, generation, human review, or comparison;
- automatic processing of the findings collection or a combined remediation proposal;
- authentication, cookies, custom headers, private targets, uploaded HTML, local files, or personal browser profiles;
- crawling, link discovery, multi-page scanning, multiple tabs, scripted task flows, form submission, or SPA route exploration;
- any rule beyond the exact three-rule allowlist, a second scanner, cross-browser equivalence, or mobile coverage;
- scheduled, parallel, queued, CI, or production-scale scanning; or
- installer, desktop-shell, embedded-webview, or release packaging work.

## Alternatives

| Alternative | Trade-off |
| --- | --- |
| One project-owned, preconfigured public lab URL | Reduces user-supplied-target and reproducibility risk, but no longer demonstrates the Accepted OD-020 interaction. It is only a contingency candidate if a later explicit product and architecture decision supersedes OD-020; failure of the bounded public-URL design must remain visible and must not switch to this target automatically. |
| Puppeteer with axe-core | Could perform the same narrow work, but duplicates the accepted Playwright evaluation direction without adding portfolio value. Reconsider only if Playwright cannot satisfy the public-page boundary. |

## Primary sources

Time-sensitive package seeds were checked on 2026-08-24; current versions must be rechecked before evaluation.

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro)
- [Node.js release status](https://nodejs.org/en/about/previous-releases)
- [Playwright Library](https://playwright.dev/docs/library)
- [Playwright browser management](https://playwright.dev/docs/browsers)
- [Playwright browser-context isolation](https://playwright.dev/docs/browser-contexts)
- [Playwright network interception](https://playwright.dev/docs/network)
- [Playwright `BrowserContext.route`](https://playwright.dev/docs/api/class-browsercontext#browser-context-route)
- [Playwright accessibility testing](https://playwright.dev/docs/accessibility-testing)
- [Playwright 1.62.1 release](https://github.com/microsoft/playwright/releases/tag/v1.62.1)
- [WHATWG URL Standard](https://url.spec.whatwg.org/)
- [IANA IPv4 Special-Purpose Address Registry](https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry.xhtml)
- [IANA IPv6 Special-Purpose Address Registry](https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry.xhtml)
- [axe-core 4.13.0 API and result model](https://github.com/dequelabs/axe-core/blob/v4.13.0/doc/API.md)
- [axe-core 4.13.0 rule descriptions](https://github.com/dequelabs/axe-core/blob/v4.13.0/doc/rule-descriptions.md)
- [axe-core 4.13.0 `image-alt`](https://github.com/dequelabs/axe-core/blob/v4.13.0/lib/rules/image-alt.json)
- [axe-core 4.13.0 `label`](https://github.com/dequelabs/axe-core/blob/v4.13.0/lib/rules/label.json)
- [axe-core 4.13.0 `color-contrast`](https://github.com/dequelabs/axe-core/blob/v4.13.0/lib/rules/color-contrast.json)
- [axe-core 4.13.0 contrast evaluator](https://github.com/dequelabs/axe-core/blob/v4.13.0/lib/checks/color/color-contrast-evaluate.js)
- [@axe-core/playwright 4.13.0 package](https://github.com/dequelabs/axe-core-npm/tree/v4.13.0/packages/playwright)

## Documentation navigation

- Up: [Authorized deterministic web scan candidate assessments](README.md)
- Next: [Authorized public-page execution and security](AUTHORIZED_PUBLIC_PAGE_EXECUTION_AND_SECURITY.md)
- Evaluation baseline: [Controlled-fixture execution and security](CONTROLLED_FIXTURE_EXECUTION_AND_SECURITY.md)
- [ADR-0017: Authorized public-page scan boundary](../../decisions/ADR-0017-authorized-public-page-scan-boundary.md)
- [Architecture index](../../README.md)
- [Local MVP feasibility](../../../LOCAL_MVP_FEASIBILITY.md)
- [Project documentation index](../../../README.md)
