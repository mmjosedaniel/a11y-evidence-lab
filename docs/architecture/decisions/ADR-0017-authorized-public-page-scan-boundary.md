# ADR-0017: Authorized public-page scan boundary

- **Status:** Superseded for the MVP by [ADR-0018](ADR-0018-trusted-operator-url-boundary.md)
- **Decision date:** 2026-08-25
- **Superseded date:** 2026-08-27

## Supersession notice

[ADR-0018](ADR-0018-trusted-operator-url-boundary.md) replaces this production-oriented hostile-network boundary for the portfolio MVP with a trusted-operator input assumption and inexpensive browser hygiene. The egress gate, DNS and IP classification, redirect and subresource revalidation, resource-limit manifest, and adversarial qualification below are no longer MVP requirements or development prerequisites.

ADR-0018 restates the current one-page, exact-three-rule, finding-level workflow and its retained limitations. The context, options, decision, and consequences below remain as decision history and possible input to a future product-hardening decision; they do not reactivate automatically.

[OD-022](../../requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-022--portfolio-mvp-yagni-simplification), [ADR-0020](ADR-0020-manual-developer-managed-local-model-setup.md), and [ADR-0021](ADR-0021-single-file-run-aggregate.md) further supersede this historical body's independently versioned `FindingWorkflow`, repeated per-invocation provider disclosure, and child-record language. The current MVP uses one `run.json` aggregate, one mode-selection disclosure, an explicit Generate action followed by the actual provider call, and no separate connection probe or repeated confirmation gate. These later changes do not alter the historical text below.

## Context

The original portfolio boundary accepted only three project-owned synthetic fixtures. That boundary made the first deterministic scan easy to reproduce, but it did not demonstrate the product's intended evidence workflow against a page selected by its user. The MVP may now accept one user-entered public page while retaining the three controlled fixtures as its fixed evaluation baseline.

Loading a live page is not equivalent to loading another fixture. A supplied URL and every page-controlled redirect or subresource request cross a hostile network boundary from a privileged local application service. DNS answers can change, an apparently public destination can resolve to a non-public address, page code can initiate additional requests, and an unbounded page can consume browser, network, storage, or scanner resources. A user authorization statement does not mitigate those technical risks.

A public page can also produce zero, one, or many violation nodes and separate native axe `incomplete` observations across the three MVP rules. The scan must therefore distinguish violations, scanner-review observations, complete coverage, and interruption while preserving every in-scope deterministic record without automatically starting retrieval or model work for all of them.

## Considered options

1. Keep every MVP scan limited to the three synthetic fixtures.
2. Accept arbitrary URLs in a general-purpose browser session, including authentication, interaction, link traversal, and unrestricted networking.
3. Accept one explicitly attested public HTTPS entry URL per page-analysis run, execute it in an ephemeral managed browser behind an application-owned egress gate, and keep downstream work user-selected and sequential.

## Decision

Accept option 3 as the MVP public-page boundary. The safety properties below are binding architecture. Exact numeric ceilings, browser and network-policy implementation details, and qualification evidence remain open pre-development work; this decision does not by itself authorize implementation or claim that the boundary has passed its security evaluation.

### Authorization and target scope

- One `PageAnalysisRun` begins with exactly one user-entered public HTTPS URL and an explicit user attestation that the user is authorized to analyze that page. Record the attested target identity, scope, and time. The attestation is an application guardrail, not independent proof of ownership or legal authorization.
- The accepted target is public and requires no login, session, client certificate, authorization header, or other credential. The application must not connect to an existing browser profile or import its cookies, storage, extensions, credentials, or authenticated state.
- The run performs one bounded top-level page analysis. It does not crawl links, discover additional analysis targets, submit forms, click controls, upload or download files, exercise application workflows, monitor a site, or schedule a later scan.

### Mandatory hostile-network boundary

