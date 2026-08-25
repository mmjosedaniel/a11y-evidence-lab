# ADR-0002: Windows installation and model acquisition

- **Status:** Accepted
- **Decision date:** 2026-08-23

## Context

Although the planned interface is web-based, the later distributable product is local-first and single-user. A release user needs a normal way to install and start it without manually launching development servers. Large model weights also need a lifecycle separate from the application installer because they change independently and require substantial storage and download time. Packaging is not required to prove the controlled-fixture portfolio slice.

## Considered options

1. Require users to run commands and start each local service manually.
2. Embed the application, local runtime, and all model weights in one installer.
3. Install the application and launcher, then configure the selected inference provider during first run.

## Decision

When distributable-product development is authorized, distribute the product with a Windows installer and a local application launcher.

- A Start menu shortcut will launch the application. The launcher will start the required local services, bind the application interface to an enumerated loopback endpoint, wait for a health check, and open the web interface in an application-controlled window or isolated browser context. It will prevent accidental duplicate instances and provide an understandable shutdown path. The exact web-container technology remains part of the packaging decision, but an unrestricted personal browser profile is not the strict local-only execution context.
- The installer will include the application and the core dependencies the project decides to own. The exact packaging technology, browser-runtime ownership, signing process, and update mechanism must be decided before distributable-product development or public distribution, not before the local-only portfolio slice.
- Large embedding and generation model weights will not be embedded in the installer.
- On first launch, setup will explain and offer two paths: the **release-qualified local LLM profile** as the recommended mode and **External LLM API** as an explicit alternative. The user may skip AI setup and return to it later. An evaluation-only bootstrap must not be presented as release-qualified.
- Local setup will detect supported local runtimes and installed models. For a model download it will show the provider, source, license, exact tag and digest when known, transfer size, estimated installed storage, destination, compatibility guidance, and whether network access is required before requesting consent.
- Model installation, update, replacement, or removal will never occur silently. Downloads will expose progress and safe cancel, retry, recovery, and integrity-verification behavior.
- API setup will collect the provider, endpoint, model, and credential through protected controls, disclose data egress and material provider terms, and test connectivity and required capabilities before activation.
- Setup-time model acquisition and a user-selected API request are explicit network actions. They do not weaken the zero-non-loopback-egress requirement for the configured local-only controlled-fixture workflow.
- Upgrades will preserve compatible user projects and settings or perform a versioned migration. Uninstall will let the user decide whether application-owned data and models are retained or removed, and it will not remove externally managed runtime data without explicit consent.

## Consequences

- Users start the local web application like an installed Windows application while the UI remains web-based and can be isolated for local-only verification.
- The installer stays materially smaller and model releases can change independently of application releases.
- First-run setup and model management become product workflows that require accessibility, failure recovery, disk-space, integrity, and privacy testing.
- The project must decide which runtime components it owns and how signed updates, rollback, repair, and uninstall work before distribution.

## Related requirements

- [Installation and model lifecycle requirements](../../requirements/generation-provider-and-model-lifecycle/INSTALLATION_AND_MODEL_LIFECYCLE.md): `REQ-INST-*`
- [Generation provider execution requirements](../../requirements/generation-provider-and-model-lifecycle/GENERATION_PROVIDER_EXECUTION.md): `REQ-LLM-*`
- [Privacy and security requirements](../../requirements/quality-security-and-operations/PRIVACY_AND_SECURITY.md): `REQ-SEC-*`
- [Local MVP feasibility](../../LOCAL_MVP_FEASIBILITY.md)
