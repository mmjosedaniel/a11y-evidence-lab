# ADR-0018: Trusted operator URL boundary for the portfolio MVP

- **Status:** Accepted
- **Decision date:** 2026-08-27
- **Supersedes for the MVP:** [ADR-0017](ADR-0017-authorized-public-page-scan-boundary.md)

## Context

The portfolio MVP exists to demonstrate one coherent evidence-first workflow: deterministic browser scanning, minimized evidence capture, curated RAG through LangChain, structured generation, human review, and conservative rescan comparison. [ADR-0017](ADR-0017-authorized-public-page-scan-boundary.md) accepted that workflow for one authorized public page, but also required a production-oriented hostile-network boundary with application-owned egress mediation, DNS and address classification, redirect and subresource revalidation, quantitative resource ceilings, and adversarial qualification before development.

Those controls would be appropriate if A11y Evidence Lab claimed safe general-purpose Internet scanning or accepted untrusted input in a distributed product. They are disproportionate to a developer-operated portfolio MVP. The developer chooses the page, runs the service locally, and is expected to supply only a page they are authorized to analyze and trust. Building a production browser-security boundary would delay the RAG and evidence workflow that the project is intended to demonstrate.

Treating the URL as trusted does not make arbitrary page content safe. It is an explicit supported-use assumption and limitation, not a security guarantee. A later product that accepts untrusted targets, is distributed to non-developers, or claims general Internet scanning would require a new threat model and architecture decision.

## Considered options

1. Keep ADR-0017's production-oriented hostile-network containment and qualification as a pre-development requirement.
2. Return the MVP to project-owned synthetic fixtures only.
3. Accept one trusted, operator-entered, authorized public HTTPS URL with inexpensive browser hygiene and explicit unsupported-use boundaries.

## Decision

Accept option 3 for the portfolio MVP. This record supersedes ADR-0017 as the current public-page architecture boundary while retaining the useful one-page, three-rule, finding-level workflow it introduced.

### Trusted operator input

- One `PageAnalysisRun` accepts exactly one operator-entered public HTTPS URL. Authorization, public reachability, and trust are operator responsibilities and supported-use assumptions, not an application admission workflow.
- The application shows a visible limitation notice that only pages the operator is authorized to analyze and trusts are supported. It does not require a separate attestation or confirmation control, independently prove ownership, classify destination addresses, or claim that the target is harmless.
- The MVP supports no credentials, authenticated browser state, client certificates, custom authorization headers, personal browser profile, private-page workflow, uploaded HTML, or local-file target.
- Hostile or untrusted pages and production-scale arbitrary-URL scanning are unsupported. Documentation and the future interface must state that limitation without presenting it as technical isolation.

### Minimal browser hygiene and scan scope

- Parse the entered value as one valid HTTPS URL and reject malformed input or embedded credentials. No application-owned DNS, IP-address, redirect, or subresource security classification is part of the MVP.
- Launch the page in a fresh, non-persistent Playwright-managed Chromium context without imported cookies, storage state, credentials, extensions, permissions, or a personal browser profile.
- Apply one finite navigation timeout, run the scan, and close the page, context, and managed browser after success, timeout, or failure. Exact timeout and cleanup mechanics are implementation details rather than architecture qualification gates.
- Perform one passive top-level page analysis. The product does not intentionally click controls, submit forms, upload or download files, discover or follow links as scan targets, execute user journeys, crawl, or scan multiple pages.
- Browser redirects and subresources needed for an ordinary page load follow the managed browser's normal behavior. The application does not re-attest redirects or mediate every connection, and it makes no hostile-page containment claim.

### Deterministic three-rule result

- Run one provider-independent axe-core scan against the admitted top-level main document, restricted to exactly `image-alt`, `label`, and `color-contrast`.
- Normalize every violation node returned for those rules as an independent `Finding`; do not sample one result or combine unrelated nodes.
- Keep native axe `incomplete` observations separate from violations and from scan failure.
- A zero-finding result is valid only when navigation and the complete three-rule axe operation finish and the returned result validates. A navigation timeout, browser failure, scanner failure, malformed response, or interrupted collection is shown as failure, not as a complete zero-finding result.
- A complete result describes only this one automated three-rule scan. It is not proof of whole-page accessibility, WCAG conformance, certification, or legal compliance.

### Downstream workflow retained

