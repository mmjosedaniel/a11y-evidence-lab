# Candidate architecture

## Authority and status

This document is Proposed architecture research referenced by, but not part of, the authoritative requirements baseline indexed by [Project requirements](../PROJECT_REQUIREMENTS.md). It is not an accepted ADR, implementation authority, dependency selection, or release qualification. Accepted architecture decisions remain under [Architecture Decision Records](decisions/README.md).

## Proposed architecture and technology constraints

**Status:** The provider-neutral generation boundary and Windows delivery approach are Accepted in ADR-0001 and ADR-0002. ADR-0003, ADRs 0005 through 0009, and ADRs 0011 through 0013 accept the named model and technologies only as initial evaluation baselines; ADR-0010 records the explicit reranker deferral. Their release adoption, the modular-monolith details, and the remaining runtime, desktop-container, and packaging choices stay Proposed until the applicable gates are accepted.

The preferred first-slice architecture is a local modular monolith: ordinary TypeScript modules own the six workflow steps, LangChain composes only retrieval and one structured generation call, and React presents the records. The application adds no worker process, IPC protocol, queue, agent graph, or workflow engine. Playwright launches its managed Chromium and the selected Chroma and Ollama candidates may remain separate local services because those are evaluated tool boundaries, not application microservices. External-API mode would replace only the generation adapter. A distributed or hosted multi-user architecture is deferred.