- The local application service owns a non-bypassable loopback egress gate for the managed scan browser. Browser-delivered UI code never receives browser-automation or direct network-policy authority.
- Parse the submitted target with a standards-conforming URL parser. Accept only HTTPS using its default port and reject embedded credentials. Non-HTTP schemes, cleartext HTTP, alternate ports, and ambiguous or invalid forms are outside this boundary.
- Before connection, resolve and validate the destination as public. Every resolved IPv4 and IPv6 address must satisfy the accepted public-destination policy; loopback, private-use, link-local, multicast, documentation, reserved, and otherwise non-global destinations are not valid targets.
- Bind each authorized connection to the validated destination while preserving HTTPS hostname and certificate verification. Revalidate every redirect destination and every subresource request, including fresh DNS results, through the same gate. A redirect that changes the attested target identity stops the run and requires a new attestation. A browser feature, worker, or page-created network channel must not bypass the gate. If a request cannot be mediated and validated, block it and fail closed.
- Launch a fresh non-persistent Playwright-managed Chromium context with the browser sandbox enabled, no granted permissions, reused user profile, ambient credentials, or imported state. Block service workers, downloads, popups, additional page targets, subframe scanning, file access, WebSockets, and other unapproved network mechanisms, and destroy the context and browser on completion, failure, timeout, or application shutdown.
- Enforce hard limits for navigation and scan duration, redirects, request count, per-resource and aggregate transfer, page or DOM complexity, scanner result size, browser resource use, and cleanup. The exact values and enforcement mechanism must be frozen and qualified before development of public-page scanning begins. Exceeding a limit never produces partial success or a valid zero-finding result.

### Atomic three-rule scan and coverage

- Analyze only the admitted stabilized main document with one atomic axe-core scan configured for exactly `image-alt`, `label`, and `color-contrast`. Do not scan subframes, broaden the rule set, or run rules against different page states within the same `PageAnalysisRun`.
- Validate the native result and the expected coverage for all three rules before declaring the scan complete. Normalize and list every in-bounds violation node returned for those rules as an independent `Finding`; do not sample one node, collapse distinct nodes into one page result, or select a finding on the user's behalf.
- Preserve every admitted native axe `incomplete` node separately as a minimized `ScannerReviewObservation`. It is not a violation, scan failure, evidence-sufficiency state, or proposal-eligible finding, and it does not enter the selected-finding workflow.
- Record complete per-rule and full-result coverage separately from the operation lifecycle, violation count, and `ScannerReviewObservation` count. Network-policy rejection, timeout, browser or scanner failure, exceeded bounds, invalid or truncated collection, missing rule coverage, or uncertain cleanup cannot be represented as a successful complete scan.
- Zero `Finding` records is valid only when navigation, the egress policy, all three rule executions, result validation, and the complete `Finding` and `ScannerReviewObservation` collections validate. Even a valid zero means only that this bounded axe-core scan returned no violation nodes for these three rules; it does not erase scanner-review observations and is not a whole-page accessibility, WCAG-conformance, certification, or legal-compliance claim.

### Selected-finding workflow and generation

- After a complete page scan, every normalized `Finding` is visibly `unprocessed` until the user selects it. Selection may create that finding's independently versioned `FindingWorkflow`; no child record is required for an unprocessed finding. Only one child may be active at a time for the existing retrieval, sufficiency, generation-or-abstention, review, and comparison path. `ScannerReviewObservation` records have no such child, and the application creates no automatic batch, queue, or all-findings generation operation.
- Record one explicit, immutable global generation-mode context, `Local` or `Groq`, for the `PageAnalysisRun`. This mode does not itself invoke a provider. Each selected finding still passes the deterministic evidence-sufficiency gate, and each eligible child requires an explicit generation action for at most one provider call.
- In Groq mode, disclose the provider, model, destination, minimized outbound data categories, provider-controlled retention and service conditions, credential handling, and bounded failure behavior before invocation. Send only the selected finding's minimized application-owned facts, required curated guidance passages, instructions, and output schema. Do not send the target URL or origin, locator or selector, raw or full HTML, element or arbitrary page text, image source, form or input values, arbitrary attributes, screenshots, DOM or accessibility-tree snapshots, cookies, headers, credentials, hidden content, redirect or network data, unrelated findings, or prior review history. If those exclusions leave material support insufficient, abstain rather than widen egress.
- Evidence-sufficiency abstention invokes no provider. Provider failure remains visible, preserves deterministic page and finding records, and never triggers automatic retry, fallback, mode change, or batch processing.

