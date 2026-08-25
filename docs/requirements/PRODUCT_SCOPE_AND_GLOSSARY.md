# Product scope and glossary

## Authority and use

This document is part of the authoritative requirements baseline indexed by [Project requirements](../PROJECT_REQUIREMENTS.md). The index defines status vocabulary, priority semantics, ID stability, and precedence. This file describes planned behavior, not implemented behavior; each identified row's recorded status controls.

## Product definition

### Intended users

The product is for engineering teams working on web interfaces.

- **Proposed primary MVP user:** a frontend developer investigating a known accessibility finding and preparing a remediation decision.
- **Secondary users:** QA engineers who reproduce and verify findings, and accessibility specialists who review contextual or subjective cases.
- **Operational role:** a corpus curator who approves source material and corpus versions. This may be the project maintainer during the MVP.

The exact primary persona remains a pre-development decision because it affects terminology, evidence depth, and review workflow.

### Core job to be done

When an authorized page produces an automated accessibility finding, the user needs to understand what was observed, find applicable authoritative guidance, decide what remediation is appropriate, record where human judgment is still needed, and verify how the evidence changes after the page is updated.

### Product principles

**Status:** Accepted product decisions derived from the repeated direction and boundaries in the existing project documentation.

1. **Evidence before interpretation.** Scanner observations, retrieved guidance, model-generated interpretation, and human decisions must remain distinguishable.
2. **Traceability by default.** A user must be able to follow an accepted proposal back to the scan, evidence, corpus passages, generation configuration, and review action that produced it.
3. **Human authority.** Every generated proposal requires review; contextual judgments require explicit manual checks.
4. **Conservative AI behavior.** Unsupported or conflicting evidence must lead to abstention or an inconclusive result, not a plausible invention.
5. **Visible limitations.** The interface, and any export that is provided, states the target, scenario, automated coverage, and comparison limits.
6. **Privacy and authorization.** Only authorized targets may be analyzed, and local/private data must not silently leave the local environment.
7. **Measurable quality.** Retrieval, generation, workflow, comparison, and resource use must be evaluated independently.
8. **Accessible by design.** The application itself must be usable by people with disabilities.
9. **Replaceable generation.** The evidence and review workflow must not be bound to one model vendor or runtime. The first portfolio slice uses one local provider; when external-API support is introduced later, the user controls which mode receives each new generation run.
10. **Existing-hardware boundary.** Local model candidates must fit the documented reference PC under the representative workload; models that exceed that capacity are excluded rather than accommodated with additional hardware or remote compute.

## Scope

### MVP scope

**Status:** The first portfolio slice below is Accepted. Distribution and broader product scope remain Proposed until their applicable decisions are accepted.

The portfolio MVP is a local-first, single-user web application that completes one full evidence lifecycle for one controlled fixture using one capacity-qualified local generation configuration. The provider-neutral generation boundary, later user choice between local and external-API generation, Windows installer, and post-install model acquisition are Accepted directions recorded in [ADR-0001](../architecture/decisions/ADR-0001-interchangeable-generation-providers.md) and [ADR-0002](../architecture/decisions/ADR-0002-windows-installation-and-model-acquisition.md). The closed-loop portfolio demonstration comes first; dual-provider support and release packaging remain later delivery stages rather than prerequisites for proving the RAG workflow.

1. Declare and authorize a target and its relevant page state.
2. Run deterministic browser accessibility checks.
3. Preserve sanitized scanner source records and normalized finding evidence.
4. Retrieve relevant passages from an approved corpus snapshot.
5. Generate a structured, cited proposal or abstain.
6. Record manual checks and an approve, edit-and-accept, or reject decision.
7. Rescan a comparable target state.
8. Show an evidence-backed scan comparison outcome.

Live public-page support is a later gated extension, not a portfolio-MVP completion criterion. It may be added only after target-isolation and network-safety requirements are verified. Authenticated private pages, arbitrary crawling, and multi-user hosting are outside the initial MVP.

### First vertical slice

**Status:** Accepted on 2026-08-24 as the smallest portfolio scenario.

