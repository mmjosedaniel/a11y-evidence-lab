# A11y Evidence Lab

## Overview

A11y Evidence Lab is a planned accessibility analysis application whose goal is to help engineering teams turn automated findings into traceable, guidance-backed remediation decisions that can be reviewed and verified. It would analyze authorized web pages with deterministic browser checks, preserve the evidence behind each finding, retrieve relevant guidance from a curated corpus, and use AI to generate cited explanations, remediation proposals, confidence indicators, and required manual checks.

Users would review each proposal and could approve, edit, or reject it before it is tracked. Subsequent scans would compare evidence to show whether an issue improved, remained, or regressed. The application would support accessibility investigation and engineering decisions; it would not provide accessibility certification or legal-compliance determinations, and it would not modify source code automatically.

## Why this matters

Automated accessibility scanners are effective at identifying deterministic issues, but their output often lacks the context engineering teams need to understand impact, select remediation, distinguish automated evidence from human judgment, and verify improvement. A11y Evidence Lab would bring those activities into one traceable workflow.

## Engineering objective

The project objective is to demonstrate the practical use of retrieval-augmented generation and its supporting workflow technologies in an evidence-centered application:

- **RAG** would ground explanations and remediation proposals in a curated, versioned accessibility corpus.
- **LangChain** would support retrieval and model integration.
- **LangGraph** would coordinate the stateful workflow, including review and recovery paths.
- **LangSmith** would support traces, evaluation datasets, and regression analysis.

The exact models, vector store, integration design, and deployment path remain open to evaluation.

## Planned workflow

1. Scan an authorized web page with deterministic browser checks.
2. Capture findings and the evidence behind them.
3. Retrieve relevant accessibility guidance from the curated corpus.
4. Generate cited explanations, remediation proposals, confidence indicators, and required manual checks.
5. Present each AI-generated remediation proposal, with its evidence, citations, confidence, and manual checks, so the user can approve, edit, or reject it.
6. Rescan the page and compare the evidence to identify improvement, persistence, or regression.

## Project status

Idea exploration only. No implementation, dependencies, tests, or technical setup have been started.

## Current scope

This repository currently contains product planning and feasibility analysis only. No runnable application or implementation has been created.

## Documentation

Start with the [project documentation index](docs/README.md) for the recommended reading order, current concept, context, and local MVP feasibility assessment.

## License

This project is licensed under the [MIT License](LICENSE).
