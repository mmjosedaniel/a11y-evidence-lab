# A11y Evidence Lab

## Overview

A11y Evidence Lab is a planned accessibility analysis application whose goal is to help a frontend developer turn automated findings into traceable, guidance-backed remediation decisions that can be reviewed and verified, with QA engineers as secondary users. For one user-supplied, explicitly authorized public HTTPS page at a time, it would run a bounded browser scan, preserve minimized evidence behind each finding, retrieve relevant guidance from a curated corpus, determine whether that finding's evidence and guidance are sufficient for generation, and use the selected local or Groq-hosted LLM to generate cited explanations, remediation proposals, and required manual checks through one provider-neutral contract.

The portfolio MVP deliberately scans exactly three axe-core rules: `image-alt`, `label`, and `color-contrast`. One atomic, provider-independent scan lists every in-envelope axe violation node reported by those rules; native `incomplete` observations remain visible and distinct from findings. A complete scan may validly report zero findings, but neither zero nor any other count is an accessibility or compliance verdict. If a safety or resource bound prevents complete coverage, the scan fails visibly with its coverage limitation and is never published as a complete or silently truncated result.

This is a deliberate portfolio-scope decision. The project exists to demonstrate the complete implementation and integration of bounded browser scanning, minimized evidence capture, curated RAG through a bounded LangChain role, structured AI generation, human review, and conservative rescan comparison—not to build a production website crawler. It accepts one public page target per analysis run, but performs no link discovery, crawling, authenticated-page access, bulk generation, or broader rule coverage. The fixed synthetic image, label, and contrast scenarios remain reproducible evaluation inputs; they are not user-submitted runtime page inputs. [OD-020](docs/requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-020--authorized-public-page-analysis-scope) records this scope, while [ADR-0017](docs/architecture/decisions/ADR-0017-authorized-public-page-scan-boundary.md) owns the public-page scan trust boundary.

Users would review each proposal and could approve, edit, or reject it before it becomes an accepted remediation plan. Subsequent scans would first determine whether the evidence pair is comparable; a comparable finding may then be classified as resolved, improved where an ordered measure exists, persistent, regressed, or inconclusive. The application would support accessibility investigation and engineering decisions; it would not provide accessibility certification or legal-compliance determinations, and it would not modify source code automatically.

## Why this matters

Automated accessibility scanners are effective at identifying deterministic issues, but their output often lacks the context engineering teams need to understand impact, select remediation, distinguish automated evidence from human judgment, and verify improvement. A11y Evidence Lab would bring those activities into one traceable workflow.

## Engineering objective

The project objective is to demonstrate the practical use of retrieval-augmented generation in an evidence-centered application without turning the portfolio MVP into a production-scale platform:

- **RAG** would ground explanations and remediation proposals in a curated, versioned accessibility corpus.
- **LangChain** is the initial evaluation baseline for the small retrieve-then-generate integration.
- Plain TypeScript application state is sufficient for the first linear workflow and one current human decision at a time.
- **LangGraph** remains a later candidate only if a demonstrated resume or recovery need justifies it.
- **LangSmith** is deferred outside the MVP; content-safe local records and diagnostics are sufficient for the portfolio workflow.

The MVP has exactly two generation modes: a downloaded local model through the selected local runtime, or the Groq API as the first and only external provider. The user selects one global mode before starting an analysis, and that immutable choice applies to every later eligible finding in the run; providers are never mixed and there is no automatic fallback. The scan itself remains provider-independent, and choosing a mode does not invoke a model. Actual provider provenance is recorded only for a finding whose evidence-supported generation call occurs. Local mode remains the recommended initial choice. The fixed Groq evaluation configuration uses model ID `openai/gpt-oss-20b`; this is an evaluation choice, not a release-qualified dependency or availability promise. Local model evaluation is restricted to configurations that first pass the documented capacity gate on the existing reference PC; models outside that capacity are excluded. TypeScript, React, and the bounded LangChain role join the other initial evaluation baselines recorded in the [architecture decisions](docs/architecture/decisions/README.md).

## Planned MVP startup and generation setup

The portfolio MVP has no installer, desktop wrapper, Start menu shortcut, or application-controlled webview. The developer starts a local application service on the developer machine and opens its loopback address in Chrome or Edge. The browser is only the unprivileged interface; the local service owns filesystem access, constrained scan-browser automation, the local model-runtime adapter, and the Groq adapter.

Local model weights are downloaded separately and explicitly, outside the repository, with size and storage information shown before acquisition. Groq setup is a separate explicit option, and its credential remains in the local service rather than browser-delivered code or tracked project files. Packaging and installer work are deferred until a demonstrated distribution need justifies them.

## Planned workflow

1. The user enters one authorized public HTTPS URL, confirms authorization and scope, selects the global Local or Groq generation mode, and activates **Analyze** to start one bounded scan under the [authorized-page boundary](docs/architecture/decisions/ADR-0017-authorized-public-page-scan-boundary.md).
2. The scan runs exactly `image-alt`, `label`, and `color-contrast`, then [captures every in-envelope violation node and its minimized evidence](docs/architecture/candidates/ACCESSIBILITY_FINDING_EVIDENCE_CAPTURE_ASSESSMENT.md) while keeping native incomplete observations separate.
3. The application lists the findings; the user selects one finding at a time for [curated guidance retrieval](docs/architecture/candidates/guidance-retrieval/README.md).
4. For that finding, the application [gates generation on evidence sufficiency, then generates a cited proposal with confidence, uncertainty, and required manual checks—or abstains without a model call](docs/architecture/candidates/EVIDENCE_GROUNDED_REMEDIATION_GENERATION_ASSESSMENT.md).
5. The application [presents that proposal for individual approval, editing, or rejection](docs/architecture/candidates/HUMAN_REMEDIATION_REVIEW_ASSESSMENT.md); it never creates one combined proposal for the page.
6. A later analysis of the same authorized page [compares evidence conservatively per finding](docs/architecture/candidates/RESCAN_EVIDENCE_COMPARISON_ASSESSMENT.md).

For `image-alt` and `label`, a uniquely correlated same-target transition may be classified conservatively as `resolved`, `persistent`, or `regressed`, subject to comparability and evidence gates. For `color-contrast`, the retained contrast margin supplies an ordered measure that can also support `improved` while the finding remains unresolved. Changed or ambiguous live-page structure may require `inconclusive` or `not comparable`. None of these outcomes establishes whole-page accessibility or conformance.

## Project status

Idea exploration only. No implementation, dependencies, tests, or technical setup have been started.

## Current scope

This repository currently contains product planning and feasibility analysis only. No runnable application or implementation has been created.

## Documentation

Start with the [project documentation index](docs/README.md) for the recommended reading order, current concept, context, [project requirements](docs/PROJECT_REQUIREMENTS.md), local MVP feasibility assessment, and the derived [documentation-only Gherkin specifications](docs/specs/README.md).

## License

This project is licensed under the [MIT License](LICENSE).
