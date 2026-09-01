# ADR-0012: React as the initial user-interface library

- **Status:** Accepted for evaluation
- **Decision date:** 2026-08-23

## Context

The product needs an evidence-oriented interface with target setup, truthful operation status and failure, finding navigation, inspectable evidence and citations, proposal review, manual checks, the current decision, and before-and-after comparison. It must keep deterministic evidence, guidance, generated interpretation, and human decisions visually and semantically distinct while satisfying the application's own accessibility requirements.

React supports TypeScript and component-based client interfaces. It can support this interaction model, but it does not by itself provide durable workflow state, runtime validation, security isolation, accessible semantics, routing, data fetching, or a Windows application container.

### MVP topology amendment recorded 2026-08-25

[ADR-0015](ADR-0015-localhost-browser-mvp-execution.md) accepts the MVP topology: the developer starts the local application service and opens its React UI from an enumerated localhost or loopback URL in Chrome or Edge. [ADR-0021](ADR-0021-single-file-run-aggregate.md) makes the service-owned `run.json`, not React state or browser storage, the durable authority. Installer, desktop-container, and broader packaging work are deferred.

### Trusted operator URL amendment recorded 2026-08-27

[ADR-0018](ADR-0018-trusted-operator-url-boundary.md) retains the loopback service and unprivileged browser UI but defers production session-authentication, request-forgery, DNS-rebinding, and exhaustive renderer-projection qualification for the trusted single-user portfolio MVP. The proportional UI boundary is the one recorded by `REQ-SEC-027`.

### Local-mode data-boundary amendment recorded 2026-08-27

[ADR-0023](ADR-0023-local-mode-data-boundary.md) supersedes this record's earlier requirement to prove that every Local-mode operation produces no unapproved non-loopback egress. The current boundary is narrower: browser-delivered code has no direct provider authority; the local service exchanges Local-generation prompts and responses only with the approved Ollama loopback endpoint and performs embedding only through the locally present embedding model over loopback, without a hosted embedding or vector service. This does not alter the separately authorized minimized Groq generation payload and does not claim or enforce zero system-wide or unrelated egress. The trusted public-page scan still uses ordinary external HTTPS traffic, and Groq remains the only external generation provider.

### MVP accessibility-verification clarification recorded 2026-08-27

[OD-022](../../requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-022--portfolio-mvp-yagni-simplification) and [OD-024](../../requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-024--minimum-complete-mvp-behavior-contracts) replace this record's earlier “three controlled review paths” wording with the compact verification boundary in `REQ-A11Y-006`: one automated check, one keyboard smoke path, and one screen-reader smoke path across the core trusted-public-URL workflow. This preserves accessible implementation as a requirement without creating a browser, assistive-technology, scenario, or workflow-state matrix.

### Retained-run navigation clarification recorded 2026-09-01

[OD-026](../../requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-026--defer-user-facing-retained-run-reopening) defers user-facing reopening after reload, deep-link loading, recent-run history, and manual Run ID entry. Service-owned records remain the durable authority and React state still cannot replace them, but the portfolio MVP is not required to reconstruct a prior run's visible view after the page or service is restarted.

## Considered options

1. Use a server-rendered or full-stack React framework as the application boundary.
2. Use React with TypeScript as a client-rendered single-page interface over the application-owned local API.
3. Use another component library such as Vue or Svelte.
4. Use browser APIs and custom elements without a UI library.

## Decision

Use React with TypeScript as the initial user-interface library for evaluation, implemented as a client-rendered single-page application served by the local application.

