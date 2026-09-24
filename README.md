# A11y Evidence Lab

## Overview

A11y Evidence Lab helps frontend developers turn automated accessibility findings into traceable, guidance-backed remediation decisions. It combines deterministic browser scanning, curated accessibility guidance, Local or Groq generation, human proposal review, and conservative rescan comparison.

The portfolio MVP analyzes **one trusted public HTTPS page at a time**, using exactly three axe-core rules: `image-alt`, `label`, and `color-contrast`. Users are responsible for choosing an authorized, non-sensitive target. The application does not crawl websites, access authenticated pages, or automatically modify source code. It provides neither accessibility certification nor legal-compliance determinations, and makes no hostile-target isolation claim.

## Why this matters

Scanner findings need context: what the evidence shows, which guidance applies, what still requires human judgment, and whether a later change improved the result. A11y Evidence Lab keeps those distinctions visible throughout the workflow.

1. Analyze a page and inspect its findings and separate native incomplete observations.
2. Select a finding and retrieve guidance from the closed W3C corpus.
3. Explicitly generate a cited proposal when evidence and guidance are sufficient; otherwise inspect the abstention or failure.
4. Approve, edit and accept, or reject a valid proposal.
5. Start an intentional rescan and compare evidence conservatively. This step does not require prior generation or review.

The [project concept](docs/PROJECT_CONCEPT.md) explains the workflow and engineering objectives in detail.

## Project status

The implemented portfolio workflow includes scanning, durable local records, selected-finding retrieval and generation, individual review, and saved rescan comparison. The [development roadmap](docs/DEVELOPMENT_ROADMAP.md) owns task status; the [bounded MVP evidence report](docs/BOUNDED_MVP_EVIDENCE.md) summarizes verification and limitations, with detailed records in the [task plans](docs/plans/README.md).

The fixed generation evaluation has six runtime-valid proposals, but semantic support and remediation limitations remain. Retrieval role coverage does not establish relevance. These bounded observations do not establish whole-page accessibility, general model or hardware support, or release readiness. Retained-run browsing, packaging, and production hardening remain outside the MVP.

## Getting started

This is a developer-run local application with a browser interface. Follow the [local startup guide](docs/DEVELOPMENT.md) in order:

1. Complete the first-time dependency and browser setup, then build the client.
2. Run the startup block in PowerShell.
3. Open the URL printed by the server in Chrome or Edge.

