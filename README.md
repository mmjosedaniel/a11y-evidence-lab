# A11y Evidence Lab

## Overview

A11y Evidence Lab is a planned accessibility analysis application whose goal is to help a frontend developer turn automated findings into traceable, guidance-backed remediation decisions that can be reviewed and verified, with QA engineers as secondary users. It would analyze controlled synthetic page states with deterministic browser checks, preserve the evidence behind each finding, retrieve relevant guidance from a curated corpus, determine whether that evidence and guidance are sufficient for generation, and use a user-selected local or Groq-hosted LLM to generate cited explanations, remediation proposals, and required manual checks through one provider-neutral contract.

The portfolio MVP is deliberately limited to three project-owned, synthetic, controlled scenarios: a missing text alternative for an informative image (`image-alt`), a form input without an accessible label (`label`), and normal text with insufficient color contrast (`color-contrast`). Each scenario has a failing and corrected state, and the product processes one selected scenario and one finding workflow at a time. The MVP accepts no live-site input, performs no crawling, and contains no crawler implementation.

This is a deliberate portfolio-scope decision. The project exists to demonstrate the complete implementation and integration of deterministic scanning, minimized evidence capture, curated RAG through a bounded LangChain role, structured AI generation, human review, and deterministic rescan comparison—not to build a production website crawler. Crawling and broader accessibility coverage are important possible product capabilities, but they are deferred until a demonstrated product need justifies their security, product, and engineering cost. This limitation applies to the MVP only.

Users would review each proposal and could approve, edit, or reject it before it becomes an accepted remediation plan. Subsequent scans would first determine whether the evidence pair is comparable; a comparable finding may then be classified as resolved, improved where an ordered measure exists, persistent, regressed, or inconclusive. The application would support accessibility investigation and engineering decisions; it would not provide accessibility certification or legal-compliance determinations, and it would not modify source code automatically.

## Why this matters

Automated accessibility scanners are effective at identifying deterministic issues, but their output often lacks the context engineering teams need to understand impact, select remediation, distinguish automated evidence from human judgment, and verify improvement. A11y Evidence Lab would bring those activities into one traceable workflow.

## Engineering objective

The project objective is to demonstrate the practical use of retrieval-augmented generation in an evidence-centered application without turning the portfolio MVP into a production-scale platform:

- **RAG** would ground explanations and remediation proposals in a curated, versioned accessibility corpus.
- **LangChain** is the initial evaluation baseline for the small retrieve-then-generate integration.
- Plain TypeScript application state is sufficient for the first linear workflow and one human decision.
- **LangGraph** remains a later candidate only if a demonstrated resume or recovery need justifies it.
- **LangSmith** is deferred outside the MVP; content-safe local records and diagnostics are sufficient for the portfolio workflow.

The MVP has exactly two generation modes, selected explicitly for each generation run: a downloaded local model through the selected local runtime, or the Groq API as the first and only external provider. Local mode remains the recommended initial choice, but it is never an automatic fallback or an implicit selection. The fixed Groq evaluation configuration uses model ID `openai/gpt-oss-20b`; this is an evaluation choice, not a release-qualified dependency or availability promise. A local failure never sends data to Groq without a new user choice. Groq remains the provider even when its API uses an OpenAI-compatible interface. Local model evaluation is restricted to configurations that first pass the documented capacity gate on the existing reference PC; models outside that capacity are excluded. TypeScript, React, and the bounded LangChain role join the other initial evaluation baselines recorded in the [architecture decisions](docs/architecture/decisions/README.md).

## Planned MVP startup and generation setup

The portfolio MVP has no installer, desktop wrapper, Start menu shortcut, or application-controlled webview. The developer starts a local application service on the developer machine and opens its loopback address in Chrome or Edge. The browser is only the unprivileged interface; the local service owns filesystem access, deterministic browser automation, the local model-runtime adapter, and the Groq adapter.

Local model weights are downloaded separately and explicitly, outside the repository, with size and storage information shown before acquisition. Groq setup is a separate explicit option, and its credential remains in the local service rather than browser-delivered code or tracked project files. Packaging and installer work are deferred until a demonstrated distribution need justifies them.

## Planned workflow

1. [Scan the selected controlled synthetic scenario with deterministic browser checks](docs/architecture/candidates/authorized-scan/README.md).
2. [Capture findings and the evidence behind them](docs/architecture/candidates/ACCESSIBILITY_FINDING_EVIDENCE_CAPTURE_ASSESSMENT.md).
3. [Retrieve relevant accessibility guidance from the curated corpus](docs/architecture/candidates/guidance-retrieval/README.md).
4. [Gate generation on evidence sufficiency, then generate a cited proposal with confidence, uncertainty, and required manual checks—or abstain without a model call](docs/architecture/candidates/EVIDENCE_GROUNDED_REMEDIATION_GENERATION_ASSESSMENT.md).
5. [Present each AI-generated remediation proposal for approval, editing, or rejection](docs/architecture/candidates/HUMAN_REMEDIATION_REVIEW_ASSESSMENT.md).
6. [Rescan the selected controlled scenario and compare its evidence conservatively](docs/architecture/candidates/RESCAN_EVIDENCE_COMPARISON_ASSESSMENT.md).

For `image-alt` and `label`, the comparison is binary: a same-target failing-to-corrected transition may be `resolved`, failing-to-failing is `persistent`, and corrected-to-failing is `regressed`, subject to comparability and evidence gates. For `color-contrast`, the retained contrast margin supplies an ordered measure: a later native pass may be `resolved`; among two remaining violations, a higher margin is `improved`, an equal margin is `persistent`, and a lower margin is `regressed`. An `improved` result remains unresolved, and none of these outcomes establishes whole-page accessibility or conformance.

## Project status

Idea exploration only. No implementation, dependencies, tests, or technical setup have been started.

## Current scope

This repository currently contains product planning and feasibility analysis only. No runnable application or implementation has been created.

## Documentation

Start with the [project documentation index](docs/README.md) for the recommended reading order, current concept, context, [project requirements](docs/PROJECT_REQUIREMENTS.md), and local MVP feasibility assessment.

## License

This project is licensed under the [MIT License](LICENSE).
