# Delivery readiness and open decisions

## Authority and use

This document is part of the authoritative requirements baseline indexed by [Project requirements](../PROJECT_REQUIREMENTS.md). The index defines status vocabulary, priority semantics, ID stability, and precedence. This file describes planned behavior, not implemented behavior; each identified row's recorded status controls.

## Delivery stages

Development has not been authorized. If it is authorized later, the first implementation scope should be one vertical portfolio slice, not six independently generalized subsystems:

1. Freeze the two project-owned `image-alt` fixture states, the four-artifact W3C corpus snapshot, the 5–10 synthetic evaluation cases, and the directly applicable record semantics.
2. Implement the closed loop from deterministic scan through evidence capture, LangChain-composed retrieval and structured generation, one human review decision, and one rescan comparison.
3. Evaluate that loop on the reference PC with one capacity-qualified local model and record its limitations.
4. Consider live pages, an external API adapter, broader scenarios, installer work, and release hardening only after the portfolio slice demonstrates a concrete need for them.

This sequence does not make implementation or release claims. A distributable product would still require the separate security, provider, application-accessibility, packaging, lifecycle, and release gates owned by their requirements modules.

## Assumptions

| ID | Assumption |
| --- | --- |
| ASM-001 | Users can provide a controlled fixture or establish authorization for each page analyzed. |
| ASM-002 | A qualified person is available to review contextual findings and remediation proposals. |
| ASM-003 | The initial source set can be lawfully captured, versioned, and cited. |
| ASM-004 | A narrow controlled-fixture set and guidance-corpus snapshot are sufficient to test the product hypothesis before broader page support. |
| ASM-005 | The reference computer can run the complete local workflow acceptably; this remains unproven until benchmarked. |
| ASM-006 | English is sufficient for the first interface, corpus workflow, evaluation set, and generated output. |
| ASM-007 | A user choosing local setup can obtain an approved model artifact, while a user choosing external-API mode can supply an account and credential governed by that provider's terms. Neither is required to use deterministic scanning and stored evidence. |

## Principal risks and required mitigations

Each mitigation becomes required before the capability or claim that creates its risk enters an authorized stage; the table is not a demand to build every control in the first portfolio slice. In particular, live-target controls (RSK-007), external-API controls (RSK-012), runtime/model acquisition controls (RSK-013, RSK-014, and RSK-020), concurrent replacement controls (the advanced part of RSK-018), and packaged-release controls (RSK-021) remain later-stage obligations. The first slice applies only the narrow form of each risk that its selected components actually introduce.

