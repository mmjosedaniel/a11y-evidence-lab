# ADR-0012: React as the initial user-interface library

- **Status:** Accepted for evaluation
- **Decision date:** 2026-08-23

## Context

The product needs an evidence-oriented interface with target setup, progress and failure states, finding navigation, inspectable evidence and citations, proposal review, manual checks, history, and before-and-after comparison. It must keep deterministic evidence, guidance, generated interpretation, and human decisions visually and semantically distinct while satisfying the application's own accessibility requirements.

React supports TypeScript and component-based client interfaces. It can support this interaction model, but it does not by itself provide durable workflow state, runtime validation, security isolation, accessible semantics, routing, data fetching, or a Windows application container.

## Considered options

1. Use a server-rendered or full-stack React framework as the application boundary.
2. Use React with TypeScript as a client-rendered single-page interface over the application-owned local API.
3. Use another component library such as Vue or Svelte.
4. Use browser APIs and custom elements without a UI library.

## Decision

Use React with TypeScript as the initial user-interface library for evaluation, implemented as a client-rendered single-page application served by the local application.

- Limit React to presentation, interaction, navigation, and transient UI state. Durable workflow, evidence, review, comparison, configuration, and audit state remains owned by the local application service and must survive UI reload or replacement.
- Communicate only through the application-owned, authenticated loopback API. Browser-delivered React code must not directly access provider APIs, Ollama, Chroma, Playwright, credentials, the filesystem, process control, or unrestricted networking.
- Reconstruct the visible state from durable service records after reload, interruption, or launcher restart; React component state must never be the source of truth for accepted decisions.
- Prefer native semantic HTML and explicit accessible names, relationships, keyboard behavior, focus management, validation, error handling, progress, and status announcements. Visual differences and state must not rely only on color.
- Render target content, scanner output, corpus passages, and model output as untrusted data. Display markup as text by default; any future rendered preview requires a separately accepted sandboxing and sanitization design.
- Serve pinned local assets under an approved content-security policy and verify that the controlled local-only workflow produces no unapproved non-loopback egress.
- Evaluate every core workflow against `REQ-A11Y-*` with automated checks, keyboard review, and the accepted assistive-technology matrix. React component tests alone are insufficient.
- Keep React-specific component, state, router, and query types outside canonical domain records and the service API.

This decision does not select a router, state or data-fetching library, CSS system, component kit, form library, build tool, full-stack React framework, desktop container, or installer technology. In particular, it does not select Vite, Next.js, Electron, Tauri, or WebView2. Those options remain separate candidates subject to need, security, accessibility, packaging, lifecycle, and resource evaluation.

Promoting React to the release UI requires successful evaluation of the complete workflow's accessibility, keyboard and assistive-technology behavior, security boundaries, untrusted-content handling, reload and recovery behavior, bundle and startup performance, offline/local-only operation, dependency lifecycle, and Windows packaging integration.

## Consequences

- The evaluation UI can use typed reusable components for evidence-heavy review and comparison while the application service remains authoritative.
- The UI and TypeScript service can share versioned contract definitions without sharing privileged implementation access.
- Accessibility remains an explicit design and verification responsibility; React neither proves nor certifies conformance.
- A client-rendered SPA avoids making server rendering a requirement for a single-user loopback application, but routing, data loading, caching, and error-boundary conventions still require an implementation decision.
- The desktop-container choice remains open and may materially affect installer size, memory, browser isolation, update behavior, and the risk of duplicating Playwright's pinned Chromium.

## Primary references

- [Using TypeScript with React](https://react.dev/learn/typescript)
- [Creating a React application](https://react.dev/learn/creating-a-react-app)

## Related decisions and requirements

- [ADR-0002: Windows installation and model acquisition](ADR-0002-windows-installation-and-model-acquisition.md)
- [ADR-0008: Playwright as the initial browser automation technology](ADR-0008-playwright-as-initial-browser-automation.md)
- [ADR-0009: axe-core as the initial accessibility scanner](ADR-0009-axe-core-as-initial-accessibility-scanner.md)
- [ADR-0011: TypeScript as the initial application language](ADR-0011-typescript-as-initial-application-language.md)
- [Evidence and review workflow requirements](../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md): `REQ-EVID-004` and `REQ-UX-*`
- [Installation and model lifecycle requirements](../../requirements/generation-provider-and-model-lifecycle/INSTALLATION_AND_MODEL_LIFECYCLE.md): `REQ-INST-002`
- [Application accessibility requirements](../../requirements/quality-security-and-operations/APPLICATION_ACCESSIBILITY.md): `REQ-A11Y-*`
- [Privacy and security requirements](../../requirements/quality-security-and-operations/PRIVACY_AND_SECURITY.md): `REQ-SEC-011`, `REQ-SEC-013`, `REQ-SEC-018`, and `REQ-SEC-019`