### Evaluation and qualification boundary

- Retain the three project-owned synthetic profiles and their failing/corrected revisions as the fixed, non-promotable evaluation baseline for rule mappings, minimized evidence, abstention, provider integration, review, and comparison. They are exercised through the controlled evaluation path and do not enter the user-submitted runtime URL path.
- Before development begins, freeze the public-page threat model, bounded subresource admission and rendering policy for the accepted main-document-only scan, redirect policy, public-address classification, DNS pinning behavior, every quantitative safety limit, cleanup expectations, and adversarial qualification cases. Those details must preserve this ADR's safety invariants and fail-closed behavior.
- Passing the synthetic manifest or one public-page demonstration does not qualify general Internet scanning, browser security, provider privacy, performance, accessibility coverage, or release support.

## Consequences

- The MVP can demonstrate its evidence workflow on one user-authorized public page without adding crawling, authentication, browser-profile reuse, interaction scripting, or batch generation.
- The local service now owns a security-critical network mediation boundary. Public-page implementation cannot proceed safely as a URL-validation check plus ordinary browser navigation; the egress path and resource bounds require explicit qualification.
- A page analysis can contain many deterministic findings while retrieval, generation, and review remain one selected finding at a time. This preserves YAGNI and keeps provider egress deliberate.
- Synthetic fixtures remain necessary for reproducible evaluation, but they are evidence for the bounded implementation rather than the product's only input mode.
- Native scanner-review observations, incomplete coverage, and a complete zero-finding result are distinct durable facts. None is an accessibility conclusion.

## Primary references

- [WHATWG URL Standard](https://url.spec.whatwg.org/)
- [RFC 9110: HTTPS URI scheme](https://www.rfc-editor.org/rfc/rfc9110.html#section-4.2.2)
- [IANA IPv4 Special-Purpose Address Registry](https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry.xhtml)
- [IANA IPv6 Special-Purpose Address Registry](https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry.xhtml)
- [OWASP Server-Side Request Forgery Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html)
- [Playwright browser-context isolation](https://playwright.dev/docs/browser-contexts)
- [Playwright network controls](https://playwright.dev/docs/network)
- [axe-core API documentation](https://www.deque.com/axe/core-documentation/api-documentation/)
- [axe-core 4.13 rule descriptions](https://github.com/dequelabs/axe-core/blob/v4.13.0/doc/rule-descriptions.md)

## Related decisions and requirements

- [ADR-0001: Interchangeable generation providers](ADR-0001-interchangeable-generation-providers.md)
- [ADR-0008: Playwright as the initial browser automation technology](ADR-0008-playwright-as-initial-browser-automation.md)
- [ADR-0009: axe-core as the initial accessibility scanner](ADR-0009-axe-core-as-initial-accessibility-scanner.md)
- [ADR-0013: LangChain as the initial RAG integration baseline](ADR-0013-langchain-as-initial-rag-integration.md)
- [ADR-0014: Groq as the MVP external generation provider](ADR-0014-groq-as-mvp-external-generation-provider.md)
- [ADR-0015: Localhost browser MVP execution](ADR-0015-localhost-browser-mvp-execution.md)
- [ADR-0016: Filesystem run persistence](ADR-0016-filesystem-run-persistence.md)
- [Evidence and review workflow requirements](../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md): `REQ-AUTH-*`, `REQ-SCAN-*`, `REQ-EVID-*`, `REQ-RETR-*`, and `REQ-GEN-*`
- [Generation provider execution requirements](../../requirements/generation-provider-and-model-lifecycle/GENERATION_PROVIDER_EXECUTION.md): `REQ-LLM-*`
- [Privacy and security requirements](../../requirements/quality-security-and-operations/PRIVACY_AND_SECURITY.md): `REQ-SEC-*`
- [Reliability, reproducibility, and operations requirements](../../requirements/quality-security-and-operations/RELIABILITY_REPRODUCIBILITY_AND_OPERATIONS.md): `REQ-QUAL-*`
- [Information and workflow lifecycle requirements](../../requirements/INFORMATION_AND_WORKFLOW_LIFECYCLE.md)
- [Evaluation and acceptance requirements](../../requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md): `REQ-EVAL-*`