- Findings remain independently selectable for minimized evidence, curated retrieval, evidence-sufficiency evaluation, generation or deterministic abstention, human review, and later comparison. There is no page-wide prompt, combined remediation proposal, automatic all-findings processing, queue, agent, or workflow engine.
- One immutable global `Local` or `Groq` mode belongs to the run. Selection does not invoke a provider; evidence insufficiency abstains without a call; provider failure never causes automatic fallback.
- Evidence minimization, provider-payload restrictions, credential handling, model-output validation, reviewer control, and conservative comparison remain application requirements. This decision changes the scan-target threat assumption, not the evidence-first or human-review boundaries.
- The three project-owned synthetic failing and corrected profiles remain the fixed evaluation baseline. They do not become user-submitted runtime targets and do not qualify general Internet scanning.

### Explicitly deferred production hardening

The following work is outside the portfolio MVP and is not a development-authorization prerequisite:

- an application-owned egress proxy or non-bypassable network gate;
- SSRF prevention, DNS pinning, rebinding defense, and public/special-address classification;
- per-redirect or per-subresource destination validation and redirect re-attestation;
- a network, transfer, DOM, browser-memory, scanner-result, or temporary-storage limit manifest and exact-limit test matrix;
- adversarial URL, malicious-page, hostile-subresource, or production browser-sandbox qualification; and
- a claim that arbitrary or untrusted URLs can be analyzed safely.

A demonstrated need for any of those capabilities requires a later threat model and ADR. Their deferral must not be described as completed security work.

## Consequences

- Development can focus on the portfolio's evidence, RAG, generation, review, and comparison objectives instead of a production web-isolation subsystem.
- The browser lifecycle remains easy to understand and avoids accidental reuse of the developer's authenticated browser state.
- The MVP may load redirects and subresources chosen by the trusted page because it relies on ordinary managed-browser behavior rather than connection-level mediation.
- A malicious, compromised, private, or otherwise untrusted page is outside the supported use boundary. The project must not claim SSRF resistance, hostile-page isolation, or suitability as a public scanning service.
- Synthetic profiles remain the reproducible evaluation authority; results from a changing public page remain observational.
- If broader distribution or untrusted-target support becomes a real product requirement, ADR-0017 provides useful historical research but does not reactivate automatically.

## Primary references

- [WHATWG URL Standard](https://url.spec.whatwg.org/)
- [Playwright Library](https://playwright.dev/docs/library)
- [Playwright browser-context isolation](https://playwright.dev/docs/browser-contexts)
- [Playwright navigations](https://playwright.dev/docs/navigations)
- [axe-core 4.13 API and result model](https://github.com/dequelabs/axe-core/blob/v4.13.0/doc/API.md)

## Related decisions and requirements

- [ADR-0008: Playwright as the initial browser automation technology](ADR-0008-playwright-as-initial-browser-automation.md)
- [ADR-0009: axe-core as the initial accessibility scanner](ADR-0009-axe-core-as-initial-accessibility-scanner.md)
- [ADR-0013: LangChain as the initial RAG integration baseline](ADR-0013-langchain-as-initial-rag-integration.md)
- [ADR-0014: Groq as the MVP external generation provider](ADR-0014-groq-as-mvp-external-generation-provider.md)
- [ADR-0015: Localhost browser MVP execution](ADR-0015-localhost-browser-mvp-execution.md)
- [ADR-0016: Filesystem run persistence](ADR-0016-filesystem-run-persistence.md)
- [ADR-0017: Authorized public-page scan boundary](ADR-0017-authorized-public-page-scan-boundary.md) — superseded for the MVP
- [Evidence and review workflow requirements](../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md): `REQ-AUTH-*`, `REQ-SCAN-*`, `REQ-EVID-*`, `REQ-RETR-*`, and `REQ-GEN-*`
- [Generation provider execution requirements](../../requirements/generation-provider-and-model-lifecycle/GENERATION_PROVIDER_EXECUTION.md): `REQ-LLM-*`
- [Privacy and security requirements](../../requirements/quality-security-and-operations/PRIVACY_AND_SECURITY.md): `REQ-SEC-*`
- [Reliability, reproducibility, and operations requirements](../../requirements/quality-security-and-operations/RELIABILITY_REPRODUCIBILITY_AND_OPERATIONS.md): `REQ-QUAL-*`
- [Evaluation and acceptance requirements](../../requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md): `REQ-EVAL-*`
