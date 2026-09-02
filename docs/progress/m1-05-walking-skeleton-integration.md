# M1-05 — Integrate and verify the walking skeleton

- **Roadmap task:** [M1-05](../DEVELOPMENT_ROADMAP.md#m1-05--integrate-and-verify-the-walking-skeleton)
- **Mirrored roadmap status:** In progress
- **ExecPlan:** [Walking-skeleton integration](../plans/m1-05-walking-skeleton-integration.md)
- **Updated:** 2026-09-02

## 2026-09-02 — Task selected and first structural slice frozen

- **Project outcome:** M1-02, M1-03, and M1-04 are Complete. The owner selected M1-05 and approved a behavior-preserving refactor of the local service into focused contracts, input-validation, scan-run-record, and loopback-API modules while retaining all ordering-sensitive lifecycle state in `service.ts`.
- **Agent-workflow outcome:** R0 source and consumer analysis found the current 69-case local-service suite sufficient as the proposed passing characterization boundary. The slice will use read-only test preflight, one separate guarded standard-profile Green/Refactor, complete backend/scanner verification, and fresh S3 critical review.
- **Evidence:** The active [M1-05 ExecPlan](../plans/m1-05-walking-skeleton-integration.md) records exact responsibilities, paths, public compatibility, lifecycle invariants, commands, budgets, and stop conditions.
- **Next boundary:** Obtain fresh S3 review and complete the structural slice's documentation barrier. HTTP scan integration, browser/build integration evidence, task completion, commit, and push remain outside this structural slice.

The independent test worker classified the slice `EXISTING_AND_COVERED`. The exact 69-case local-service command passed with zero failure, cancellation, skip, or todo and no repository residue. It maps the public exports and consumers plus effect-free validation, admission, persistence, immutable terminal records, shutdown/deadline ordering, loopback HTTP behavior, listener failures, and real entry point. No test change or artificial Red was required.

## 2026-09-02 — Local-service extraction reached verified Green

- **Project outcome:** `service.ts` remains the stable public entry point and lifecycle coordinator. Focused modules now own contracts, effect-free input preparation, terminal run-record construction, and loopback HTTP behavior without changing routes, types, persisted records, or runtime results.
- **Agent-workflow outcome:** The five-path Green/Refactor lease closed compliant. The implementation worker and primary both accepted cohesion as `REFACTORED`; no test, dependency, configuration, or unrelated source file changed.
- **Evidence:** The unchanged local-service suite passed 69/69, strict TypeScript and all five syntax checks passed, and the complete backend/scanner regression passed 290/290 under the required M1-03 scanner environment with empty post-run scratch. The active ExecPlan records the exact lease, receipt, file identities, and rejected invalid-environment invocation.
- **Next boundary:** The structural slice is accepted. M1-05 stays In progress for real HTTP scan integration and its later browser/build checkpoint.

## 2026-09-02 — Local-service structural slice accepted

- **Project outcome:** The requested module extraction is complete without observable behavior or API changes. The service lifecycle remains together in `service.ts`; the four internal modules have the approved focused responsibilities.
- **Agent-workflow outcome:** Fresh S3 review found no production defect. Its only Minor documentation finding was corrected in the two UI status headers, and the bounded correction review returned PASS with no unresolved finding.
- **Evidence:** Focused 69/69 and complete 290/290 regressions, strict TypeScript, five syntax checks, compliant lease closure, 14-document link validation, `git diff --check`, and exact empty-scratch cleanup all pass. Production cohesion is `REFACTORED`.
- **Documentation impact:** The active ExecPlan and this progress record contain the structural evidence. The two stale M1-04 UI status lines now agree with the completed roadmap task. No ADR or further product-authority change is needed because runtime behavior, public contracts, dependencies, and architecture are unchanged.
- **Remaining task scope:** M1-05 remains In progress. Real HTTP scan integration and the complete browser/build integration checkpoint are not part of this accepted structural slice.

## 2026-09-02 — External dependency-clarity follow-up accepted

- **Finding:** An external independent reviewer confirmed behavioral correctness but found that `service.ts` still loads the default `node:http` value solely for a server type annotation after HTTP construction moved to `loopback-api.ts`.
- **Correction boundary:** Change only the import and annotation in `service.ts` to a type-only `Server` dependency. Public contracts, lifecycle behavior, tests, other extracted modules, dependencies, and M1-05 scope remain unchanged.
- **Evidence:** The attempt-2 lease closed compliant with only `service.ts` modified. Focused service validation passed 69/69, strict TypeScript and all five syntax checks passed, the complete backend/scanner regression passed 290/290, and the empty scanner scratch was removed.
- **Review and closure:** Bounded correction review returned PASS with no finding and confirmed `loopback-api.ts` as the sole production runtime owner of the default HTTP object. No ADR or product-authority change is required.
- **Next boundary:** The structural slice is accepted again. M1-05 remains In progress for HTTP scan integration and its browser/build checkpoint.

## 2026-09-02 — Scanner composition slice frozen

- **Project outcome:** The owner approved a behavior-preserving extraction of stateless request preparation, native capture, native-value reading, and rule-evidence projection from `scan-page.ts` and `normalize-scan.ts`. The browser lifecycle remains in `executeScan`, and normalization ordering remains in `normalizeNativeScan`.
- **Agent-workflow outcome:** R0 source and consumer analysis found the existing 20 normalization and 68 scan-execution cases sufficient as the proposed passing characterization boundary. The slice will use read-only test preflight, one guarded seven-path `code_worker` Green/Refactor, complete backend/scanner verification, and fresh S3 critical review.
- **Evidence:** The active [M1-05 ExecPlan](../plans/m1-05-walking-skeleton-integration.md) records exact responsibilities, stable public imports, serialization and lifecycle constraints, environment, commands, budgets, cleanup checks, and stop conditions.
- **Next boundary:** Obtain independent `EXISTING_AND_COVERED` preflight before opening a production write lease. HTTP scan integration, browser/build integration evidence, task completion, commit, and push remain outside this structural slice.

The corrected independent test-worker preflight classified the scanner slice `EXISTING_AND_COVERED`. The exact 20 normalization and 68 scan-execution leaf cases passed under the retained Chromium and repository-owned scratch environment; TAP reported 108 tests including parent groups, with no failure, cancellation, skip, or todo. Production/test hashes remained exact and scratch remained empty. The first packet stopped safely before execution because it named an obsolete completed-plan filename; the corrected packet used the M1-03 authority linked from `docs/README.md`. No test change or artificial Red is required.

## 2026-09-02 — Scanner composition extraction reached verified Green

- **Project outcome:** `scan-page.ts` remains the stable execution entry point and lifecycle coordinator, while `normalize-scan.ts` remains the stable normalization entry point and ordered collection coordinator. Five focused internal modules now own profile constants/factories, request preparation, serialized native capture, safe native-value reading, and rule-specific evidence projection.
- **Agent-workflow outcome:** The seven-path `code_worker` lease closed fresh and compliant. The worker and primary accepted cohesion as `REFACTORED`; no test, dependency, configuration, fixture, unrelated source, or Git state changed.
- **Evidence:** The unchanged scanner boundary passed all 88 leaf cases, strict TypeScript and seven syntax checks passed, and independent complete backend/scanner verification passed 290/290. Scanner scratch is empty, the retained runtime remains unchanged, and generated client output is absent. The active ExecPlan records the exact lease, receipt, hashes, dependency direction, and lifecycle/serialization checks.
- **Next boundary:** Obtain fresh S3 review of privacy-safe native projection, reporter serialization, validation precedence, cancellation, late acquisition, cleanup truthfulness, public compatibility, and module cohesion. M1-05 remains In progress.

## 2026-09-02 — Scanner structural slice accepted

- **Project outcome:** The approved seven-module scanner composition is complete without changing public imports, native evidence, browser behavior, terminal results, or dependencies. Both ordering-sensitive coordinators remain intact, and the five extracted modules have the approved focused responsibilities.
- **Agent-workflow outcome:** Fresh S3 review returned PASS with no Blocker, Major, or Minor finding and independently accepted cohesion as `REFACTORED`. It confirmed self-contained reporter serialization, native-evidence privacy, validation precedence, lifecycle/cleanup placement, public compatibility, dependency direction, behavioral test relevance, and status honesty.
- **Evidence:** Exact-identical focused 88-leaf and complete 290-case regressions pass; strict TypeScript, seven syntax checks, isolated reporter serialization, dependency-cycle inspection, exact identities, empty scratch, retained-runtime integrity, and generated-output absence pass. Final documentation validation passes 529 relative links and 116 fragments across ten changed documents, formatting, status reconciliation, and `git diff --check`. The active ExecPlan records the complete lease, review, validation, cleanup, and documentation evidence.
- **Documentation impact:** The active ExecPlan, this progress record, roadmap status text, and documentation indexes now reflect both accepted internal structural slices. No requirement, ADR, product, API, dependency, M1-03, fixture, or executable-configuration update is needed because observable behavior and authority semantics are unchanged.
- **Next boundary:** M1-05 remains In progress for real HTTP scan integration and its complete browser/build integration checkpoint. Commit and push remain unauthorized.

## 2026-09-02 — External scanner policy-integrity follow-up opened

- **Finding:** An owner-supplied independent review found that the exported `as const` policy arrays remain mutable JavaScript values. Primary reproduced rule and result-bucket corruption in later profile factories and expansion of the native message-key allowlist.
- **Correction boundary:** Freeze the six existing exported policy tuples without changing their values, order, types, consumers, public entry points, scanner behavior, tests, dependencies, fixtures, configuration, or lifecycle/normalization placement.
- **Evidence route:** Use the existing scanner characterization and bounded attempt-2 `code_worker` lineage, add no file-layout test, and require a direct mutation-resistance probe plus focused 88-leaf, complete 290-case, strict, syntax, cleanup, and renewed S3 evidence.
- **Status:** The earlier scanner S3 PASS is superseded as final slice acceptance until this correction closes. M1-05 remains In progress; HTTP integration is still unimplemented.

## 2026-09-02 — Scanner policy-integrity correction reached verified Green

- **Project outcome:** All six scan-feature policy tuples are now runtime-frozen at construction. Their exact literals, order, readonly types, consumers, stable entry points, and scanner behavior remain unchanged.
- **Agent-workflow outcome:** The attempt-2 `code_worker` lease closed fresh and compliant with only `scan-profile.ts` and `native-value-reader.ts` modified. The worker and primary accepted cohesion as `REFACTORED`; no test, dependency, fixture, configuration, unrelated source, or Git state changed.
- **Evidence:** A process-isolated mutation probe confirms all six tuples are frozen and unchanged after generic array-mutation attempts, while fresh scan contexts/options retain three rules and four buckets. The unchanged scanner boundary passed all 88 leaf cases, the complete regression passed 290/290, strict TypeScript and seven syntax checks passed, and scanner scratch is empty.
- **Next boundary:** Obtain renewed S3 review of runtime immutability and evidence-allowlist integrity before accepting the scanner structural slice again. M1-05 remains In progress for later HTTP integration.

## 2026-09-02 — Scanner policy-integrity follow-up accepted

- **Project outcome:** The runtime-mutable policy defect is corrected. The six existing scanner policy tuples are frozen without changing their literals, order, types, consumers, public API, normalization behavior, or browser lifecycle.
- **Agent-workflow outcome:** Renewed S3 review returned PASS with no Blocker, Major, or Minor finding and accepted cohesion as `REFACTORED`. It independently confirmed frozen descriptors, rejection of five generic mutation methods, detached factory results, and end-to-end withholding of an injected unknown native message key.
- **Evidence:** The fresh compliant two-file correction receipt, direct mutation probe, focused 88-leaf scanner boundary, complete 290-case regression, strict TypeScript, seven syntax checks, exact production/test identities, empty scratch, and renewed critical review all pass.
- **Documentation impact:** The active ExecPlan and this progress record supersede the earlier review as final correction acceptance. No requirement, ADR, M1-03 authority, product, public contract, dependency, fixture, or executable-configuration update is needed because the correction enforces the already accepted policy boundary.
- **Next boundary:** M1-05 remains In progress for real HTTP scan integration and its complete browser/build checkpoint. Commit and push remain unauthorized.
