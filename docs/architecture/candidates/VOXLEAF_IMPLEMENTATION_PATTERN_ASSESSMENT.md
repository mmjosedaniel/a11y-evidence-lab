# Voxleaf implementation pattern assessment

## Authority and status

**Status: Proposed research input; unaccepted.** This assessment informs the [candidate architecture](../CANDIDATE_ARCHITECTURE.md) and the deferred or implementation-stage choices in [Delivery readiness and open decisions](../../requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md#remaining-deferred-or-implementation-stage-choices). It does not accept a technology or design, authorize implementation, add a release dependency, qualify a provider or model, or change any accepted ADR.

### MVP disposition amendment — 2026-08-25

OD-012, OD-015, OD-017, and OD-018 now deliberately choose a smaller MVP than several patterns recorded below: filesystem run directories with canonical JSON, small application-owned TypeScript records plus validation only at actual external boundaries, no formal support or promotion system, and one non-cancellable operation with only `running`, `completed`, and `failed` outcomes. [ADR-0015](../decisions/ADR-0015-localhost-browser-mvp-execution.md) also supersedes the earlier installer direction for the MVP. Therefore schema generation, transactional migration machinery, queues, cancellation controllers, checkpoints, support registries, packaged lifecycle systems, and installer comparisons below are **Deferred references**, not MVP candidates. Their historical research value is preserved, but they require a later demonstrated need and new decision before evaluation.

### Portfolio YAGNI amendment — 2026-08-27

[OD-022](../../requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-022--portfolio-mvp-yagni-simplification) narrows the remaining applicable lessons further. [ADR-0019](../decisions/ADR-0019-in-process-exact-vector-search.md) removes vector-service lifecycle work, [ADR-0020](../decisions/ADR-0020-manual-developer-managed-local-model-setup.md) replaces application-managed model acquisition and readiness probes with manual developer setup and actual-use checks, and [ADR-0021](../decisions/ADR-0021-single-file-run-aggregate.md) replaces parent/child records and audit-style histories with one `run.json` aggregate and one current review decision. The current MVP reuses only proportionate ideas such as strict TypeScript, minimal runtime validation, content-safe errors, and native semantic rendering. Every acquisition, supervision, release, migration, queue, cancellation, support-matrix, and audit-history pattern below remains Deferred history.

The review covered the 155 tracked project-documentation files in the separate Voxleaf reference repository at commit `2cc3632bf0fb675d641079591564a1b2999145d3` and inspected the implementations named below. No Voxleaf code, configuration, thresholds, assets, or dependency choices have been copied into A11y Evidence Lab.

The paths in this assessment are repository-relative identifiers inside the reviewed Voxleaf source, not dependencies or portable links from this repository. Voxleaf's repository-owned code is MIT-licensed. Any later adaptation must record source provenance, preserve required attribution for substantial copied portions, and independently review every dependency, model, runtime, asset, and third-party license at the exact selected revision.

## Adaptation candidates after the MVP boundary

| Reference implementation | Transferable concept | Required A11y adaptation and gate | Status |
| --- | --- | --- | --- |
| `packages/shared/scripts/generate-contracts.mjs`, `packages/shared/src/contracts/serialized-conformance.test.ts`, canonical schemas, and `apps/desktop/vite.config.ts` | Deterministic schema-to-TypeScript and standalone-validator generation, shared conformance fixtures, drift checking, and a production guard against runtime code generation. | Deferred by OD-015. Reconsider only if multiple producers, a cross-language boundary, or incompatible persisted versions create demonstrated drift that minimal runtime validation cannot contain. | Deferred |
| `tsconfig.base.json`, root project references, and workspace configuration | Strict TypeScript, isolated package boundaries, one lock, independent format/lint/typecheck/test/build checks, and generated-contract verification. | Evaluate the runtime, package manager, build tool, package topology, Windows packaging, and resource cost under [ADR-0011](../decisions/ADR-0011-typescript-as-initial-application-language.md) and OD-014. This does not select pnpm, Vite, Node.js, or the Voxleaf workspace layout. | Proposed |
| `packages/shared/src/testing/manual-clock.ts` and deterministic fakes | Reproducible timeout, retry, cancellation, backoff, queue, and stale-result tests without wall-clock sleeps. | Deferred by OD-018. Reconsider only after interactive cancellation, concurrency, queues, backoff, or replace-in-flight work enters scope. | Deferred |
| `apps/desktop/src/publication/publication-session.ts` and `apps/desktop/src/publication/local-publication-open.ts` | Latest-intent ownership, invalidation before cancellation, stale-success cleanup, serialized close, and idempotent lifecycle control. | Deferred by OD-018. The ordinary **Analyze** flow creates a new independent run after failure and publishes no partial success; the MVP has no retry action, cancellation, replacement, or checkpoint controller. | Deferred |
| `apps/desktop/src/tts/operational-recovery.ts` and `packages/shared/src/contracts/operational-error.ts` | Small pure recovery state machines and closed, content-safe operational error categories. | Use only the closed content-safe error-category idea in the MVP. Failure ends the workflow run; the ordinary **Analyze** flow may later start another independent run without overwriting the first. No retry action, retry lineage, recovery state machine, resubmission, or billable-request orchestration is required. | Partially useful; advanced recovery Deferred |
| `packages/shared/schemas/host-profile-compatibility-report/v1.schema.json`, `apps/desktop/src/tts/hardware-profile-authority.ts`, `hardware-profile-registry.ts`, and `hardware-profile-matcher.ts` | Bounded privacy-safe host facts, exact-profile evidence binding, deterministic fail-closed matching, and explicit support states. | Deferred by OD-010 and OD-017. The MVP performs only one practical reference-PC capacity check and records limitations without a support matrix or public support state. | Deferred |
| Persistence repository and migration patterns such as `apps/desktop/src/persistence/reader-position-repository.ts` | Asynchronous storage abstraction, strict decode, independent envelope versions, future-version preservation, pure migrations, atomic replacement, and valid in-memory state after storage failure. | Deferred by OD-012 and OD-022. The MVP uses one `data/runs/<run-id>/run.json` aggregate and no child-record versions, database, or migration framework; browser Web Storage is not the durable authority. | Deferred |

## Pattern references requiring redesign

| Reference implementation | Transferable concept | Required A11y adaptation and gate | Status |
| --- | --- | --- | --- |
| `services/tts/release/optional/chatterbox/optional-package-manifest-v2.json`, `apps/desktop/src-tauri/src/tts_optional_chatterbox.rs`, and `apps/desktop/src/tts/OptionalChatterboxControls.tsx` | Closed acquisition authority, exact source and hash, separate transfer/installed/temporary/free-space measurements, consent, real byte progress, staging, verification, atomic activation, cancellation, and removal. | Fully Deferred by ADR-0020. The developer installs Ollama and pulls the two fixed models with Ollama's tools outside the application; the MVP has no acquisition action, progress state, artifact manager, or readiness workflow. Reconsider only if a later distributable product owns onboarding. | Deferred |
| `apps/desktop/src-tauri/src/tts_release_core.rs` | Exact frozen-tree verification, safe relative paths, link rejection, per-file and total-byte checks, and closed runtime/profile resolution. | Deferred until application-owned packaging or artifact trees enter scope. It does not apply to the independently managed model runtime in the MVP. | Deferred |
| `apps/desktop/src-tauri/src/host_profile_detection.rs` and `apps/desktop/src-tauri/src/tts_service_supervisor.rs` | Privileged bounded detection, version/readiness handshake, operation IDs, timeouts, redirected private transport, and whole-process-tree cleanup. | Deferred. The MVP local service uses one simple operation and no helper supervisor, worker, checkpoint, or resumable orchestration. | Deferred |
| `scripts/release_inventory.py`, `scripts/release-audit.mjs`, release policies, and release evidence schemas | Policy-as-data auditing of exact production graphs, deterministic component inventory, explicit advisory blind spots, runtime reachability, artifact state, and install/removal ownership. | Deferred by OD-017 until a distributable artifact or release claim exists. | Deferred |
| `scripts/build-windows-release.ps1`, `scripts/test-windows-package-lifecycle.ps1`, `apps/desktop/src-tauri/windows/nsis-hooks.nsh`, and Windows release checks | External signing material, exact artifact hashes, clean-host install/repair/uninstall scenarios, pre-existing-data backup/restore, exact-child containment, reparse rejection, and unrelated-data sentinels. | Deferred by ADR-0015. The MVP has no installer, desktop wrapper, signing, update, repair, or uninstall workflow. | Deferred |
| Bounded ingestion, processing-budget, raster-policy, incremental-rendering, and exact-limit tests under `packages/epub` and `apps/desktop/src/reader` | Preflight plus observed counters, maximum-plus-one tests, no partial domain object, cancellation checkpoints, safe object-URL release, decoded-pixel limits, and focus-safe incremental rendering. | Durable or raw live-page ingestion into application storage or UI, screenshots, arbitrary DOM capture, bulk processing, and cancellation are outside the MVP. [ADR-0018](../decisions/ADR-0018-trusted-operator-url-boundary.md) separately accepts ordinary transient navigation for one trusted operator-supplied URL and exact-three-rule scanning; that path retains only minimized evidence and does not adopt this ingestion/rendering design. Reconsider these Voxleaf patterns only if one of the deferred capabilities is later accepted. | Deferred |
| Safe projection patterns in `apps/desktop/src/reader/SemanticDocument.tsx` | Closed discriminated view models, exhaustive rendering, native semantics, validated language/direction, inert unavailable links, and no untrusted HTML or URLs. | Defer a formal closed-view-model and specialized audit program. The MVP needs only application-owned evidence, guidance, generated-output, review, and comparison text projections rendered with native semantics under [ADR-0012](../decisions/ADR-0012-react-as-initial-user-interface-library.md). Reconsider the fuller pattern only if richer external content rendering enters scope. | Deferred |

## Deferred packaging comparison

Voxleaf contains a pinned Tauri, React, TypeScript, WebView2, Rust, and NSIS reference implementation intended to support a Windows installer, native lifecycle ownership, strict content-security policy, optional-artifact acquisition, and bounded uninstall. ADR-0015 explicitly excludes that topology from the A11y Evidence Lab MVP. Its evidence remains a future distribution reference, not a current comparison requirement or technology selection.

If distribution is later accepted, a new decision must establish the actual requirements and candidate set at that time. The MVP reserves no desktop container, Rust component, installer technology, launcher, updater, or signing design.

## Explicit non-adoptions

The following are not proposed for reuse:

- EPUB parsing, TTS, audio, PCM, playback, narration synchronization, voice evaluation, or TTS-specific stdio contracts.
- Voxleaf model identities, artifacts, quantizations, thresholds, VRAM margins, benchmark corpora, one-model assumptions, one-reviewer decisions, or zero-retry policy.
- Bundling model weights in the repository or any future installer; local model acquisition remains an explicit user action outside both.
- Browser Web Storage or a memory-only model for the canonical `run.json` evidence aggregate.
- Silent provider fallback, broad Windows-support claims from one host, or treating process supervision as an OS sandbox.
- Wholesale reuse of the Rust acquisition or supervisor modules, or selection of Tauri, NSIS, pnpm, Vite, Rust, or Node.js from precedent alone.
- A custom model-store downloader in the MVP. Any later application-managed acquisition requires a new distribution decision rather than being inferred from this assessment.

## Promotion and documentation rules

A candidate may become an evaluation baseline only after development is explicitly authorized, an accepted MVP need or later decision calls for it, and current primary documentation and versions are independently reviewed. Release adoption is deferred and would require a separate decision. Reusable patterns should be extracted into small A11y-owned interfaces rather than copied as product-specific modules.

Implementation plans may reuse Voxleaf's practice of recording scope, invariants, discoveries, decisions, validation, and final evidence for complex milestones. The project should keep those plans proportionate and retain one current requirements baseline and one fixed non-promotable MVP evaluation manifest rather than overlapping narrative authorities. No formal support matrix is required for the portfolio MVP.

## Documentation navigation

- [Candidate architecture](../CANDIDATE_ARCHITECTURE.md)
- [Architecture index](../README.md)
- [Project requirements index](../../PROJECT_REQUIREMENTS.md)
- [Project documentation index](../../README.md)