| ID | Risk | Required mitigation |
| --- | --- | --- |
| RSK-001 | [Automated checks cover only part of web accessibility](https://playwright.dev/docs/accessibility-testing) and may be mistaken for conformance. | Manual checks, visible coverage limits, prohibited-claim tests, and the non-certification boundary. |
| RSK-002 | Dynamic content makes nominally deterministic scans differ. | Record and control page state, environment, timing, and tool versions; allow not-comparable outcomes. |
| RSK-003 | Finding identity breaks after DOM changes. | Use evidence-aware matching and allow inconclusive or unmatched results. |
| RSK-004 | A local model produces plausible but unsupported or unsafe remediation. | Structured validation, exact citations, abstention, human review, and fixed evaluations. |
| RSK-005 | Corpus updates, chunking, or conflicting guidance cause citation drift. | Immutable snapshots, authority metadata, checksums, exact locators, and conflict handling. |
| RSK-006 | Private page content or credentials leak through evidence, prompts, logs, or cloud traces. | Data minimization, redaction, local-only defaults, explicit egress, retention controls, and secret-leak tests. |
| RSK-007 | Live URL scanning exposes the host or internal network. | Defer live targets until browser isolation, URL/network policy, authorization, and threat-model gates pass. |
| RSK-008 | A proposed local model exceeds usable latency, context, memory, storage, or thermal capacity on the laptop. | Metadata prefilter, bounded capacity preflight before quality evaluation, smaller replacements after failure, recorded resources, and no unverified performance claims. |
| RSK-009 | Users overtrust evidence-sufficiency labels or generated language. | Categorical definitions, layer labels, manual review, limitations in context, and no aggregate accessibility score. |
| RSK-010 | The application itself creates accessibility barriers. | WCAG 2.2 AA design target and combined automated, manual, assistive-technology, and user evaluation. |
| RSK-011 | Provider SDK, API, model alias, or structured-output semantics drift and silently change results. | Application-owned contract, capability snapshots, immutable model/version records, provider conformance tests, and explicit updates. |
| RSK-012 | External-API use leaks sensitive evidence or credentials, incurs unexpected cost, or produces duplicate billable requests. | Protected secrets, preflight disclosure, inspectable egress, approved destinations, bounded retries, usage records, and no automatic fallback. |
| RSK-013 | Runtime or model acquisition fails, consumes unexpected storage, activates a partial artifact, or conflicts with local-only egress controls. | Size and destination disclosure, disk preflight, integrity verification, atomic activation, failure recovery, and setup networking isolated from the core workflow. |
| RSK-014 | An independently installed local runtime performs automatic update or telemetry networking during a local-only run. | OD-014 must define runtime ownership and update control; the release test must verify zero non-loopback egress for the pinned configuration. |
| RSK-015 | Another website or local process reaches the loopback web service and reads or changes project data. | Loopback-only binding, host/origin validation, local session authentication, request-forgery protection, and DNS-rebinding tests. |
| RSK-016 | Untrusted target, scanner, corpus, or generated content reaches the React DOM or a privileged application boundary and executes markup, script, navigation, or process access. | Unprivileged renderer, text-by-default rendering, separately approved sandboxing for any preview, local assets, content-security policy, runtime schemas, and a narrow authenticated application API. |
| RSK-017 | Record definitions, runtime checks, persisted values, or provider contracts drift apart. | Use one application-owned definition for each first-slice record and validate actual external boundaries. Generated types, standalone validators, compatibility frameworks, and CI drift machinery require a later demonstrated multi-producer or versioning need under OD-015. |
| RSK-018 | Failed or timed-out sequential work publishes a partial result, or later concurrent, cancelled, or replaced work publishes a stale result. | The first slice publishes only complete results from its single-current-item flow and exposes no interactive cancellation. Identity-first invalidation, cancellation, late-result tests, and generalized cleanup become required only if later work introduces those states under OD-018. |
| RSK-019 | Capacity, evaluation, development, support, packaging, signing, and public-release states are conflated and produce an unsupported recommendation. | Exact-profile support states, a result-blind evaluation authority, conjunctive gates, independent release claims, and visible unavailable evidence under REQ-LLM-012 and REQ-EVAL-010 through REQ-EVAL-013. |
| RSK-020 | Acquisition, update, model removal, repair, or uninstall crosses an intended storage boundary or activates unverified content. | Closed manifests, live preflight, bounded staging, integrity and tree verification, atomic promotion, exact-root deletion, reparse rejection, and unrelated-data sentinels under REQ-INST-013 through REQ-INST-016. |
| RSK-021 | The tested source build, packaged application, installer, installed binary, or optional artifact differs from what is released. | Deterministic inventory, cryptographic artifact binding, separate packaged/native validation, signature verification, and independent claim gates under REQ-QUAL-015, REQ-QUAL-016, and REQ-REL-*. |
| RSK-022 | Multiple overlapping planning or evaluation authority documents make the current rule or support status impossible to reconstruct. | Keep one current requirements baseline, one current official evaluation authority per evaluation family, and one current support matrix; preserve superseded evidence without repeating active authority in historical plans. |

## Resolved decisions for the first portfolio slice

| ID | Resolution | Authority |
| --- | --- | --- |
| OD-002 | Use one project-owned `image-alt` fixture in failing and corrected states, mapped only to axe-core `image-alt` and WCAG 2.2 SC 1.1.1. Other scenario families are later candidates. | [Product scope and glossary](PRODUCT_SCOPE_AND_GLOSSARY.md#first-vertical-slice) |
| OD-005 | Use LangChain as a thin, replaceable two-step RAG integration baseline, Accepted for evaluation only. Keep canonical records and deterministic stages application-owned; defer LangGraph and keep LangSmith optional. | [ADR-0013](../architecture/decisions/ADR-0013-langchain-as-initial-rag-integration.md) |

## Decisions required before development

Only the portion of an open decision that is directly needed by the authorized implementation stage must be resolved before that stage begins. A recorded deferral is a valid disposition. Release-only questions do not block a portfolio-only vertical slice, and no open decision authorizes development by itself.

| ID | Decision | Recommended starting point |
| --- | --- | --- |
| OD-001 | Confirm the primary MVP user and reviewer relationship. | Frontend developer as primary user; QA and accessibility specialists as reviewers. |
| OD-003 | Confirm target types, browser, viewport, page-state capture, and authorization mechanism. | For the first slice, accept only the two named fixture revisions, one pinned Chromium profile, and the minimal fixture attestation. Decide live-page policy later. |
| OD-004 | Approve corpus sources, source hierarchy, snapshot method, and licensing. | Manually freeze the four W3C artifacts supporting SC 1.1.1; keep axe rule metadata outside the embedded guidance corpus. |
| OD-006 | Approve the evidence capture, in-memory boundary, deterministic sanitization, encryption/access control, retention, cascading deletion, tombstone, backup, export, and local data-storage policy. | For the synthetic slice, retain only the Step 2 allowlisted evidence and records needed to reopen the demonstration. Decide private-page, backup, deletion, screenshot, and export policy before those capabilities exist. |
| OD-007 | Approve evidence-sufficiency definitions and reviewer calibration. | Use the closed retrieval support states and deterministic generation eligibility policy; never use percentage confidence. The reviewer confirms semantic support before acceptance. |
| OD-008 | Approve finding correlation rules and per-scenario comparison semantics. | Use exact fixture, scan-profile, axe-rule, and stable target identity. Support `resolved`, `persistent`, and inverse-pair `regressed`; allow `inconclusive` or pair-level `not comparable`. |
| OD-009 | Approve the evaluation dataset, case counts, stratification, reviewer rubric, metric vocabulary, severity scale, browser/assistive-technology matrix, screen-reader scenarios, agreement/adjudication method, and quality thresholds. | Freeze 5–10 synthetic `image-alt` cases and one reviewer rubric for the non-promotable portfolio pilot. Add statistics, multiple reviewers, and assistive-technology matrices only before broader claims. |
| OD-010 | Set stage latency, responsiveness, paging, thermal, and RAM/VRAM/disk budgets after a representative baseline. | Establish provisional capacity limits with the 4B bootstrap, then admit only configurations that pass the gate on the documented reference machine. |
| OD-011 | Decide local tracing, hosted tracing comparison, telemetry, framework update checking, and non-generation data-egress policy. | Use local application-owned traces for the portfolio slice. LangSmith remains optional and must not receive page evidence until its egress and retention policy is accepted. |
| OD-012 | Confirm persistence, export, backup, and migration scope. | Persist only the small local record graph needed to reopen the single demonstration. Defer backup, migration, general export, and external tracker integration. |
| OD-013 | Approve the generation-provider contract details and select the first supported external API adapter, model allowlist, endpoint policy, capability profile, usage/cost behavior, and provider-specific privacy disclosures. | Defer the first API adapter until after the local portfolio slice; do not claim arbitrary endpoint compatibility. |
| OD-014 | Approve the JavaScript runtime, package manager and build tool, local-service host, Chroma deployment topology, Windows packaging and launcher technology, controlled web-container and profile-isolation design, supported Windows builds, elevation policy, owned versus independently installed runtimes, browser dependencies, model storage and offline acquisition, acquisition-manifest ownership, code signing, exact component inventory, update/rollback, repair, retained-data classes, uninstall containment, packaged-host validation, and independent release-claim policy. | Select only the runtime and service topology needed for the authorized portfolio slice. Defer installer, signing, update, repair, and uninstall decisions until distribution is in scope. |
| OD-015 | Decide the serialized-contract authority, schema dialect, contract-family versioning, offline reference policy, closed-object behavior, generated TypeScript and standalone-validator pipeline, semantic-validation boundary, compatibility/migration rules, and drift verification. | Define the minimal application-owned record shapes and validate external boundaries. Do not require schema generation or a compatibility framework until more than one producer, persisted version, or import path creates that need. |
| OD-016 | Decide deterministic corpus normalization, structural segmentation, chunk identity, source locators, continuation, resource budgets, cancellation, and atomic snapshot publication. | Manually prepare the four-artifact snapshot with heading-aware chunks and stable locators. Keep canonical chunk identity independent of LangChain, embeddings, Chroma, and generation. |
| OD-017 | Decide the calibration and official evaluation-authority process, result validity and decision states, conjunctive gates, exact-profile support vocabulary, support-matrix ownership, evidence promotion, and separation of evaluation, adoption, packaging, and release claims. | Label the 5–10-case portfolio run non-promotable and bind it to exact configurations. Defer a formal support matrix and promotion process until release claims are contemplated. |
| OD-018 | Decide work ownership, immutable identity and revision, cancellation ordering, stale-result rejection, active and queued budgets, cleanup, retry/resume, durable checkpoints, service readiness and protocol identity, timeouts, crash behavior, and process-tree shutdown. | Use one sequential, single-current-item operation per stage. Add interactive cancellation, queues, replacement, resume, checkpointing, or helper supervision only after a demonstrated need. |

No development may begin until the repository status and agent instructions explicitly authorize it. After authorization, each implementation slice may begin only when its directly applicable Must requirements and open-decision portions have an accepted or explicitly deferred disposition and its small evaluation set is frozen. Unrelated release-only decisions do not block a portfolio slice.

## Documentation navigation

- [Project requirements index](../PROJECT_REQUIREMENTS.md)
- [Project documentation index](../README.md)