The first slice uses one project-owned synthetic page with one informative image that lacks an `alt` attribute and one corrected revision of the same fixture. The exact scanner rule is axe-core `image-alt`, mapped to WCAG 2.2 SC 1.1.1. The two fixture revisions are sufficient to demonstrate the complete pipeline and can be paired as follows without creating more page scenarios:

“Informative” records the fixture author's intended evaluation-gold answer. It is not included in the scanner evidence, retrieval query, or model prompt. The reviewer must independently inspect the rendered image, surrounding content, and behavior to confirm its purpose; this keeps the blocking image-purpose check meaningful and lets evaluation detect an unsupported model assumption.

| Scan pair | Applicable automated outcome |
| --- | --- |
| Missing alternative → corrected alternative | `resolved`, subject to the same-target positive observation and the stated automated-coverage limitation |
| Missing alternative → the same missing-alternative state | `persistent` |
| Corrected alternative → missing alternative | `regressed` |

The `image-alt` rule does not provide an ordered measure for an `improved` outcome, so the first slice must not manufacture one. A later contrast scenario is the leading candidate if the portfolio needs to demonstrate a quantitative improved-but-not-resolved comparison. Accessible names, contrast, keyboard, focus, and semantic-structure scenarios remain later candidates rather than MVP obligations.

### Out of scope for the MVP

**Status:** The non-certification, no-automatic-modification, authorization, and public-data boundaries are Accepted. The remaining deferrals are Proposed MVP scope decisions.

- Accessibility certification, compliance badges, legal advice, or whole-page/whole-site conformance claims.
- Claims that the absence of automated findings means a page is accessible.
- Automatic source-code edits, pull requests, or deployments.
- Arbitrary site crawling or discovery of targets the user did not authorize.
- Authenticated production pages or persistence of browser credentials.
- Broad WCAG coverage, cross-browser equivalence, mobile-device coverage, or production-scale concurrency.
- A generic chatbot as the primary interface. Chat, if later included, remains secondary.
- Automatic learning from rejected proposals or unreviewed page content.
- Public exposure of private page content, source code, evidence, prompts, or traces.
- Local model configurations that require hardware beyond the documented reference PC or remote compute to complete the representative workflow.

## Terminology

Terms prefixed with **Candidate** below are proposed vocabulary from the architecture review. Their definitions make the proposals precise without accepting the underlying design.

