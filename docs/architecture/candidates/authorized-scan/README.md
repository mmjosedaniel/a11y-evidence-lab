# Authorized deterministic web scan candidate assessments

## Authority, status, and scope

**Document status: Proposed architecture assessment.** [ADR-0017](../../decisions/ADR-0017-authorized-public-page-scan-boundary.md) owns the accepted MVP public-page policy. ADR-0008, ADR-0009, and ADR-0011 retain their evaluation-baseline scope. This assessment family proposes technical detail only; it does not authorize implementation, accept exact packages or limits, or promote an evaluation technology to release adoption.

Assessment date: 2026-08-23. Reframed for the authorized-public-page boundary on 2026-08-25.

This family describes the smallest proposed approach for the first workflow step: **scan one attested, authorized public HTTPS page with the exact three accepted axe-core rules**. Canonical behavior remains in [Evidence and review workflow requirements — Target authorization and scanning](../../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#target-authorization-and-scanning), the applicable [quality, security, and operations requirements](../../../requirements/quality-security-and-operations/README.md), and accepted ADRs. If an assessment conflicts with one of those authorities, the authority controls.

## MVP runtime boundary

One admitted scan:

1. accepts one user-supplied HTTPS page URL on the accepted default port 443 and an explicit authorization attestation;
2. validates the requested and normalized URL under ADR-0017 before browser execution;
3. opens only that top-level page in a fresh Playwright-managed Chromium context under bounded navigation and network policy and scans only its main document;
4. runs one atomic axe-core scan restricted to `image-alt`, `label`, and `color-contrast`;
5. returns all in-envelope violation nodes for those rules plus distinct native `incomplete` observations and scan coverage; and
6. fails closed if admission, redirect, destination, resource, readiness, result-envelope, timeout, or cleanup policy cannot be satisfied.

The scan does not crawl, follow page links as targets, authenticate, submit forms, accept custom headers or cookies, scan iframe documents, or broaden the rule set. A successful Step 1 handoff is one page-level transient observation, not three scans and not a completed end-to-end workflow. Main-document-only coverage is Accepted through ADR-0017 and OD-020; exact readiness, resource, and numeric-limit details remain Proposed.

Each violation node becomes an independent candidate finding in Step 2. The interface may list all retained findings, but only one selected finding proceeds through retrieval, generation or abstention, and review at a time. No scan-wide prompt, combined remediation proposal, bulk decision, queue, parallel provider work, or workflow engine is introduced.

## Evaluation baseline

The project-owned synthetic failing and corrected cases remain the deterministic evaluation baseline for the three rule families. They freeze known content, expected native results, and comparison evidence independently of changing public pages. They are evaluation inputs, not the product's runtime target intake.

| Rule family | Controlled evaluation mapping |
| --- | --- |
| `image-alt` | Missing text alternative; WCAG 2.2 SC 1.1.1 |
| `label` | Form control without an accessible name; WCAG 2.2 SC 4.1.2 |
| `color-contrast` | Insufficient normal-text contrast; WCAG 2.2 SC 1.4.3 |

An automated result remains evidence about one rule under the recorded scan profile. It does not establish complete success-criterion non-conformance, page accessibility, legal compliance, or certification.

## Assessment map

| Assessment | Responsibility |
| --- | --- |
| [Technology selection](TECHNOLOGY_SELECTION.md) | Minimal TypeScript, Playwright, Chromium, and axe-core proposal, with alternatives and primary-source evidence. |
| [Authorized public-page execution and security](AUTHORIZED_PUBLIC_PAGE_EXECUTION_AND_SECURITY.md) | Runtime admission, browser/network containment, exact three-rule scan, bounds, coverage, failure, and Step 1 handoff. |
| [Controlled-fixture execution and security](CONTROLLED_FIXTURE_EXECUTION_AND_SECURITY.md) | Project-owned deterministic evaluation baseline and its stricter zero-egress fixture profile. |

## Step boundary

Step 1 ends with a runtime-validated, **transient native page-scan observation held in memory**. Step 2 exclusively owns rule-specific evidence allowlisting, privacy sanitization, per-node finding identity, normalized evidence, redaction information, and durable publication.

All application-owned scan logic remains ordinary modules in one local TypeScript service. The loopback React UI is unprivileged; it does not receive raw page/scanner payloads, filesystem authority, provider credentials, local-model-runtime access, or Playwright authority. Whether the accepted network boundary can be enforced in that one service is an implementation evaluation question; this assessment does not assume that browser request interception alone satisfies ADR-0017.

## Documentation navigation

- Next workflow step: [Accessibility finding and evidence capture assessment](../ACCESSIBILITY_FINDING_EVIDENCE_CAPTURE_ASSESSMENT.md)
- [ADR-0017: Authorized public-page scan boundary](../../decisions/ADR-0017-authorized-public-page-scan-boundary.md)
- [Architecture index](../../README.md)
- [Candidate architecture](../../CANDIDATE_ARCHITECTURE.md)
- [Local MVP feasibility](../../../LOCAL_MVP_FEASIBILITY.md)
- [Evidence and review workflow requirements](../../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md)
- [Quality, security, and operations requirements](../../../requirements/quality-security-and-operations/README.md)
- [Project documentation index](../../../README.md)
