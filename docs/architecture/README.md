# Architecture

This directory is the entry point for the architecture documentation of A11y Evidence Lab. It separates accepted decisions from proposed designs and will grow with the system as the project moves from idea exploration into development.

## Current documentation

- [Architecture Decision Records](decisions/README.md) document significant accepted technical and architectural decisions, their context, and their consequences.
- [Candidate architecture](CANDIDATE_ARCHITECTURE.md) organizes proposed system shapes, technology constraints, and adoption gates. Its status is **Proposed**; it is not an accepted decision or implementation authority.
- The [workflow-step technical assessments](#workflow-step-technical-assessments) record the smallest viable Proposed technical approach for each of the six planned workflow elements.
- [Voxleaf implementation-pattern assessment](candidates/VOXLEAF_IMPLEMENTATION_PATTERN_ASSESSMENT.md) records proposed research inputs, limitations, and provenance from the reference review. Its status is **Proposed**; it does not select a dependency, technology, threshold, provider, model, or release design.

## Workflow-step technical assessments

The requirement IDs, wording, and statuses remain authoritative in [Evidence and review workflow requirements](../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md). These assessments are supporting Proposed architecture research. They cannot override a requirement or accepted ADR, promote an evaluation baseline, or authorize development.

All six assessments now describe the same first portfolio slice: exactly three independent, project-owned synthetic controlled profiles in failing and corrected states—`informative-image-alt` (axe `image-alt`, WCAG 2.2 SC 1.1.1), `form-input-label` (axe `label`, SC 4.1.2), and `text-contrast` (axe `color-contrast`, SC 1.4.3). One operation selects one profile, executes only its named rule, and carries one finding and one proposal through the sequential workflow. Step 1 owns browser execution and ends with a transient native axe observation; Step 2 exclusively creates minimized durable evidence. Steps 3 and 4 use the bounded LangChain evaluation role accepted by [ADR-0013](decisions/ADR-0013-langchain-as-initial-rag-integration.md), while review and comparison remain plain application-owned TypeScript behavior. LangGraph remains deferred and LangSmith remains optional for eligible synthetic-data evaluation only.

The mapping basis is the official versioned [axe-core 4.13 rule descriptions](https://github.com/dequelabs/axe-core/blob/v4.13.0/doc/rule-descriptions.md) and normative WCAG 2.2 [SC 1.1.1](https://www.w3.org/TR/2024/REC-WCAG22-20241212/#non-text-content), [SC 4.1.2](https://www.w3.org/TR/2024/REC-WCAG22-20241212/#name-role-value), and [SC 1.4.3](https://www.w3.org/TR/2024/REC-WCAG22-20241212/#contrast-minimum). A rule tag scopes evidence and retrieval; it does not make one automated result proof of complete success-criterion or page-level non-conformance.

OD-019 records this accepted portfolio-scope replacement for OD-002's earlier one-scenario resolution; it does not promote any Proposed assessment or evaluation baseline to an implementation or release dependency. The MVP includes no live-page or arbitrary-URL scanning, authenticated target scanning, crawling, crawler implementation, multi-rule orchestration, service expansion, agent, queue, or workflow engine.

| Step | Assessment | Focus |
| --- | --- | --- |
| 1 | [Authorized deterministic web scan assessments](candidates/authorized-scan/README.md) | Select one controlled profile and execute only its pinned axe rule in the deterministic browser boundary. |
| 2 | [Accessibility finding and evidence capture](candidates/ACCESSIBILITY_FINDING_EVIDENCE_CAPTURE_ASSESSMENT.md) | Convert the selected rule's transient native result into minimized, rule-appropriate durable evidence and provenance. |
| 3 | [Accessibility guidance retrieval assessments](candidates/guidance-retrieval/README.md) | Prepare the bounded three-scenario guidance corpus and retrieve cited passages for one finding. |
| 4 | [Evidence-grounded remediation generation](candidates/EVIDENCE_GROUNDED_REMEDIATION_GENERATION_ASSESSMENT.md) | Generate one structured proposal from the selected finding and eligible passages, with sufficiency, citations, abstention, and manual checks. |
| 5 | [Human remediation review](candidates/HUMAN_REMEDIATION_REVIEW_ASSESSMENT.md) | Present the four information layers for one proposal and record one approve, edit, or reject decision without automatic modification. |
| 6 | [Rescan evidence comparison](candidates/RESCAN_EVIDENCE_COMPARISON_ASSESSMENT.md) | Compare one baseline/later pair under the same profile, including ordered contrast evidence where applicable, and report conservative outcomes. |

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