| Term | Definition |
| --- | --- |
| Authorized target | A single page or controlled fixture the user is permitted to analyze, with the declared scope recorded. |
| Controlled fixture | A deliberately constructed local page state with known expected accessibility evidence. |
| Transient scan observation | The in-memory native scanner result and execution metadata produced by Step 1 for immediate consumption by Step 2; it is not a durable finding or evidence record. |
| Scan run | One execution of a versioned scanner configuration against a recorded target state. |
| Finding | A scanner observation. A finding is not automatically a confirmed accessibility issue. |
| Page evidence | The minimal captured data needed to inspect and reproduce one finding, such as rule output, locator, allowlisted DOM attributes or excerpt, and computed values. The first slice retains one source-evidence item per finding. |
| Positive target observation | A narrow, non-failing observation retained only when the selected comparison profile needs to prove that the same target and rule scope were exercised in a corrected scan. |
| Corpus snapshot | An immutable, identified collection of approved and versioned guidance sources and derived chunks. |
| Guidance passage | A traceable excerpt retrieved from a corpus source. |
| Model interpretation | Generated explanation, impact analysis, or remediation text; it is never deterministic evidence. |
| Generation provider | A replaceable adapter that executes the structured-generation contract without changing the evidence, retrieval, review, or comparison domains. |
| Provider profile | A versioned configuration identifying a local or external-API adapter, endpoint class, model, capabilities, non-secret settings, and a reference to any separately protected credential. |
| Candidate: readiness dimensions | Separately observed facts covering host compatibility, runtime availability, exact artifact installation, adapter health, and eligibility for the requested workload. Passing one dimension does not imply that another passed. |
| Candidate: support state | A state attached to one exact provider, model, runtime, context, and hardware profile, proposed as **evaluation-only**, **capacity-qualified**, **development-supported**, **release-qualified**, **excluded**, or **unknown**. Capacity qualification alone does not imply release qualification. |
| Candidate: work identity | An immutable identifier and revision that determine whether an asynchronous operation still owns its inputs and is eligible to publish a result. |
| Candidate: acquisition manifest | An application-owned, versioned record of an optional runtime or model artifact's exact identity, source, license, sizes, integrity data, allowed network origins, staging rules, compatibility profile, and install/removal ownership. |
| Candidate: activated provider profile | The configured and readiness-verified provider profile selected for future generation. Installing a local artifact does not by itself activate or select its profile; an external-API profile is configured rather than installed. |
| Candidate: release evidence set | Content-safe, immutable evidence binding a particular build or package to its exact component inventory, validation environment, applicable support claims, known blind spots, and distribution status. |
| Local LLM mode | Generation through a supported runtime on the user's computer, with no model prompt or response sent to an external inference service. Explicit model acquisition is a separate setup action. |
| External-API LLM mode | Generation through a user-selected remote provider after data-egress, privacy, retention, cost, and failure behavior are disclosed and accepted. |
| Model artifact | A separately acquired model file or set of files with a recorded source, identifier, immutable digest, quantization or format, license, size, storage location, and verification state. |
| First-run setup | The post-install workflow for choosing or deferring an inference mode, validating its prerequisites, and acquiring or configuring only what the user explicitly authorizes. |
| Remediation proposal | The generated proposal version awaiting a review decision. A reviewer-edited successor remains a proposal version but is explicitly reviewer-authored rather than AI-generated. |
| Accepted remediation plan | A proposal explicitly approved, or edited and accepted, by a reviewer. |
| Manual-check definition | Immutable instructions, purpose, timing, and blocking classification for a human evaluation. |
| Manual-check result | One execution occurrence referencing a manual-check definition, proposal, reviewer, time, status, and—when completed—observed outcome and relationship to that proposal. A post-change occurrence may also reference its later scan and comparison. |
| Evidence sufficiency | A categorical assessment of whether the observed evidence and retrieved guidance support the material claims in a proposal. |
| Material claim | A statement that changes the interpretation of a finding, its user impact, the recommended remediation, or the meaning of a comparison. Material claims require direct evidence and citation support. |
| High-impact remediation claim | A material recommendation that could create or preserve a serious accessibility barrier, remove content or functionality, weaken security or privacy, or materially change user interaction. |
| Unsafe proposal | A proposal that could introduce a barrier or harmful side effect, relies on a prohibited claim, or recommends a material change without adequate evidence and guidance. |
| Qualified reviewer | A person whose documented accessibility and relevant web-engineering experience meets the evaluation rubric approved in OD-009. |
| Critical blocker | An accessibility defect in A11y Evidence Lab that prevents a core workflow for a user in the approved browser and assistive-technology matrix. |
| Supported screen-reader scenario | A versioned test procedure with a pinned operating system, browser, screen reader, target workflow, expected announcements, and pass rule. |
| Abstention | A structured result with no remediation conclusion because support is insufficient, conflicting, or invalid. It cannot become an accepted remediation plan. |
| Comparable scans | Scan runs whose target state and material configuration are sufficiently aligned for a supported comparison. |
| Scan comparison outcome | An evidence-backed relationship between findings from two comparable runs; distinct from an AI evaluation regression. |
| Scan-pair comparison | One operation record for a baseline scan and later scan, containing comparability, operation status, limitations, and identified finding-comparison entries. |
| Finding-comparison entry | One addressable child of a scan-pair comparison containing a correlation rationale, before-and-after evidence references, and one applicable finding outcome. |
| Finding fingerprint | Versioned correlation data used to suggest that findings from separate scans refer to the same observed condition; it is distinct from each finding record's immutable ID. |
| Audit record | The append-only history of versions, actions, decisions, and relevant configuration metadata while that history remains within its approved retention period. |

## Documentation navigation

- [Project requirements index](../PROJECT_REQUIREMENTS.md)
- [Project documentation index](../README.md)
