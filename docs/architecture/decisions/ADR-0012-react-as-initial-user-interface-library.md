# ADR-0012: React as the initial user-interface library

- **Status:** Accepted for evaluation
- **Decision date:** 2026-08-23

## Context

The product needs an evidence-oriented interface with target setup, progress and failure states, finding navigation, inspectable evidence and citations, proposal review, manual checks, history, and before-and-after comparison. It must keep deterministic evidence, guidance, generated interpretation, and human decisions visually and semantically distinct while satisfying the application's own accessibility requirements.

React supports TypeScript and component-based client interfaces. It can support this interaction model, but it does not by itself provide durable workflow state, runtime validation, security isolation, accessible semantics, routing, data fetching, or a Windows application container.

### MVP topology amendment recorded 2026-08-25

[ADR-0015](ADR-0015-localhost-browser-mvp-execution.md) accepts the MVP topology: the developer starts the local application service and opens its React UI from an enumerated localhost or loopback URL in Chrome or Edge. [ADR-0016](ADR-0016-filesystem-run-persistence.md) makes service-owned JSON records, not React state or browser storage, the durable authority. Installer, desktop-container, and broader packaging work are deferred.

### Trusted operator URL amendment recorded 2026-08-27

[ADR-0018](ADR-0018-trusted-operator-url-boundary.md) retains the loopback service and unprivileged browser UI but defers production session-authentication, request-forgery, DNS-rebinding, and exhaustive renderer-projection qualification for the trusted single-user portfolio MVP. The proportional UI boundary is the one recorded by `REQ-SEC-027`.

## Considered options

1. Use a server-rendered or full-stack React framework as the application boundary.
2. Use React with TypeScript as a client-rendered single-page interface over the application-owned local API.
3. Use another component library such as Vue or Svelte.
4. Use browser APIs and custom elements without a UI library.

## Decision

Use React with TypeScript as the initial user-interface library for evaluation, implemented as a client-rendered single-page application served by the local application.

- Limit React to presentation, interaction, navigation, and transient UI state. Durable workflow, evidence, review, comparison, and provider-choice state remains owned by the local application service and must survive UI reload or replacement.
- Communicate only through the application-owned loopback interface. Browser-delivered React code must not directly access Groq or another provider API, Ollama, Chroma, Playwright, credentials, the filesystem, process control, or unrestricted networking. Under the 2026-08-27 amendment, no production loopback request-protection system is required for the trusted single-developer MVP, and no user accounts, roles, or permissions are introduced.
- Reconstruct the visible state from durable service records after reload, interruption, or local-service restart; React component state must never be the source of truth for accepted decisions.
- Prefer native semantic HTML and explicit accessible names, relationships, keyboard behavior, focus management, validation, error handling, progress, and status announcements. Visual differences and state must not rely only on color.
- Render target content, scanner output, corpus passages, and model output as untrusted data. Display markup as text by default; any future rendered preview requires a separately accepted sandboxing and sanitization design.
- Serve pinned local assets from the local service and verify that local-mode operations produce no unapproved non-loopback egress. A Groq-mode generation request is the one explicit external operation accepted by ADR-0014.
- Evaluate the three controlled review paths against `REQ-A11Y-*` with automated checks plus focused keyboard and manual review. A formal assistive-technology support matrix is deferred, and React component tests alone are insufficient.
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
- [ADR-0016: Filesystem run persistence](ADR-0016-filesystem-run-persistence.md)
- [Evidence and review workflow requirements](../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md): `REQ-EVID-004` and `REQ-UX-*`
- [Installation and model lifecycle requirements](../../requirements/generation-provider-and-model-lifecycle/INSTALLATION_AND_MODEL_LIFECYCLE.md): `REQ-INST-002`
- [Application accessibility requirements](../../requirements/quality-security-and-operations/APPLICATION_ACCESSIBILITY.md): `REQ-A11Y-*`
- [Privacy and security requirements](../../requirements/quality-security-and-operations/PRIVACY_AND_SECURITY.md): `REQ-SEC-013` and `REQ-SEC-027`