- Limit React to presentation, interaction, navigation, and transient UI state. Durable workflow, evidence, review, comparison, and provider-choice state remains owned by the local application service and is not replaced by browser component state. OD-026 separately defers exposing that durable state again after UI reload or replacement.
- Communicate only through the application-owned loopback interface. Browser-delivered React code must not directly access Groq or another provider API, Ollama, the in-process retrieval store, Playwright, credentials, the filesystem, process control, or unrestricted networking. Under the 2026-08-27 amendment, no production loopback request-protection system is required for the trusted single-developer MVP, and no user accounts, roles, or permissions are introduced.
- Treat durable service records as the source of truth for accepted decisions and validate them whenever the application reads them. Reconstructing a previous visible run after reload, interruption, or local-service restart is Deferred through OD-026.
- Prefer native semantic HTML and explicit accessible names, relationships, keyboard behavior, focus management, validation, error handling, and status announcements. Visual differences and state must not rely only on color. No separate progress subsystem follows from this decision.
- Render target content, scanner output, corpus passages, and model output as untrusted data. Display markup as text by default; any future rendered preview requires a separately accepted sandboxing and sanitization design.
- Serve pinned application UI assets from the local service. Browser-delivered code has no direct generation or embedding authority; the local service exchanges Local-generation prompts and responses only with the approved Ollama loopback endpoint and performs embedding only through the locally present embedding model over loopback, without a hosted embedding or vector service. This boundary does not alter the separately authorized minimized Groq generation payload or require system-wide egress control: trusted public-page navigation remains external under ADR-0018, and an explicit Groq-mode generation request remains the only external generation path accepted by ADR-0014.
- Evaluate the application's core path against `REQ-A11Y-*` using the one automated check, keyboard smoke path, and screen-reader smoke path governed by `REQ-A11Y-006`. This supersedes the earlier three-controlled-review-path wording; a formal assistive-technology support matrix is deferred, and React component tests alone are insufficient.
- Keep React-specific component, state, router, and query types outside canonical domain records and the service API.

This decision does not select a router, state or data-fetching library, CSS system, component kit, form library, build tool, full-stack React framework, local-service framework, desktop container, or installer technology. In particular, it does not select Vite, Next.js, Electron, Tauri, or WebView2. A desktop container and installer are outside the MVP.

This evaluation decision does not qualify React or a browser version as a release dependency. Any future distributable UI requires a separate decision and appropriate accessibility, security, lifecycle, and packaging evidence.

## Consequences

- The evaluation UI can use typed reusable components for evidence-heavy review and comparison while the application service remains authoritative.
- The UI and TypeScript service can share versioned contract definitions without sharing privileged implementation access.
- Accessibility remains an explicit design and verification responsibility; React neither proves nor certifies conformance.
- A client-rendered SPA avoids making server rendering a requirement for a single-user loopback application, but routing, data loading, caching, and error-boundary conventions still require an implementation decision.
- The MVP avoids a desktop container. A later distribution decision must consider browser isolation, update behavior, resources, and the risk of duplicating Playwright's pinned Chromium.

## Primary references

- [Using TypeScript with React](https://react.dev/learn/typescript)
- [Creating a React application](https://react.dev/learn/creating-a-react-app)

## Related decisions and requirements

- [ADR-0002: Windows installation and model acquisition](ADR-0002-windows-installation-and-model-acquisition.md) — historical, superseded for the MVP
- [ADR-0008: Playwright as the initial browser automation technology](ADR-0008-playwright-as-initial-browser-automation.md)
- [ADR-0009: axe-core as the initial accessibility scanner](ADR-0009-axe-core-as-initial-accessibility-scanner.md)
- [ADR-0011: TypeScript as the initial application language](ADR-0011-typescript-as-initial-application-language.md)
- [ADR-0014: Groq as the MVP external generation provider](ADR-0014-groq-as-mvp-external-generation-provider.md)
- [ADR-0015: Localhost browser MVP execution](ADR-0015-localhost-browser-mvp-execution.md)
- [ADR-0021: Single-file run aggregate](ADR-0021-single-file-run-aggregate.md)
- [ADR-0023: Local-mode data boundary](ADR-0023-local-mode-data-boundary.md)
- [Minimum complete MVP behavior contracts](../../requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-024--minimum-complete-mvp-behavior-contracts)
- [OD-026: Defer user-facing retained-run reopening](../../requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-026--defer-user-facing-retained-run-reopening)
- [Evidence and review workflow requirements](../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md): `REQ-EVID-004` and `REQ-UX-*`
- [Installation and model lifecycle requirements](../../requirements/generation-provider-and-model-lifecycle/INSTALLATION_AND_MODEL_LIFECYCLE.md): `REQ-INST-002`
- [Application accessibility requirements](../../requirements/quality-security-and-operations/APPLICATION_ACCESSIBILITY.md): `REQ-A11Y-*`
- [Privacy and security requirements](../../requirements/quality-security-and-operations/PRIVACY_AND_SECURITY.md): `REQ-SEC-004`, `REQ-SEC-013`, and `REQ-SEC-027`
