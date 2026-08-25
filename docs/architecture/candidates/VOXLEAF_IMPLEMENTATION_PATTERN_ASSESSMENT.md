# Voxleaf implementation pattern assessment

## Authority and status

**Status: Proposed research input; unaccepted.** This assessment informs the [candidate architecture](../CANDIDATE_ARCHITECTURE.md) and the open decisions in [Delivery readiness and open decisions](../../requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md#decisions-required-before-development). It does not accept a technology or design, authorize implementation, add a release dependency, qualify a provider or model, or change any accepted ADR.

The review covered the 155 tracked project-documentation files in the separate Voxleaf reference repository at commit `2cc3632bf0fb675d641079591564a1b2999145d3` and inspected the implementations named below. No Voxleaf code, configuration, thresholds, assets, or dependency choices have been copied into A11y Evidence Lab.

The paths in this assessment are repository-relative identifiers inside the reviewed Voxleaf source, not dependencies or portable links from this repository. Voxleaf's repository-owned code is MIT-licensed. Any later adaptation must record source provenance, preserve required attribution for substantial copied portions, and independently review every dependency, model, runtime, asset, and third-party license at the exact selected revision.

## Strong adaptation candidates

| Reference implementation | Transferable concept | Required A11y adaptation and gate | Status |
| --- | --- | --- | --- |
| `packages/shared/scripts/generate-contracts.mjs`, `packages/shared/src/contracts/serialized-conformance.test.ts`, canonical schemas, and `apps/desktop/vite.config.ts` | Deterministic schema-to-TypeScript and standalone-validator generation, shared conformance fixtures, drift checking, and a production guard against runtime code generation. | Prototype representative evidence, provider, workflow, persistence, and import/export contracts under OD-015. Rename all authorities, decide whether cross-language generation is needed, verify CSP and packaged builds, and independently pin current tools. | Proposed |
| `tsconfig.base.json`, root project references, and workspace configuration | Strict TypeScript, isolated package boundaries, one lock, independent format/lint/typecheck/test/build checks, and generated-contract verification. | Evaluate the runtime, package manager, build tool, package topology, Windows packaging, and resource cost under [ADR-0011](../decisions/ADR-0011-typescript-as-initial-application-language.md) and OD-014. This does not select pnpm, Vite, Node.js, or the Voxleaf workspace layout. | Proposed |
| `packages/shared/src/testing/manual-clock.ts` and deterministic fakes | Reproducible timeout, retry, cancellation, backoff, queue, and stale-result tests without wall-clock sleeps. | Generalize for scan, corpus, retrieval, generation, acquisition, and comparison work under OD-018; prove forced-late-result and cleanup behavior. | Proposed |
| `apps/desktop/src/publication/publication-session.ts` and `apps/desktop/src/publication/local-publication-open.ts` | Latest-intent ownership, invalidation before cancellation, stale-success cleanup, serialized close, and idempotent lifecycle control. | Replace publication/EPUB concepts with application-owned work records and durable checkpoints; preserve evidence and ambiguous external-provider outcomes. | Proposed |
| `apps/desktop/src/tts/operational-recovery.ts` and `packages/shared/src/contracts/operational-error.ts` | Small pure recovery state machines and closed, content-safe operational error categories. | Define A11y stage-specific errors, bounded retries, billable-request ambiguity, durable recovery, and a strict separation between content-safe diagnostics and protected evidence. Do not copy Voxleaf's zero-retry rule. | Proposed |
| `packages/shared/schemas/host-profile-compatibility-report/v1.schema.json`, `apps/desktop/src/tts/hardware-profile-authority.ts`, `hardware-profile-registry.ts`, and `hardware-profile-matcher.ts` | Bounded privacy-safe host facts, exact-profile evidence binding, deterministic fail-closed matching, and explicit support states. | Replace TTS criteria with the combined browser, embedding, vector-store, local-service, and LLM workload; define A11y-specific margins and freshness under [ADR-0004](../decisions/ADR-0004-reference-pc-capacity-gate-for-local-models.md), OD-010, and OD-017. | Proposed |
| Persistence repository and migration patterns such as `apps/desktop/src/persistence/reader-position-repository.ts` | Asynchronous storage abstraction, strict decode, independent envelope versions, future-version preservation, pure migrations, atomic replacement, and valid in-memory state after storage failure. | Evaluate a service-owned transactional store under OD-006 and OD-012. Browser `localStorage` or other Web Storage is not acceptable as the durable evidence, audit, or secret authority. | Proposed |

## Pattern references requiring redesign

| Reference implementation | Transferable concept | Required A11y adaptation and gate | Status |
| --- | --- | --- | --- |
| `services/tts/release/optional/chatterbox/optional-package-manifest-v2.json`, `apps/desktop/src-tauri/src/tts_optional_chatterbox.rs`, and `apps/desktop/src/tts/OptionalChatterboxControls.tsx` | Closed acquisition authority, exact source and hash, separate transfer/installed/temporary/free-space measurements, consent, real byte progress, staging, verification, atomic activation, cancellation, and removal. | Reuse the state model and user disclosures under OD-014. For application-owned artifacts, evaluate bounded staging, tree verification, and atomic promotion. If Ollama owns model storage, use its supported API and observed identity, integrity, progress, cancellation, and lifecycle semantics rather than inspect or mutate its files directly or duplicate the package manager. The large Rust module is a design reference, not a copy candidate. | Proposed |
| `apps/desktop/src-tauri/src/tts_release_core.rs` | Exact frozen-tree verification, safe relative paths, link rejection, per-file and total-byte checks, and closed runtime/profile resolution. | Apply only to application-owned executable or artifact trees after OD-014 selects ownership and packaging. It does not directly verify an independently managed Ollama store. | Proposed |
| `apps/desktop/src-tauri/src/host_profile_detection.rs` and `apps/desktop/src-tauri/src/tts_service_supervisor.rs` | Privileged bounded detection, version/readiness handshake, operation IDs, timeouts, redirected private transport, and whole-process-tree cleanup. | Select the actual Node, Rust, native-helper, or sidecar topology under OD-014 and OD-018. Supervision is not sandboxing; the TTS/stdin/audio protocol is not applicable. | Proposed |
| `scripts/release_inventory.py`, `scripts/release-audit.mjs`, release policies, and release evidence schemas | Policy-as-data auditing of exact production graphs, deterministic component inventory, explicit advisory blind spots, runtime reachability, artifact state, and install/removal ownership. | Map the inventory to TypeScript/Node or another runtime, Playwright browser binaries, axe-core, Chroma, Ollama, models, corpus snapshots, API SDKs, and any native components under REQ-QUAL-015 and REQ-REL-*. | Proposed |
| `scripts/build-windows-release.ps1`, `scripts/test-windows-package-lifecycle.ps1`, `apps/desktop/src-tauri/windows/nsis-hooks.nsh`, and Windows release checks | External signing material, exact artifact hashes, clean-host install/repair/uninstall scenarios, pre-existing-data backup/restore, exact-child containment, reparse rejection, and unrelated-data sentinels. | Compare Tauri/NSIS with other OD-014 candidates. Reuse lifecycle invariants regardless of packaging technology; reuse script code only if its selected stack and current security review justify it. | Proposed |
| Bounded ingestion, processing-budget, raster-policy, incremental-rendering, and exact-limit tests under `packages/epub` and `apps/desktop/src/reader` | Preflight plus observed counters, maximum-plus-one tests, no partial domain object, cancellation checkpoints, safe object-URL release, decoded-pixel limits, and focus-safe incremental rendering. | Define A11y-specific limits for live pages, scanner evidence, DOM/accessibility trees, screenshots if OD-006 permits them, corpus sources, prompts, provider payloads, and result lists. EPUB parsing and Voxleaf constants are not reusable. | Proposed |
| Safe projection patterns in `apps/desktop/src/reader/SemanticDocument.tsx` | Closed discriminated view models, exhaustive rendering, native semantics, validated language/direction, inert unavailable links, and no untrusted HTML or URLs. | Replace the EPUB view model with evidence, guidance, generated-output, review, and comparison projections under [ADR-0012](../decisions/ADR-0012-react-as-initial-user-interface-library.md) and REQ-SEC-020; independently audit focus management and accessible virtualization. | Proposed |

## Candidate packaging comparison

Voxleaf contains a pinned Tauri, React, TypeScript, WebView2, Rust, and NSIS reference implementation intended to support a Windows installer, native lifecycle ownership, strict content-security policy, optional-artifact acquisition, and bounded uninstall. Its documentation and implementation evidence are useful inputs to an OD-014 comparison, not proof that the same properties hold for A11y Evidence Lab and not a technology selection.

The comparison must account for the authenticated loopback API, Playwright's separately pinned Chromium, Chroma and Ollama ownership, native integration needs, installer and updater behavior, accessibility in the application-controlled web context, memory on the reference PC, release signing, and whether adding Rust materially improves containment or only adds another language and supply chain. Tauri, Electron, a managed browser context with a native launcher, and any other viable candidate must be evaluated against the same requirements.

## Explicit non-adoptions

The following are not proposed for reuse:

- EPUB parsing, TTS, audio, PCM, playback, narration synchronization, voice evaluation, or TTS-specific stdio contracts.
- Voxleaf model identities, artifacts, quantizations, thresholds, VRAM margins, benchmark corpora, one-model assumptions, one-reviewer decisions, or zero-retry policy.
- Bundling a large core model in the installer, which conflicts with accepted ADR-0002.
- Browser Web Storage or a memory-only privacy model for durable evidence and audit history.
- Silent provider fallback, broad Windows-support claims from one host, or treating process supervision as an OS sandbox.
- Wholesale reuse of the Rust acquisition or supervisor modules, or selection of Tauri, NSIS, pnpm, Vite, Rust, or Node.js from precedent alone.
- A custom model-store downloader when the runtime configuration selected under OD-014 owns storage and can provide the required verified lifecycle through a safe adapter.

## Promotion and documentation rules

A candidate may become an evaluation baseline only after development is explicitly authorized, the applicable open decision and any required ADR are accepted, and current primary documentation and versions are independently reviewed. Release adoption additionally requires project-specific security and accessibility review, recorded licensing and attribution, and representative tests on the exact implemented and packaged stack. Reusable patterns should be extracted into small A11y-owned interfaces rather than copied as product-specific modules.

Implementation plans may reuse Voxleaf's practice of recording scope, invariants, progress, discoveries, decisions, validation, and final evidence for complex milestones. The project should keep those plans proportionate, retain one current roadmap, one current evaluation authority per evaluation family, and one current support matrix, with immutable machine-readable run artifacts rather than overlapping narrative authority versions.

## Documentation navigation

- [Candidate architecture](../CANDIDATE_ARCHITECTURE.md)
- [Architecture index](../README.md)
- [Project requirements index](../../PROJECT_REQUIREMENTS.md)
- [Project documentation index](../../README.md)