An already prepared checkout can go straight to [Start the application](docs/DEVELOPMENT.md#start-the-application).

Scanning needs no model. Retrieval in either mode requires developer-managed Ollama and `embeddinggemma`; Local generation additionally needs `qwen3.5:4b`, while Groq needs the documented local credential setup. See [provider setup and application use](docs/APPLICATION_GUIDE.md).

## Documentation

Start with the [documentation index](docs/README.md) for the complete catalog and authority map.

| Guide | Contents |
| --- | --- |
| [Run the project locally](docs/DEVELOPMENT.md) | First-time setup, everyday startup, stopping, and troubleshooting |
| [Maintainer verification reference](docs/DEVELOPMENT_REFERENCE.md) | Complete tests, recorded command wrappers, and retained-run cleanup |
| [Application workflow and API reference](docs/APPLICATION_GUIDE.md) | Guidance, generation, review, rescans, service contracts, and provider setup |
| [Evaluation and evidence inspection](docs/EVALUATION_GUIDE.md) | Frozen packages, retained observations, and read-only inspection instructions |
| [Closed corpus and source notices](docs/CORPUS.md) | Corpus structure, static verification, attribution, and full W3C notices |
| [Project concept](docs/PROJECT_CONCEPT.md) and [requirements](docs/PROJECT_REQUIREMENTS.md) | Product direction, detailed workflow, accepted scope, and boundaries |
| [Architecture decisions](docs/architecture/decisions/README.md) | Technology choices and their accepted scope |

## License

Project-authored code and documentation use the [MIT License](LICENSE). W3C corpus text retains its [source-specific attribution and full license notices](docs/CORPUS.md#closed-corpus-notices).

<details>
<summary>Links to sections moved from this README</summary>

These anchors preserve links from frozen corpus metadata, existing documentation, and bookmarks. Follow the linked guide for the maintained content.

- <a id="engineering-objective"></a>[Engineering objective](docs/PROJECT_CONCEPT.md#engineering-objective)
- <a id="planned-mvp-startup-and-generation-setup"></a>[Planned MVP startup and generation setup](docs/DEVELOPMENT_REFERENCE.md#planned-mvp-startup-and-generation-setup)
- <a id="planned-workflow"></a>[Planned workflow](docs/PROJECT_CONCEPT.md#possible-user-flow)
- <a id="development-toolchain"></a>[Development toolchain](docs/DEVELOPMENT_REFERENCE.md#development-toolchain)
- <a id="development-command-preparation"></a>[Development command preparation](docs/DEVELOPMENT_REFERENCE.md#development-command-preparation)
- <a id="build-and-verify-the-walking-skeleton"></a>[Build and verify the walking skeleton](docs/DEVELOPMENT_REFERENCE.md#build-and-verify-the-walking-skeleton)
- <a id="run-the-local-service"></a>[Run the local service](docs/DEVELOPMENT.md#start-the-application)
- <a id="retained-runs-and-deletion"></a>[Retained runs and deletion](docs/DEVELOPMENT_REFERENCE.md#retained-runs-and-deletion)
- <a id="current-scope"></a>[Current scope](docs/APPLICATION_GUIDE.md#current-scope)
- <a id="intentional-rescans"></a>[Intentional rescans](docs/APPLICATION_GUIDE.md#intentional-rescans)
- <a id="internal-comparison"></a>[Internal comparison](docs/APPLICATION_GUIDE.md#internal-comparison)
- <a id="shared-generation-apis"></a>[Shared generation APIs](docs/APPLICATION_GUIDE.md#shared-generation-apis)
- <a id="proposal-review-apis"></a>[Proposal review APIs](docs/APPLICATION_GUIDE.md#proposal-review-apis)
- <a id="reviewing-one-proposal"></a>[Reviewing one proposal](docs/APPLICATION_GUIDE.md#reviewing-one-proposal)
- <a id="fixed-local-qwen-adapter"></a>[Fixed Local Qwen adapter](docs/APPLICATION_GUIDE.md#fixed-local-qwen-adapter)
- <a id="fixed-groq-adapter"></a>[Fixed Groq adapter](docs/APPLICATION_GUIDE.md#fixed-groq-adapter)
- <a id="frozen-generation-evaluation-package"></a>[Frozen generation evaluation package](docs/EVALUATION_GUIDE.md#frozen-generation-evaluation-package)
- <a id="inspecting-m6-02-generation-evidence"></a>[Inspecting M6-02 generation evidence](docs/EVALUATION_GUIDE.md#inspecting-m6-02-generation-evidence)
- <a id="closed-corpus-snapshot"></a>[Closed corpus snapshot](docs/CORPUS.md#closed-corpus-snapshot)
- <a id="inspecting-m2-02-retrieval-evidence"></a>[Inspecting M2-02 retrieval evidence](docs/EVALUATION_GUIDE.md#inspecting-m2-02-retrieval-evidence)
- <a id="inspecting-generation-for-one-finding"></a>[Inspecting generation for one Finding](docs/APPLICATION_GUIDE.md#inspecting-generation-for-one-finding)
- <a id="inspecting-m2-04-checkpoint-evidence"></a>[Inspecting M2-04 checkpoint evidence](docs/EVALUATION_GUIDE.md#inspecting-m2-04-checkpoint-evidence)
- <a id="closed-corpus-notices"></a>[Closed corpus notices](docs/CORPUS.md#closed-corpus-notices)
- <a id="w3c-document-license--2023"></a>[W3C Document License — 2023](docs/CORPUS.md#w3c-document-license--2023)
- <a id="w3c-software-and-document-license--2023"></a>[W3C Software and Document License — 2023](docs/CORPUS.md#w3c-software-and-document-license--2023)

</details>