The [accepted MVP portfolio scope](../requirements/PRODUCT_SCOPE_AND_GLOSSARY.md#first-vertical-slice) supplies exactly three independent, project-owned synthetic controlled profiles: `informative-image-alt` (`image-alt`/SC 1.1.1), `form-input-label` (`label`/SC 4.1.2), and `text-contrast` (`color-contrast`/SC 1.4.3). The candidate architecture reuses one sequential path for all three: each operation selects one profile, runs only its rule, retains one rule-appropriate finding, retrieves guidance, generates one proposal, records one human decision, and compares one baseline/later pair. It does not introduce concurrent multi-rule execution, cross-finding orchestration, another service, an agent, a queue, or a workflow engine. Live pages, arbitrary URLs, authenticated targets, crawling, and crawler implementation remain excluded from the MVP.

| Capability | Current candidate | Status and requirement |
| --- | --- | --- |
| Application language | TypeScript | Accepted only as the initial application-language evaluation baseline in ADR-0011. Require independent strict type checking, versioned runtime schemas, adapter isolation, pinned toolchain identity, and full Windows packaging and resource validation. |
| User interface | React with TypeScript, client-rendered SPA | Accepted only as the initial UI evaluation baseline in ADR-0012. The renderer remains presentation-only over the authenticated local API and must pass the complete accessibility, untrusted-content, recovery, CSP, zero-egress, startup, and resource gates. |
| JavaScript execution runtime and local-service host | Node.js 24 LTS is the dated evaluation candidate | Proposed until OD-014. The exact dated scan seed and rationale are recorded in the [scan technology selection assessment](candidates/authorized-scan/TECHNOLOGY_SELECTION.md#technology-profile); TypeScript still does not select a runtime, web-service framework, package manager, build tool, desktop container, native-module strategy, or installer. |
| Browser analysis | Playwright Library with its pinned managed Chromium; axe-core through `@axe-core/playwright` | Accepted only as separate initial evaluation baselines in ADR-0008 and ADR-0009. The [technology selection assessment](candidates/authorized-scan/TECHNOLOGY_SELECTION.md) records the tool rationale, while the [controlled-fixture execution assessment](candidates/authorized-scan/CONTROLLED_FIXTURE_EXECUTION_AND_SECURITY.md) proposes the fixture, profile, transient observation, and security detail. Release use requires broader validation. |
| Retrieval/model integration | LangChain | Accepted only as the thin initial two-step RAG integration baseline in ADR-0013. Application code owns queries, records, provenance, citations, eligibility policy, and evaluation. |
| Stateful workflow | Plain TypeScript state | Use an ordinary sequential, single-current-item application flow for one proposal at a time; dependency calls may still be asynchronous. LangGraph is deferred until a measured resume, interruption, or branching need cannot be handled coherently without it. |
| Tracing and evaluation | Application-owned local records | Sufficient for the local portfolio slice. LangSmith is optional for synthetic-data evaluation only after egress, redaction, retention, and cost are accepted. |
| Generation-provider boundary | Application-owned adapter contract with one local adapter | Accepted in ADR-0001 for the first portfolio slice. A provider registry and shared multi-adapter conformance suite are added only when the second provider mode is introduced. |
| Local model runtime | Ollama | Accepted only as the initial evaluation runtime for the separate generation and embedding adapters in ADR-0005; adopting it as the release dependency remains Proposed pending provider-conformance, GPU, structured-output, lifecycle, recovery, update/egress, security, packaging, and digest validation. |
| External generation | Later approved provider-specific API adapter | The provider-neutral contract is required in the first slice; an external adapter is a later distributable-product capability and its provider remains Proposed under OD-013. It is never an automatic fallback and cannot bypass local validation. |
| Embeddings | `embeddinggemma` | Accepted only as the initial evaluation model in ADR-0006, through the separate embedding adapter and initially on the runtime selected in ADR-0005. Release use requires capacity, retrieval-quality, context-handling, reproducibility, latency, memory, disk, sustained-workload, provenance, and license validation. |
| Initial local capacity screen | `qwen3.5:4b`; `qwen3.5:9b` only as a later borderline screen | Initial screen accepted in ADR-0003 and governed by ADR-0004. Only capacity-qualified configurations may enter comparison or first-run recommendation. |
| Vector storage | Chroma | Accepted only as the initial local persistent evaluation technology in ADR-0007. Its documented TypeScript path uses a running Chroma service; that topology is not accepted. Release use requires provenance, isolation, authenticated or otherwise approved loopback access, service lifecycle, atomic rebuild, recovery, deletion, backup, migration, reproducibility, resource, packaging, and zero-egress validation. |
| Reranking | None in the initial baseline | Deferral accepted in ADR-0010. A reranker requires retrieval-error evidence, reference-PC capacity qualification, measurable improvement, and a later ADR selecting the exact model and runtime. |
| Windows installation and launch | Installer plus local launcher and application-controlled web UI on loopback | Delivery approach accepted in ADR-0002; web-container technology, packaging, signing, owned dependencies, and update mechanism remain Proposed until OD-014. |

The hardware snapshot in [Local MVP feasibility](../LOCAL_MVP_FEASIBILITY.md) is the reference benchmark environment, not a universal minimum specification. Model artifact sizes are feasibility evidence, not proof of generation quality, latency, context capacity, or full GPU residency.

## First-slice candidate patterns

**Status: Proposed candidate.** This section records coherent implementation shapes to evaluate after development is authorized. It does not accept the shape, select the named supporting tools, or authorize copying code. The detailed external implementation references and provenance constraints are recorded in [Voxleaf implementation pattern assessment](candidates/VOXLEAF_IMPLEMENTATION_PATTERN_ASSESSMENT.md).

| Candidate pattern | Proposed implementation shape | Adoption gate and explicit non-goals |
| --- | --- | --- |
| Authorized deterministic scan slice | One TypeScript module loads the selected project-owned synthetic profile revision as static page content in a fresh pinned Chromium context, blocks unexpected requests, runs only that profile's axe rule (`image-alt`, `label`, or `color-contrast`), and returns one validated transient native observation in memory. | Step 1 owns execution and the transient observation. [Step 2](candidates/ACCESSIBILITY_FINDING_EVIDENCE_CAPTURE_ASSESSMENT.md) exclusively owns allowlisting, sanitization, rule-specific normalization, digests, durable evidence, and retained deterministic contrast measurements. Live pages, arbitrary URLs, crawling, and crawler implementation remain out of scope. |
| Minimal record boundary | Small application-owned record definitions describe the exact handoffs among the six steps, with runtime validation at actual external boundaries. | OD-015 may select a schema authority later. The first slice does not require code generation, multiple schema dialects, or a compatibility framework. |
| Manual micro-corpus preparation | A bounded frozen W3C source pack covering the three selected success criteria and minimum scenario-specific techniques is divided into heading-aware passages with stable source locators and application-owned identities, then embedded once. | The [curated guidance corpus assessment](candidates/guidance-retrieval/CURATED_GUIDANCE_CORPUS_ASSESSMENT.md#deterministic-source-preparation) owns the Proposed source pack; OD-004 still owns its exact inventory and revision policy. Axe metadata maps the finding to the corpus but is not embedded guidance. |
| Thin two-step RAG | Application code builds the deterministic privacy-safe query, LangChain composes vector retrieval and one structured model call, and deterministic validation checks references and prohibited claims. | ADR-0013 accepts this only as an evaluation baseline. No agent, reranker, query rewriting, critique model, or semantic judge is included. |
| Sequential operation ownership | One current operation at a time carries one selected scenario, rule, finding, and proposal to a complete result before another operation begins. | No multi-rule orchestration, queue, replacement controller, checkpoint engine, or user-cancellation framework is required for the controlled portfolio slice. |
| Portfolio evaluation | One Proposed frozen shared 9–12-case synthetic set spanning all three controlled profiles and one reviewer rubric evaluate retrieval, grounded generation, abstention, review, and conservative comparison behavior. | OD-009 still owns the exact evaluation-set decision. The run is non-promotable and supports no generalized quality, provider-comparison, coverage, compliance, or release claim. |
| Safe React projection | Application code converts untrusted records into a closed view model; React renders the four information layers and one proposal decision using native semantics and text by default. | ADR-0012 accepts only React's evaluation baseline. This candidate does not select a router, state library, component kit, desktop container, or workflow library. |
| Minimal local persistence | Persist only the small record graph needed to reopen the three profile demonstrations, one sequential operation at a time, with explicit version fields and safe failure behavior. | OD-006 and OD-012 must select the actual store and retention policy before implementation. Browser Web Storage is not the durable authority. |

## Deferred candidates requiring evidence

The following ideas remain useful research candidates from the Voxleaf assessment, but YAGNI excludes them from the first slice. They may be evaluated only after the named trigger exists.

| Candidate | Trigger before evaluation |
| --- | --- |
| Generated serialized-contract pipeline | More than one producer, persisted schema version, or import/export boundary creates demonstrated drift risk. |
| Identity-first queue, cancellation, and checkpoint controller | Concurrent, replaceable, resumable, or long-running application work is accepted into scope. |
| Supervised helper-process recovery | A selected dependency or live-page threat model requires an application-owned helper process. |
| Managed optional-artifact acquisition | Distribution and application-owned runtime/model installation enter scope; do not duplicate a selected runtime's safe lifecycle. |
| Full backup, migration, and cascading deletion | Private page projects, multiple stored versions, or distributable retention controls enter scope. |
| Exact release inventory, signing, repair, and uninstall evidence | A distributable Windows release is authorized. |
| Formal evaluation authority and support matrix | The project intends to promote results, compare providers publicly, or make support claims. |
| Compatibility/readiness report | The project supports hardware beyond the documented reference PC. |

## Documentation navigation

- [Project requirements index](../PROJECT_REQUIREMENTS.md)
- [Architecture index](README.md)
- [Authorized deterministic web scan candidate assessments](candidates/authorized-scan/README.md)
- [Accessibility guidance retrieval assessments](candidates/guidance-retrieval/README.md)
- [Voxleaf implementation pattern assessment](candidates/VOXLEAF_IMPLEMENTATION_PATTERN_ASSESSMENT.md)
- [Project documentation index](../README.md)
