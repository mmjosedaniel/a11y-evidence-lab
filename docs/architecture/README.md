# Architecture

This directory is the entry point for the architecture documentation of A11y Evidence Lab. It separates accepted decisions from proposed designs and will grow with the system as the project moves from idea exploration into development.

## Current documentation

- [Architecture Decision Records](decisions/README.md) document significant accepted technical and architectural decisions, their context, and their consequences.
- [Candidate architecture](CANDIDATE_ARCHITECTURE.md) organizes proposed system shapes, technology constraints, and adoption gates. Its status is **Proposed**; it is not an accepted decision or implementation authority.
- [ADR-0014](decisions/ADR-0014-groq-as-mvp-external-generation-provider.md), [ADR-0015](decisions/ADR-0015-localhost-browser-mvp-execution.md), [ADR-0016](decisions/ADR-0016-filesystem-run-persistence.md), and [ADR-0017](decisions/ADR-0017-authorized-public-page-scan-boundary.md) record the accepted MVP external-provider, execution-topology, run-persistence, and authorized public-page boundaries.
- The [workflow-step technical assessments](#workflow-step-technical-assessments) record the smallest viable Proposed technical approach for each of the six planned workflow elements.
- [Voxleaf implementation-pattern assessment](candidates/VOXLEAF_IMPLEMENTATION_PATTERN_ASSESSMENT.md) records proposed research inputs, limitations, and provenance from the reference review. Its status is **Proposed**; it does not select a dependency, technology, threshold, provider, model, or release design.

## Workflow-step technical assessments

The requirement IDs, wording, and statuses remain authoritative in [Evidence and review workflow requirements](../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md). These assessments are supporting Proposed architecture research. They cannot override a requirement or accepted ADR, promote an evaluation baseline, or authorize development.

The accepted MVP now has a public-page operating path and a controlled evaluation baseline. One `PageAnalysisRun` accepts one explicitly attested public HTTPS URL, loads it in an ephemeral Playwright-managed Chromium environment behind the application-owned egress gate, and performs one atomic axe-core scan with exactly `image-alt`, `label`, and `color-contrast`. A complete scan lists every in-bounds violation node with independently addressable minimized evidence as a `Finding` and every admitted native axe `incomplete` node separately as a `ScannerReviewObservation`; incomplete scan coverage is another distinct condition, and zero Findings is valid only after all three rules and both collections validate as complete. The user then selects one Finding at a time for retrieval, deterministic sufficiency, proposal or abstention, human review, and comparison. Scanner-review observations never enter that path, and no automatic all-findings workflow is created.

Exactly three independent, project-owned synthetic profiles in failing and corrected states remain the fixed evaluation baseline: `informative-image-alt` (axe `image-alt`, WCAG 2.2 SC 1.1.1), `form-input-label` (axe `label`, SC 4.1.2), and `text-contrast` (axe `color-contrast`, SC 1.4.3). Their fixture-specific assessment procedures support reproducible evaluation; they do not enter the user-submitted runtime URL path. Step 3 uses the bounded LangChain role accepted by [ADR-0013](decisions/ADR-0013-langchain-as-initial-rag-integration.md) for one selected finding. Step 4 uses the parent run's global `Local` or `Groq` mode and invokes that adapter at most once only for complete required evidence plus a completed `supported` retrieval; every other support state preserves the finding and produces abstention without a model call. Review and comparison remain plain application-owned behavior. LangGraph, LangSmith, provider batches, and automatic fallback are outside the MVP.

The mapping basis is the official versioned [axe-core 4.13 rule descriptions](https://github.com/dequelabs/axe-core/blob/v4.13.0/doc/rule-descriptions.md) and normative WCAG 2.2 [SC 1.1.1](https://www.w3.org/TR/2024/REC-WCAG22-20241212/#non-text-content), [SC 4.1.2](https://www.w3.org/TR/2024/REC-WCAG22-20241212/#name-role-value), and [SC 1.4.3](https://www.w3.org/TR/2024/REC-WCAG22-20241212/#contrast-minimum). A rule tag scopes evidence and retrieval; it does not make one automated result proof of complete success-criterion or page-level non-conformance.

OD-019 remains decision history for the three-profile evaluation baseline and its replacement of OD-002's earlier one-scenario scope. ADR-0017 later accepts the single authorized public-page boundary without promoting proposal-only mechanics or unqualified technology configurations to release dependencies. The local application service owns the non-bypassable loopback egress gate, browser automation, provider calls, and filesystem parent/child record boundary. Exact numeric public-page limits and the gate's implementation remain open pre-development qualification. The MVP still includes no authenticated target scanning, user-profile reuse, interaction scripting, crawling, crawler implementation, automatic multi-finding orchestration, agent, queue, workflow engine, installer, or desktop wrapper.

| Step | Assessment | Focus |
| --- | --- | --- |
| 1 | [Authorized deterministic web scan assessments](candidates/authorized-scan/README.md) | Qualify the controlled fixtures and the ADR-0017 public-page boundary; execute exactly the three accepted rules atomically and distinguish complete scan coverage, native scanner-incomplete observations, failures, and a valid zero-Finding result. |
| 2 | [Accessibility finding and evidence capture](candidates/ACCESSIBILITY_FINDING_EVIDENCE_CAPTURE_ASSESSMENT.md) | Convert every in-bounds violation node into a minimized `Finding`, retain native `incomplete` nodes separately as minimized scanner-review observations, and expose Finding selection without automatic downstream processing. |
| 3 | [Accessibility guidance retrieval assessments](candidates/guidance-retrieval/README.md) | Prepare the bounded three-rule guidance corpus and retrieve cited passages for one user-selected finding. |
| 4 | [Evidence-grounded remediation generation](candidates/EVIDENCE_GROUNDED_REMEDIATION_GENERATION_ASSESSMENT.md) | Under the parent run's global mode, generate one structured proposal for one eligible selected Finding; otherwise preserve the deterministic sufficiency result and abstain without a model call. |
| 5 | [Human remediation review](candidates/HUMAN_REMEDIATION_REVIEW_ASSESSMENT.md) | Present the four information layers for one selected finding's proposal and record one approve, edit, or reject decision without automatic modification. |
| 6 | [Rescan evidence comparison](candidates/RESCAN_EVIDENCE_COMPARISON_ASSESSMENT.md) | Compare one complete baseline/later `PageAnalysisRun` pair after page/profile comparability, correlate Findings independently, preserve unmatched or ambiguous cases, and report only conservative child outcomes. |

## Planned documentation areas

Add architecture documents only when the corresponding design has enough evidence to be useful. Expected areas include:

- System context and component boundaries.
- Runtime and deployment topology.
- Data flows, persistence, and lifecycle ownership.
- Trust boundaries, privacy, and security controls.
- Architecture diagrams and their supporting explanations.

Proposed architecture alternatives remain non-authoritative planning material until accepted. Significant durable decisions belong in an ADR and must be linked from the decision index; candidate documents must not be interpreted as changing the scope or status of an accepted ADR.

## Documentation navigation

- [Project documentation index](../README.md)
- [Project overview](../../README.md)
