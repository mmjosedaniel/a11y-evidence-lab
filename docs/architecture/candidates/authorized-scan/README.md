# Authorized deterministic web scan candidate assessments

## Authority, status, and scope

**Document status: Proposed architecture assessment.** ADR-0008, ADR-0009, and ADR-0011 retain their accepted evaluation-baseline scope; no part of this assessment family becomes accepted by association.

Assessment date: 2026-08-23. Expanded to the three-scenario portfolio slice on 2026-08-24.

This family describes the smallest proposed approach for the first workflow step: **scan an authorized controlled fixture with deterministic browser checks**. It does not authorize implementation, dependency installation, live-page scanning, or release adoption.

The authoritative behavior remains in [Evidence and review workflow requirements — Target authorization and scanning](../../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#target-authorization-and-scanning), the applicable focused modules in [Quality, security, and operations requirements](../../../requirements/quality-security-and-operations/README.md), and accepted ADRs. If an assessment conflicts with an identified requirement or accepted ADR, that authority controls.

## Initial portfolio slice

The accepted first portfolio slice is deliberately limited to three synthetic, project-owned controlled scenario families. This assessment proposes only how Step 1 executes them:

| Scenario profile | Failing and corrected revisions | Direct rule mapping |
| --- | --- | --- |
| `informative-image-alt` — missing text alternative | One informative image without an `alt` attribute, then the same image with a reviewed alternative | axe-core **image-alt**; WCAG 2.2 SC 1.1.1 |
| `form-input-label` — missing accessible form-input name | One email input with nearby visible text but no programmatic association, then the same input with an explicit visible `label` | axe-core **label**; WCAG 2.2 SC 4.1.2. The rule does not by itself test SC 3.3.2 or the whole success criterion/page. |
| `text-contrast` — insufficient text contrast | One 16 CSS px, weight-400 normal-text target rendered as `#888888` on `#ffffff`, then the same target as `#767676` on `#ffffff` | axe-core **color-contrast**; WCAG 2.2 SC 1.4.3 |

Each scan operation selects exactly one scenario, one failing or corrected revision, one rule, and one intended target. The three families use the same pinned Playwright-managed Chromium profile but do not form a broad rule suite. No operation accepts an arbitrary URL, uploaded HTML, credential, authentication state, crawler input, or live page.

This is enough to supply three different kinds of deterministic evidence to the later retrieval and generation stages while keeping the portfolio focus on RAG, bounded LangChain integration, grounded generation, evaluation, human review, and rescan comparison. Broader rule or fixture coverage and any crawler remain deferred until demonstrated product need.

## Assessment map

| Assessment | Responsibility |
| --- | --- |
| [Technology selection](TECHNOLOGY_SELECTION.md) | Minimal TypeScript, Playwright, Chromium, and axe-core proposal, with alternatives and primary-source evidence. |
| [Controlled-fixture execution and security](CONTROLLED_FIXTURE_EXECUTION_AND_SECURITY.md) | Exact three-family fixture slice, minimal authorization attestation, page-state profile, execution sequence, scan outcome, Step 1 handoff, and security limits. |

## Step boundary

Step 1 ends with a runtime-validated, **transient native scanner observation held in memory**. Step 2 exclusively owns evidence allowlisting, privacy sanitization, normalization, finding and evidence records, redaction information, and durable publication.

All application-owned scan logic is proposed as ordinary modules in one local TypeScript application process. Playwright still launches and owns its managed Chromium process; the MVP does not add an application child worker, IPC protocol, process-tree supervisor, policy proxy, or microservice.

## Documentation navigation

- Next workflow step: [Accessibility finding and evidence capture assessment](../ACCESSIBILITY_FINDING_EVIDENCE_CAPTURE_ASSESSMENT.md)
- [Architecture index](../../README.md)
- [Candidate architecture](../../CANDIDATE_ARCHITECTURE.md)
- [Local MVP feasibility](../../../LOCAL_MVP_FEASIBILITY.md)
- [Evidence and review workflow requirements](../../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md)
- [Quality, security, and operations requirements](../../../requirements/quality-security-and-operations/README.md)
- [Project documentation index](../../../README.md)
