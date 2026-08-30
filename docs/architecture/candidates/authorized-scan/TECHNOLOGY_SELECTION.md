# Authorized deterministic web scan technology selection assessment

## Authority, status, and scope

**Document status: Proposed architecture assessment.** [ADR-0018](../../decisions/ADR-0018-trusted-operator-url-boundary.md) owns the accepted trusted operator URL policy. [ADR-0017](../../decisions/ADR-0017-authorized-public-page-scan-boundary.md) is superseded decision history. ADR-0008, ADR-0009, and ADR-0011 retain their evaluation-baseline scope. This assessment does not authorize implementation, accept exact package versions, or promote a technology to release adoption.

Assessment date: 2026-08-23. Reframed for the trusted operator URL boundary on 2026-08-27.

Canonical behavior remains in [Evidence and review workflow requirements — Target authorization and scanning](../../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#target-authorization-and-scanning). This assessment owns only the proposed technology shape for the [authorized deterministic web scan family](README.md).

## Minimal recommendation

Use ordinary TypeScript modules in one local application service:

1. An admission module accepts one trusted operator-entered public HTTPS page URL, exposes the supported-use limitation without a separate attestation gate, parses the URL, and rejects malformed input or embedded credentials.
2. A scan module uses the Playwright Library with its matching managed Chromium in a fresh non-persistent context without imported user state.
3. The scan module applies one finite navigation timeout, performs no intentional page interaction or download, and closes the page, context, and browser after every outcome.
4. One axe adapter performs one atomic scan restricted to `image-alt`, `label`, and `color-contrast` and returns all reported violation nodes plus separate native incomplete observations and coverage.
5. A small runtime boundary validates the transient page-scan observation before the in-memory handoff to Step 2; an invalid or interrupted result remains a visible failure.

The user opens the React interface from the local service's loopback address in Chrome or Edge. That UI browser is distinct from Playwright-managed Chromium and has no direct browser-automation authority. LangChain, retrieval, embeddings, vector storage, generation providers, and review do not belong in Step 1.

## Technology profile

The table below preserves the assessment's dated research seeds, not the current installed baseline. On 2026-08-30 (UTC), [RD-002](../../../plans/completed/rd-002-minimum-development-toolchain-literals.md#accepted-synthesis-and-ordinary-literal-freeze) selected the development literals and verified locked package restoration, module loading, and strict type checking. The [developer instructions](../../../../README.md#development-toolchain) identify the current runtime and commands; the manifest and lockfile pin packages. This later setup does not promote the assessment or qualify the browser/rule profile, which remains RD-003 work. No browser was installed or launched.

| Concern | Minimal candidate | Status and boundary |
| --- | --- | --- |
| Application language | TypeScript with strict independent type checking | **Accepted for evaluation** by [ADR-0011](../../decisions/ADR-0011-typescript-as-initial-application-language.md). Runtime validation still applies to external data. |
| Local JavaScript runtime | Node.js 24 LTS; 24.19.0 is the dated seed | **Proposed.** ADR-0011 does not select a runtime or web-service framework. |
| Browser automation | `playwright@1.62.1` Library | Playwright with pinned managed Chromium is **Accepted for evaluation** by [ADR-0008](../../decisions/ADR-0008-playwright-as-initial-browser-automation.md); this version remains Proposed. |
| Browser context | Matching managed Chromium, fresh non-persistent context, no personal profile, cookies, storage, credentials, extensions, or granted permissions | The hygiene direction follows ADR-0018 and ADR-0008. Exact browser artifact, readiness procedure, finite timeout, and cleanup mechanics remain Proposed. This is not hostile-page isolation. |
| Accessibility scanner | `@axe-core/playwright@4.13.0` with the resolved axe-core version recorded | axe-core through the Playwright adapter is **Accepted for evaluation** by [ADR-0009](../../decisions/ADR-0009-axe-core-as-initial-accessibility-scanner.md). |
| Rule selection | One exact allowlist containing `image-alt`, `label`, and `color-contrast` in one axe execution | The three-rule product boundary is accepted by ADR-0018. The [minimal axe option profile](#proposed-minimal-axe-option-profile) states the Proposed configuration intent. Broad WCAG tags and package defaults must not expand it. |
| Runtime target | One trusted operator-entered and authorized public HTTPS page; no authentication or imported browser state | Accepted policy in ADR-0018. The application validates URL syntax but does not prove public reachability or perform DNS, IP, redirect, or subresource security classification. |
| Document scope | The entire developer-selected top-level document in its current rendered state at the configured readiness condition; iframe documents and inactive/non-rendered states excluded | Accepted product boundary through ADR-0018 and the applicable open-decision record. The Proposed axe profile expresses the intended `iframes: false` boundary, but the pinned adapter behavior must pass the compatibility check below before implementation is frozen. Exact readiness and coverage checks remain Proposed. |
| Evaluation target | Project-owned synthetic failing/corrected cases for all three rule families | Retained as the deterministic evaluation baseline. They do not replace runtime public-page admission or imply broad live-page reproducibility. |
| Runtime validation | Small application-owned TypeScript record definitions and boundary checks | The minimal boundary is accepted in principle; exact code or library remains Proposed. No schema framework or code generation is required. |
| Application topology | Loopback React UI plus admission, scan, and evidence modules in one local service | The local-service topology is Accepted by ADR-0015. ADR-0018 requires no egress proxy, separate browser worker, supervisor, or production sandbox for the trusted-input portfolio path. |

### Proposed minimal axe option profile

Each scan should materialize one application-owned option profile whose effective axe-core values are:

| Boundary | Proposed value | Purpose |
| --- | --- | --- |
| Rule selection | `runOnly: { type: "rule", values: ["image-alt", "label", "color-contrast"] }` | Select the three rule IDs directly. Do not use WCAG tags, omit `runOnly`, or merge user-supplied rule settings. axe-core otherwise runs its broader enabled-rule defaults. |
| Document scope | `iframes: false` as the intended option | Keep the accepted scan on the entire developer-selected top-level document in its current rendered state while excluding iframe documents. The axe-core 4.13 default is `true`, so relying on the default would broaden the scope; the Playwright adapter compatibility check below is still required. |
| Native result detail for an ordinary scan | `resultTypes: ["violations", "incomplete"]` | Preserve full node detail for every Finding and ScannerReviewObservation. The other required native arrays remain available in their reduced per-rule form for coverage; retaining all pass nodes on every scan is unnecessary. |
| Additional detail for an intentional comparison rescan | Add `"passes"` only when the selected baseline Finding requires a later same-target non-failing observation | Pass detail is transient and reduced immediately to the one correlated positive observation. Do not persist a page-wide pass collection or request full inapplicable-node detail. |

The application should materialize the applicable closed profile rather than constructing it by subtracting rules from axe defaults. An ordinary scan uses the exact rule, document-scope, and two-detail settings above; an intentional comparison rescan may add pass detail only for its selected baseline need. Adapter convenience methods, direct option calls, ordering of the three rule IDs, and the exact TypeScript representation remain Proposed implementation details.

After execution, the runtime boundary should require all four native result arrays, reject any result whose union of rule IDs differs from the exact three-rule set, and preserve every returned violation and incomplete node for Step 2. Passes and inapplicable results establish coverage transiently; Step 2 persists only the narrow same-target positive observation required for comparison. An `incomplete` result is scanner evidence, not scan failure. A missing array, unexpected rule, absent requested-rule coverage, malformed result, or truncated page-scan envelope is a visible scan failure rather than a valid zero-Finding result.

This profile is a Proposed way to make the Accepted scope explicit, not a new ADR or an implementation prescription. The versioned axe-core API documents rule-ID `runOnly`, the four result collections, `resultTypes`, the reduced non-requested result detail, and the `iframes` default. The versioned Playwright adapter source shows both an adapter-owned recursive frame path and the option handoff to axe-core, so configuration text alone is not sufficient evidence that iframe results are excluded.

Before the implementation profile is frozen, one version-pinned synthetic probe must place a supported-rule violation only inside an iframe and confirm that `@axe-core/playwright` returns no violation node from that iframe under the intended configuration. If it does not, the implementation must use the smallest verified top-frame-only axe invocation instead of adding a frame-management subsystem. Until that probe passes, iframe exclusion is an accepted product boundary with a Proposed, unverified adapter mechanism—not an implemented capability claim.

## Why this is sufficient

### Playwright supplies rendered-page execution

Playwright supplies a managed browser, fresh contexts, navigation timeouts, axe integration, and lifecycle cleanup. For this portfolio path, a non-persistent context with no imported state, one finite navigation timeout, no application-directed interaction or downloads, and cleanup after every outcome are sufficient. They reduce accidental state reuse but do not establish a hostile-page security boundary.

The product uses the Playwright Library because scanning is application behavior. `@playwright/test` may later be used for executable tests, but it need not become the product runtime.

### axe-core supplies the exact three-rule source result

One axe execution over the developer-selected page's current rendered state avoids three redundant navigations while keeping coverage closed. Each native violation node becomes an independent candidate Finding. Rule-level grouping is presentation; it must not merge unrelated targets into one proposal. The three rule mappings remain:

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
| One project-owned, preconfigured public lab URL | Further reduces live-page variability, but no longer demonstrates the accepted operator-entered URL interaction. The three controlled profiles already supply the reproducible evaluation baseline, so this restriction adds little portfolio value. |
| Puppeteer with axe-core | Could perform the same narrow work, but duplicates the accepted Playwright evaluation direction without adding portfolio value. Reconsider only if Playwright cannot support the simple trusted-page scan. |

## Primary sources

Time-sensitive package seeds were checked on 2026-08-24; current versions must be rechecked before evaluation.

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro)
- [Node.js release status](https://nodejs.org/en/about/previous-releases)
- [Playwright Library](https://playwright.dev/docs/library)
- [Playwright browser management](https://playwright.dev/docs/browsers)
- [Playwright browser-context isolation](https://playwright.dev/docs/browser-contexts)
- [Playwright accessibility testing](https://playwright.dev/docs/accessibility-testing)
- [Playwright 1.62.1 release](https://github.com/microsoft/playwright/releases/tag/v1.62.1)
- [WHATWG URL Standard](https://url.spec.whatwg.org/)
- [axe-core 4.13.0 API and result model](https://github.com/dequelabs/axe-core/blob/v4.13.0/doc/API.md)
- [axe-core 4.13.0 partial-run guidance](https://github.com/dequelabs/axe-core/blob/v4.13.0/doc/run-partial.md)
- [@axe-core/playwright 4.13.0 builder options and rule restriction](https://github.com/dequelabs/axe-core-npm/blob/v4.13.0/packages/playwright/src/index.ts)
- [axe-core 4.13.0 rule descriptions](https://github.com/dequelabs/axe-core/blob/v4.13.0/doc/rule-descriptions.md)
- [axe-core 4.13.0 `image-alt`](https://github.com/dequelabs/axe-core/blob/v4.13.0/lib/rules/image-alt.json)
- [axe-core 4.13.0 `label`](https://github.com/dequelabs/axe-core/blob/v4.13.0/lib/rules/label.json)
- [axe-core 4.13.0 `color-contrast`](https://github.com/dequelabs/axe-core/blob/v4.13.0/lib/rules/color-contrast.json)
- [axe-core 4.13.0 contrast evaluator](https://github.com/dequelabs/axe-core/blob/v4.13.0/lib/checks/color/color-contrast-evaluate.js)
- [@axe-core/playwright 4.13.0 package](https://github.com/dequelabs/axe-core-npm/tree/v4.13.0/packages/playwright)

## Documentation navigation

- Up: [Authorized deterministic web scan candidate assessments](README.md)
- Deferred hardening research: [Deferred hostile-URL and public-page hardening assessment](AUTHORIZED_PUBLIC_PAGE_EXECUTION_AND_SECURITY.md)
- Evaluation baseline: [Controlled-fixture evaluation assessment](CONTROLLED_FIXTURE_EXECUTION_AND_SECURITY.md)
- [ADR-0018: Trusted operator URL boundary for the portfolio MVP](../../decisions/ADR-0018-trusted-operator-url-boundary.md)
- [ADR-0017: Authorized public-page scan boundary](../../decisions/ADR-0017-authorized-public-page-scan-boundary.md) — superseded history
- [Architecture index](../../README.md)
- [Local MVP feasibility](../../../LOCAL_MVP_FEASIBILITY.md)
- [Project documentation index](../../../README.md)
