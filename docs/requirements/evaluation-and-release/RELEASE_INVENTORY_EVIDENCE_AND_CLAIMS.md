# Release inventory, evidence, and claims requirements

## Authority and use

This document is a focused canonical module within [Evaluation and release requirements](README.md) and the authoritative requirements baseline indexed by [Project requirements](../../PROJECT_REQUIREMENTS.md). The index defines status vocabulary, priority semantics, ID stability, and precedence. This file describes planned behavior, not implemented behavior; each identified row's recorded status controls.

## Deferred release inventory, evidence, and claims

**Status: Deferred.** OD-017 deferred these requirements on 2026-08-25. They were previously Proposed candidate release discipline; their stable IDs and conditional content are preserved so the decision history is not silently rewritten. The MVP creates portfolio evidence only. It has no installer, packaged release, formal support qualification, signing claim, or distributable-artifact claim.

These rows become applicable only after a later explicit packaging or release decision. They do not select Tauri, Rust, NSIS, Vite, pnpm, a signing service, a package format, or any other release technology.

| ID | Requirement | Priority | Status | Planned verification |
| --- | --- | --- | --- | --- |
| REQ-REL-001 | If release work is later authorized, its process must deterministically derive or verify an exact production component inventory from the build inputs and artifact without silently mutating reviewed authority. | May | Deferred | Reproducible inventory check after release authorization |
| REQ-REL-002 | Any later release status must be scoped independently for the deterministic application, each exact local or external provider profile, any selected packaging lifecycle, and any signed public artifact. One passing scope must not imply another passed. | May | Deferred | Closed release-status matrix after release authorization |
| REQ-REL-003 | Any later release-evidence set must bind applicable tested packages, installed artifacts, configuration, dependency locks, and optional artifacts by digest; checksum identity must not be represented as trusted code signing. | May | Deferred | Hash reconciliation and signature verification after release authorization |
| REQ-REL-004 | If packaging is later selected, packaged/native validation must remain distinct from development localhost-browser checks and cover only the explicitly supported installation, startup, shutdown, update, retained-data, removal, and uninstall behavior. | May | Deferred | Later clean-host lifecycle harness |
| REQ-REL-005 | Any later release evidence must preserve unavailable or inconclusive results, audit blind spots, independently managed components, applicable notices, and the exact scope of each claim. | May | Deferred | Later evidence and notice audit |
| REQ-REL-006 | Before any later release, dependencies, permissions, network destinations, development fallbacks, and optional artifacts introduced only for unselected candidates must be removed or justified in the exact production inventory. | May | Deferred | Later production-closure audit |

## Documentation navigation

- Previous: [Evaluation and acceptance requirements](EVALUATION_AND_ACCEPTANCE.md)
- Up: [Evaluation and release requirements](README.md)
- [Project requirements index](../../PROJECT_REQUIREMENTS.md)
- [Project documentation index](../../README.md)
