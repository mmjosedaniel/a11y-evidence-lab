# Release inventory, evidence, and claims requirements

## Authority and use

This document is a focused canonical module within [Evaluation and release requirements](README.md) and the authoritative requirements baseline indexed by [Project requirements](../../PROJECT_REQUIREMENTS.md). The index defines status vocabulary, priority semantics, ID stability, and precedence. This file describes planned behavior, not implemented behavior; each identified row's recorded status controls.

## Proposed release inventory, evidence, and claims

**Status: Proposed candidate.** These requirements describe candidate release discipline. They do not select Tauri, Rust, NSIS, Vite, pnpm, a signing service, a package format, or any other release technology, and they do not claim that a distributable artifact exists.

| ID | Requirement | Priority | Status | Planned verification |
| --- | --- | --- | --- | --- |
| REQ-REL-001 | The release process must deterministically derive or verify the exact production component inventory required by REQ-QUAL-015 from the build inputs and artifact, with separate write and check operations so review does not silently mutate authority. | Must | Proposed | Reproducible inventory check |
| REQ-REL-002 | Release status must be claimed independently for the deterministic core application, each exact local-AI profile, each exact external-API profile, the Windows installation and removal lifecycle, and a signed public-distribution artifact. A passing claim must not imply another claim passed. | Must | Proposed | Closed release-status matrix |
| REQ-REL-003 | Every release-evidence set must bind the exact tested installer, portable or unpackaged binary where applicable, installed binary, configuration, dependency locks, and optional artifacts by cryptographic digest. A checksum provides identity evidence but does not replace trusted code signing. | Must | Proposed | Hash reconciliation and signature verification |
| REQ-REL-004 | Packaged/native validation must be distinct from development-server and ordinary browser tests and must cover clean installation, first launch, controlled loopback binding, provider setup or deferral, shutdown, repair, update and rollback where supported, retained-data behavior, model removal, and uninstall using unrelated-data sentinels. | Must | Proposed | Clean-host lifecycle harness |
| REQ-REL-005 | Release evidence must preserve unavailable or inconclusive results, declared dependency-audit blind spots, independently managed components, applicable third-party notices, and the exact scope of each claim. A release may expose a narrower truthful claim but must not omit a failed applicable gate. | Must | Proposed | Evidence-schema and notice audit |
| REQ-REL-006 | Before release, dependencies, resources, permissions, network destinations, development fallbacks, content-security-policy expansions, and optional artifacts introduced only for failed, removed, or unselected candidates must be removed or separately justified in the exact production inventory. | Must | Proposed | Production-closure and forbidden-resource audit |

## Documentation navigation

- Previous: [Evaluation and acceptance requirements](EVALUATION_AND_ACCEPTANCE.md)
- Up: [Evaluation and release requirements](README.md)
- [Project requirements index](../../PROJECT_REQUIREMENTS.md)
- [Project documentation index](../../README.md)
