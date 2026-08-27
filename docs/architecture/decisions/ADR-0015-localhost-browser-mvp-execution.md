# ADR-0015: Localhost browser MVP execution

- **Status:** Accepted
- **Decision date:** 2026-08-25
- **Supersedes for the MVP:** [ADR-0002](ADR-0002-windows-installation-and-model-acquisition.md)

## Context

The portfolio MVP needs a clear way for its developer user to start and use the application, but it does not need product installation, a desktop shell, or distribution engineering. The application also needs a privileged boundary for filesystem records, Playwright, the local model runtime, and the Groq credential; browser-delivered UI code must not own those capabilities.

ADR-0002 previously accepted a Windows installer, launcher, Start menu entry, and application-controlled browser container for a later distributable product. That delivery direction is disproportionate to the now-explicit portfolio MVP and is superseded for the MVP by this record. ADR-0002 remains in the repository as decision history; installer and packaging work may be reconsidered only through a future decision based on demonstrated product need.

### Trusted operator URL amendment recorded 2026-08-27

[ADR-0018](ADR-0018-trusted-operator-url-boundary.md) supersedes ADR-0017 and this record's earlier synthetic-only input statement. The localhost UI may submit one operator-entered public HTTPS URL per `PageAnalysisRun`, but it remains an unprivileged control surface. Authorization and trust are supported-use assumptions disclosed through a visible limitation notice, not a separate confirmation workflow. The local application service owns the fresh Playwright-managed Chromium context, scanning, evidence, persistence, and provider calls. Authenticated targets, imported browser state, interaction, crawling, and distributed hosting remain excluded.

The ordinary Chrome or Edge UI is acceptable because it never loads or controls the scan target, receives provider credentials, or gains filesystem, process, browser-automation, or model-runtime authority. The separate managed scan context uses no imported cookies, storage, credentials, extensions, permissions, or personal profile. Under ADR-0018 the operator-supplied target is trusted; a production egress gate, DNS and address classification, redirect re-attestation, hostile-page qualification, and exact resource-limit matrix are deferred rather than pre-development obligations.

## Considered options

1. Build the installer, launcher, and isolated desktop browser container for the MVP.
2. Serve the UI from one local application service and let the developer open it in an ordinary local Chrome or Edge tab.
3. Host the MVP as a remote web application.

## Decision

Run the MVP as a local application service on the developer's Windows machine and open its UI in Chrome or Edge at an enumerated `localhost` or loopback URL.

- The local application service owns filesystem access, run records, Playwright execution, local-runtime calls, Groq calls, and Groq credential access. Browser-delivered React code owns none of these privileged capabilities and communicates only with the application-owned loopback interface.
- The service owns the separate fresh non-persistent Playwright context used for the trusted target, applies a finite navigation timeout, and closes the managed page, context, and browser after success or failure. It does not implement a production connection-level egress boundary for the MVP.
- Starting the service remains a developer operation for the MVP. This decision does not select a launcher, installer, Start menu entry, desktop wrapper, WebView, service framework, package manager, or background-service mechanism.
- The user's Chrome or Edge tab is the application UI only. It is not an arbitrary scan target and it does not replace the pinned Playwright-managed browser used by the deterministic scan boundary.
- The UI may accept one trusted operator-entered public HTTPS URL and displays ADR-0018's supported-use limitation without requiring a separate attestation control. The scan path does not connect to an existing external Chrome or Edge session, accept authenticated state, crawl, intentionally interact with the target, download files, or treat redirects or links as additional analysis targets.
- A selected local model is downloaded explicitly through its selected local runtime, outside the repository and outside any application installer, only after the developer sees its source, identity, transfer/storage information, and network requirement and consents. The download is not bundled with tracked project material.
- Groq is contacted only for a run that explicitly selects Groq. Local failure never triggers external egress automatically.
- Packaging, signing, repair, update, uninstall, desktop isolation, and a non-developer startup experience are deferred. A future distributable-product decision must revisit security, accessibility, lifecycle, model ownership, and browser isolation from current evidence rather than treating ADR-0002 as automatically reactivated.

## Consequences

- The MVP demonstrates the complete browser UI and local privileged boundary without spending portfolio scope on distribution engineering.
- The ordinary browser profile is acceptable only for the unprivileged application UI. The trusted target runs separately in a fresh non-persistent managed Chromium context. This topology and its threat assumptions must be reconsidered before untrusted or private/authenticated targets, interaction automation, or a distributable product enter scope.
- The developer must start the local service and separately ensure the selected local runtime/model or Groq credential is available.
- The exact JavaScript runtime, local service framework, finite navigation timeout, cleanup mechanics, and developer start command remain implementation details. Production loopback request-authentication and request-forgery hardening are Deferred under `REQ-SEC-027`; production URL containment and quantitative resource qualification are Deferred under ADR-0018. None blocks the portfolio slice.

## Related decisions and requirements

- [ADR-0002: Windows installation and model acquisition](ADR-0002-windows-installation-and-model-acquisition.md) — superseded for the MVP
- [ADR-0005: Ollama as the initial local model runtime](ADR-0005-ollama-as-initial-local-model-runtime.md)
- [ADR-0012: React as the initial user-interface library](ADR-0012-react-as-initial-user-interface-library.md)
- [ADR-0014: Groq as the MVP external generation provider](ADR-0014-groq-as-mvp-external-generation-provider.md)
- [ADR-0016: Filesystem run persistence](ADR-0016-filesystem-run-persistence.md)
- [ADR-0017: Authorized public-page scan boundary](ADR-0017-authorized-public-page-scan-boundary.md) — superseded for the MVP
- [ADR-0018: Trusted operator URL boundary for the portfolio MVP](ADR-0018-trusted-operator-url-boundary.md)
- [Installation and model lifecycle requirements](../../requirements/generation-provider-and-model-lifecycle/INSTALLATION_AND_MODEL_LIFECYCLE.md): `REQ-INST-*`
- [Privacy and security requirements](../../requirements/quality-security-and-operations/PRIVACY_AND_SECURITY.md): `REQ-SEC-*`
