# ADR-0015: Localhost browser MVP execution

- **Status:** Accepted
- **Decision date:** 2026-08-25
- **Supersedes for the MVP:** [ADR-0002](ADR-0002-windows-installation-and-model-acquisition.md)

## Context

The portfolio MVP needs a clear way for its developer user to start and use the application, but it does not need product installation, a desktop shell, or distribution engineering. The application also needs a privileged boundary for filesystem records, Playwright, the local model runtime, and the Groq credential; browser-delivered UI code must not own those capabilities.

ADR-0002 previously accepted a Windows installer, launcher, Start menu entry, and application-controlled browser container for a later distributable product. That delivery direction is disproportionate to the now-explicit portfolio MVP and is superseded for the MVP by this record. ADR-0002 remains in the repository as decision history; installer and packaging work may be reconsidered only through a future decision based on demonstrated product need.

### Authorized public-page amendment recorded 2026-08-25

[ADR-0017](ADR-0017-authorized-public-page-scan-boundary.md) supersedes this record's statement that the MVP accepts no live or arbitrary URL. The localhost UI may submit one explicitly attested public HTTPS URL per `PageAnalysisRun`, but it remains an unprivileged control surface. The local application service owns target validation, the non-bypassable loopback egress gate, ephemeral Playwright-managed Chromium, hard bounds, scanning, evidence, persistence, and provider calls. Authenticated targets, existing-browser attachment, interaction, crawling, and distributed hosting remain excluded.

The ordinary Chrome or Edge UI is still acceptable, but for a different trust reason than the original synthetic-only rationale: it never loads or controls the target page, receives provider credentials, or gains filesystem, process, browser-automation, or egress-policy authority. Untrusted page and provider records reach it only through closed application-owned projections. The concrete local-service framework, gate mechanism, request protections, and numeric public-page limits remain open pre-development qualification.

## Considered options

1. Build the installer, launcher, and isolated desktop browser container for the MVP.
2. Serve the UI from one local application service and let the developer open it in an ordinary local Chrome or Edge tab.
3. Host the MVP as a remote web application.

## Decision

Run the MVP as a local application service on the developer's Windows machine and open its UI in Chrome or Edge at an enumerated `localhost` or loopback URL.

- The local application service owns filesystem access, run records, Playwright execution, local-runtime calls, Groq calls, and Groq credential access. Browser-delivered React code owns none of these privileged capabilities and communicates only with the application-owned loopback interface.
- The service also owns the mandatory public-page egress gate accepted by ADR-0017. All managed-browser navigation, DNS, redirects, and subresources must traverse that fail-closed boundary; page code and browser-delivered UI code have no bypass path.
- Starting the service remains a developer operation for the MVP. This decision does not select a launcher, installer, Start menu entry, desktop wrapper, WebView, service framework, package manager, or background-service mechanism.
- The user's Chrome or Edge tab is the application UI only. It is not an arbitrary scan target and it does not replace the pinned Playwright-managed browser used by the deterministic scan boundary.
- The UI may accept one user-entered public HTTPS URL after the explicit authorization attestation required by ADR-0017. The scan boundary does not connect to an existing external Chrome or Edge session, accept authenticated state, crawl, interact with the application, or treat redirects or links as additional analysis targets.
- A selected local model is downloaded explicitly through its selected local runtime, outside the repository and outside any application installer, only after the developer sees its source, identity, transfer/storage information, and network requirement and consents. The download is not bundled with tracked project material.
- Groq is contacted only for a run that explicitly selects Groq. Local failure never triggers external egress automatically.
- Packaging, signing, repair, update, uninstall, desktop isolation, and a non-developer startup experience are deferred. A future distributable-product decision must revisit security, accessibility, lifecycle, model ownership, and browser isolation from current evidence rather than treating ADR-0002 as automatically reactivated.

## Consequences

- The MVP demonstrates the complete browser UI and local privileged boundary without spending portfolio scope on distribution engineering.
- The ordinary browser profile is acceptable only for the unprivileged application UI. The hostile public target runs separately in an ephemeral managed Chromium environment behind the service-owned egress gate. This topology must be reconsidered before private/authenticated targets, interaction automation, or a distributable product enter scope.
- The developer must start the local service and separately ensure the selected local runtime/model or Groq credential is available.
- The exact JavaScript runtime, local service framework, public-page gate mechanism, loopback request-protection mechanism, numeric safety limits, and developer start command remain pre-development qualification or implementation details. Their eventual selection must preserve ADR-0017's accepted fail-closed properties.

## Related decisions and requirements

- [ADR-0002: Windows installation and model acquisition](ADR-0002-windows-installation-and-model-acquisition.md) — superseded for the MVP
- [ADR-0005: Ollama as the initial local model runtime](ADR-0005-ollama-as-initial-local-model-runtime.md)
- [ADR-0012: React as the initial user-interface library](ADR-0012-react-as-initial-user-interface-library.md)
- [ADR-0014: Groq as the MVP external generation provider](ADR-0014-groq-as-mvp-external-generation-provider.md)
- [ADR-0016: Filesystem run persistence](ADR-0016-filesystem-run-persistence.md)
- [ADR-0017: Authorized public-page scan boundary](ADR-0017-authorized-public-page-scan-boundary.md)
- [Installation and model lifecycle requirements](../../requirements/generation-provider-and-model-lifecycle/INSTALLATION_AND_MODEL_LIFECYCLE.md): `REQ-INST-*`
- [Privacy and security requirements](../../requirements/quality-security-and-operations/PRIVACY_AND_SECURITY.md): `REQ-SEC-*`
