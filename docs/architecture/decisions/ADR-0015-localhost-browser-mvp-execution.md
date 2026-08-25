# ADR-0015: Localhost browser MVP execution

- **Status:** Accepted
- **Decision date:** 2026-08-25
- **Supersedes for the MVP:** [ADR-0002](ADR-0002-windows-installation-and-model-acquisition.md)

## Context

The portfolio MVP needs a clear way for its developer user to start and use the application, but it does not need product installation, a desktop shell, or distribution engineering. The application also needs a privileged boundary for filesystem records, Playwright, the local model runtime, and the Groq credential; browser-delivered UI code must not own those capabilities.

ADR-0002 previously accepted a Windows installer, launcher, Start menu entry, and application-controlled browser container for a later distributable product. That delivery direction is disproportionate to the now-explicit portfolio MVP and is superseded for the MVP by this record. ADR-0002 remains in the repository as decision history; installer and packaging work may be reconsidered only through a future decision based on demonstrated product need.

## Considered options

1. Build the installer, launcher, and isolated desktop browser container for the MVP.
2. Serve the UI from one local application service and let the developer open it in an ordinary local Chrome or Edge tab.
3. Host the MVP as a remote web application.

## Decision

Run the MVP as a local application service on the developer's Windows machine and open its UI in Chrome or Edge at an enumerated `localhost` or loopback URL.

- The local application service owns filesystem access, run records, Playwright execution, local-runtime calls, Groq calls, and Groq credential access. Browser-delivered React code owns none of these privileged capabilities and communicates only with the application-owned loopback interface.
- Starting the service remains a developer operation for the MVP. This decision does not select a launcher, installer, Start menu entry, desktop wrapper, WebView, service framework, package manager, or background-service mechanism.
- The user's Chrome or Edge tab is the application UI only. It is not an arbitrary scan target and it does not replace the pinned Playwright-managed browser used by the deterministic scan boundary.
- The UI does not accept live-site or arbitrary URLs or authenticated targets. The scan boundary does not connect to an existing external Chrome or Edge session or accept it as a scan target. The MVP still selects one project-owned controlled scenario and revision per operation.
- A selected local model is downloaded explicitly through its selected local runtime, outside the repository and outside any application installer, only after the developer sees its source, identity, transfer/storage information, and network requirement and consents. The download is not bundled with tracked project material.
- Groq is contacted only for a run that explicitly selects Groq. Local failure never triggers external egress automatically.
- Packaging, signing, repair, update, uninstall, desktop isolation, and a non-developer startup experience are deferred. A future distributable-product decision must revisit security, accessibility, lifecycle, model ownership, and browser isolation from current evidence rather than treating ADR-0002 as automatically reactivated.

## Consequences

- The MVP demonstrates the complete browser UI and local privileged boundary without spending portfolio scope on distribution engineering.
- An ordinary browser profile is acceptable only because all scan inputs are project-owned synthetic scenarios and the UI remains unprivileged. This topology must be reconsidered before private targets or a distributable product enter scope.
- The developer must start the local service and separately ensure the selected local runtime/model or Groq credential is available.
- The exact JavaScript runtime, local service framework, loopback request-protection mechanism, and developer start command remain implementation details to select after development is authorized.

## Related decisions and requirements

- [ADR-0002: Windows installation and model acquisition](ADR-0002-windows-installation-and-model-acquisition.md) — superseded for the MVP
- [ADR-0005: Ollama as the initial local model runtime](ADR-0005-ollama-as-initial-local-model-runtime.md)
- [ADR-0012: React as the initial user-interface library](ADR-0012-react-as-initial-user-interface-library.md)
- [ADR-0014: Groq as the MVP external generation provider](ADR-0014-groq-as-mvp-external-generation-provider.md)
- [ADR-0016: Filesystem run persistence](ADR-0016-filesystem-run-persistence.md)
- [Installation and model lifecycle requirements](../../requirements/generation-provider-and-model-lifecycle/INSTALLATION_AND_MODEL_LIFECYCLE.md): `REQ-INST-*`
- [Privacy and security requirements](../../requirements/quality-security-and-operations/PRIVACY_AND_SECURITY.md): `REQ-SEC-*`
