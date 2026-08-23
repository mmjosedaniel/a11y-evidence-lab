# Project context

## Motivation

Automated accessibility tools can identify deterministic issues, but their output often stops at detection. Engineering teams still need to connect findings to authoritative guidance, understand the available evidence, identify where human judgment is required, and verify whether a change improved the result.

A11y Evidence Lab explores an evidence-centered workflow for that gap. The goal is not to build a generic document chatbot, but to connect browser findings, retrieved guidance, structured remediation proposals, human review, and before-and-after verification.

## Direction

The selected direction combines:

- Deterministic browser analysis as the source of findings and page evidence.
- Retrieval from a curated, versioned accessibility corpus.
- Grounded explanations and remediation proposals with citations.
- Explicit confidence, abstention, and manual-check requirements.
- User approval, editing, or rejection before a proposal is tracked.
- Rescanning and comparison to evaluate whether an issue improved, remained, or regressed.

This structure makes the AI workflow observable and testable. Retrieval quality, answer quality, review outcomes, and regressions can be evaluated independently instead of relying on the apparent quality of a chat response.

## Technical intent

The engineering objective is to demonstrate practical use of retrieval-augmented generation, LangChain, LangGraph, and LangSmith in a cohesive workflow. Their intended roles cover retrieval and model integration, stateful orchestration, human-review paths, tracing, evaluation, and regression analysis. The exact architecture and component configuration remain open decisions.

A local-first configuration is feasible for document ingestion, embeddings, vector search, retrieval, and generation. A hosted model can remain an optional comparison or deployment path rather than a requirement for the core workflow.

## Product boundaries

- The product would support investigation and review; it would not certify accessibility or legal compliance.
- Deterministic evidence and cited guidance would remain distinguishable from model-generated interpretation.
- Findings that require contextual or subjective judgment would be routed to human review.
- The system would operate only on authorized pages or controlled fixtures.
- Private pages, source code, and sensitive traces would not be exposed in a public demonstration.
- Automated source-code modification is outside the current concept.

## Current status

The project remains in idea exploration. No implementation has started, and the architecture, tools, evaluation dataset, and success thresholds remain open decisions.

## Documentation navigation

- [Documentation index](README.md)
- Next: [Project concept](PROJECT_CONCEPT.md)
