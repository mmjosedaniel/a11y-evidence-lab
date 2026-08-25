# Architecture

This directory is the entry point for the architecture documentation of A11y Evidence Lab. It separates accepted decisions from proposed designs and will grow with the system as the project moves from idea exploration into development.

## Current documentation

- [Architecture Decision Records](decisions/README.md) document significant accepted technical and architectural decisions, their context, and their consequences.
- [Candidate architecture](CANDIDATE_ARCHITECTURE.md) organizes proposed system shapes, technology constraints, and adoption gates. Its status is **Proposed**; it is not an accepted decision or implementation authority.
- The [workflow-step technical assessments](#workflow-step-technical-assessments) record the smallest viable Proposed technical approach for each of the six planned workflow elements.
- [Voxleaf implementation-pattern assessment](candidates/VOXLEAF_IMPLEMENTATION_PATTERN_ASSESSMENT.md) records proposed research inputs, limitations, and provenance from the reference review. Its status is **Proposed**; it does not select a dependency, technology, threshold, provider, model, or release design.

## Workflow-step technical assessments

The requirement IDs, wording, and statuses remain authoritative in [Evidence and review workflow requirements](../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md). These assessments are supporting Proposed architecture research. They cannot override a requirement or accepted ADR, promote an evaluation baseline, or authorize development.

All six assessments now describe the same first portfolio slice: one project-owned `image-alt` fixture in failing and corrected states. Step 1 owns browser execution and ends with a transient native axe observation; Step 2 exclusively creates minimized durable evidence. Steps 3 and 4 use the bounded LangChain evaluation role accepted by [ADR-0013](decisions/ADR-0013-langchain-as-initial-rag-integration.md), while review and comparison remain plain application-owned TypeScript behavior.

| Step | Assessment | Focus |
| --- | --- | --- |
| 1 | [Authorized deterministic web scan assessments](candidates/authorized-scan/README.md) | Family index for technology selection and controlled-fixture execution, determinism, and security. |
| 2 | [Accessibility finding and evidence capture](candidates/ACCESSIBILITY_FINDING_EVIDENCE_CAPTURE_ASSESSMENT.md) | Scanner findings, minimized evidence, provenance, coverage, and sanitization. |
| 3 | [Accessibility guidance retrieval assessments](candidates/guidance-retrieval/README.md) | Family index for curated-corpus preparation and local retrieval execution and evaluation. |
| 4 | [Evidence-grounded remediation generation](candidates/EVIDENCE_GROUNDED_REMEDIATION_GENERATION_ASSESSMENT.md) | Structured generation, grounding, citation attachment, sufficiency, abstention, and model evaluation. |
| 5 | [Human remediation review](candidates/HUMAN_REMEDIATION_REVIEW_ASSESSMENT.md) | Evidence-first proposal review, decisions, manual checks, lifecycle, and review history. |
| 6 | [Rescan evidence comparison](candidates/RESCAN_EVIDENCE_COMPARISON_ASSESSMENT.md) | Scan comparability, finding correlation, evidence deltas, outcomes, and follow-up checks. |

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
