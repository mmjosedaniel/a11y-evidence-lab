# Authorized deterministic web scan candidate assessments

## Authority, status, and scope

**Document status: Proposed architecture assessment.** ADR-0008, ADR-0009, and ADR-0011 retain their accepted evaluation-baseline scope; no part of this assessment family becomes accepted by association.

Assessment date: 2026-08-23. Simplified for the portfolio vertical slice on 2026-08-24.

This family describes the smallest proposed approach for the first workflow step: **scan an authorized controlled fixture with deterministic browser checks**. It does not authorize implementation, dependency installation, live-page scanning, or release adoption.

The authoritative behavior remains in [Evidence and review workflow requirements — Target authorization and scanning](../../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#target-authorization-and-scanning), the applicable focused modules in [Quality, security, and operations requirements](../../../requirements/quality-security-and-operations/README.md), and accepted ADRs. If an assessment conflicts with an identified requirement or accepted ADR, that authority controls.

## Initial portfolio slice

The accepted first portfolio scenario is deliberately narrow; this assessment proposes only how Step 1 executes it:

- One synthetic, project-owned product-image scenario represented by a baseline fixture and one corrected revision.
- The baseline contains one informative image without an alternative-text attribute.
- The corrected revision contains an appropriate alternative for the same image.
- One pinned axe-core rule, **image-alt**, runs in one pinned Playwright-managed Chromium profile.
- No arbitrary URL, uploaded HTML, credential, crawling, or live-page access.

This is enough to supply deterministic evidence to the later retrieval and generation stages while keeping the portfolio focus on RAG, LangChain, grounded generation, tracing, evaluation, and human review.

## Assessment map

| Assessment | Responsibility |
| --- | --- |
| [Technology selection](TECHNOLOGY_SELECTION.md) | Minimal TypeScript, Playwright, Chromium, and axe-core proposal, with alternatives and primary-source evidence. |
| [Controlled-fixture execution and security](CONTROLLED_FIXTURE_EXECUTION_AND_SECURITY.md) | Exact fixture slice, minimal authorization attestation, page-state profile, execution sequence, scan outcome, Step 1 handoff, security limits, and live-page prerequisites. |

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
