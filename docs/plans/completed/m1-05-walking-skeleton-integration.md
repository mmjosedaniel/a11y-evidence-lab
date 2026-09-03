# Integrate and verify the walking skeleton (M1-05)

This ExecPlan is a living document. Maintain `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` as work proceeds. This document must be maintained in accordance with `PLANS.md`.

This plan owns only [M1-05 — Integrate and verify the walking skeleton](../../DEVELOPMENT_ROADMAP.md#m1-05--integrate-and-verify-the-walking-skeleton). M1-05 is Complete again after the two owner-authorized post-closure corrections at `1f92fe8`, replacement 335-test verification, fresh independent reviews, exact cleanup, and renewed documentation closure. Earlier implementation, failed evidence, review, public smoke, and closure history remain preserved. Correction commands record the completed execution; do not replay one-shot setup or cleanup. Only explicitly identified read-only definitions and verification checks are reusable. No M2 work, public smoke, provider call, new dependency, requirement/ADR change, commit, or push is authorized.

## Progress

- [x] (2026-09-03) Reproduced both post-closure findings at clean committed baseline `1f92fe89e28fb2e645a97875ee38390d4744a858`: quoted CSS loads, unquoted local/external `rel=stylesheet` bypasses the asset map; five existing abort-helper attempts reach zero server requests/data/aborted/error events while a control request reaches intake. All probes were file-free and the diagnostic listener closed.
- [x] (2026-09-03) Received explicit owner authorization to reopen M1-05 for only these corrections. Dependencies remain Complete, Accepted contracts unchanged, original source/test/runtime/protected identities match, no lease is active, build/scratch are absent, and run siblings are empty. Returned this same plan to the active directory and reconciled current task status.
- [x] (2026-09-03) Accepted `M105-PC08-PREFLIGHT-01` as PARTIAL. Strict TypeScript, all three syntax checks, source/test/Node identities, endpoint/index, and absent generated-state checks passed. Only stylesheet recognition is missing; real abort behavior remains existing-but-uncovered. Confirmed real-startup quoted/mixed/unquoted positives and external/missing/malformed/duplicate negatives, plus restored test-only intake observation that waits for actual partial data before destruction and proves no callback dispatch/effects.
- [x] (2026-09-03) Accepted `M105-PC08-RED-01`: strict TypeScript and three syntax checks passed; 15 focused tests produced 5 pass / 10 intended stylesheet failures / zero cancellation, skip or todo. All four original lanes and the quoted boolean-attribute control passed. Corrected abort characterization proves actual partial receipt, real aborted/error settlement, no completed-body dispatch, unchanged scanner/storage/sibling state and responsive service. Lease `M1-05-20260903-08-postclosure-red-01` closed fresh compliant with exactly the two test paths, contract `eda28cccf51326f4203dc97fab9b0e3e83048b38dc93a198de0724df0ec0e38a`, receipt `fe96da0b301fc87f8ea5cebbf6146a58195cf75b56c4f72e23ce4d62bc7e850d`. Primary inspected both diffs and independently rechecked identities and clean generated state.
- [x] (2026-09-03) Accepted `M105-PC08-GREEN-01`: separate code worker reproduced the 15-case 5-pass/10-fail Red, changed only `client-assets.ts::attributes()`, then passed strict TypeScript, three syntax checks and all 15 focused cases with unchanged accepted tests. Contiguous token recognition handles quoted/unquoted/boolean attributes and rejects malformed/duplicate tokens; no dependency or responsibility moves. Cohesion RETAINED. Fresh compliant Green lease `M1-05-20260903-08-postclosure-green-01`, contract `950c6a47267f193470e3919317c6ccb93a1fdb90ca4f43524a2df47545a7e7c8`, receipt `3670dac391a923b6af5e2875cbb6650d6c0dd69f1cee6ba2b98cd6e8c9930681`. Primary inspected the exact one-file diff, accepted structure, and rechecked source/test identities.
- [x] (2026-09-03) Accepted replacement complete verification: all 335 tests, strict TypeScript, three syntax checks, exact corrected source/test/build/runtime identities, empty scratch/siblings and absent caches passed. Added the frozen two-receipt correction identity and exact post-review cleanup commands; documentation validation passed 86 files / 1,891 links / 529 fragments / 25 PowerShell blocks.
- [x] (2026-09-03) Accepted fresh slice review `M105-PC08-S3-01` as PASS WITH FOLLOW-UPS after consolidating its sole Minor duplicate progress checkpoint. No Blocker/Major; independent 25-case tokenizer matrix, three real aborts, deliberate no-arrival timeout and restored hooks, strict/syntax and frozen identities passed. Cohesion RETAINED.
- [x] (2026-09-03) Accepted different fresh final integrated review `M105-PC08-FINAL-01`: PASS, no remaining findings, RETAINED cohesion. Independent identities, strict/syntax, Green-start test hashes, file-free integrated asset/HTTP/abort/control probe, command isolation and status checks passed; the exact 335-test barrier remains reusable.
- [x] (2026-09-03) Exact correction cleanup passed: removed only identity-checked `dist/client` and three verified-empty scratch roots; no run deletion. Corrected source/tests, retained runtime, evaluation/fixtures, protected inputs, both receipts, empty run siblings, Git endpoint and empty index remain exact. Reconciled current-status owners for renewed closure.
- [x] (2026-09-03) Renewed post-archive closure passed after current-status reconciliation and link repair: exact corrected files/trees/receipts, retained runtime, absent generated state, empty run siblings/index and unchanged Git endpoint; 16 changed paths; eight Complete / 20 Not started / no active roadmap task; 86 Markdown files, 1,892 links, 529 fragments, 26 PowerShell blocks, required headings, UTF-8 and whitespace. M1-05 is Complete again.

- [x] (2026-09-02) Confirmed M1-02, M1-03, and M1-04 are Complete and reconciled M1-04's final umbrella closure from its accepted verification, review, cleanup, and documentation evidence.
- [x] (2026-09-02) Received explicit owner selection of M1-05 and approval of `M105-LOCAL-SERVICE-MODULE-REFACTOR-01` with the named module boundary and behavior-preserving constraints.
- [x] (2026-09-02) Completed R0 repository-local responsibility and consumer analysis. The existing 69-case local-service suite is the proposed passing characterization boundary; no significant architecture decision or new dependency is required.
- [x] (2026-09-02) Accepted read-only test-worker preflight as `EXISTING_AND_COVERED`: all 69 local-service and entry-point cases passed with zero failure, cancellation, skip, or todo and no repository residue.
- [x] (2026-09-02) Extracted the four focused modules under a separate guarded `code_worker` Green/Refactor lease while preserving `service.ts` as the stable public entry point and lifecycle coordinator. The lease closed compliant with exactly the five allowed production paths.
- [x] (2026-09-02) Passed focused, strict, syntax, and complete 290-case backend/scanner verification; received fresh S3 PASS after one documentation-only correction; removed the empty scanner scratch; and completed the structural slice's documentation barrier.
- [x] (2026-09-02) Corrected the external review's P3 dependency-clarity finding by making `service.ts` import only the `Server` type from `node:http`; the unchanged focused and complete regression boundaries passed and bounded correction review returned PASS with no finding.
- [x] (2026-09-02) Received explicit owner approval of `M105-SCANNER-MODULE-REFACTOR-02` with the exact seven-module boundary, stable public entry points, 88-case characterization boundary, and behavior-preserving constraints.
- [x] (2026-09-02) Accepted corrected read-only test-worker preflight as `EXISTING_AND_COVERED`: all 88 leaf scanner cases passed under the required environment, with 108 TAP tests including parent groups, no test/source change, and empty scratch. The first packet stopped before execution because it named an obsolete M1-03 plan path; the corrected packet used the authority linked by `docs/README.md`.
- [x] (2026-09-02) Completed the guarded seven-path scanner Green/Refactor. The lease closed fresh and compliant; focused 88-leaf scanner verification, strict TypeScript, seven syntax checks, and the complete 290-case backend/scanner regression pass with empty scratch and unchanged protected inputs.
- [x] (2026-09-02) Accepted fresh S3 PASS with no Blocker, Major, or Minor finding; the reviewer independently validated reporter serialization, native evidence privacy, precedence, lifecycle placement, stable imports, hashes, and cohesion as `REFACTORED`. Completed scanner-slice cleanup and documentation reconciliation while keeping M1-05 In progress.
- [x] (2026-09-02) Accepted the owner-supplied external P2 finding that exported policy tuples remained mutable at runtime. A process-isolated probe reproduced rule/bucket profile corruption and message-key allowlist expansion; the prior scanner S3 PASS is superseded for this correction boundary.
- [x] (2026-09-02) Froze all six exported policy tuples under a fresh compliant attempt-2 Green lease. The direct mutation-resistance probe, unchanged 88-leaf scanner boundary, complete 290-case regression, strict TypeScript, and seven syntax checks passed before the correction advanced to renewed S3 review.
- [x] (2026-09-02) Accepted renewed S3 PASS with no Blocker, Major, or Minor finding. The reviewer independently confirmed hostile mutation resistance, exact tuple identity, factory isolation, unknown-message-key withholding, stable exports, and unchanged cohesion; completed correction cleanup and documentation reconciliation while keeping M1-05 In progress.
- [x] (2026-09-02) Received explicit owner approval of `M105-RUN-CONTRACT-MODULE-REFACTOR-03` with the stable public façade, six focused internal modules, 30-case characterization boundary, frozen exported policy tuples, and behavior-preserving constraints.
- [x] (2026-09-02) Completed R0 source, consumer, authority, and test analysis. The 497-line contract contains six separable responsibilities, the existing 30 contract cases are the proposed passing characterization boundary, and no new dependency or significant architecture decision is required.
- [x] (2026-09-02) Accepted independent read-only `EXISTING_AND_COVERED` preflight: the 30 static contract cases execute 58 TAP tests, all passing with no failure, cancellation, skip, todo, snapshot, layout assertion, source/test change, or residue.
- [x] (2026-09-02) Completed the guarded seven-path contract Green/Refactor under a separate `code_worker` lease without changing tests. The lease closed compliant with exactly the seven authorized source paths, and both worker and primary inspection accepted cohesion as `REFACTORED`.
- [x] (2026-09-02) Passed the unchanged 58-test focused boundary, complete 290-case regression, strict TypeScript, seven syntax checks, production build, exact runtime-export check, 16-policy-tuple mutation probe, dependency inspection, protected-input identity checks, and bounded generated-output cleanup.
- [x] (2026-09-02) Accepted fresh S3 PASS with no Blocker, Major, or Minor finding. The reviewer independently validated hostile-value inspection, fixed policy, evidence privacy, validation precedence, immutable output, collection and lifecycle integrity, stable exports, exact behavior against the prior implementation, and cohesion as `REFACTORED`; completed documentation reconciliation while keeping M1-05 In progress.
- [x] (2026-09-02) Received explicit owner approval of `M105-RUN-REPOSITORY-MODULE-REFACTOR-04` with the stable public entry point, four focused internal modules, 55-case characterization boundary, and behavior-preserving persistence constraints.
- [x] (2026-09-02) Completed R0 source, consumer, authority, and test analysis. The 270-line repository contains separable contract, error, Windows path-safety, transition, and stateful publication responsibilities; the focused suite passes 55/55 and no new dependency or significant architecture decision is required.
- [x] (2026-09-02) Accepted independent read-only `EXISTING_AND_COVERED` preflight: all 55 repository cases passed with no failure, cancellation, skip, todo, source/test change, or retained test-owned residue.
- [x] (2026-09-02) Completed the guarded five-path repository Green/Refactor without changing tests. The lease closed fresh and compliant; focused 55-case, complete 290-case, strict TypeScript, five syntax, stable-export/import, identity, and cleanup checks pass.
- [x] (2026-09-02) Accepted fresh S3 PASS with no Blocker, Major, or Minor finding. The reviewer independently validated Windows path and identity protection, publication and interruption ordering, cleanup truthfulness, error precedence, stable exports, dependency direction, and cohesion as `REFACTORED`; completed documentation reconciliation while keeping M1-05 In progress.
- [x] (2026-09-02) Accepted the owner-supplied P3 cleanup-evidence correction: independently verified `node_modules/.vite-temp` as an ordinary, non-link, empty directory inside the workspace; removed only that exact directory without recursion; verified both it and repository-root `.vite-temp` are absent; and corrected the overstated earlier evidence without changing production code or tests.
- [x] (2026-09-02) Received explicit owner approval of `M105-APP-DEAD-STATE-CLEANUP-05`. Repository analysis found `App.tsx` already cohesive at its accepted orchestration boundary; the selected cleanup removes only unread `pendingAnalysis` state and its two setter calls without creating a hook, reducer, controller, component, or module.
- [x] (2026-09-02) Accepted independent read-only `EXISTING_AND_COVERED` preflight: all 30 browser cases passed under the pinned Chromium environment with exact baseline identities, no failure, skip, test change, external request, or retained test-owned residue.
- [x] (2026-09-02) Completed the guarded one-file Green, focused and complete verification, exact generated-output cleanup, and fresh S1 PASS with no finding. The production diff is exactly three deletions in `App.tsx`; public interfaces and observable behavior remain unchanged, and cohesion is accepted as `RETAINED`.
- [x] (2026-09-02) Completed the owner-requested documentation follow-up: reconciled the public overview, documentation index, roadmap, plan index, and progress index to include the accepted App cleanup, linked each applicable navigation surface to this owning slice, and confirmed that the unchanged UI contract and historical M1-04 plan need no amendment.
- [x] (2026-09-02) Reconciled the complete current task state at clean HEAD `a9ccb01f19db386e82c5a00f163c6525b66cb9c0`: all three dependencies are Complete, the five earlier M1-05 slices remain accepted, strict TypeScript passes, and the fresh browser-free contract/repository/service baseline passes 182/182.
- [x] (2026-09-02) Accepted fresh final readiness review `M105-REMAINING-WORK-PLAN-REVIEW-05` as PASS with no Blocker, Major, or Minor finding against candidate SHA-256 `6258258BB57F571EE3AD3E2223461963D1A4251F08305E9F803C1D7C902B3797`. The reviewer independently confirmed task routing, authority coverage, worker/lease/TDD ownership, exact commands, evidence continuity through post-archive closure, capability gating, full browser-to-disk lanes, owner-gated smoke, cleanup ordering, and YAGNI/KISS scope. Planning remains R0 repository-local synthesis; no comparative decision or Decision Review Contract is triggered.
- [x] (2026-09-03) Accepted independent review `M105-REMAINING-WORK-PLAN-REVIEW-06` as `REVISE`: committing the plan advanced clean HEAD to `bbce48b27d4f7528ee73c79eacd8ffc27acc24b0`, so the old executable HEAD, lease-receipt, closure, and plan-dirty assumptions no longer matched the current tree. Revalidated the unchanged source, tests, protected inputs, runtime, generated-path state, strict TypeScript, and 182/182 browser-free baseline before this plan-only correction.
- [x] (2026-09-03) Accepted fresh independent readiness review `M105-REMAINING-WORK-PLAN-REVIEW-07` as PASS with no Blocker, Major, or Minor finding against candidate SHA-256 `417DF3390B3A8089F1B2AB444EDD10F3C81973DDE27CACB798E2E35AFB32AF8B`. The reviewer confirmed zero obsolete HEAD literals in executable blocks, exactly three consistent `bbce48b27d4f7528ee73c79eacd8ffc27acc24b0` comparisons, a passing exact entry gate, unchanged evidence identities, full workflow readiness, and preserved YAGNI/KISS scope. Planning remains R0 repository-local synthesis; no comparative decision or Decision Review Contract is triggered.
- [x] (2026-09-03) Reconciled the second committed-plan endpoint at clean HEAD `552f57ec93f23cde164e3327fba06ba961fa1286` as `M105-INTEGRATION-PLAN-BASELINE-004`. Exact Git, source/test, protected-input, retained-browser, active-lease, and generated-path identities match baseline 003; strict TypeScript and the 182/182 browser-free baseline pass; all 16 PowerShell blocks parse; 1,898 relative links and 533 fragments resolve across 86 Markdown files; formatting and `git diff --check` pass; and the actual `Assert-M105PlanningIdentity` command passes with this plan as the sole unstaged path.
- [x] (2026-09-03) Accepted fresh independent readiness review `M105-REMAINING-WORK-PLAN-REVIEW-08` as PASS with no Blocker, Major, or Minor finding against candidate SHA-256 `CBBC600A6D501BCD5774DB2562C39E68FB18AB01455DF0D5527EE55E746996B7`. The reviewer independently reproduced the exact planning gate; confirmed the current Git, source/test, protected-input, runtime, browser, marker, lease, and generated-state identities; and regression-checked authorities, TDD/lease ownership, responsibility placement, risk routing, smoke/cleanup/closure sequencing, and YAGNI/KISS scope. Only this result record changes after the reviewed candidate; preflight is unblocked.
- [x] (2026-09-03) Recorded preflight assignment `M105-WALKING-SKELETON-INTEGRATION-06-PREFLIGHT-01` as `UNKNOWN` with no reusable evidence: its orchestration wrapper matched the longer `M105-CMD-PREFLIGHT-SETUP` heading, which stopped on the already-created `temp/m103-scan` root before any mutation. No test, typecheck, runtime, source, generated output, or Git state changed. One bounded same-worker wrapper correction may target the exact `M105-CMD-PREFLIGHT` heading without changing the frozen command or work-slice contract.
- [x] (2026-09-03) Accepted corrected same-worker preflight `M105-WALKING-SKELETON-INTEGRATION-06-PREFLIGHT-02` as `MISSING`. Exact full-heading extraction ran the frozen block successfully: 182/182 browser-free tests, the accepted 20 normalization plus 68 execution leaf cases within 108 passing scanner TAP entries, 30/30 UI tests, and strict TypeScript all passed; both planning-identity checks passed; the three scratch roots remained empty; build/cache paths remained absent; and the retained browser runtime was unchanged. Source inspection confirmed the existing `runScan` and `App.analyze` seams while configured-client assets/static dispatch, `POST /api/runs`, production `executeScan` composition, and the client same-origin callback remain absent.
- [x] (2026-09-03) Closed attempt-1 Red lease `M1-05-20260902-06-integration-red-01` compliant with guard digest `8f3acdc28a6f38344413bb42263a6691e53122df83318b140e67e8f307a30ace` and receipt digest `de014e4215e88b977a6119f9d5a9413c0959e1c3fcb25623eb7e6da183b84b05`; exactly the two allowed test paths were created. The native build and both syntax checks passed, and the first of four focused cases failed on the expected absent configured-client capability, but the helper registered teardown after startup and left one empty task-owned directory, causing the remaining cases and final scratch check to fail. This is `RED INVALID`, not reusable Red evidence. One same-contract attempt-2 test correction is permitted only after exact generated build and empty-residue cleanup.
- [x] (2026-09-03) Verified the owner-completed exact cleanup after the command-approval backend repeatedly returned HTTP 404: the fingerprinted `dist/client` build and verified empty `temp/m105-integration/local-populated` directory are absent; both Vite-cache paths are absent; all three retained scratch roots are empty; no lease is active; HEAD, branch, and empty index remain unchanged. The two test files and plan are the only worktree paths, so attempt-2 Red may begin.
- [x] (2026-09-03) Accepted attempt-2 Red behavior and identities after an exceptional independent workflow-integrity audit. All four cases fail only at the absent configured-client startup boundary; syntax and the 32-module build pass; scratch is empty; no browser, scanner, provider, or external request occurs. Lease `M1-05-20260902-06-integration-red-02` closed compliant under semantic digest `96e7cdb206cfd4edf592f029b3594582ea19d4d958f1662d808f80b145ef8b61` and receipt digest `da1e055ed758399c778c46409cf3215784404a1bbaf948f9b2ddff537f44a409`. Audit verdict `ACCEPTABLE-WITH-RECORDED-PROCESS-FINDING` records one permanent Major process finding: the worker packet incorrectly named the active-pointer file hash instead of the semantic contract digest. The immutable contract, exact path scope, and terminal receipt remove write-scope ambiguity but do not retroactively make that packet compliant.
- [x] (2026-09-03) Reverified the accepted Red build's exact three files and one assets directory against the frozen four-entry / 225,273-byte identity, removed only those individual generated files and then-empty directories, and proved `dist/client` absent with all three scratch roots empty. Green may start from the required clean generated state.
- [x] (2026-09-03) Closed Green attempt-1 lease `M1-05-20260902-06-integration-green-01` compliant with zero changed paths and receipt digest `31b857887db25a7875a4d84514ae89516f0f03ade5074572009b12158587ba9d`. The packet correctly contained semantic contract digest `23992063b57befc74ffc47e627e45090f512fa0600de6af2fb8daa9d9741bdfe`, but the worker mistook `active.json` pointer hash `7da50b585f75649370ecc1ee1ccb5b65c0a2773230242d1bdaf62ba68f247c4e` for that value and stopped before writing or validation. One same-contract attempt-2 Green with the no-diff attempt-1 parent is permitted; its packet must distinguish the returned semantic digest from the active-pointer hash explicitly.
- [x] (2026-09-03) Closed Green attempt-2 lease `M1-05-20260902-06-integration-green-02` compliant with exactly the seven authorized production paths and receipt digest `a3d6e2b5cb2a0caa681b1938797976160aec5179068e61f3a8f759617f193940`. The worker's command wrapper malformed the prep extraction and ran no validation, so primary executed the frozen focused Green once after closure. Build and test syntax passed, but all four focused cases failed: the Local case hit a two-element strict locator for `Choose Local or Groq.`, the Groq lane persisted a browser/cleanup failure and timed out waiting for valid-zero presentation, and its retained run root contaminated the remaining two cases. No Green evidence is accepted; the correction budget is exhausted and the exact build plus failed-run scratch are preserved for owner-directed recovery.
- [x] (2026-09-03) Received explicit owner authorization for one fresh same-contract recovery cycle after both automatic correction budgets were exhausted. The historical process findings and failed evidence remain unchanged. Recovery begins with read-only `M105-WALKING-SKELETON-INTEGRATION-06-RECOVERY-DIAGNOSIS-01` against the preserved build and failed aggregate; only after classification may one fresh test-owned `evidence` or `red` lease correct the same two test paths. A passing test-only characterization skips another production write; a valid product Red may open one fresh Green lease for the same seven production paths. Neither role receives another automatic correction.
- [x] (2026-09-03) Accepted read-only recovery diagnosis `M105-WALKING-SKELETON-INTEGRATION-06-RECOVERY-DIAGNOSIS-01` as `EXISTING_BUT_UNCOVERED`. The validation-text failure is an unscoped test locator. The Groq browser/cleanup failure occurred because the long-lived UI Chromium used scanner-owned `TEMP`/`TMP`, making `temp/m103-scan` nonempty before `executeScan`'s clean-entry gate; teardown then asserted `stop-failed` before removing its owned run. Static call-graph and preserved-aggregate evidence identify no production defect. After exact diagnostic cleanup, one test-owned lease `M1-05-20260902-06-integration-recovery-evidence-01` may change only the two accepted test paths to scope the locator, isolate the UI browser in `temp/m104-ui`, restore scanner environment before submission, and make teardown attempt all owned cleanup before surfacing errors. Passing characterization is required; any product-boundary failure stops for reconciliation and does not authorize Green implicitly.
- [x] (2026-09-03) Reverified and removed only the preserved diagnostic build, failed Groq run aggregate, and Vite dependency cache after matching every file to its recorded or freshly inventoried SHA-256 identity and confirming ordinary non-link topology. `dist/client`, `node_modules/.vite`, and `node_modules/.vite-temp` are absent; all three retained task scratch roots are present and empty; no lease is active; HEAD, branch, and the empty index remain unchanged. The recovery evidence lease may begin.
- [x] (2026-09-03) Closed recovery evidence lease `M1-05-20260902-06-integration-recovery-evidence-01` fresh and compliant under semantic digest `e8fe0b719239d9141ce4f6a99cf871b7d2083894f91d2c2a9b121f0f4e458afc`, receipt digest `a46cda6d41edeba14835f47e838e945262d4ca570aeba4bc877aae4d6a7a6cb5`, and receipt-file SHA-256 `828DB3B234ED89BAC5203B3C6975644A94EBCFE6424F66F363E4AE296338E163`. Exactly the two test paths changed. Syntax and the 32-module build passed; the focused suite executed four cases with one pass and three failures, so the characterization is not reusable. Scratch and Vite caches are empty/absent, and the recognized build remains retained.
- [x] (2026-09-03) Accepted read-only S3 recovery reconciliation `M105-RECOVERY-FAILURE-REVIEW-01` as `BLOCKED` solely on exhausted write authorization. It found no production defect or authority conflict: the remaining failures are an array-shaped assertion against keyed `Coverage`, a platform-inaccurate HTTP listener-closure probe, and an in-flight 503 delivery expectation incompatible with the accepted immediate `closeAllConnections` contract. Another evidence lease may correct only those test defects after fresh explicit owner authorization; production must remain unchanged.
- [x] (2026-09-03) Received fresh explicit owner authorization for one final two-test-path, no-correction evidence lease that applies only the reconciled coverage, raw-socket closure, and split shutdown-status assertions. Production remains frozen; any failure stops for owner reconciliation.
- [x] (2026-09-03) Reverified the retained four-entry / 225,483-byte build against its three exact file hashes, removed only those files and their then-empty parent directories, and confirmed the build and both Vite caches absent with all three retained scratch roots empty. The final recovery evidence lease may begin.
- [x] (2026-09-03) Accepted final recovery characterization `M105-WALKING-SKELETON-INTEGRATION-06-FINAL-RECOVERY-EVIDENCE-01`: both syntax checks and the native 32-module build passed; all four focused cases passed with zero failure, cancellation, skip, or todo; the real Local, Groq-zero, navigation-failure, and immediate-stop lanes retained their complete assertions; scratch is empty and Vite caches are absent. Lease `M1-05-20260902-06-integration-final-recovery-evidence-01` closed fresh and compliant with exactly the two test paths under semantic digest `a048065f8c16adeb53bdd19d2bbad290d88eccc1a31f8b6f4629805ad815ae30` and receipt digest `67e621ce21c60caece0367f86e4685016ebc801d3ec8af4b87ec2820b11bff4d`.
- [x] (2026-09-03) Captured `M105-ACCEPTED-GREEN-TUPLE-001` before plan maintenance. It freezes the seven unchanged production hashes, two accepted test hashes, five protected inputs, 52-entry source tree, 11-entry test tree, four-entry build, 332-entry retained browser, final test-evidence receipt, and compliant Green-02 production receipt. The populated reusable assertion owns all later complete, review, smoke, and pre-cleanup identity checks; later recapture is forbidden.
- [x] (2026-09-03) Ran the exact complete barrier against the frozen tuple. The 58-case run-contract suite and 55-case repository suite passed; the unchanged 69-case local-service suite passed 67 and failed exactly its two production-entry cases, so the barrier stopped before scanner, integration, UI, typecheck, and syntax completion. The build remains identity-frozen, scratch is empty, caches are absent, and no lease is active. Complete evidence is not accepted.
- [x] (2026-09-03) Accepted read-only preflight `M105-WALKING-SKELETON-INTEGRATION-06-COMPLETE-FAILURE-PREFLIGHT-01` as `EXISTING_BUT_UNCOVERED`. Production `main.ts` correctly supplies the configured client root and therefore reports `capabilities.scan: true`; only `tests/local-service.test.ts` lines 1077 and 1111 retain the old API-only `scan: false` expectation. The smallest correction is that one test path: add an optional `scan` argument to its existing health helper and pass `true` only in those two production-entry assertions. No production defect or broader test change is supported.
- [x] (2026-09-03) Received fresh explicit owner authorization to add only `tests/local-service.test.ts` to the accepted test boundary under one no-correction test-worker evidence lease, then invalidate and replace the affected test-tree/test-receipt portions of `M105-ACCEPTED-GREEN-TUPLE-001` before rerunning the complete barrier.
- [x] (2026-09-03) Accepted one-file evidence `M105-WALKING-SKELETON-INTEGRATION-06-LOCAL-ENTRY-EVIDENCE-01`: syntax passed and all 69 local-service cases passed with zero failure, cancellation, skip, or todo. Lease `M1-05-20260902-06-integration-local-entry-evidence-01` closed fresh and compliant with only `tests/local-service.test.ts`, semantic digest `a7554c1f6b314234c131f4c701a30b2b996c2d437ca18133b320dff7cdfd2e32`, and receipt digest `be48bbb2c9b4b8e08317795e3b9f33b5dc4c981076589d0a0456c325a7bd2236`; the diff is only the defaulted scan capability and two production-entry `true` arguments.
- [x] (2026-09-03) Replaced the invalidated test portion of `M105-ACCEPTED-GREEN-TUPLE-001` before plan maintenance. The accepted boundary now contains three test paths and two immutable test receipts; the test tree is 11 entries / 10 files / one directory / 342,259 bytes / `C34220C7D1DAD41C973F8B8CF5640F21BFB4BABEEAE77DAAD48A398AA1D752F7`. Production, protected inputs, source tree, build, runtime, and Green-02 receipt retain their prior frozen identities.
- [x] (2026-09-03) Replayed the complete barrier from the beginning after one orchestration-only whitespace correction that executed no plan block. All 324 runtime tests passed—58 contract, 55 repository, 69 local service, 20 normalization, 88 real scanner, four walking skeleton, and 30 UI—with empty scratch, absent caches, and the accepted build intact. Strict TypeScript then failed only at `tests/walking-skeleton.test.ts:104` with TS7022 because the local variable `coverage` shadows the accessed `coverage` property in its initializer. The barrier stopped before changed-server syntax checks; complete evidence remains unaccepted.
- [x] (2026-09-03) Received fresh explicit owner authorization for one no-correction test-worker evidence lease limited to `tests/walking-skeleton.test.ts`, renaming only that local variable to `ruleCoverage`, then rerun strict TypeScript and the unchanged four-case walking-skeleton suite before replacing its test receipt/hash and replaying the complete barrier.
- [x] (2026-09-03) Closed that no-correction lease fresh and compliant after exactly the authorized local rename, with semantic digest `f3044338dfe88af7929670f007b71872381ea77ea2c1c7b67ac4fafe7b11965a`, receipt digest `acbce985d4297737b7445ed96fdbe408105d72c9a26d272417e13d4a338a937d`, receipt-file SHA-256 `12FED60D3E8F8CDFB0834FE73D66B4662CDEC6A1FE8D314F7C26B73E7F8C1866`, and resulting test-file SHA-256 `58B7A5E82E0226ABAF6108386AA499866FF057D940DC182FE0B6D3A5CB87A856`. Strict TypeScript still reports TS7022 on the renamed local, so the packet stopped before syntax or focused tests. The accepted tuple is not replaced, no complete evidence is accepted, and the exhausted packet requires owner reconciliation before any different test expression or type annotation.
- [x] (2026-09-03) Received fresh explicit owner authorization for one no-correction test-worker evidence lease limited to `tests/walking-skeleton.test.ts`: remove only the inferred `ruleCoverage` local and reference `persisted.scan.coverage[rule]` directly in the same four assertions, then run strict TypeScript, syntax, and the unchanged four-case suite before tuple replacement and complete-barrier replay.
- [x] (2026-09-03) Accepted direct-expression evidence `M105-WALKING-SKELETON-INTEGRATION-06-WALKING-DIRECT-EVIDENCE-01`: strict TypeScript and syntax passed, and the unchanged four-case suite passed 4/4. Lease `M1-05-20260902-06-integration-walking-direct-evidence-01` closed fresh and compliant with only `tests/walking-skeleton.test.ts` under semantic digest `7915de58e568d8ad297a473afab2610a6a5fc551ea3d7b8d3f5a18513af362c2`, receipt digest `d1e439f5b09a405227c1367370b596038635e78f5655d009a994cb6fabdd0ab2`, and receipt-file SHA-256 `B105E1F644EEBCF455C3A3F897B5FA0FE3A96911B847F80C3817E486B20DC571`.
- [x] (2026-09-03) Replaced the invalidated walking-test portion of `M105-ACCEPTED-GREEN-TUPLE-001` before plan maintenance. The accepted test file is now `807BA472522541DE17598705C47ED11ED2845D56EF9FDB459512ED8C36B39275`; the test tree is 11 entries / 10 files / one directory / 342,291 bytes / `443FE3FC6F0C1A931D0C60875D804B7F6C3889742A6C4444C5E137B37C8F0E04`. The tuple retains the complete three-receipt walking-test provenance chain, local-entry receipt, Green production receipt, and every unchanged source/build/runtime/protected identity.
- [x] (2026-09-03) Replayed the complete barrier from the beginning against the replacement frozen tuple. All 324 runtime cases passed—58 contract, 55 repository, 69 local service, 20 normalization, 88 real scanner, four walking skeleton, and 30 UI—with zero failure, cancellation, skip, or todo. Strict TypeScript passed; all six changed server files passed syntax checks; all three scratch roots and `data/runs` are empty; both Vite-cache paths are absent; and the accepted build, source, tests, protected inputs, browser runtime, receipts, HEAD, branch, and empty index remain exact. Complete integration evidence is accepted pending fresh S3 review.
- [x] (2026-09-03) Fresh S3 review returned `REVISE` with no Blocker, two Major findings, and no Minor finding. The asset loader accepts a linked `assets` ancestor when its real target remains inside `clientRoot`, contrary to the frozen ordinary-non-link-ancestor contract, and its frozen response entries expose mutable backing `Buffer` bytes. Primary reproduced the mutable-buffer defect and confirmed both findings against the exact loader and line-423 authority. No other required review dimension failed; complete evidence and the public smoke cannot advance until an owner-authorized test Red, production Green, full barrier replay, and renewed S3 review resolve both findings.
- [x] (2026-09-03) Received fresh explicit owner authorization for the exact S3 correction route: one no-correction test-worker Red lease limited to `tests/walking-skeleton.test.ts`, followed only after accepted Red by one no-correction code-worker Green lease limited to `src/server/local-service/client-assets.ts`. The correction may add only mutation-isolation and internal-junction rejection evidence, then add literal descendant-ancestor checks and private immutable response backing with fresh copies. Any additional path or changed contract stops.
- [x] (2026-09-03) Accepted asset-hardening Red `M105-WALKING-SKELETON-INTEGRATION-06-ASSET-HARDENING-RED-01`. Syntax and strict TypeScript passed; the focused suite produced exactly 4 tests / 3 pass / one fail, with only the direct transport/lifecycle case failing on the combined expected `{ mutationIsolation: true, linkedRejectionNoStorage: true }` versus actual `{ false, false }`. The junction was unlinked before fixture cleanup; scratch, `data/runs`, caches, build, and Git state are clean. Lease `M1-05-20260902-06-integration-asset-hardening-red-01` closed fresh compliant with only `tests/walking-skeleton.test.ts`, semantic digest `bc03d8e13e96338e8ba447dec0ea0f901b7338945a89ab7074d207c00f14bf03`, receipt digest `10ab999d0a3cc2b4a4d517aa91d1442d29309a7ee9f78de8b0dac45ac5eb9aca`, receipt-file SHA-256 `72A67B2C0CDCC3D05D53FFAA7F3594F18EBEE738A680D232DEBFEF2F6EEB2F0A`, and Red test SHA-256 `9CF2120512BA0936D6BFD8585FEA320D4FEE127E8136FCA2EE954D4A3BEF233F`.
- [x] (2026-09-03) Accepted asset-hardening Green `M105-WALKING-SKELETON-INTEGRATION-06-ASSET-HARDENING-GREEN-01`. `client-assets.ts` now rejects every linked descendant directory component and keeps loaded bytes private behind a fresh-copy body getter. Syntax and strict TypeScript passed; the focused suite passed 4/4, including both corrected asset observations and existing byte equality. Lease `M1-05-20260902-06-integration-asset-hardening-green-01` closed fresh compliant with only `src/server/local-service/client-assets.ts`, semantic digest `400170c789bf38ed1941ba586c860aed9ccff46b263d3c8b7e21196a99eec039`, receipt digest `cba84a48dc02e75ec18914da183954804051867f08e32e6b596f6dd26843132d`, receipt-file SHA-256 `2E5898AD3AB1A8072F108F09D2FB9EDA385F441437719EFB0AD3966E013E422D`, and production SHA-256 `E6471020C61D34F8C108281F5448391C8A55BF577F365D68CDAFA9E887228C8D`. Cohesion is `RETAINED`.
- [x] (2026-09-03) Replaced `M105-ACCEPTED-GREEN-TUPLE-001` before plan maintenance. The corrected source tree is 52/40/12/155,794/`1CDEF37A13522636497B196180E537B098C2610E4498C355690C61AB55606B75`; the corrected test tree is 11/10/1/344,299/`4D8800E7ACF958D5C914AB686CDBD03A3AE2D5965954D7F8DE7B54F01BDE240C`. The tuple freezes the seven current production and three test hashes plus the complete seven-receipt provenance chain. Protected inputs, build, and browser runtime remain unchanged.
- [x] (2026-09-03) Replayed the complete barrier from the beginning against the corrected seven-receipt tuple. All 324 runtime cases passed—58 contract, 55 repository, 69 local service, 20 normalization, 88 real scanner, four walking skeleton, and 30 UI—with zero failure, cancellation, skip, or todo. Strict TypeScript and all six changed-server syntax checks passed; exact response-byte and asset-hardening assertions passed; scratch and `data/runs` are empty; both Vite caches are absent; and the final tuple assertion passed. Corrected complete evidence is accepted pending a fresh S3 review.
- [x] (2026-09-03) Accepted renewed independent review `M105-WALKING-SKELETON-INTEGRATION-06-S3-02` as PASS with no Blocker, Major, or Minor finding. A different fresh reviewer confirmed both asset-loader corrections and rechecked the original transport, validation, privilege, provider, lifecycle, persistence, cleanup, API-only, and responsibility-fit dimensions. All seven changed application files are accepted as `RETAINED`; the controlled integration checkpoint is complete.
- [x] (2026-09-03) Executed `M105-WALKING-SKELETON-INTEGRATION-06` through read-only preflight, guarded test-owned Red/evidence and production Green, authorized bounded recoveries, complete validation, and fresh S3 acceptance.
- [x] (2026-09-03) Rejected the first owner-authorized public smoke as a non-reusable observation after the managed scanner could not navigate the approved page. The validator accepted the resulting aggregate as a well-formed Local-mode `navigation` failure but correctly rejected it as the required completed smoke. The production service stopped cleanly; exact disposable-run cleanup removed only run `run-fb211c46-f235-463d-8cf2-3f1b5d1c3f2e` with `run.json` SHA-256 `3D5A6000D6CC0BAF6824EA31CA905C521FBEE75E8ABB7892B4248CF016E4A29D`, leaving `data/runs` empty. No product defect or automatic retry is claimed.
- [x] (2026-09-03) Rejected the single owner-directed replacement smoke as another validated Local-mode `navigation` failure. Same-environment diagnosis reproduced `page.goto: net::ERR_NETWORK_ACCESS_DENIED`; a read-only HTTPS HEAD request outside the Codex sandbox returned 200 for the same approved page, isolating the failure to sandbox-denied outbound browser access rather than the page or application route. The service stopped cleanly; exact cleanup removed only run `run-6f2446f7-81a2-4e4a-bf45-393426714e3e` with `run.json` SHA-256 `9432F96BD68FBD31490D035F28818DC6A9C470DE4F7D7ACB501E7A5BB27AA4D1`, leaving `data/runs` empty.
- [x] (2026-09-03) Received explicit owner authorization for one same-target, same-mode network-capable correction after the sandbox diagnosis. This is not a third target or automatic retry: the exact replacement target and Local mode remain fixed, both public-smoke blocks and the frozen tuple remain unchanged, and only shell A may run outside the Codex sandbox so its production managed-browser child inherits outbound network access.
- [x] (2026-09-03) The first network-capable shell-A invocation stopped before service startup because the outside-sandbox host process was denied read access to an ignored terminal lease receipt during the frozen tuple assertion. No service, browser, run, scratch, cache, source, test, or Git mutation occurred. The owner-authorized environment correction therefore separates evidence from network privilege: run the exact tuple and scratch gate inside the sandbox immediately before and after, and run only the already-verified PREP plus unchanged production-start block outside it, with no intervening mutation.
- [x] (2026-09-03) Accepted the single owner-authorized network-capable correction for `M105-TRUSTED-PUBLIC-SMOKE-07`: completed Local-mode scan, exact three-rule coverage, zero Findings and 20 scanner-review observations. Live response, validated disk read, clean stop/exit 0, post-stop tuple, exact aggregate hash, empty sibling set/scratch, and refused service socket passed. The aggregate and build are retained as `M105-SMOKE-RETAINED-001` for final review.
- [x] (2026-09-03) Accepted different final integrated critical review `M105-FINAL-INTEGRATED-REVIEW-01` as PASS WITH FOLLOW-UPS; resolved its sole Minor revision-history omission and passed documentation validation before cleanup. Exact cleanup removed the authorized disposable run, exact client build, and three empty scratch roots while preserving siblings, browser runtime, source, tests, protected inputs, and terminal receipts. Reconciled current-status owners and documentation before completing M1-05 and archiving this plan; final post-archive checks preserve those identities and the 8 Complete / 20 Not started task totals.

## Surprises & Discoveries

- Observation: Passing full-path tests did not cover unquoted stylesheet discovery or actual partial-request arrival. Evidence: the post-closure probes above reproduced both P2 findings without artifact writes; `attributes()` ignored unquoted `rel`, while immediate client destruction preceded HTTP intake. A test must prove its adverse event occurred before absence of effects counts as coverage.

- Observation: `service.ts` combines stateless validation and transport policy with one ordering-sensitive lifecycle protocol. Evidence: `src/server/service.ts` keeps admission, synchronous read ownership, active operation reservation, stop notification, abort, deadline, cleanup uncertainty, listener close, and stop settlement in one closure. Splitting those state transitions would require a shared mutable abstraction and would weaken local reasoning.
- Observation: Existing interception tests replace methods on the default `node:http` object. Evidence: `tests/local-service.test.ts` patches `http.createServer`; the extracted HTTP module must continue importing and using that default object.
- Observation: The local-service suite already characterizes the public API and the critical ordering paths in 69 cases. Evidence: `tests/local-service.test.ts`; the approved change is structural and does not justify file-layout assertions or implementation-shaped tests.
- Observation: The complete scanner regression depends on the M1-03 process environment, including repository-owned `TEMP` and `TMP`. Evidence: an initial invocation without that environment failed only the scan-page temporary-directory assertions; the corrected invocation with the pinned browser path and all required variables passed all 290 cases and left the scratch directory empty.
- Observation: An external independent review found that `service.ts` retained a runtime default `node:http` import solely for the `http.Server` annotation after HTTP construction moved to `loopback-api.ts`. Evidence: `service.ts` line 1 and the server declaration; with `verbatimModuleSyntax`, the import remains in emitted runtime code even though the coordinator does not construct HTTP objects.
- Observation: `scan-page.ts` combines stateless scan-request/profile preparation and serialized in-page capture with an ordering-sensitive browser lifecycle. Evidence: `executeScan` shares browser acquisition, cancellation, operation deadline, late settlement, cleanup, terminal chronology, and failure precedence through one closure, while the request and reporter functions do not share that lifecycle state.
- Observation: `normalize-scan.ts` combines generic safe native-value readers and rule-specific evidence projection with the normalization coordinator. Evidence: envelope validation, failure precedence, exact coverage reconciliation, UUID creation, native ordering, and final collection assembly depend on explicit sequence, while the low-level readers and per-node projections are stateless.
- Observation: The first scanner-preflight packet named a nonexistent historical M1-03 plan path. Evidence: the test worker returned `UNKNOWN` before running tests; `docs/README.md` identifies `docs/plans/completed/m1-03-real-scan-and-evidence.md` as the accepted completed plan. The corrected read-only packet used that authority and produced fresh focused evidence without a write.
- Observation: TypeScript `as const` does not freeze a JavaScript array. Evidence: a process-isolated import of the accepted Green changed `scanRules` with `pop()`, causing later `initialScanContext()` and `nativeScanOptions()` calls to expose only two rules; extending `nativeBuckets` changed later result types, and extending `messageKeys` widened the normalization allowlist. This is an internal policy-integrity defect even though no current production consumer mutates the exports.
- Observation: `src/server/domain/run-contract.ts` has 497 lines and six ordered responsibility clusters: public/internal contract types and policy at lines 1–147, descriptor-safe unknown-value reading at 149–260, finding/evidence validation at 262–373, scan validation at 375–431, and parent-run validation at 434–497. Evidence: complete source inspection plus 30 behavior-oriented cases in `tests/run-contract.test.ts` and imports across server, scanner, persistence, and browser code.
- Observation: `src/server/persistence/run-repository.ts` has 270 lines and five responsibility clusters: public contracts, bounded store errors, Windows identifier/path and filesystem-identity checks, immutable transition validation, and the stateful repository/publication coordinator. Evidence: complete source and consumer inspection plus 55 passing repository cases covering real filesystem topology, staged-write faults, cleanup ownership, and process interruption around rename.
- Observation: Atomic publication and cleanup share descriptor, staged-path, directory-identity, canonical-identity, and commit-point state. Evidence: the `publish` closure performs exclusive stage creation, identity checks, short-write completion, flush, close, topology revalidation, rename, and verified cleanup in one sequence; extracting it would require a new one-consumer transaction abstraction and weaken auditability.
- Observation: The first repository-slice cleanup probe checked repository-root `.vite-temp` but not Vite's actual `node_modules/.vite-temp` cache location. Evidence: an owner-supplied read-only review found the latter ordinary empty directory still present, and primary inspection confirmed its resolved workspace path, ordinary directory attributes, absent link type, and zero children before exact non-recursive removal.
- Observation: Current `App.tsx` already delegates form presentation, result presentation, and response-envelope admission; its remaining reservation, settlement, accepted-run, selection, announcement, and focus responsibilities form one cohesive UI coordinator. Evidence: `pendingAnalysis` is the only state value never read, while its setter is called at operation start and settlement solely to cause redundant renders.
- Observation: The remaining product gap is visible at both composition boundaries. Evidence: `src/server/local-service/loopback-api.ts` advertises `scan: false` and accepts only GET health/read requests, while `src/client/main.tsx` renders `<App />` without the `analyze` callback, so the shipped build disables Analyze and reports that service integration is pending.
- Observation: All required product capabilities already exist behind stable entry points. Evidence: `prepareScanRequest` and `executeScan` are exported through `src/server/scan/scan-page.ts`; `startLocalService().service.runScan` already owns reservation, persistence, terminal validation, and shutdown; `App` already owns unknown-response admission and every accepted visible state. No package, second service, UI state model, provider adapter, or persisted field is needed.
- Observation: The current Vite build emits a browser client to `dist/client`, but the production loopback entry does not serve it. Evidence: `vite.config.ts`, root `index.html`, `src/server/main.ts`, and the current developer instructions. The smallest ADR-0015-compliant topology is for the existing service to expose only that built entry and its generated direct assets from the same origin.
- Observation: Exact request, transfer, DOM, and result ceilings are explicitly Deferred for the trusted-input portfolio MVP. Evidence: `REQ-QUAL-014`, `REQ-QUAL-017`, and the deferred-bounds clarification under `REQ-QUAL-020`. The integration must not invent a resource-limit framework or present ordinary JSON parsing as hostile-request hardening.
- Observation: A changing public page cannot be reusable deterministic evidence. Evidence: ADR-0018 keeps synthetic project-owned states as the evaluation baseline and treats public-page results as observations. The public smoke therefore needs an owner-selected target at execution time, records no page content, and cannot substitute for the controlled integration matrix.
- Observation: The first independent review of this remaining-work revision returned `REVISE`, not execution approval. Evidence: it found that the draft did not preserve API-only POST/health behavior explicitly, referred to command variables without defining an executable wrapper, omitted slice-local authority anchors, allowed controlled success cases to bypass the browser form, and deleted the public aggregate before the final reviewer could inspect it. This revision addresses all five findings and the review's residual request-stream and asset-topology questions before seeking a different fresh review.
- Observation: Committing an otherwise reviewed living plan changes both its Git endpoint and its expected initial dirty-path state. Evidence: commit `bbce48b27d4f7528ee73c79eacd8ffc27acc24b0` contains only this plan relative to `a9ccb01f19db386e82c5a00f163c6525b66cb9c0`, but the three executable endpoint comparisons and plan-only entry check still described the pre-commit tree and therefore could not pass.
- Observation: Prefix-only command-heading extraction is unsafe when one frozen command heading prefixes another. Evidence: preflight assignment `M105-WALKING-SKELETON-INTEGRATION-06-PREFLIGHT-01` requested `M105-CMD-PREFLIGHT`, but its wrapper selected `M105-CMD-PREFLIGHT-SETUP`; that setup block stopped on the expected pre-existing scratch root before mutation and no validation command ran. The bounded correction must require an exact full heading match.
- Observation: Test cleanup ownership must be registered before an expected startup failure. Evidence: attempt-1 Red correctly reached the missing configured-client startup assertion, but `startConfiguredService` and `startBrowserHarness` registered teardown only after successful startup; the first failure therefore left the empty task-owned `temp/m105-integration/local-populated` directory and invalidated the overall Red. The test-only correction may change only that teardown ordering and any directly necessary idempotent cleanup in the accepted two-file boundary.
- Observation: The active-pointer `digest` is not the lease contract's semantic `contract_digest`. Evidence: attempt-2 Red start created immutable contract digest `96e7cdb206cfd4edf592f029b3594582ea19d4d958f1662d808f80b145ef8b61`, while `active.json` exposed its contract-file hash `bd7bfac8c580cf31e863ca3922103f95d8588dcc3421c0b1ae74766ed5cf7422`. The latter was incorrectly inserted in the worker packet after the start command returned no JSON. A fresh packet must use the `contract_digest` returned by `start`; an active pointer is never a substitute.
- Observation: A worker may also misclassify a correct packet when it treats the active-pointer hash as the semantic contract digest. Evidence: Green attempt 1 received the exact `contract_digest` returned by guard start and present in immutable `contract.json`, but stopped without writing after comparing it with `active.json.digest`. Future packets explicitly state that only the guard-start `contract_digest` is binding and that the active-pointer hash has a different integrity purpose.
- Observation: The accepted Red contract contains a locator that becomes ambiguous only after configured startup succeeds. Evidence: primary focused Green reached the actual served App and `getByText('Choose Local or Groq.')` resolved both the field error and the live-status announcement. Red could not expose that weakness because configured startup failed first. Any recovery must let the test worker replace only this ambiguous locator with a behavior-equivalent exact accessible target before reaccepting the test boundary.
- Observation: The first real configured Groq scan did not produce the expected valid zero. Evidence: it durably wrote a bounded failed aggregate with `failure.category: browser`, `scanContext.cleanup: failed`, and no scan, then the UI wait timed out and left the exact `groq-zero` scratch root. This may be a test-harness managed-browser wrapper defect or a production composition defect; recovery must diagnose it without assuming either and must preserve the failed aggregate until ownership is reconciled.
- Observation: The preserved Groq failure was caused before the managed-scan wrapper could launch. Evidence: the UI browser started while `TEMP` and `TMP` pointed at `temp/m103-scan`, so its profile artifacts violated `executeScan`'s scanner-scratch clean-entry requirement. The failed aggregate finished nine milliseconds after creation with browser version, final URL, scan time, and readiness still missing, which corroborates that branch. UI browser artifacts belong under `temp/m104-ui`; scanner environment must be restored before form submission.

## Decision Log

- (2026-09-03) Reopen only M1-05 under the owner's bounded correction authorization. Extend the existing attribute recognizer to cover ordinary unquoted values, preserving quoted values and boolean attributes emitted by Vite; invalid/external/duplicate asset references still fail before storage/listen. Replace the vacuous abort helper with bounded server-observed partial-body synchronization and explicit stream-event/no-effect assertions. Preserve production abort handling unless new evidence supports an owner-authorized scope change. Use one coherent corrected startup/intake verification slice with Red only for missing stylesheet behavior and passing characterization for existing stream behavior.

- (2026-09-03) Accepted final integrated review after its sole documentation-only follow-up was resolved and validated. Preserve the reviewed implementation and all historical evidence; perform only the exact disposable-artifact cleanup, current-status reconciliation, plan archival, and post-archive closure checks. No requirement, ADR, evaluation baseline, source, test, or next-task scope changes.

- Decision: Keep admission, `readRun`, scan reservation and settlement, `stop`, listener startup/errors, and their shared state in `service.ts`.
  Rationale: These responsibilities form one concurrency and shutdown protocol. Keeping them together preserves synchronous reservation, notification-before-abort ordering, deadline write suppression, cleanup uncertainty, listener-error precedence, and stable stop-promise identity without adding a state machine, class, event bus, or dependency container.
  Date/Author: 2026-09-02 / project owner and primary coordinator.
- Decision: Extract only `contracts.ts`, `input-validation.ts`, `scan-run-records.ts`, and `loopback-api.ts` under `src/server/local-service/`.
  Rationale: Each module owns one current cohesive responsibility. The boundary is small, purpose-named, dependency-free, and directly authorized by the owner.
  Date/Author: 2026-09-02 / project owner and primary coordinator.
- Decision: Use the existing 69 service/entry-point cases as passing characterization and add no test for file placement.
  Rationale: The accepted observable contract already has deep coverage. A layout assertion would couple tests to private structure and would not improve behavioral confidence.
  Date/Author: 2026-09-02 / project owner and primary coordinator.
- Decision: Keep `executeScan` and its local `track`, `bounded`, `close`, `active`, and `operation` state together in `scan-page.ts`.
  Rationale: Browser acquisition, abort, deadlines, late resource registration, ordered cleanup, terminal chronology, and cleanup truthfulness form one lifecycle. Extracting that state would add indirection and weaken failure-order reasoning.
  Date/Author: 2026-09-02 / project owner and primary coordinator.
- Decision: Keep native envelope and option validation, error precedence, coverage reconciliation, UUID creation, native ordering, and final `Finding`/`ScannerReviewObservation` assembly together in `normalize-scan.ts`.
  Rationale: These operations define the canonical normalized collection and depend on explicit ordering. Only the safe readers and rule-specific projections are cohesive stateless extractions.
  Date/Author: 2026-09-02 / project owner and primary coordinator.
- Decision: Preserve `scan-page.ts` and `normalize-scan.ts` as stable public entry points and add no barrel file.
  Rationale: Existing production and test consumers retain the same imports. The new modules are internal responsibility owners, not another public API layer.
  Date/Author: 2026-09-02 / project owner and primary coordinator.
- Decision: Preserve `src/server/domain/run-contract.ts` as the only public contract façade and extract `run-types.ts`, `run-policy.ts`, `contract-value-reader.ts`, `finding-validation.ts`, `scan-validation.ts`, and `run-validation.ts` under `src/server/domain/run-contract/`.
  Rationale: The six modules match proven current responsibilities, retain one-way validation dependencies, and keep every production and test consumer on the existing stable import path.
  Date/Author: 2026-09-02 / project owner and primary coordinator.
- Decision: Freeze every policy tuple exported between internal contract modules and reuse the existing 30 contract cases without a layout test.
  Rationale: Module extraction turns private tuples into internal exports, so runtime immutability must enforce their fixed contract. Existing tests cover observable validation; file-layout assertions would couple tests to private structure.
  Date/Author: 2026-09-02 / project owner and primary coordinator.
- Decision: Preserve `src/server/persistence/run-repository.ts` as the only public repository entry point and extract `contracts.ts`, `store-errors.ts`, `windows-run-paths.ts`, and `run-transition.ts` under `src/server/persistence/run-repository/`.
  Rationale: These modules own four current cohesive responsibilities while every external production and test consumer retains the existing import path.
  Date/Author: 2026-09-02 / project owner and primary coordinator.
- Decision: Keep root identity, canonical reads, the complete `publish` transaction, `create`/`read`/`finish`, rollback, cleanup, and error precedence together inside `openRunRepository`.
  Rationale: They form one ordering-sensitive integrity boundary whose shared state determines whether canonical bytes were committed and whether cleanup is known to have succeeded.
  Date/Author: 2026-09-02 / project owner and primary coordinator.
- Decision: Reuse the existing 55 repository cases and add no private-layout test if independent preflight returns `EXISTING_AND_COVERED`.
  Rationale: The suite already exercises the observable persistence and failure contract. A file-placement assertion would add coupling without improving data-integrity evidence.
  Date/Author: 2026-09-02 / project owner and primary coordinator.
- Decision: Keep all current analysis orchestration in `App.tsx` and remove only the unused `pendingAnalysis` state declaration and setter calls.
  Rationale: The owner selected cleanup only. A custom hook, reducer, controller, or further component would move one already cohesive lifecycle without creating a clearer current responsibility boundary.
  Date/Author: 2026-09-02 / project owner and primary coordinator.
- Decision: Implement the remaining product behavior as one coherent standard-profile slice, `M105-WALKING-SKELETON-INTEGRATION-06`, rather than separate route, static-file, client-fetch, and scanner-wiring micro-slices.
  Rationale: Those changes jointly create one falsifiable user outcome and no subset is independently useful. One Red/Green pair keeps the accepted client/server boundary visible without turning M1-05 into another task graph.
  Date/Author: 2026-09-02 / primary coordinator from Accepted authorities and current repository state.
- Decision: Use the existing loopback origin for both the built client and API. Add `POST /api/runs` with the exact JSON input `{ "requestedUrl": string, "mode": "local" | "groq" }`; let the service derive the fixed provider/model and scan context through `prepareScanRequest`, invoke `executeScan` through its existing `runScan` owner, and return the existing `ScanOutcome` JSON envelope.
  Rationale: ADR-0015 selects one local application service and keeps filesystem and managed-browser authority out of browser code. Sending only URL plus mode prevents the client from becoming authoritative for scanner policy, provider identity, run identity, or persistence.
  Date/Author: 2026-09-02 / primary coordinator from ADR-0015, ADR-0018, ADR-0021, and the accepted M1 interfaces.
- Decision: Gate the new scan route and truthful health capability on successful configured-client loading. With no own `clientRoot` field, `startLocalService` remains the existing API-only service: health reports `scan: false`, every POST remains 405, and the existing read behavior is unchanged. A valid configured client root enables the closed client routes, exact scan POST, and `scan: true`; an invalid configured root returns `client-unavailable` before a listener or run repository is opened.
  Rationale: Focused M1-02/service construction intentionally has no client build. Capability gating preserves that accepted contract while making the developer-started production composition truthful; an unconditional POST would silently invalidate the existing 69-case boundary.
  Date/Author: 2026-09-02 / primary coordinator after independent plan review.
- Decision: Map a successful completed outcome to HTTP 200, malformed or rejected input to 400, busy to 409, stopping or shutdown to 503, and scan/create/validation/persistence failure to 500 while preserving the existing bounded outcome body. Keep unsupported methods at 405 and unknown paths at 404 under the current route-precedence contract.
  Rationale: This is the smallest transport projection that preserves the domain outcome consumed by `App`, distinguishes admission conditions, and adds no retry, queue, alternate error model, or framework.
  Date/Author: 2026-09-02 / primary coordinator.
- Decision: Add one focused `client-assets.ts` module that loads the Vite-generated `index.html` and its direct `.js`/`.css` assets from the configured build root into a closed response table at service startup. Serve only `/`, `/index.html`, and those exact table keys; report missing or invalid build output as bounded `client-unavailable` startup failure when a client root is configured.
  Rationale: A closed startup-built map makes readiness truthful and avoids a generic static-file server, traversal resolution, dynamic directory serving, a second Vite process, CORS, or runtime build tooling. One current consumer is sufficient because asset loading is a distinct current responsibility, not a speculative shared abstraction.
  Date/Author: 2026-09-02 / primary coordinator.
- Decision: Extend only `src/client/main.tsx` to provide the same-origin Analyze callback and reuse `App`, every M1-04 component, its admission validator, markup, CSS, copy, focus behavior, and state ownership as-is.
  Rationale: Service calling and composition plumbing are standard-profile nonvisual frontend work under the project workflow. A hook, client API layer, store, router, visual redesign, or component change is not justified by one fixed request.
  Date/Author: 2026-09-02 / primary coordinator with the frontend-quality reuse audit.
- Decision: Treat plan preparation as R0 and omit a Decision Review Contract.
  Rationale: The current task needs no external evidence, candidate ranking, ADR, or owner-controlled architectural choice; Accepted authorities already select the topology and the remaining literals are reversible task-owned implementation details. The owner-controlled public URL remains a later smoke input, not an architecture decision.
  Date/Author: 2026-09-02 / primary coordinator.
- Decision: Record `bbce48b27d4f7528ee73c79eacd8ffc27acc24b0` as historical execution baseline 003 while retaining `a9ccb01f19db386e82c5a00f163c6525b66cb9c0` as historical planning baseline 002.
  Rationale: The intervening commit contained only the already reviewed plan, and the baseline-003 correction made its then-current endpoint executable. The later plan-only commit at `552f57ec93f23cde164e3327fba06ba961fa1286` supersedes that endpoint without invalidating its historical evidence.
  Date/Author: 2026-09-03 / primary coordinator after independent review.
- Decision: Use `552f57ec93f23cde164e3327fba06ba961fa1286` as the sole current execution HEAD and receipt baseline 004.
  Rationale: The second intervening commit again changes only this already reviewed plan. Source, tests, protected inputs, runtime, and generated-state identities remain unchanged, but every future guard receipt and closure check must use the actual current parent commit. This correction makes the plan the exact sole dirty path expected before preflight.
  Date/Author: 2026-09-03 / primary coordinator after the mandatory handoff refresh.
- Decision: Permit one owner-authorized same-target public-smoke correction with production shell A outside the Codex sandbox.
  Rationale: The replacement smoke and a bounded same-environment diagnostic both failed at managed Chromium navigation with `net::ERR_NETWORK_ACCESS_DENIED`, while the identical approved page returned HTTP 200 outside the sandbox. Running the unchanged production command outside that restriction corrects the demonstrated execution environment without changing source, tests, target, mode, build, scanner policy, or the exact smoke contract. The host process cannot read the ignored lease-receipt store, so the exact frozen tuple and scratch gate run inside the sandbox immediately before and after the outside-sandbox start/stop; only PREP plus the unchanged production-start block crosses the boundary, with no intervening mutation. Shell B and evidence validation remain unchanged; another target or retry is not authorized.
  Date/Author: 2026-09-03 / project owner and primary coordinator.

## Outcomes & Retrospective

Current outcome: Both post-closure P2 findings are corrected and independently reviewed. All 335 tests, strict TypeScript, three syntax checks, exact identity/receipt checks and the bounded cleanup passed. M1-05 is Complete again after renewed documentation closure. The following original 324-test/public-smoke account is historical; neither is presented as new correction evidence.

The local-service, scanner, run-contract, and run-repository structural extractions and their verification barriers are complete. The App dead-state cleanup is also complete: the unread state and its two setter calls are gone, while the existing coordinator, public interfaces, rendered behavior, and browser contract remain unchanged. The controlled integration checkpoint is accepted: the production service serves the exact built client from its loopback origin, the browser submits target plus mode through the same-origin POST boundary, the real scanner publishes one validated durable run, and the existing Results surface admits the bounded outcome. API-only construction remains read-only, and the closed asset table rejects linked descendants while isolating stored response bytes. The authorized network-capable public-page smoke now passes with complete three-rule coverage, zero Findings and 20 distinct scanner-review observations. Different final integrated critical review passed with one documentation follow-up, resolved before exact cleanup. All 324 tests, strict TypeScript, syntax checks, and final documentation closure passed. M1-05 is Complete; no retrieval or provider work is implemented.

## Purpose / Big Picture

The completed outcome is one honest walking skeleton: a developer builds and starts one local service, opens its enumerated URL in Chrome or Edge, enters one trusted public HTTPS target, selects Local or Groq, and receives the accepted complete or failed Analyze/Results presentation. The browser sends only target plus mode to its own loopback origin; the service derives the fixed scan request, executes the real exact-three-rule scanner, durably publishes one validated `run.json`, and returns the existing bounded outcome. Scanning invokes no provider.

The completed first slice made the local service easier to read and review while preserving every external import and runtime result. A reviewer now sees `service.ts` as the lifecycle coordinator plus four focused internal modules, with unchanged behavior across the accepted service and backend/scanner regressions.

The accepted integration slice connects those already implemented boundaries without changing the run aggregate, scanner policy, Results presentation, or provider lifecycle. Its controlled test matrix proves populated, valid-zero, native-incomplete, malformed-input, failure, one-operation, persistence/read, sibling-preservation, cleanup, and no-provider behavior. A separate public smoke is observational and cannot replace those controlled checks.

The third slice makes the central unknown-data and persisted-aggregate boundary easier to inspect without weakening it. A reviewer should see a small stable `run-contract.ts` façade, focused internal modules with acyclic dependencies, and the same accepted results across all 30 contract cases and every current consumer.

The fourth slice makes the filesystem repository easier to audit without separating its commit protocol. A reviewer should see a stable `run-repository.ts` entry point, four focused internal modules, the complete publication sequence still locally visible, and unchanged results across all 55 repository cases and every current consumer.

The fifth slice removes misleading dead state from the already purpose-composed client. A reviewer should see the same public `App` boundary, rendered tree, asynchronous ownership, focus behavior, and browser results, with no `pendingAnalysis` declaration or setter remaining.

## Context and Orientation

`src/server/service.ts` is the stable service entry point and owns the one-operation lifecycle around `runScan`. `src/server/domain/run-contract.ts`, `src/server/persistence/run-repository.ts`, and `src/server/scan/scan-page.ts` are stable façades over their accepted focused modules. The scanner exports `prepareScanRequest` and `executeScan`, but no production callback joins them to `runScan`. `src/server/local-service/loopback-api.ts` exposes only health and validated run reads and advertises `scan: false`. `src/client/main.tsx` renders `<App />` without its optional `analyze` callback, so the current production build is intentionally unavailable for analysis even though the accepted M1-04 presentation can render every required outcome under its test harness.

The applicable authority boundary is the M1-05 roadmap row and its Accepted requirements: one trusted public HTTPS target, exact-three-rule complete scanning, visible failure, durable validated aggregate reads, one-operation admission, clean stop, and accessible Analyze/Results behavior. ADR-0015 owns the developer-started loopback topology, ADR-0021 owns the single-file aggregate, ADR-0018 owns the trusted-input scan boundary, and ADR-0024 owns this worker-first behavior-preserving implementation method. The fixed RD-003 evaluation boundary remains unchanged.

The current execution baseline is `M105-INTEGRATION-PLAN-BASELINE-004`, captured from the clean `codex/m1-05-walking-skeleton-integration` worktree at `552f57ec93f23cde164e3327fba06ba961fa1286` immediately before this plan-only correction. Node 24.20.0, npm 11.19.0, TypeScript 7.0.2, React 19.2.8, Vite 8.0.16, Playwright 1.62.1, and axe integration 4.13.0 remain pinned by `package-lock.json`. Fresh strict TypeScript and the 182-case browser-free contract/repository/service baseline pass. Commit comparison proves that only this plan changed from `bbce48b27d4f7528ee73c79eacd8ffc27acc24b0`; source, tests, protected inputs, retained runtime, and generated-state identities remain exact. The earlier `M105-INTEGRATION-PLAN-BASELINE-002` and `M105-INTEGRATION-PLAN-BASELINE-003` are historical evidence only. Mutable browser or filesystem evidence must still be rerun for the integration barrier. No new dependency, runtime, provider, persisted field, schema version, or product state is needed.

## Scope and Non-Goals

The completed local-service structural slice included:

- re-exporting the existing public service types from `src/server/service.ts`;
- effect-free configuration and initial-running-record validation;
- terminal-record matching, failed-record creation, and rejected scan-outcome construction;
- exact HTTP headers, route precedence, status mapping, health/read responses, and CONNECT/upgrade rejection; and
- the unchanged lifecycle coordinator in `service.ts`.

The remaining integration slice includes:

- one exact same-origin `POST /api/runs` JSON boundary from target-plus-mode input to the existing `ScanOutcome`;
- service-owned preparation and real scanner invocation through the existing `runScan` persistence/lifecycle owner;
- closed serving of the already built Vite entry and its direct generated JavaScript/CSS assets from the loopback origin;
- composition-root wiring that supplies `App`'s existing optional Analyze callback without changing M1-04 components or presentation;
- controlled full-path evidence plus one separately authorized public-page smoke; and
- developer instructions for build, retained managed-browser prerequisite, start, manual Chrome/Edge opening, stop, evidence location, and exact task-owned cleanup.

It excludes:

- any rendered component, CSS, visual hierarchy, copy, focus, ARIA, or accepted M1-04 presentation change;
- retrieval, generation, provider invocation or probing, review, comparison, retained-run reopening, Run ID UI, reload restoration, retry/resume/cancel, or automatic browser launch;
- another server, Vite development/preview process, CORS layer, proxy, router, client store, hook, API framework, dependency container, or generic static-file abstraction;
- a request/transfer/DOM/result limit framework, SSRF defense, DNS/address/redirect classification, egress proxy, or hostile-page claim;
- changes to the accepted run schema, scanner/evidence policy, repository format, runtime pins, dependency graph, controlled fixtures, or evaluation manifest;
- a lifecycle class, generic state machine, event bus, context/dependency container, shared persistence transition abstraction, generic HTTP framework, barrel file, or compatibility wrapper;
- any test change outside the new M1-05 integration test and its one purpose-named helper; and
- M2 work, release claims, commit, or push.

The run-contract slice includes only declaration moves into the six named modules, frozen internal policy tuples, the minimum internal exports needed by the next validation layer, and stable type/function re-exports from `run-contract.ts`. It excludes persistence-format changes, new accepted values, error or precedence changes, scanner-policy consolidation, one-file-per-rule decomposition, generic schema/reader abstractions, JSON Schema, validation libraries, UI behavior, and new public helpers.

The run-repository slice includes only declaration moves into four named modules, the minimum internal exports needed by the coordinator, and stable type/callable re-exports from `run-repository.ts`. It excludes persistence-format or API changes, recovery, locking, retries, staging-file sweeping or promotion, a filesystem adapter, repository class, transaction framework, generic path library, dependency, migration, UI behavior, and changes to completed M1-02 authorities or tests.

The App cleanup includes only deletion of the unread `pendingAnalysis` state declaration and its operation-start and settlement setter calls in `src/client/App.tsx`. It excludes module extraction, hooks, reducers, controllers, components, CSS, markup, copy, ARIA, focus rules, admission behavior, public interfaces, test changes, service integration, dependencies, and any M1-04 authority change.

## Plan of Work

### M105-POST-CLOSURE-CORRECTION-08 — complete startup and intake evidence

Completed correction workflow `M1-05-20260903-08`, work slice `M105-POST-CLOSURE-CORRECTION-08`, baseline HEAD `1f92fe89e28fb2e645a97875ee38390d4744a858`, branch `codex/m1-05-walking-skeleton-integration`. This is R0 repository-local reconciliation and S3 implementation verification (closed asset identity and request-stream settlement). No research or architecture decision is required. Dependencies M1-02/03/04 remain Complete; the original M1-05 authority anchors below, ADR-0015/0018/0021/0024, REQ-INST-002, REQ-SEC-005/006, REQ-QUAL-011/012/020, BHV-01/07, and HS-001/004/006 remain Accepted or explicitly Deferred as before. RD-003 manifest and six fixtures are unchanged.

The corrected observable contract is one trustworthy configured-client startup/intake boundary: ordinary unquoted stylesheet attributes must be recognized instead of silently skipped. A local stylesheet is included with exact CSS bytes; an external, missing, malformed, or duplicate reference fails as `client-unavailable` before repository/listener effects. Preserve quoted attributes and Vite's boolean attributes, closed asset keys, linked-ancestor rejection, private response bytes, and API-only construction. The current tokenizer may be extended locally; no general HTML parser package or generic serving layer is needed.

The abort evidence must traverse the actual HTTP intake: observe the server receiving an incomplete body, then destroy the client, then observe the server-side aborted/error settlement with a bounded wait that fails on timeout. Assert no scan/provider call, no run publication or preparation effects observable through the existing service/repository seams, intact siblings, and a responsive service afterward. No sleep-only success, synthetic emitted abort substituted for the real event, or production observability export is permitted. Existing deliverable-failure projection and real shutdown semantics remain unchanged.

Production responsibility and permitted change: only `src/server/local-service/client-assets.ts`, specifically its existing attribute-recognition/startup validation responsibility. Dependency direction stays `service -> client-assets -> node:fs/node:path`; no runtime/interface edge is added. Reuse the existing module and finite response table. A small private extraction inside this file is allowed only if it clarifies current token recognition; no other production path or public type may change. The unchanged HTTP handler remains the production owner of stream settlement. The test worker owns only `tests/walking-skeleton.test.ts` and `tests/helpers/m105-walking-skeleton-harness.ts`; the existing helper owns test-only arrival/event synchronization and restores every interception.

TDD applies. Preflight is read-only and should distinguish the missing stylesheet behavior from existing-but-uncovered abort handling. Primary reconciles PARTIAL if returned. One guarded Red turn may add the coherent failing stylesheet regression matrix and passing abort characterization; only the missing production behavior advances through a separate `code_worker` Green. All accepted tests stay byte-identical during Green. Existing four full-path cases remain; new asset cases may be grouped without skipped/focused/conditional assertions. Use real startup for rejection-before-storage and actual transport for abort evidence; filesystem seams may supplement, not replace, those integration assertions.

Budget: one preflight, one Red, one Green, at most one same-contract correction per role with its terminal attempt-1 parent, one fresh slice S3 review, and a different fresh final integrated S3 review. Stop on repeated decisive failure, two no-diff handoffs, exhausted budget, new actionable finding outside these two fixes, conflicting authority, unknown/changed contract, unexpected path, missing prerequisite, or guard ambiguity. Additional production paths, public smoke, dependency download, provider work, and altered evaluation fixtures require new owner direction. Standard profile only: no rendered component, style, focus, copy, or ARIA change; no frontend-visual capsule.

Baseline evidence: source tree `1CDEF37A13522636497B196180E537B098C2610E4498C355690C61AB55606B75`; test tree `4D8800E7ACF958D5C914AB686CDBD03A3AE2D5965954D7F8DE7B54F01BDE240C`; browser tree `4FDF9490EDBA2FC4662FF487C591F769F682D8031B3E59FC26C0C35AEE8371CC` (332 entries, 318 files, 14 directories, 451,193,922 bytes); manifest tree `3048E8A9F4412437116513F830CF4317C87F5A00C5C3FFD8675474BD173FD4AE`. Package/lock/tsconfig/Vite/index hashes remain the historical protected values. The previous public smoke is preserved only as historical external observation and will not be rerun. Capture new affected-file and test/source-tree hashes after each accepted correction phase; preserve old tuple/receipt blocks rather than editing them to imply fresh evidence.

### M105-CMD-CORRECTION-PREFLIGHT — read-only readiness

Run from the repository root after loading only the first fenced block of `M105-CMD-PREP`. Do not call its historical planning/Git assertions or any old Green/cleanup/closure block: those pin the prior commit and removed artifacts. This restriction applies to every correction command below.

```powershell
if ((& git rev-parse HEAD).Trim() -cne '1f92fe89e28fb2e645a97875ee38390d4744a858') { throw 'Correction HEAD drift' }
if ((& git branch --show-current).Trim() -cne 'codex/m1-05-walking-skeleton-integration') { throw 'Correction branch drift' }
if (@(& git diff --cached --name-only).Count) { throw 'Correction index must remain empty' }
Invoke-M105Command {
  & $m105Node node_modules/typescript/bin/tsc --project tsconfig.json
  if ($LASTEXITCODE -ne 0) { throw 'Correction strict TypeScript failed' }
  & $m105Node --check src/server/local-service/client-assets.ts
  if ($LASTEXITCODE -ne 0) { throw 'Correction production syntax failed' }
  & $m105Node --check tests/walking-skeleton.test.ts
  if ($LASTEXITCODE -ne 0) { throw 'Correction test syntax failed' }
  & $m105Node --check tests/helpers/m105-walking-skeleton-harness.ts
  if ($LASTEXITCODE -ne 0) { throw 'Correction helper syntax failed' }
}
```

### M105-CMD-CORRECTION-SETUP — primary-owned disposable build

Accepted setup on 2026-09-03: primary ran the unchanged README setup block after preflight. Strict TypeScript and the native 32-module build passed. Build identity is 4 entries / 3 files / 1 directory / 225,483 bytes / `1D1198338F4C1E267737F5F9D8F5540854A33A7C7E52BFC3EDC36C35164A503F`; retained browser identity is unchanged and all three ordinary scratch roots are empty. The controlled tests may reuse this exact build; no public scan occurred.

After accepted preflight and before Red, primary runs the existing README build block: verify/create only the three absent ordinary scratch roots, strict TypeScript, and one native Vite build with output absent at entry. Retain the exact build identity through focused and complete verification and reviews. No package acquisition or browser setup is needed. Tests may create/remove only their exact owned synthetic descendants and must settle all browser/listener/interception state. Shared runtime/dependencies/caches stay unchanged.

### M105-CMD-CORRECTION-FOCUSED — corrected integration test boundary

Accepted Red identities: `tests/walking-skeleton.test.ts` = `F51AC6CF9652E8B5094EFB83760D55DF7DD55A4F5A5D3A77039D6739A81F9729`; helper = `C58B1428D96452FD3CE131C710CD955DA5895BAB3B6450D3956F5ED3690C4001`; whole test tree = `66AE699D6A4984048F97FE057B794BD481312C6FF3FCE25E636EF076FC33EAA6`. Source, build, browser, scratch, siblings, caches, HEAD and index retain their verified state. Green must execute all 15 tests unchanged; downstream positive assertions not reached during Red become mandatory Green evidence.

Run once per Red/Green evidence phase after PREP. A Red run must exit nonzero only for the intended stylesheet regression; abort characterization must pass. Record the native test exit code before running the final scratch checks. Green requires every case to pass, followed by strict TypeScript. The test-count change, names, and identities are recorded on acceptance.

```powershell
foreach ($m105Scratch in @($m105ScanTemp,$m105UiTemp,$m105IntegrationTemp)) { Assert-M105EmptyDirectory $m105Scratch }
Invoke-M105Command {
  & $m105Node --test --test-timeout=120000 tests/walking-skeleton.test.ts
  $script:m105CorrectionTestExit = $LASTEXITCODE
} $m105ScanTemp
foreach ($m105Scratch in @($m105ScanTemp,$m105UiTemp,$m105IntegrationTemp)) { Assert-M105EmptyDirectory $m105Scratch }
if ($m105CorrectionTestExit -ne 0) { throw ('Correction focused tests exit ' + $m105CorrectionTestExit) }
```

### M105-CMD-CORRECTION-COMPLETE — replacement closure evidence

Accepted Green source SHA-256: `client-assets.ts` = `9DE67BA8E09C2D6FF12B999A5D57E82D693C1C36844A18080C4B6F9932D005CD`; whole source = 52 entries / 40 files / 12 directories / 156,106 bytes / `168E3847A44D4AEB3A9E142991ED27363FFBF0ACD434D3CC96B3718FDF3F5848`. Accepted test tree = 11 / 10 / 1 / 352,774 / `66AE699D6A4984048F97FE057B794BD481312C6FF3FCE25E636EF076FC33EAA6`. The Red receipt file hashes to `19D401784D26E9BAA844E9C94CD1F048F160D6AD6D47DBC9B85671B33F7B29C4`; Green receipt file to `131B0982586737E8E5B6117CFAF244A7A2BF3CA5132E88801EFD18AD340A9323`. These new immutable receipts belong to HEAD `1f92fe8`; historical `552f57ec` receipt helpers must not be used for them.

After Green and test-relevance/structural audit, run the README's exact sequential seven-file suite against the retained build, plus the correction preflight strict/syntax block. Recheck source/test/protected/evaluation/runtime identities, empty scratch and siblings, absent Vite caches, no active lease, unchanged HEAD/branch and empty index. Record the new total honestly. The slice reviewer may reuse that exact frozen evidence; final reviewer must be a different fresh instance and inspect cross-slice interaction, both findings, and closure. Do not represent the old 324-case record or prior public-page result as evidence of these corrected paths.

After both reviews pass and any follow-up is resolved, primary removes only the exact identity-checked correction build and three verified-empty scratch roots; no run deletion is needed because controlled tests own their run descendants and siblings began empty. Reconcile current-status owners, archive this same plan, repair navigation, and run proportional Markdown/fragment/PowerShell/UTF-8/whitespace plus new-baseline identity/status/residue checks after the final documentation mutation. Do not execute the old post-archive validator pinned to `552f57ec` or its old three-file required-change set. Preserve the retained browser and historical receipts. M1-05 remains In progress until renewed verification and documentation closure pass.


### M105-LOCAL-SERVICE-MODULE-REFACTOR-01 — conservative service extraction

The observable contract is exact behavior preservation. `startLocalService` and every existing type remain importable from `src/server/service.ts`. Configuration and malformed scan input remain effect free. A scan reserves admission before collaborator execution. Reads remain synchronous owners of the single-operation boundary. `whenStopping` resolves before abort, repeated `stop()` calls retain one promise, deadline expiry suppresses late writes, cleanup uncertainty closes admission, runtime listener errors retain precedence, and terminal results cannot mutate immutable run context. HTTP headers, routes, response bodies, status codes, CONNECT rejection, and upgrade rejection remain byte-for-byte equivalent at the JSON value boundary.

TDD is applicable because application source changes. The planned preflight classification is `EXISTING_AND_COVERED`, subject to an independent read-only `test_worker` report. The focused characterization command is:

    node --test --test-timeout=120000 tests/local-service.test.ts

Expected result: 69 passing cases, zero failures, skips, todos, or cancellations, with owned test resources cleaned up. No test write follows an accepted `EXISTING_AND_COVERED` result.

The standard-profile Green/Refactor uses one `code_worker` turn under a lease allowing only:

- `src/server/service.ts`
- `src/server/local-service/contracts.ts`
- `src/server/local-service/input-validation.ts`
- `src/server/local-service/scan-run-records.ts`
- `src/server/local-service/loopback-api.ts`

The accepted test file and all other source, documentation, dependency, fixture, executable configuration, and Git metadata are forbidden. One same-contract correction is available only if attempt 1 stops on one bounded implementation defect without changing the authority, paths, or behavioral contract. Two identical decisive failures, two no-diff handoffs, an unexpected path, a test change, an API difference, or a need to split lifecycle state stops the slice.

Responsibility and cohesion contract:

| Production owner | Responsibility after the slice | Fit and dependency direction |
| --- | --- | --- |
| `src/server/service.ts` | Stable public entry point; repository opening; admission, reads, scan execution, stop, deadlines, cleanup uncertainty, listener startup/error handling, and shared state | Retained lifecycle coordinator. Imports focused stateless helpers and re-exports contracts. |
| `src/server/local-service/contracts.ts` | Existing public result unions and service/options interfaces | Bounded creation. Type-only dependencies point to domain and persistence contracts; `service.ts` re-exports it. |
| `src/server/local-service/input-validation.ts` | Safe own-data inspection, normalized service configuration, and validated initial running-record preparation | Local extraction. May depend on domain validation and contract input types; causes no storage or network effect. |
| `src/server/local-service/scan-run-records.ts` | Terminal-result identity matching, immutable context checks, authored failed records, and rejected scan outcomes | Local extraction. Depends on domain/persistence contracts and service result types; owns no lifecycle state. |
| `src/server/local-service/loopback-api.ts` | Default-`node:http` request listener, headers, route precedence, health/read status mapping, CONNECT and upgrade rejection | Local extraction. Receives narrow callbacks for stopping, busy, and reads; owns no repository or lifecycle transition. |

Permitted local structural refactor is limited to function moves, imports/exports, and the smallest callback interface needed by `loopback-api.ts`. Cohesion disposition after Green must be `REFACTORED` or the worker must return `RECONCILE` and stop.

Risk is `S3` because concurrency, shutdown, cleanup, persistence ordering, and listener-error semantics are critical even though the intended change is structural. A fresh `critical_reviewer` must inspect the actual diff, dependency direction, public API, default HTTP import, and decisive validation evidence.

The complete backend/scanner command is:

    node --test --test-timeout=120000 tests/run-contract.test.ts tests/run-repository.test.ts tests/local-service.test.ts tests/scan-normalization.test.ts tests/scan-page.test.ts

Expected result: 290 passing cases. Strict typechecking uses `node node_modules/typescript/bin/tsc --project tsconfig.json`. Syntax verification uses `node --check` on `service.ts` and every `.ts` file in `src/server/local-service/`. The later M1-05 integration checkpoint, after HTTP scan wiring exists, must also run the complete 30-case browser suite and the native Vite production build; those results are not evidence for this structural slice or M1-05 completion.

### M105-SCANNER-MODULE-REFACTOR-02 — scanner composition extraction

The observable contract is exact behavior preservation. `prepareScanRequest`, `captureNativeScan`, and `executeScan` remain importable from `src/server/scan/scan-page.ts`; `NormalizationResult` and `normalizeNativeScan` remain importable from `src/server/scan/normalize-scan.ts`. Canonical HTTPS and generation-mode validation, validation and failure precedence, exact rules and native bucket order, provider context, report metadata, evidence minimization, UUID creation, timeouts, browser options, response records, and cleanup results remain unchanged.

`executeScan` retains browser lifecycle, scratch admission, report-metadata acceptance, operation deadline, abort handling, late resource registration, ordered cleanup, terminal chronology, and completed/failed result construction. Its local `track`, `bounded`, `close`, `active`, and `operation` state must not move. `normalizeNativeScan` retains native envelope and option validation, error precedence, exact coverage reconciliation, UUID creation, native ordering, and final `Finding`/`ScannerReviewObservation` assembly.

TDD is applicable because application source changes. The planned preflight classification is `EXISTING_AND_COVERED`, subject to an independent read-only `test_worker` report. The focused characterization command is:

    node --test --test-timeout=120000 tests/scan-normalization.test.ts tests/scan-page.test.ts

Run it with `PLAYWRIGHT_BROWSERS_PATH` set to the retained `m104-browser-runtime/browsers` directory, `PLAYWRIGHT_SKIP_BROWSER_GC=1`, `PLAYWRIGHT_DOWNLOAD_CONNECTION_TIMEOUT=30000`, `TEMP` and `TMP` set to the repository-owned empty `temp/m103-scan` directory, and `NODE_DISABLE_COMPILE_CACHE=1`. Expected result: 88 passing cases—20 normalization and 68 scan execution—with zero failures, cancellations, skips, or todos and empty post-run scratch. No test write follows an accepted `EXISTING_AND_COVERED` result.

The standard-profile Green/Refactor uses one `code_worker` turn under a lease allowing only:

- `src/server/scan/scan-page.ts`
- `src/server/scan/scan-profile.ts`
- `src/server/scan/scan-request.ts`
- `src/server/scan/native-scan-capture.ts`
- `src/server/scan/normalize-scan.ts`
- `src/server/scan/normalization/native-value-reader.ts`
- `src/server/scan/normalization/native-rule-evidence.ts`

The accepted tests and all other source, documentation, dependency, fixture, executable configuration, and Git metadata are forbidden. One same-contract correction is available only if attempt 1 stops on one bounded implementation defect without changing the authority, paths, or behavioral contract. Two identical decisive failures, two no-diff handoffs, an unexpected path, a test change, an API difference, reporter serialization that depends on a Node closure, or movement of lifecycle state stops the slice.

Responsibility and cohesion contract:

| Production owner | Responsibility after the slice | Fit and dependency direction |
| --- | --- | --- |
| `src/server/scan/scan-profile.ts` | Exact rule and native-bucket order, scanner/reporter identifiers, fresh initial scan context, and fresh axe options | Bounded stateless extraction. Exposes fresh values to request, capture, and normalization owners without lifecycle state. |
| `src/server/scan/scan-request.ts` | Canonical public-HTTPS URL validation, generation-mode validation, provider-context preparation, and `prepareScanRequest` | Focused preparation boundary. Depends on domain contracts and scan profile; causes no browser, storage, or network effect. |
| `src/server/scan/native-scan-capture.ts` | `registerReporter` and `captureNativeScan` | Focused capture boundary. All reporter helpers remain nested in `registerReporter` so serialization into the analyzed document has no Node closure. |
| `src/server/scan/normalization/native-value-reader.ts` | Safe unknown-value inspection, exact own-property reading, dense arrays, categorical values, and available/unavailable fact construction | Low-level stateless normalization dependency. Owns no rule policy, ordering, UUID, or final collection state. |
| `src/server/scan/normalization/native-rule-evidence.ts` | Locator, native check-group, image, label, contrast, incomplete-reason, and per-node evidence projection | Rule-specific projection. Depends only on domain evidence shapes and native-value readers; owns no collection ordering or identifiers. |
| `src/server/scan/normalize-scan.ts` | Stable normalization entry point; envelope/options validation, failure precedence, coverage reconciliation, UUID creation, native ordering, and final collection assembly | Retained normalization coordinator. Imports profile, readers, and rule projections. |
| `src/server/scan/scan-page.ts` | Stable scan entry point and re-export boundary; complete `executeScan` browser/deadline/abort/cleanup lifecycle | Retained lifecycle coordinator. Imports focused preparation, profile, capture, and normalization functions. |

Permitted local structural refactor is limited to declaration moves, intention-revealing internal exports, imports/re-exports, and the smallest type movement needed by those exact responsibilities. Do not add a lifecycle class, generic parser, adapter, dependency container, barrel file, dependency, or public helper. Cohesion disposition after Green must be `REFACTORED` or the worker must return `RECONCILE` and stop.

Risk is `S3` because native evidence privacy, browser cancellation, late acquisition, cleanup truthfulness, and terminal precedence are critical even though the intended change is structural. A fresh `critical_reviewer` must inspect reporter serialization self-containment, exact native evidence projection and minimization, validation precedence, browser lifecycle placement, late settlement, cleanup/failure truthfulness, public compatibility, dependency direction, and decisive validation evidence.

Post-Green validation includes the complete normalization suite, complete scan-page suite under the stated M1-03 environment, strict TypeScript checking, and `node --check` for all seven resulting scan modules. The complete backend/scanner command remains:

    node --test --test-timeout=120000 tests/run-contract.test.ts tests/run-repository.test.ts tests/local-service.test.ts tests/scan-normalization.test.ts tests/scan-page.test.ts

Expected result: 290 passing cases. Verification must also show empty scanner scratch, unchanged retained downloads, absent generated client output, unchanged fixtures, manifests, dependencies, and executable configuration, and stable public imports. Browser UI and production-build verification remain deferred to the real HTTP integration checkpoint because this slice changes no UI or HTTP integration behavior.

### M105-RUN-CONTRACT-MODULE-REFACTOR-03 — aggregate-contract validation extraction

The observable contract is exact behavior preservation. `Fact`, `ProviderContext`, `Finding`, `ScannerReviewObservation`, `ScanResult`, `PageAnalysisRun`, and `ValidationResult` remain type-importable from `src/server/domain/run-contract.ts`; its only runtime exports remain `validateRun` and `validateScan`. Accepted values, exact-key rules, validation and failure precedence, descriptor-only inspection, accessor avoidance, ordinary-object and dense-array requirements, bounded errors, detachment, freezing, collection ordering, unique finding IDs, coverage reconciliation, chronology, cleanup constraints, and failure-category relationships remain unchanged.

TDD is applicable because application source changes. The planned preflight classification is `EXISTING_AND_COVERED`, subject to an independent read-only `test_worker` report. The focused characterization command is:

    node --test --test-timeout=120000 tests/run-contract.test.ts

Expected result: the 30 static contract cases execute 58 passing TAP tests with zero failures, cancellations, skips, or todos. No test write follows an accepted `EXISTING_AND_COVERED` result.

The standard-profile Green/Refactor uses one `code_worker` turn under a lease allowing only:

- `src/server/domain/run-contract.ts`
- `src/server/domain/run-contract/run-types.ts`
- `src/server/domain/run-contract/run-policy.ts`
- `src/server/domain/run-contract/contract-value-reader.ts`
- `src/server/domain/run-contract/finding-validation.ts`
- `src/server/domain/run-contract/scan-validation.ts`
- `src/server/domain/run-contract/run-validation.ts`

The accepted test and all other source, documentation, dependency, fixture, executable configuration, generated output, and Git metadata are forbidden. One same-contract correction is available only if attempt 1 stops on one bounded implementation defect without changing the authority, paths, or behavioral contract. An unexpected path, test change, public-export difference, accepted-value difference, validation-precedence change, mutable exported policy tuple, cycle, or attempt to share the scanner native reader stops the slice.

Responsibility and cohesion contract:

| Production owner | Responsibility after the slice | Fit and dependency direction |
| --- | --- | --- |
| `src/server/domain/run-contract.ts` | Stable public façade for the seven existing public types and two validator functions | Retained entry point. Re-exports no internal reader or policy value. |
| `run-types.ts` | Run, scan, finding, evidence, fact, provider, coverage, and validation-result types | Type-model extraction. Depends only on policy-derived types where necessary. |
| `run-policy.ts` | Frozen exact rules, failure categories, attribute states, input types, message keys, and check identifiers plus their derived literal types | Fixed contract policy. Has no application dependency and exposes no mutable backing value. |
| `contract-value-reader.ts` | Descriptor-safe object inspection, exact keys, dense arrays, primitive values, IDs, times, HTTPS URLs, locales, facts, and unavailable values | Lowest validation layer. Depends on model/policy only and never invokes accessors. |
| `finding-validation.ts` | Locator, check group, rule-specific evidence, Finding, and ScannerReviewObservation validation | Evidence layer. Depends on policy, model, and value readers; owns no collection or parent lifecycle state. |
| `scan-validation.ts` | Scan context, complete-context assertion, coverage reconciliation, unique IDs, collection ordering, internal `readScan`, and public `validateScan` | Scan coordinator. Depends downward on finding validation and readers; exports only required internal seams to run validation. |
| `run-validation.ts` | Provider context, chronology, status-specific key sets, cleanup/failure relationships, internal `readRun`, and public `validateRun` | Parent-run coordinator. Depends on scan validation and lower layers; catches all inspection failures at the public boundary. |

Permitted local structural refactor is limited to declaration moves, type-only imports, frozen policy-tuple construction, intention-revealing internal exports, and stable façade re-exports. Do not introduce a schema framework, generic parser, class, dependency container, per-rule module, scanner-reader reuse, compatibility wrapper, or index barrel. Cohesion disposition after Green must be `REFACTORED` or the worker must return `RECONCILE` and stop.

Risk is `S3` because the module validates unknown persisted data, enforces privacy allowlists and identity/collection integrity, suppresses hostile inspection errors, and protects lifecycle chronology. A fresh `critical_reviewer` must inspect accessor/prototype/key/array safety, frozen policy values, exact evidence allowlists, validation precedence, detachment/freezing, coverage and identity rules, lifecycle constraints, public compatibility, dependency direction, and decisive evidence.

Post-Green validation includes the exact 30-case contract suite, strict TypeScript, syntax checks for the façade and all six modules, the complete 290-case backend/scanner regression under the required scanner environment, and `npm run build` because browser admission imports `validateRun`. Verification must show unchanged tests, fixtures, dependencies, package metadata and TypeScript configuration; exact stable public exports; empty scanner scratch; and removal of generated `dist/client`, repository-root `.vite-temp`, and `node_modules/.vite-temp` output. The complete 30-case browser suite remains deferred to the real HTTP integration checkpoint because this structural slice changes no rendered or interaction behavior.

### M105-RUN-REPOSITORY-MODULE-REFACTOR-04 — persistence responsibility extraction

The observable contract is exact behavior preservation. `RunningRun`, `CompletedRun`, `FailedRun`, `TerminalRun`, `StoreError`, `StoreResult`, `RunRepository`, and `openRunRepository` remain importable from `src/server/persistence/run-repository.ts`. Synchronous results, validation and error precedence, Windows root and identifier admission, exact spelling, topology and identity checks, aggregate serialization, detached immutable reads, transition rules, staged publication, commit-point semantics, canonical-byte preservation, and cleanup truthfulness remain unchanged.

TDD is applicable because application source changes. The planned preflight classification is `EXISTING_AND_COVERED`, subject to an independent read-only `test_worker` report. The focused characterization command is:

    node --test --test-timeout=120000 tests/run-repository.test.ts

Expected result: 55 passing cases with zero failures, cancellations, skips, or todos and no retained test-owned filesystem residue. No test write follows an accepted `EXISTING_AND_COVERED` result.

The standard-profile Green/Refactor uses one `code_worker` turn under a lease allowing only:

- `src/server/persistence/run-repository.ts`
- `src/server/persistence/run-repository/contracts.ts`
- `src/server/persistence/run-repository/store-errors.ts`
- `src/server/persistence/run-repository/windows-run-paths.ts`
- `src/server/persistence/run-repository/run-transition.ts`

The accepted test and all other source, documentation, dependency, fixture, executable configuration, generated output, and Git metadata are forbidden. One same-contract correction is available only if attempt 1 stops on one bounded implementation defect without changing the authority, paths, or behavioral contract. An unexpected path, test change, public-export difference, error-precedence change, captured named filesystem callable, publication-state extraction, cleanup difference, or need for another path stops the slice.

Responsibility and cohesion contract:

| Production owner | Responsibility after the slice | Fit and dependency direction |
| --- | --- | --- |
| `src/server/persistence/run-repository.ts` | Stable public entry point; captured root identity, root/run/canonical revalidation, validated current reads, complete staged publication and cleanup, and `create`/`read`/`finish` coordination | Retained integrity coordinator. Imports the four focused modules and re-exports public contracts; all publication state remains local. |
| `run-repository/contracts.ts` | Existing public run aliases, closed store errors/results, and repository interface | Type-only extraction. Depends on the stable domain contract; external consumers continue through the façade. |
| `run-repository/store-errors.ts` | Internal bounded exception, rejection, failure-result mapping, and native error-code inspection | Lowest operational-error layer. Depends only on public store result/error types and exposes no raw exception content. |
| `run-repository/windows-run-paths.ts` | Run-ID and reserved-name policy, absolute-root validation/establishment, case-insensitive entry discovery, exact-name enforcement, ordinary file/directory checks, real-path comparison, and `dev`/`ino` identity comparison | Focused filesystem-safety layer. Retains the default `node:fs` object so existing fault interception remains effective. |
| `run-repository/run-transition.ts` | Pure compatibility validation from a persisted running record to a proposed terminal record | Focused domain-transition layer. Depends on public run aliases and bounded rejection; owns no filesystem or repository state. |

Keep `checkRoot`, `checkRun`, `checkCanonical`, `readCurrent`, the complete `publish` transaction, directory rollback, and the three repository methods inside `openRunRepository`. Permitted local refactor is limited to declaration moves, intention-revealing internal exports, type-only imports, and stable façade re-exports. Do not introduce a filesystem adapter, repository class, transaction framework, locking, retries, recovery or staging sweep, generic path library, new dependency, compatibility wrapper, or barrel. Cohesion disposition after Green must be `REFACTORED` or the worker must return `RECONCILE` and stop.

Risk is `S3` because path identity, reparse/hard-link rejection, write atomicity, process interruption, cleanup ownership, and no-partial-publication are critical even though the intended change is structural. A fresh `critical_reviewer` must inspect default filesystem-object use, exact Windows admission, repeated topology checks, descriptor/path identity, short-write and close behavior, rename as the final filesystem operation, failure and cleanup precedence, public compatibility, dependency direction, and decisive evidence.

Post-Green validation includes the exact 55-case repository suite, strict TypeScript, syntax checks for all five resulting modules, stable runtime/type export and external-consumer inspection, and the complete 290-case backend/scanner regression under the required scanner environment. Verification must show unchanged tests, fixtures, dependencies, package metadata, TypeScript configuration, persisted format, retained browser runtime, and absent generated output; scanner scratch must be empty and removed after use. Browser UI and production-build verification remain deferred to the real HTTP integration checkpoint because this slice changes no UI, browser runtime, or client import.

### M105-APP-DEAD-STATE-CLEANUP-05 — retain the App coordinator

The observable contract is exact behavior preservation. `App`, `AppProps`, and the `AnalyzeIntent` type re-export remain unchanged. URL/mode validation, synchronous reservation, busy presentation, stale/unmounted settlement guards, response admission, completed-result retention, failed-run presentation, selection identity, announcements, Results-heading node stability, and conditional focus restoration remain identical. The rendered DOM, text, IDs, classes, semantics, ARIA relationships, CSS, and client/server boundaries do not change.

TDD is applicable because application source changes. Independent read-only `test_worker` preflight must classify the unchanged 30-case `tests/target-results-ui.test.ts` boundary. `EXISTING_AND_COVERED` is expected; any other outcome stops for reconciliation, and no implementation-shaped or dead-state-layout assertion may be added.

The standard nonvisual Green uses one `code_worker` turn under a lease allowing only `src/client/App.tsx`. The worker removes the `pendingAnalysis` state declaration, `setPendingAnalysis(intent)`, and `setPendingAnalysis(null)`, and makes no other source or test change. The accepted cohesion disposition is `RETAINED`; any need for a new path, abstraction, behavior correction, test change, or public-interface adjustment stops the slice.

Risk is `S1`: this is ordinary bounded application cleanup with no rendered or cross-boundary behavior change. A fresh `milestone_reviewer` must confirm exact three-line removal, unchanged public interfaces and lifecycle ownership, absence of the dead symbols, accepted behavior evidence, generated-output cleanup, and documentation truthfulness.

Post-Green validation runs the unchanged 30 browser cases under the retained pinned Chromium and isolated UI scratch environment, strict TypeScript, the native production build, and the complete sequential 290 backend/scanner plus 30 UI regression. The harness's deterministic client inventory must include the changed App identity without harness modification. After verification, remove only verified owned `dist/client`, UI/scanner scratch, repository-root `.vite-temp`, and `node_modules/.vite-temp`; prove both Vite cache locations absent and the pinned browser runtime unchanged. Existing human Chrome 200% and Narrator evidence remains applicable because no rendered node, text, relationship, focus rule, or style changes.

### M105-WALKING-SKELETON-INTEGRATION-06 — one same-origin Analyze-to-disk path

After this slice, the production entry point serves the built React client and its closed generated asset set from the enumerated loopback origin. The ready client posts exactly one normalized target and selected mode to `POST /api/runs`. The service validates that boundary, derives the fixed provider/model plus scan context through `prepareScanRequest`, reserves the existing single operation, calls `executeScan`, publishes the resulting terminal aggregate through the existing repository, and returns the existing `ScanOutcome`. The same response is admitted by `App`; no browser code receives filesystem, managed-browser, scanner, or provider authority. API-only callers remain read-only and do not acquire this production capability implicitly.

The binding authority anchors for this slice are the M1-05 [Objective, Expected output, User-visible outcome, and Verification](../../DEVELOPMENT_ROADMAP.md#m1-05--integrate-and-verify-the-walking-skeleton); `REQ-AUTH-007` and `REQ-AUTH-008`, `REQ-SCAN-001` and `REQ-SCAN-005`–`REQ-SCAN-007`, plus `REQ-EVID-003` and `REQ-EVID-007`–`REQ-EVID-011` in [Target authorization, scanning, evidence, and provenance](../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#target-authorization-and-scanning); `REQ-LLM-002`, `REQ-LLM-003`, and `REQ-LLM-021` in [LLM provider selection and generation execution](../../requirements/generation-provider-and-model-lifecycle/GENERATION_PROVIDER_EXECUTION.md#llm-provider-selection-and-generation-execution); `REQ-INST-002` and `REQ-INST-004` in [MVP startup and model lifecycle](../../requirements/generation-provider-and-model-lifecycle/INSTALLATION_AND_MODEL_LIFECYCLE.md#mvp-startup-model-setup-and-deferred-packaging); `REQ-SEC-005` and `REQ-SEC-006` in [Privacy and security](../../requirements/quality-security-and-operations/PRIVACY_AND_SECURITY.md#privacy-and-security); `REQ-UX-002`–`REQ-UX-005` and `REQ-UX-010`–`REQ-UX-014` in [Evidence-oriented interface and export](../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#evidence-oriented-interface-and-export); and `REQ-QUAL-011`, `REQ-QUAL-012`, and `REQ-QUAL-020` in [Reliability, reproducibility, and operations](../../requirements/quality-security-and-operations/RELIABILITY_REPRODUCIBILITY_AND_OPERATIONS.md#reliability-reproducibility-and-operations). The scenario anchors are `BHV-01`/`SPEC-001`, `BHV-07`/`SPEC-007`, `HS-001`, `HS-004`, and `HS-006` in [`SPEC.feature`](../../specs/SPEC.feature) and [`HARD_SPEC.feature`](../../specs/HARD_SPEC.feature). ADR-0015, ADR-0018, ADR-0021, and ADR-0024 remain controlling, together with [OD-021](../../requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-021--trusted-operator-url-boundary-for-the-portfolio-mvp), [OD-024](../../requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-024--minimum-complete-mvp-behavior-contracts), [OD-026](../../requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-026--defer-user-facing-retained-run-reopening), and [OD-027](../../requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-027--simplify-analysis-and-results-presentation).

The HTTP literal is fixed for this task. Only a configured-client service has this route. It accepts exact `POST /api/runs` with a `Content-Type` value which, after outer whitespace trimming and ASCII case folding, is exactly `application/json`; parameters, comma-separated values, missing values, and alternatives are rejected. The JSON value must be an ordinary parsed object with exactly `requestedUrl` and `mode`, and `mode` is only `local` or `groq`. No quantitative body ceiling is invented because the Accepted trusted-loopback MVP explicitly defers exhaustive request bounds; this is not a hostile-request hardening claim. A request-stream `aborted` or `error` event must settle once, must not prepare, create, persist, or scan a run, and returns the existing invalid-request outcome at 400 only if the response remains writable; otherwise the connection is closed without an unbounded diagnostic.

The service does not accept client-supplied run IDs, revisions, provider/model strings, scan context, scanner options, evidence, file paths, headers, or destinations. Successful completion returns 200; invalid media type, request stream, JSON, keys, URL, embedded credentials, or mode returns the existing rejected `ScanOutcome` at 400; busy returns 409; stopping or shutdown returns 503; and create, scan, result-validation, or initial-persistence failure returns 500. API-only construction preserves the current health value `capabilities.scan: false` and rejects every POST at 405 without consuming its body. Configured-client construction reports `scan: true`. For both modes, all responses retain `Cache-Control: no-store` and `X-Content-Type-Options: nosniff`; API responses retain `application/json;charset=utf-8`. Method selection retains precedence over query checking for unsupported methods. For GET, a literal query or fragment is 400, health precedes the stopping gate, the stopping gate precedes read/static/unknown dispatch, exact API routes precede client routes, and unknown paths remain 404. CONNECT and upgrade sockets remain rejected.

An own `clientRoot` field must be a non-empty absolute string; an accessor, explicit `undefined`, relative path, or extra configuration key is `invalid-configuration`. If the field is absent, startup follows the existing API-only path with no client filesystem read. If present, startup validates and loads the client before opening the run repository or listener. The configured root, `index.html`, and every selected asset must resolve to their literal absolute locations through ordinary non-link ancestors; the root must be an ordinary directory, and every entry must be an ordinary file whose real path remains beneath that root. Startup reads only `index.html`, the one or more root-absolute module-script `src` references matching `/assets/<single-basename>.js`, and any root-absolute stylesheet `href` references matching `/assets/<single-basename>.css`; duplicate, encoded, query-bearing, fragment-bearing, nested, escaping, external, missing, unreadable, linked, non-file, or other script/stylesheet references fail as `client-unavailable`. At least one JavaScript entry is required. The loader reads those finite bytes once and returns a closed immutable table for `/`, `/index.html`, and the exact asset keys, with `text/html;charset=utf-8`, `text/javascript;charset=utf-8`, or `text/css;charset=utf-8` as applicable. No request-derived filesystem join, directory listing, fallback file, SPA rewrite, or runtime reload is permitted. `src/server/main.ts` supplies the absolute repository `dist/client` root, so the production command requires a successful build and reports `client-unavailable` rather than readiness for absent or invalid output.

TDD is applicable because the slice adds missing application behavior. One persistent `test_worker` first performs read-only preflight against the exact current source, existing 182 browser-free cases, 88 scanner cases, and 30 UI cases without a repository edit. The primary—not the test worker—first runs the explicitly recorded no-lease `M105-CMD-PREFLIGHT-SETUP` to create the three empty ignored scratch roots. The test worker may then run only `M105-CMD-PREFLIGHT`; those commands may use the owned roots and managed browser but must leave zero net generated residue. It must not create setup paths, build, start the production listener, or write a tracked file. `MISSING` is expected only after it cites the absent production callback, route, configured-client composition, and static-serving behavior plus the existing seams that will carry them; `PARTIAL` may advance only after the primary records the exact already-covered versus missing boundary. `EXISTING_AND_COVERED`, `EXISTING_BUT_UNCOVERED`, `REGRESSION`, `CONFLICTING`, or `UNKNOWN` stops for reconciliation. Search absence alone is not accepted evidence.

The Red lease permits only `tests/walking-skeleton.test.ts` and `tests/helpers/m105-walking-skeleton-harness.ts`. The test file owns behavior-oriented full-path cases; the helper may own only repeated test-side service/UI-browser/managed-scan interception, isolated run-root creation under exact `temp/m105-integration`, request observation, and exact task-owned teardown. Build creation belongs to the frozen command, not the helper. The helper must not duplicate a production validator or normalize a scanner result. It may embed only the minimum project-owned HTML needed for the controlled page; no new fixture or captured external content is created.

The controlled lanes are exact and sequential:

| Lane | Required entry and observable result |
| --- | --- |
| Local populated/incomplete | In the actually served production client, verify no mode is selected; an invalid Analyze attempt shows only the accepted validation and sends no request. Then select Local and submit the target through the browser form. The same-origin fetch must cross exact HTTP intake, service preparation/reservation, real `executeScan` with an intercepted project-owned `https://m105.test/` page, atomic publication, response admission, and the existing Results UI. Assert multiple Findings, at least one distinct native incomplete observation, validated HTTP/disk reread, exact run identity, and zero provider request. |
| Groq valid zero | Submit Groq through the same served browser form and the same complete production path. The exact three-rule native result has zero Findings, complete coverage, no incomplete observation, durable validated publication, truthful zero presentation, and zero provider request or probe. |
| Visible scan failure | Submit one target through the same served browser form; fail navigation inside the real `executeScan` path, persist the bounded failed terminal record when required by the existing service contract, admit the response, and show the existing failure presentation without presenting zero or partial success. |
| Direct transport/lifecycle | Exercise configured health/static and asset closure, exact/invalid content type, malformed JSON, wrong keys, aborted/error request settlement, busy contention, stopping/clean stop, invalid/missing client build startup, validated API read, exact disposable run-directory deletion, and sibling preservation directly at their owning HTTP/service/filesystem boundaries. |
| Existing presentation regression | The unchanged 30-case `tests/target-results-ui.test.ts` remains the authority for both modes, initially unselected state, validation-only feedback, known Local/Groq configuration messages that do not probe or block scanning, response hardening, complete evidence presentation, keyboard operation, announcements, focus retention/replacement, zoom, and default axe checks. The new integration file must not duplicate those permutations. |

The expected Red is the new focused command failing on the current production's missing configured-client static and `POST /api/runs` capabilities—not a broken runtime, wrong import, unconditional assertion, skipped case, unrelated existing failure, or a test that calls the service method instead of traversing each browser lane above.

The separate Green lease uses one `code_worker` and forbids both accepted test paths. Its exact allowed production paths are:

| Path | Current primary responsibility | Slice addition and fit |
| --- | --- | --- |
| `src/server/service.ts` | Public service entry and one-operation lifecycle/persistence coordinator | Reuse the existing reservation owner to prepare one admitted request and call the real scanner; scanner execution must not move into HTTP code. |
| `src/server/main.ts` | Developer-started composition root and bounded lifecycle diagnostics | Supply the fixed built-client root; retain manual browser opening, environment validation, stop handling, and content-safe diagnostics. |
| `src/server/local-service/contracts.ts` | Public local-service types | Add only optional `clientRoot` configuration and bounded `client-unavailable` startup result needed by the current production composition. |
| `src/server/local-service/input-validation.ts` | Descriptor-safe service and run-input preparation | Add exact target-plus-mode admission and delegate fixed scan-policy construction to `prepareScanRequest`; do not create another URL or provider policy. |
| `src/server/local-service/loopback-api.ts` | Loopback HTTP routing, headers, transport parsing, and callback dispatch | Add the one POST route, bounded status projection, and exact closed client-response dispatch while retaining current route and socket precedence. |
| `src/server/local-service/client-assets.ts` | Planned closed startup loading of the current built client | `CREATE` one focused module for exact entry/direct-asset loading and MIME-bearing response-table construction; it is not a generic file server or future packaging layer. |
| `src/client/main.tsx` | Browser composition root | Extend the existing root with one same-origin `fetch` callback that sends only URL plus mode and returns parsed unknown data to `App` admission. |

The dependency direction is `main.ts -> service.ts -> input-validation/client-assets/loopback-api/repository/scan-page`; `input-validation.ts -> scan-page.prepareScanRequest`; `service.ts -> scan-page.executeScan`; `loopback-api.ts -> narrow callback and response-table types`; and `client/main.tsx -> App`. `service.ts` loads the finite client table before repository/listener effects and passes it to the transport; the transport never asks the filesystem to resolve a request. The browser calls only its loopback API. No server module imports client components, no client module imports a server runtime value, and no transport module owns scanner, persistence, or lifecycle state. The reuse disposition is: retain the four stable server façades and all M1-04 UI components; extend the five existing composition/transport/configuration files above; create only `client-assets.ts`; create no other production file. Permitted Refactor is limited to a small purpose-named private function inside an allowed file when the final changed surface otherwise mixes one of these declared responsibilities. A need for another production path, a generic abstraction, or a different dependency edge is `RECONCILE`, not implicit permission.

The standard profile is controlling. Although `main.tsx` changes and Analyze becomes available in the production composition, the accepted UI already implements that state; no rendered component, CSS, hierarchy, copy, focus, or ARIA contract changes. The frontend-quality reuse audit therefore selects no `frontend-visual` capsule and no `frontend_code_worker`. If Green needs any component or style change, close the lease and reclassify the changed contract before writing.

Risk is `S3` because the new boundary joins HTTP parsing, operation admission, managed-browser cleanup, terminal-result identity, atomic publication, and a closed filesystem asset map. A fresh `critical_reviewer` must inspect the actual Red/Green order, terminal lease receipts, status/body mapping, unknown-data validation, same-origin privilege boundary, scanner and provider call graph, one-operation and shutdown behavior, publication/read/deletion evidence, asset path containment, absence of raw content, changed-surface cohesion, and complete validation. One unresolved finding stops advancement.

Use workflow ID `M1-05-20260902-06` and work-slice ID `M105-WALKING-SKELETON-INTEGRATION-06`. Default budget is one preflight, one Red turn, one Green turn, at most one same-contract correction per role using attempt 2 and its terminal parent lease, and one review correction loop. Stop after the same decisive failure twice, two no-diff write handoffs, any changed binding field, unexpected path, active lease ambiguity, dependency/runtime drift, public contract conflict, or need for more than this one coherent TDD cycle. After Green the implementation worker reports exactly `RETAINED`, `REFACTORED`, or `RECONCILE` with path-and-symbol evidence; the primary independently accepts behavior and structure.

No implementation branch is parallelizable in this worktree. Preflight, Red, Green/optional behavior-preserving Refactor, primary inspection, complete verification, slice review, public smoke, final review, and cleanup remain sequential; read-only review never overlaps a writer or an owned browser/service command.

The exact command preparation, entry/preflight identity, focused Red/Green command, accepted evidence tuple, sequential verification barrier, public smoke, generated boundaries, final cleanup, documentation closure, and restoration rules are frozen below under `M105-CMD-*`; a setup packet may copy them but may not invent replacements. Record build and test exit codes separately and record exact final test counts rather than predicting how many cases the new Red will add.

### M105-TRUSTED-PUBLIC-SMOKE-07 — observational public-page checkpoint

This is external verification after the controlled slice passes, not another production change. TDD is not applicable because it observes the already implemented workflow against a mutable external page. No worker or write lease is needed unless the observation exposes a new, separately reconciled product defect. Before execution, the project owner must provide one exact public HTTPS URL they are permitted and willing to trust, confirm that its requested and ordinary redirect destination are non-sensitive enough for local run provenance, and declare the one generated smoke run disposable. Do not choose a target on the owner's behalf, scan more than that one page, or publish its URL, page content, Findings, or evidence in tracked documentation.

The binding anchors for this checkpoint are the M1-05 [Expected output, User-visible outcome, and Verification](../../DEVELOPMENT_ROADMAP.md#m1-05--integrate-and-verify-the-walking-skeleton); `REQ-AUTH-007`, `REQ-AUTH-008`, `REQ-SCAN-001`, `REQ-SCAN-005`–`REQ-SCAN-007`, `REQ-EVID-003`, and `REQ-EVID-007`–`REQ-EVID-011` in [Target authorization, scanning, evidence, and provenance](../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#target-authorization-and-scanning); `REQ-INST-002`, `REQ-INST-004`, `REQ-SEC-005`, `REQ-SEC-006`, `REQ-QUAL-011`, `REQ-QUAL-012`, and `REQ-QUAL-020` in their requirement modules linked above; the Analyze/Results portions of `REQ-LLM-002`, `REQ-LLM-003`, `REQ-LLM-021`, `REQ-UX-002`–`REQ-UX-005`, and `REQ-UX-010`–`REQ-UX-014`; `BHV-01`/`SPEC-001`, the retention/deletion portion of `BHV-07`/`SPEC-007`, and `HS-001`, `HS-004`, and `HS-006`; ADR-0015, ADR-0018, ADR-0021, and the OD-021/OD-024/OD-026/OD-027 boundaries. It is observational corroboration only and cannot qualify the frozen RD-003 evaluation baseline.

Using the exact `M105-CMD-PUBLIC-SMOKE` block below with the already accepted build identity, retained managed-browser identity, and production `npm run start` entry, capture the bounded `service-ready` line. Open only that enumerated loopback URL manually in installed Chrome or Edge, confirm no mode is preselected, select one mode, and activate Analyze once. Acceptance requires a completed exact-three-rule result—not a particular finding count—whose normalized target identity and concise limitation render through the accepted UI; the corresponding one newly created `data/runs/<run-id>/run.json` must validate both through the running application read boundary and the application-owned validator and contain no prohibited raw material. Confirm the service cleanly stops, all managed browser resources close, scanner scratch is empty, and no provider is invoked.

Before the smoke, snapshot the exact immediate child names under `data/runs`; afterward require exactly one new ordinary non-link run directory. Pin its run ID, canonical `run.json` SHA-256, accepted source/build/browser identities, application revision, process-environment name set, selected mode, date, bounded completion/coverage result, validation result, and clean-stop/scratch result. The URL remains a private execution input and no page content, Finding, evidence value, redirect identity, or provider secret enters tracked documentation. Public network evidence remains `Non-reusable`; a mutable-page or network failure does not justify code change or automatic retry, and one owner-directed replacement target is the maximum before stopping for direction.

Keep that exact aggregate intact through the different fresh final integrated `critical_reviewer` inspection. Preserve and fingerprint every pre-existing sibling if any exists, but do not manufacture a durable sibling merely for this smoke; the controlled transport/lifecycle lane owns the mandatory sibling-preservation proof. The reviewer must read the pinned canonical bytes and independently reconcile their identity, minimized shape, publication/read evidence, surrounding directory state, and exact deletion preconditions. Only after that review returns PASS may the primary resolve the literal smoke-run path beneath `data/runs`, recheck ordinary non-link topology and hash, remove only the declared smoke run directory, prove it absent, and confirm every pre-existing sibling identity is unchanged. This final deterministic cleanup does not authorize another scan or source change and does not require another full integrated review; its exact command result belongs to the documentation closure gate. It demonstrates the manual deletion boundary without adding a deletion UI, backup, recycle bin, cascade, tombstone, or provider-erasure claim.

### M105-PC08-ACCEPTED-VERIFICATION — replacement evidence

Primary executed the unchanged README sequential seven-file command and correction strict/syntax block on 2026-09-03: 58 contract + 55 repository + 69 service + 20 normalization + 88 scanner + 15 integration + 30 UI = 335 tests, all passed with zero failure/cancellation/skip/todo. Independent strict TypeScript and all three changed-path syntax checks passed. UI teardown reported no external request or page error and settled normally. Source, tests, build, and browser matched the frozen corrected identities; owned scratch and run siblings remained empty. The test-relevance audit retained the four full-path lanes, replaced only vacuous abort evidence with real arrival/settlement assertions, and added eleven table-driven startup cases with genuine positive/negative behavior. No focused/skipped/todo test, production substitute, changed evaluation fixture, or rendered UI change was introduced.

### M105-CMD-CORRECTION-IDENTITY — frozen replacement tuple

After the first PREP definitions, load this block and call `Assert-M105CorrectionIdentity` for review or before cleanup. Call it with `-AfterCleanup` only after the exact cleanup below; that mode requires build/scratch absence while preserving all source, test, evaluation, runtime, receipt, and endpoint checks. These constants were captured after accepted Green, not regenerated during verification.

```powershell
function Assert-M105CorrectionIdentity([switch]$AfterCleanup) {
  if ((& git rev-parse HEAD).Trim() -cne '1f92fe89e28fb2e645a97875ee38390d4744a858' -or
      (& git branch --show-current).Trim() -cne 'codex/m1-05-walking-skeleton-integration') { throw 'Correction endpoint drift' }
  if (@(& git diff --cached --name-only).Count) { throw 'Correction index drift' }
  $null = Assert-M105OrdinaryPath $m105ActiveLease -AllowMissing
  if (Test-Path -LiteralPath $m105ActiveLease) { throw 'Correction lease remains active' }
  $allowed = $m105PreArchiveDocumentationPaths + @('docs/plans/completed/m1-05-walking-skeleton-integration.md',
    'src/server/local-service/client-assets.ts','tests/walking-skeleton.test.ts','tests/helpers/m105-walking-skeleton-harness.ts')
  foreach ($row in @(& git -c status.renames=false status --porcelain=v1 --untracked-files=all)) {
    if ($allowed -cnotcontains $row.Substring(3)) { throw ('Unexpected correction path: ' + $row.Substring(3)) }
  }
  Assert-M105FileHashes ([ordered]@{
    'src/server/local-service/client-assets.ts'='9DE67BA8E09C2D6FF12B999A5D57E82D693C1C36844A18080C4B6F9932D005CD';
    'tests/walking-skeleton.test.ts'='F51AC6CF9652E8B5094EFB83760D55DF7DD55A4F5A5D3A77039D6739A81F9729';
    'tests/helpers/m105-walking-skeleton-harness.ts'='C58B1428D96452FD3CE131C710CD955DA5895BAB3B6450D3956F5ED3690C4001';
    'package.json'='C2C8718FA44813288ABBA5792FACB3D39400446912EC73DE2A8C93E2A6D92C98';
    'package-lock.json'='ECE19CD10739D5C4139E4700B5A712B89FEFE1F898BE29C4FBF18DD54682C553';
    'tsconfig.json'='3957F80AF41B23DC4CCEFAA6B24823C367E6984980420B596275B8692DF5ABDE';
    'vite.config.ts'='8D75B9863C86A8ECA2267C74D8875BE46061C288F5EAEF6BEA93C427D3DACD07';
    'index.html'='91BEF948D015F0E084708FDECFB79F765437B439D76B1ED70AF55580D815DC88'
  }) 'Correction accepted files'
  Assert-M105TreeRecord (Join-Path $m105Repo 'src') ([pscustomobject]@{Entries=52;Files=40;Directories=12;Bytes=156106;Digest='168E3847A44D4AEB3A9E142991ED27363FFBF0ACD434D3CC96B3718FDF3F5848'}) 'Correction source'
  Assert-M105TreeRecord (Join-Path $m105Repo 'tests') ([pscustomobject]@{Entries=11;Files=10;Directories=1;Bytes=352774;Digest='66AE699D6A4984048F97FE057B794BD481312C6FF3FCE25E636EF076FC33EAA6'}) 'Correction tests'
  Assert-M105TreeRecord (Join-Path $m105Repo 'evaluation') ([pscustomobject]@{Entries=1;Files=1;Directories=0;Bytes=16029;Digest='3048E8A9F4412437116513F830CF4317C87F5A00C5C3FFD8675474BD173FD4AE'}) 'Frozen evaluation'
  Assert-M105TreeRecord (Join-Path $m105Repo 'fixtures/rd003') ([pscustomobject]@{Entries=9;Files=6;Directories=3;Bytes=2806;Digest='7E0554E767DA4995045C1235FEF0E8AE1C4BE681B73D0BB6EF7312AA912317AC'}) 'Frozen fixtures'
  Assert-M105TreeRecord $m105Runtime ([pscustomobject]@{Entries=332;Files=318;Directories=14;Bytes=451193922;Digest='4FDF9490EDBA2FC4662FF487C591F769F682D8031B3E59FC26C0C35AEE8371CC'}) 'Retained browser'
  if ((Get-FileHash -LiteralPath $m105Node -Algorithm SHA256).Hash -cne '5C976096E04E5C2C1F091938926234CC9FBEBFE9787DDD149351B3B0ECC707B5') { throw 'Node drift' }
  if ((Get-M105RunSetDigest) -cne 'E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855') { throw 'Run sibling drift' }
  foreach ($cache in @('.vite-temp','node_modules/.vite-temp')) {
    $null = Assert-M105OrdinaryPath (Join-Path $m105Repo $cache) -AllowMissing
    if (Test-Path -LiteralPath (Join-Path $m105Repo $cache)) { throw 'Vite cache residue' }
  }
  if ($AfterCleanup) {
    foreach ($absent in @($m105Build,$m105ScanTemp,$m105UiTemp,$m105IntegrationTemp)) {
      $null = Assert-M105OrdinaryPath $absent -AllowMissing
      if (Test-Path -LiteralPath $absent) { throw 'Correction cleanup residue' }
    }
  } else {
    Assert-M105TreeRecord $m105Build ([pscustomobject]@{Entries=4;Files=3;Directories=1;Bytes=225483;Digest='1D1198338F4C1E267737F5F9D8F5540854A33A7C7E52BFC3EDC36C35164A503F'}) 'Correction build'
    foreach ($scratch in @($m105ScanTemp,$m105UiTemp,$m105IntegrationTemp)) { Assert-M105EmptyDirectory $scratch }
  }
  $receipts = @(
    @{Id='M1-05-20260903-08-postclosure-red-01';Contract='eda28cccf51326f4203dc97fab9b0e3e83048b38dc93a198de0724df0ec0e38a';Digest='fe96da0b301fc87f8ea5cebbf6146a58195cf75b56c4f72e23ce4d62bc7e850d';ContractHash='410597490A27AE71204B9185F88198B5BC49384DABE8FAD6BDAF83B3DBBABF07';Hash='19D401784D26E9BAA844E9C94CD1F048F160D6AD6D47DBC9B85671B33F7B29C4';Paths=@('tests/helpers/m105-walking-skeleton-harness.ts','tests/walking-skeleton.test.ts')},
    @{Id='M1-05-20260903-08-postclosure-green-01';Contract='950c6a47267f193470e3919317c6ccb93a1fdb90ca4f43524a2df47545a7e7c8';Digest='3670dac391a923b6af5e2875cbb6650d6c0dd69f1cee6ba2b98cd6e8c9930681';ContractHash='4B99A228E432C53BC8AD0624EC9D9DAE2018CD844FA20D8ED0ED554640647356';Hash='131B0982586737E8E5B6117CFAF244A7A2BF3CA5132E88801EFD18AD340A9323';Paths=@('src/server/local-service/client-assets.ts')}
  )
  foreach ($expected in $receipts) {
    $root = Join-Path $m105Repo ('logs/agent-flow-leases/v2/' + $expected.Id)
    $file = Assert-M105OrdinaryPath (Join-Path $root 'receipt.json')
    $contract = Assert-M105OrdinaryPath (Join-Path $root 'contract.json')
    if ((Get-FileHash -LiteralPath $file -Algorithm SHA256).Hash -cne $expected.Hash -or
        (Get-FileHash -LiteralPath $contract -Algorithm SHA256).Hash -cne $expected.ContractHash) { throw 'Correction lease identity drift' }
    $receipt = Get-Content -Raw -LiteralPath $file | ConvertFrom-Json
    if ($receipt.schema_version -ne 2 -or $receipt.lease_id -cne $expected.Id -or
        $receipt.contract_digest -cne $expected.Contract -or $receipt.digest -cne $expected.Digest -or
        $receipt.outcome -cne 'compliant' -or $receipt.verified_head -cne '1f92fe89e28fb2e645a97875ee38390d4744a858' -or
        $receipt.verified_head_ref -cne 'refs/heads/codex/m1-05-walking-skeleton-integration' -or
        @($receipt.changes.forbidden).Count -ne 0 -or @($receipt.changes.unleased).Count -ne 0 -or
        ((@($receipt.changes.allowed.path | Sort-Object) -join '|') -cne ($expected.Paths -join '|'))) { throw 'Correction receipt mismatch' }
  }
}
```

### M105-CMD-CORRECTION-CLEANUP — after both accepted reviews

Run only after both fresh reviews pass and all follow-ups are resolved. Both services and browsers must already be settled by the accepted tests. Remove no run, retained browser, dependency, shared cache, or parent directory.

```powershell
Assert-M105CorrectionIdentity
$null = Assert-M105OrdinaryPath $m105Build
Remove-Item -LiteralPath $m105Build -Recurse -Force -ErrorAction Stop
foreach ($scratch in @($m105ScanTemp,$m105UiTemp,$m105IntegrationTemp)) {
  Assert-M105EmptyDirectory $scratch
  Remove-Item -LiteralPath $scratch -ErrorAction Stop
}
Assert-M105CorrectionIdentity -AfterCleanup
```

### M105-CMD-CORRECTION-CLOSURE — final archived-state validation

After both accepted reviews and exact cleanup, reconcile all current-status owners and archive this same plan with repaired links. Load the first PREP definitions and the correction identity function from the archive, then run this block. It reuses only the historical validator's status, Markdown/fragment, UTF-8, PowerShell, and required-heading checks; its old Git/tuple/receipt/cleanup assertions are excluded. The progress heading check explicitly accepts CRLF. Run again after the last documentation mutation. Expected final totals are 28 roadmap tasks: eight Complete and 20 Not started, with no active task.

```powershell
Assert-M105CorrectionIdentity -AfterCleanup
$m105ActivePlan = Join-Path $m105Repo 'docs/plans/m1-05-walking-skeleton-integration.md'
$m105ArchivedPlan = Assert-M105OrdinaryPath (Join-Path $m105Repo 'docs/plans/completed/m1-05-walking-skeleton-integration.md')
if (Test-Path -LiteralPath $m105ActivePlan) { throw 'Correction plan remains active' }
$m105ChangedPaths = @(@(& git diff --name-only) + @(& git ls-files --others --exclude-standard) | Sort-Object -Unique)
if ($m105ChangedPaths.Count -ne 16) { throw 'Correction closure path set changed' }
$m105ArchivedText = Get-Content -Raw -LiteralPath $m105ArchivedPlan
$historical = [regex]::Match($m105ArchivedText,
  '(?ms)^### M105-CMD-DOCUMENTATION-CLOSURE [^\r\n]*\r?\n.*?^```powershell\r?\n(.*?)^```').Groups[1].Value
$start = $historical.IndexOf('$m105RoadmapText =')
$stop = $historical.IndexOf('git diff --check')
if ($start -lt 0 -or $stop -le $start) { throw 'Shared documentation checks unavailable' }
# Reuse only status, Markdown, fragment, UTF-8, PowerShell, and heading checks.
# Never execute historical commit, tuple, receipt, or cleanup checks.
$shared = $historical.Substring($start,$stop-$start).Replace(
  '(?m)^- \*\*Mirrored roadmap status:\*\* Complete$',
  '(?m)^- \*\*Mirrored roadmap status:\*\* Complete\r?$')
. ([scriptblock]::Create($shared))
foreach ($owner in $m105CurrentOwners) {
  $current = Get-Content -Raw -LiteralPath (Join-Path $m105Repo $owner)
  if ($current -match '(?i)M1-05[^\r\n]*(?:is In progress again|is reopened|closure (?:is superseded|are pending))') {
    throw ('Stale correction current status: ' + $owner)
  }
}
git -c core.safecrlf=false diff --check
if ($LASTEXITCODE -ne 0) { throw 'Correction closure whitespace failed' }
[pscustomobject]@{MarkdownFiles=$m105Markdown.Count;Links=$m105LinkCount;Fragments=$m105FragmentCount;
  PowerShellBlocks=$m105PowerShellCount;ChangedPaths=$m105ChangedPaths.Count;Complete=8;NotStarted=20}
```

### M105-CMD-PREP — exact shell literals and environment restoration

All commands run in PowerShell from `C:\Users\mmjos\Desktop\workbeanch\a11y-evidence-lab`. They reuse Node `C:/nvm4w/nodejs/node.exe`, adjacent npm 11.19.0, installed packages, the existing npm cache at `temp/rd002-npm-cache`, and the retained browser at `m104-browser-runtime/browsers`. Bootstrap, dependency restore, package/configuration mutation, browser acquisition, another cache, and a repository helper script are `None`. The generated locations are exactly `dist/client`, `temp/m103-scan`, `temp/m104-ui`, and `temp/m105-integration`; repository-root `.vite-temp` and `node_modules/.vite-temp` must remain absent. Run this preparation text in every new command shell; it defines values and functions but creates or removes nothing.

```powershell
$ErrorActionPreference = 'Stop'
$m105Repo = [IO.Path]::GetFullPath('C:/Users/mmjos/Desktop/workbeanch/a11y-evidence-lab')
if ((Resolve-Path -LiteralPath '.').Path -ine $m105Repo) { throw 'Wrong M1-05 working directory' }
$m105Node = 'C:/nvm4w/nodejs/node.exe'
$m105Npm = 'C:/nvm4w/nodejs/npm.cmd'
$m105Runtime = Join-Path $m105Repo 'm104-browser-runtime'
$m105Browsers = Join-Path $m105Runtime 'browsers'
$m105ScanTemp = Join-Path $m105Repo 'temp/m103-scan'
$m105UiTemp = Join-Path $m105Repo 'temp/m104-ui'
$m105IntegrationTemp = Join-Path $m105Repo 'temp/m105-integration'
$m105Build = Join-Path $m105Repo 'dist/client'
$m105RunRoot = Join-Path $m105Repo 'data/runs'
$m105ActiveLease = Join-Path $m105Repo 'logs/agent-flow-leases/v2/active.json'
$m105ProductionPaths = @('src/server/service.ts','src/server/main.ts',
  'src/server/local-service/contracts.ts','src/server/local-service/input-validation.ts',
  'src/server/local-service/loopback-api.ts','src/server/local-service/client-assets.ts',
  'src/client/main.tsx')
$m105WalkingTestPaths = @('tests/walking-skeleton.test.ts',
  'tests/helpers/m105-walking-skeleton-harness.ts')
$m105WalkingFilePath = @('tests/walking-skeleton.test.ts')
$m105LocalEntryTestPaths = @('tests/local-service.test.ts')
$m105AcceptedTestPaths = $m105WalkingTestPaths + $m105LocalEntryTestPaths
$m105ProtectedPaths = @('package.json','package-lock.json','tsconfig.json','vite.config.ts','index.html')
$m105PreArchiveDocumentationPaths = @('README.md','docs/README.md','docs/DEVELOPMENT_ROADMAP.md',
  'docs/PROJECT_CONCEPT.md','docs/PROJECT_CONTEXT.md','docs/architecture/README.md',
  'docs/architecture/CANDIDATE_ARCHITECTURE.md',
  'docs/requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md',
  'docs/requirements/INFORMATION_AND_WORKFLOW_LIFECYCLE.md','docs/plans/README.md',
  'docs/plans/m1-05-walking-skeleton-integration.md','docs/progress/README.md',
  'docs/progress/m1-05-walking-skeleton-integration.md')
$toolchainOptions = @('--global=false','--prefix',$m105Repo,'--cache',
  (Join-Path $m105Repo 'temp/rd002-npm-cache'),'--ignore-scripts=true',
  '--audit=false','--fund=false','--update-notifier=false','--logs-max=0',
  '--registry=https://registry.npmjs.org/','--strict-ssl=true',
  '--package-lock=true','--include=dev','--include=optional')
$m105FixedReject = @('NODE_OPTIONS','NODE_DEBUG','NODE_DEBUG_NATIVE',
  'NODE_COMPILE_CACHE','NODE_V8_COVERAGE','NODE_REDIRECT_WARNINGS',
  'DEBUG','DEBUG_FILE','PWDEBUG','PWDEBUGIMPL','SELENIUM_REMOTE_URL',
  'SELENIUM_REMOTE_CAPABILITIES','SELENIUM_REMOTE_HEADERS')
$m105Controlled = @('PLAYWRIGHT_BROWSERS_PATH','PLAYWRIGHT_SKIP_BROWSER_GC',
  'PLAYWRIGHT_DOWNLOAD_CONNECTION_TIMEOUT')
$m105Rejected = @(Get-ChildItem Env: | Where-Object {
  $m105Name = $_.Name
  $m105Alias = $m105Name -match '^(?i:npm_config_|npm_package_config_)'
  $m105Base = $m105Name -replace '^(?i:npm_config_|npm_package_config_)',''
  ($m105FixedReject -contains $m105Base) -or
    (($m105Base -match '^(?i:PLAYWRIGHT_|PWTEST_|PW_)') -and
      ($m105Alias -or $m105Controlled -notcontains $m105Base))
} | Select-Object -ExpandProperty Name)
if ($m105Rejected.Count) { throw ('Unsupported environment names: ' + ($m105Rejected -join ', ')) }

function Invoke-M105Command([scriptblock]$Command, [string]$Scratch = '') {
  $m105Names = @('NODE_DISABLE_COMPILE_CACHE')
  if ($Scratch) {
    if (@($m105ScanTemp,$m105UiTemp) -notcontains $Scratch) { throw 'Unknown M1-05 command scratch' }
    $m105Names += @('PLAYWRIGHT_BROWSERS_PATH','PLAYWRIGHT_SKIP_BROWSER_GC',
      'PLAYWRIGHT_DOWNLOAD_CONNECTION_TIMEOUT','TEMP','TMP')
  }
  $m105Saved = @{}
  foreach ($m105Name in $m105Names) {
    $m105Saved[$m105Name] = [Environment]::GetEnvironmentVariable($m105Name,'Process')
  }
  try {
    [Environment]::SetEnvironmentVariable('NODE_DISABLE_COMPILE_CACHE','1','Process')
    if ($Scratch) {
      [Environment]::SetEnvironmentVariable('PLAYWRIGHT_BROWSERS_PATH',$m105Browsers,'Process')
      [Environment]::SetEnvironmentVariable('PLAYWRIGHT_SKIP_BROWSER_GC','1','Process')
      [Environment]::SetEnvironmentVariable('PLAYWRIGHT_DOWNLOAD_CONNECTION_TIMEOUT','30000','Process')
      [Environment]::SetEnvironmentVariable('TEMP',$Scratch,'Process')
      [Environment]::SetEnvironmentVariable('TMP',$Scratch,'Process')
    }
    & $Command
  } finally {
    foreach ($m105Name in $m105Names) {
      $m105Prior = $m105Saved[$m105Name]
      [Environment]::SetEnvironmentVariable($m105Name,
        $(if ($null -eq $m105Prior) { [NullString]::Value } else { $m105Prior }),'Process')
    }
    foreach ($m105Name in $m105Names) {
      if ([Environment]::GetEnvironmentVariable($m105Name,'Process') -cne $m105Saved[$m105Name]) {
        throw ('Environment restore mismatch: ' + $m105Name)
      }
    }
  }
}

function Assert-M105OrdinaryPath([string]$Candidate, [switch]$AllowMissing) {
  $m105Full = [IO.Path]::GetFullPath($Candidate)
  $m105Prefix = $m105Repo.TrimEnd([IO.Path]::DirectorySeparatorChar,[IO.Path]::AltDirectorySeparatorChar) + [IO.Path]::DirectorySeparatorChar
  if (-not $m105Full.StartsWith($m105Prefix,[StringComparison]::OrdinalIgnoreCase)) { throw 'M1-05 path escapes repository' }
  $m105Parts = [IO.Path]::GetRelativePath($m105Repo,$m105Full) -split '[\\/]'
  $m105Cursor = $m105Repo
  for ($m105Index = 0; $m105Index -lt $m105Parts.Count; $m105Index++) {
    $m105Cursor = Join-Path $m105Cursor $m105Parts[$m105Index]
    if (-not (Test-Path -LiteralPath $m105Cursor)) {
      if ($AllowMissing) { return $m105Full }
      throw ('Missing M1-05 path: ' + $m105Cursor)
    }
    $m105Item = Get-Item -LiteralPath $m105Cursor -Force
    if (($m105Item.Attributes -band [IO.FileAttributes]::ReparsePoint) -ne 0) { throw ('Linked M1-05 path: ' + $m105Cursor) }
    if ($m105Index -lt $m105Parts.Count - 1 -and -not $m105Item.PSIsContainer) { throw 'Non-directory M1-05 ancestor' }
    if ([IO.Path]::GetFullPath((Resolve-Path -LiteralPath $m105Cursor).Path) -ine [IO.Path]::GetFullPath($m105Cursor)) {
      throw ('Aliased M1-05 path: ' + $m105Cursor)
    }
  }
  return $m105Full
}

function Assert-M105EmptyDirectory([string]$Candidate) {
  $m105Full = Assert-M105OrdinaryPath $Candidate
  if (-not (Get-Item -LiteralPath $m105Full -Force).PSIsContainer) { throw 'M1-05 scratch is not a directory' }
  if (@(Get-ChildItem -LiteralPath $m105Full -Force).Count -ne 0) { throw ('M1-05 scratch is not empty: ' + $m105Full) }
}

function Get-M105TreeIdentity([string]$Candidate) {
  $m105Root = Assert-M105OrdinaryPath $Candidate
  if (-not (Get-Item -LiteralPath $m105Root -Force).PSIsContainer) { throw 'M1-05 tree root is not a directory' }
  $m105Rows = [Collections.Generic.List[string]]::new()
  $m105Queue = [Collections.Generic.Queue[string]]::new()
  $m105Queue.Enqueue($m105Root)
  [int]$m105Files = 0; [int]$m105Directories = 0; [long]$m105Bytes = 0
  while ($m105Queue.Count) {
    $m105Current = $m105Queue.Dequeue()
    foreach ($m105Child in @(Get-ChildItem -LiteralPath $m105Current -Force | Sort-Object Name)) {
      if (($m105Child.Attributes -band [IO.FileAttributes]::ReparsePoint) -ne 0) { throw 'Linked M1-05 tree entry' }
      $m105Relative = [IO.Path]::GetRelativePath($m105Root,$m105Child.FullName).Replace('\','/')
      if ($m105Child.PSIsContainer) {
        $m105Directories++; $m105Rows.Add("D`t$m105Relative"); $m105Queue.Enqueue($m105Child.FullName)
      } elseif ($m105Child -is [IO.FileInfo]) {
        $m105Files++; $m105Bytes += $m105Child.Length
        $m105Hash = (Get-FileHash -Algorithm SHA256 -LiteralPath $m105Child.FullName).Hash
        $m105Rows.Add("F`t$m105Relative`t$($m105Child.Length)`t$m105Hash")
      } else { throw 'Unsupported M1-05 tree entry' }
    }
  }
  $m105Payload = [Text.Encoding]::UTF8.GetBytes(($m105Rows -join "`n"))
  [pscustomobject]@{ Entries = $m105Files + $m105Directories; Files = $m105Files;
    Directories = $m105Directories; Bytes = $m105Bytes;
    Digest = [Convert]::ToHexString([Security.Cryptography.SHA256]::HashData($m105Payload)) }
}

function Get-M105FileHashes([string[]]$RelativePaths) {
  $m105Hashes = [ordered]@{}
  foreach ($m105Relative in $RelativePaths) {
    $m105File = Assert-M105OrdinaryPath (Join-Path $m105Repo $m105Relative)
    $m105Item = Get-Item -LiteralPath $m105File -Force
    if ($m105Item.PSIsContainer -or $m105Item -isnot [IO.FileInfo]) { throw ('Expected ordinary file: ' + $m105Relative) }
    $m105Hashes[$m105Relative] = (Get-FileHash -Algorithm SHA256 -LiteralPath $m105File).Hash
  }
  return $m105Hashes
}

function Assert-M105FileHashes($Expected, [string]$Label) {
  $m105Actual = Get-M105FileHashes @($Expected.Keys)
  if ($m105Actual.Count -ne $Expected.Count) { throw ($Label + ' file-set count changed') }
  foreach ($m105Relative in $Expected.Keys) {
    if ($m105Actual[$m105Relative] -cne $Expected[$m105Relative]) {
      throw ($Label + ' changed: ' + $m105Relative)
    }
  }
}

function Assert-M105TreeRecord([string]$Candidate, $Expected, [string]$Label) {
  $m105Actual = Get-M105TreeIdentity $Candidate
  foreach ($m105Field in @('Entries','Files','Directories','Bytes','Digest')) {
    if ($m105Actual.$m105Field -cne $Expected.$m105Field) { throw ($Label + ' changed at ' + $m105Field) }
  }
}

function Assert-M105GitEndpoint([string[]]$RequiredPaths, [string[]]$AllowedPaths = @()) {
  $m105Head = (& git rev-parse HEAD).Trim()
  if ($LASTEXITCODE -ne 0 -or $m105Head -cne '552f57ec93f23cde164e3327fba06ba961fa1286') { throw 'M1-05 HEAD changed' }
  $m105Branch = (& git branch --show-current).Trim()
  if ($LASTEXITCODE -ne 0 -or $m105Branch -cne 'codex/m1-05-walking-skeleton-integration') { throw 'M1-05 branch changed' }
  $m105Staged = @(& git diff --cached --name-only)
  if ($LASTEXITCODE -ne 0 -or $m105Staged.Count -ne 0) { throw 'M1-05 Git index is not empty' }
  $m105Status = @(& git -c status.renames=false status --porcelain=v1 --untracked-files=all)
  if ($LASTEXITCODE -ne 0) { throw 'Cannot inspect M1-05 worktree state' }
  $m105ActualPaths = @($m105Status | ForEach-Object {
    if ($_.Length -lt 4) { throw 'Malformed Git status row' }
    $_.Substring(3).Replace('\','/')
  } | Sort-Object)
  if ($AllowedPaths.Count -eq 0) {
    $m105ExpectedPaths = @($RequiredPaths | Sort-Object)
    if (($m105ActualPaths -join "`n") -cne ($m105ExpectedPaths -join "`n")) {
      throw ('Unexpected M1-05 worktree paths: ' + ($m105ActualPaths -join ', '))
    }
  } else {
    foreach ($m105ActualPath in $m105ActualPaths) {
      if ($AllowedPaths -notcontains $m105ActualPath) { throw ('Unexpected M1-05 worktree path: ' + $m105ActualPath) }
    }
    foreach ($m105RequiredPath in $RequiredPaths) {
      if ($m105ActualPaths -notcontains $m105RequiredPath) { throw ('Missing required M1-05 worktree path: ' + $m105RequiredPath) }
    }
  }
  $null = Assert-M105OrdinaryPath $m105ActiveLease -AllowMissing
  if (Test-Path -LiteralPath $m105ActiveLease) { throw 'A write lease is active' }
}

function Assert-M105PlanningIdentity {
  Assert-M105GitEndpoint @('docs/plans/m1-05-walking-skeleton-integration.md')
  Assert-M105TreeRecord (Join-Path $m105Repo 'src') ([pscustomobject]@{
    Entries=51; Files=39; Directories=12; Bytes=147831;
    Digest='8960366EC4E34C2C3649C44D7FDED9077AA28EFA90E456FE350988FA735C7A21'
  }) 'Planning source tree'
  Assert-M105TreeRecord (Join-Path $m105Repo 'tests') ([pscustomobject]@{
    Entries=9; Files=8; Directories=1; Bytes=317970;
    Digest='B96EC7A3DB35396475C5485180D880BB5F36DCC3F19DA475E9D811BFE1216840'
  }) 'Planning test tree'
  Assert-M105FileHashes ([ordered]@{
    'package.json'='C2C8718FA44813288ABBA5792FACB3D39400446912EC73DE2A8C93E2A6D92C98'
    'package-lock.json'='ECE19CD10739D5C4139E4700B5A712B89FEFE1F898BE29C4FBF18DD54682C553'
    'tsconfig.json'='3957F80AF41B23DC4CCEFAA6B24823C367E6984980420B596275B8692DF5ABDE'
    'vite.config.ts'='8D75B9863C86A8ECA2267C74D8875BE46061C288F5EAEF6BEA93C427D3DACD07'
    'index.html'='91BEF948D015F0E084708FDECFB79F765437B439D76B1ED70AF55580D815DC88'
  }) 'Planning protected input'
  Assert-M105TreeRecord $m105Runtime ([pscustomobject]@{
    Entries=332; Files=318; Directories=14; Bytes=451193922;
    Digest='4FDF9490EDBA2FC4662FF487C591F769F682D8031B3E59FC26C0C35AEE8371CC'
  }) 'Planning retained browser'
  $m105PlanningMarker = Get-Item -LiteralPath (Join-Path $m105Browsers 'chromium-1234/DEPENDENCIES_VALIDATED') -Force
  if ($m105PlanningMarker.LastWriteTimeUtc -gt [DateTime]::UtcNow -or
      $m105PlanningMarker.LastWriteTimeUtc -lt [DateTime]::UtcNow.AddDays(-30) -or
      (Get-FileHash -Algorithm SHA256 -LiteralPath $m105PlanningMarker.FullName).Hash -cne
        'E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855' -or
      (Get-FileHash -Algorithm SHA256 -LiteralPath (Join-Path $m105Browsers 'chromium-1234/chrome-win64/chrome.exe')).Hash -cne
        '409805A16D6416087E6B2F778DF1CF8F7BBB267D6B99F6B5BB0A618EACE234F2') {
    throw 'Planning browser executable or marker drifted'
  }
}

function Get-M105LeaseReceiptEvidence([string]$LeaseId, [string]$ContractDigest, [string[]]$ExpectedPaths) {
  if ($ContractDigest -notmatch '^[0-9a-f]{64}$') { throw ('Invalid guard digest slot for ' + $LeaseId) }
  $m105ReceiptPath = Assert-M105OrdinaryPath (Join-Path $m105Repo ('logs/agent-flow-leases/v2/' + $LeaseId + '/receipt.json'))
  $m105Receipt = Get-Content -Raw -LiteralPath $m105ReceiptPath | ConvertFrom-Json
  if ($m105Receipt.schema_version -ne 2 -or $m105Receipt.lease_id -cne $LeaseId -or
      $m105Receipt.contract_digest -cne $ContractDigest -or $m105Receipt.outcome -cne 'compliant' -or
      $m105Receipt.verified_head -cne '552f57ec93f23cde164e3327fba06ba961fa1286' -or
      $m105Receipt.verified_head_ref -cne 'refs/heads/codex/m1-05-walking-skeleton-integration' -or
      @($m105Receipt.changes.forbidden).Count -ne 0 -or @($m105Receipt.changes.unleased).Count -ne 0) {
    throw ('Noncompliant terminal receipt: ' + $LeaseId)
  }
  $m105ActualPaths = @($m105Receipt.changes.allowed.path | ForEach-Object { $_.ToLowerInvariant() } | Sort-Object)
  $m105ExpectedPaths = @($ExpectedPaths | ForEach-Object { $_.ToLowerInvariant() } | Sort-Object)
  if (($m105ActualPaths -join "`n") -cne ($m105ExpectedPaths -join "`n")) {
    throw ('Terminal receipt path mismatch: ' + $LeaseId)
  }
  return [pscustomobject]@{ Digest=$m105Receipt.digest;
    FileHash=(Get-FileHash -Algorithm SHA256 -LiteralPath $m105ReceiptPath).Hash }
}

function Get-M105RunSetDigest([string]$ExcludeRunId = '') {
  $null = Assert-M105OrdinaryPath $m105RunRoot
  $m105Rows = [Collections.Generic.List[string]]::new()
  foreach ($m105Entry in @(Get-ChildItem -LiteralPath $m105RunRoot -Force | Sort-Object Name)) {
    if ($ExcludeRunId -and $m105Entry.Name -ceq $ExcludeRunId) { continue }
    if (-not $m105Entry.PSIsContainer -or ($m105Entry.Attributes -band [IO.FileAttributes]::ReparsePoint) -ne 0) {
      throw 'Unsafe run-root sibling'
    }
    $m105Identity = Get-M105TreeIdentity $m105Entry.FullName
    $m105Rows.Add("$($m105Entry.Name)`t$($m105Identity.Entries)`t$($m105Identity.Bytes)`t$($m105Identity.Digest)")
  }
  $m105Payload = [Text.Encoding]::UTF8.GetBytes(($m105Rows -join "`n"))
  return [Convert]::ToHexString([Security.Cryptography.SHA256]::HashData($m105Payload))
}
```

### M105-CMD-PREFLIGHT-SETUP — retained runtime and clean generated state

At the current baseline the retained runtime identity under the exact function above is 332 entries, 318 files, 14 directories, 451,193,922 bytes, digest `4FDF9490EDBA2FC4662FF487C591F769F682D8031B3E59FC26C0C35AEE8371CC`; `chromium-1234/chrome-win64/chrome.exe` is SHA-256 `409805A16D6416087E6B2F778DF1CF8F7BBB267D6B99F6B5BB0A618EACE234F2`; and `chromium-1234/DEPENDENCIES_VALIDATED` is the empty-file SHA-256 `E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855`, UTC mtime `2026-09-01T19:46:51.6545663Z`. Require the same tree identity before and after every managed-browser command and a marker no more than 30 days old and not future-dated. Drift, a stale marker, a missing runtime, or a reparse point stops for explicit setup reconciliation; it never triggers incidental download or deletion.

With no active lease and before the read-only test-worker turn, the primary runs this one explicitly safe coordinator setup. Require `dist/client`, repository-root `.vite-temp`, `node_modules/.vite-temp`, `temp/m103-scan`, `temp/m104-ui`, and `temp/m105-integration` absent, then create only the three scratch directories as declared ignored diagnostic effects and require them empty. This is not application source, a test contract, setup behavior, or a worker write turn. Record the created paths and keep them as empty owned roots through Red, Green, verification, smoke, and final cleanup. A pre-existing path is preserved and stops execution until its ownership is reconciled; it is not deleted to satisfy this check.

Vite never runs over an existing `dist/client` in this plan. Each build requires that path absent. After Red evidence and its generated build identity are inspected, the primary removes only that exact recognized Red build before Green. The accepted Green build is retained unchanged through complete verification, both reviews, and the public smoke; a same-contract Green correction must first reconcile and remove only its recorded failed-attempt build. Before and after each test/start command, require its named scratch and `temp/m105-integration` empty. The integration helper may create descendants only under `temp/m105-integration` and must remove them before returning.

```powershell
Assert-M105PlanningIdentity
$m105RuntimeIdentity = Get-M105TreeIdentity $m105Runtime
if ($m105RuntimeIdentity.Entries -ne 332 -or $m105RuntimeIdentity.Files -ne 318 -or
    $m105RuntimeIdentity.Directories -ne 14 -or $m105RuntimeIdentity.Bytes -ne 451193922 -or
    $m105RuntimeIdentity.Digest -cne '4FDF9490EDBA2FC4662FF487C591F769F682D8031B3E59FC26C0C35AEE8371CC') {
  throw 'Retained browser identity drifted'
}
$m105Marker = Get-Item -LiteralPath (Join-Path $m105Browsers 'chromium-1234/DEPENDENCIES_VALIDATED') -Force
if ($m105Marker.LastWriteTimeUtc -gt [DateTime]::UtcNow -or $m105Marker.LastWriteTimeUtc -lt [DateTime]::UtcNow.AddDays(-30) -or
    (Get-FileHash -Algorithm SHA256 -LiteralPath $m105Marker.FullName).Hash -cne 'E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855' -or
    (Get-FileHash -Algorithm SHA256 -LiteralPath (Join-Path $m105Browsers 'chromium-1234/chrome-win64/chrome.exe')).Hash -cne
      '409805A16D6416087E6B2F778DF1CF8F7BBB267D6B99F6B5BB0A618EACE234F2') { throw 'Retained browser prerequisite is invalid' }
foreach ($m105Absent in @($m105Build,(Join-Path $m105Repo '.vite-temp'),
    (Join-Path $m105Repo 'node_modules/.vite-temp'),$m105ScanTemp,$m105UiTemp,$m105IntegrationTemp)) {
  $null = Assert-M105OrdinaryPath $m105Absent -AllowMissing
  if (Test-Path -LiteralPath $m105Absent) { throw ('Expected absent at M1-05 entry: ' + $m105Absent) }
}
New-Item -ItemType Directory -Path $m105ScanTemp,$m105UiTemp,$m105IntegrationTemp | Out-Null
Assert-M105EmptyDirectory $m105ScanTemp
Assert-M105EmptyDirectory $m105UiTemp
Assert-M105EmptyDirectory $m105IntegrationTemp
```

### M105-CMD-PREFLIGHT — exact no-lease characterization commands

After the coordinator setup above, the persistent `test_worker` runs this block without a lease or repository edit. It records each invocation's exit and TAP counts separately, verifies all scratch roots empty after the applicable process, and compares the runtime with the entry identity. The browser-free boundary must pass 182/182. The scanner boundary must retain its accepted 20 normalization and 68 execution leaf cases, with its existing TAP parent groups; the UI boundary must pass 30/30. Strict TypeScript must exit 0. Any source/test/configuration hash drift, generated residue, external UI request, browser/runtime mutation, failed command, or different case inventory returns `UNKNOWN` or `REGRESSION` as applicable rather than advancing to Red.

```powershell
Assert-M105PlanningIdentity
Assert-M105EmptyDirectory $m105ScanTemp
Assert-M105EmptyDirectory $m105UiTemp
Assert-M105EmptyDirectory $m105IntegrationTemp
Invoke-M105Command {
  & $m105Node --test --test-timeout=120000 tests/run-contract.test.ts tests/run-repository.test.ts tests/local-service.test.ts
  $m105Exit = $LASTEXITCODE; Write-Output "M1-05 preflight browser-free exit: $m105Exit"
  if ($m105Exit -ne 0) { throw 'M1-05 browser-free preflight failed' }
}
Assert-M105EmptyDirectory $m105ScanTemp
Invoke-M105Command {
  & $m105Node --test --test-timeout=120000 tests/scan-normalization.test.ts tests/scan-page.test.ts
  $m105Exit = $LASTEXITCODE; Write-Output "M1-05 preflight scanner exit: $m105Exit"
  if ($m105Exit -ne 0) { throw 'M1-05 scanner preflight failed' }
} $m105ScanTemp
Assert-M105EmptyDirectory $m105ScanTemp
Invoke-M105Command {
  & $m105Node --test --test-timeout=120000 tests/target-results-ui.test.ts
  $m105Exit = $LASTEXITCODE; Write-Output "M1-05 preflight UI exit: $m105Exit"
  if ($m105Exit -ne 0) { throw 'M1-05 UI preflight failed' }
} $m105UiTemp
Assert-M105EmptyDirectory $m105UiTemp
Assert-M105EmptyDirectory $m105IntegrationTemp
Invoke-M105Command {
  & $m105Node node_modules/typescript/bin/tsc --project tsconfig.json
  $m105Exit = $LASTEXITCODE; Write-Output "M1-05 preflight typecheck exit: $m105Exit"
  if ($m105Exit -ne 0) { throw 'M1-05 preflight typecheck failed' }
}
if (Test-Path -LiteralPath $m105Build) { throw 'Preflight created unexpected client build output' }
if (Test-Path -LiteralPath (Join-Path $m105Repo '.vite-temp')) { throw 'Preflight created unexpected repository Vite cache' }
if (Test-Path -LiteralPath (Join-Path $m105Repo 'node_modules/.vite-temp')) { throw 'Preflight created unexpected node_modules Vite cache' }
$m105PreflightRuntimeIdentity = Get-M105TreeIdentity $m105Runtime
if ($m105PreflightRuntimeIdentity.Entries -ne 332 -or $m105PreflightRuntimeIdentity.Files -ne 318 -or
    $m105PreflightRuntimeIdentity.Directories -ne 14 -or $m105PreflightRuntimeIdentity.Bytes -ne 451193922 -or
    $m105PreflightRuntimeIdentity.Digest -cne '4FDF9490EDBA2FC4662FF487C591F769F682D8031B3E59FC26C0C35AEE8371CC') {
  throw 'Retained browser changed during preflight'
}
Assert-M105PlanningIdentity
```

### M105-CMD-FOCUSED — exact Red and Green commands

Red and Green use the same frozen preparation and effects. Run the syntax checks and native build first. For Red, the focused test command must exit nonzero only on the absent configured-client/static/POST behavior described above; an exit 0, environment/runtime failure, or unrelated failure is rejected. After the accepted Red file identities are frozen, Green reruns the same build and test command without changing either test path and requires exit 0.

```powershell
# Run this common prefix once immediately before Red and again immediately before Green.
if (Test-Path -LiteralPath $m105Build) { throw 'M1-05 build must be absent before Vite runs' }
Invoke-M105Command {
  & $m105Node --check tests/walking-skeleton.test.ts
  if ($LASTEXITCODE -ne 0) { throw 'Walking-skeleton test syntax failed' }
  & $m105Node --check tests/helpers/m105-walking-skeleton-harness.ts
  if ($LASTEXITCODE -ne 0) { throw 'Walking-skeleton helper syntax failed' }
}
Invoke-M105Command {
  & $m105Node node_modules/vite/bin/vite.js build --configLoader native
  $m105Exit = $LASTEXITCODE; Write-Output "M1-05 focused build exit: $m105Exit"
  if ($m105Exit -ne 0) { throw 'M1-05 focused build failed' }
}
Assert-M105EmptyDirectory $m105ScanTemp
Assert-M105EmptyDirectory $m105IntegrationTemp
```

The exact Red invocation is:

```powershell
Invoke-M105Command {
  & $m105Node --test --test-timeout=120000 tests/walking-skeleton.test.ts
  $m105Exit = $LASTEXITCODE; Write-Output "M1-05 focused test exit: $m105Exit"
  if ($m105Exit -eq 0) { throw 'M1-05 Red unexpectedly passed' }
} $m105ScanTemp
Assert-M105EmptyDirectory $m105ScanTemp
Assert-M105EmptyDirectory $m105IntegrationTemp
```

Attempt-1 lease `M1-05-20260902-06-integration-red-01` is historical invalid Red. The accepted corrected Red lease ID is exactly `M1-05-20260902-06-integration-red-02`. The primary recorded the exit and decisive assertion names, terminally closed that lease, inserted its semantic contract digest below, and ran this identity check before this plan maintenance or any Green lease. The two emitted hashes are the accepted Red boundary; a wrong receipt, path set, HEAD/ref, staged change, active lease, or other worktree path stops.

```powershell
$m105RedLeaseId = 'M1-05-20260902-06-integration-red-02'
$m105RedContractDigest = '96e7cdb206cfd4edf592f029b3594582ea19d4d958f1662d808f80b145ef8b61'
Assert-M105GitEndpoint @('docs/plans/m1-05-walking-skeleton-integration.md',
  'tests/walking-skeleton.test.ts','tests/helpers/m105-walking-skeleton-harness.ts')
$m105RedReceipt = Get-M105LeaseReceiptEvidence $m105RedLeaseId $m105RedContractDigest $m105WalkingTestPaths
$m105RedTestHashes = Get-M105FileHashes $m105WalkingTestPaths
[pscustomobject]@{ LeaseId=$m105RedLeaseId; ContractDigest=$m105RedContractDigest;
  ReceiptDigest=$m105RedReceipt.Digest; ReceiptFileHash=$m105RedReceipt.FileHash;
  TestHashes=$m105RedTestHashes } | ConvertTo-Json -Depth 5
```

After freezing those literal values in this living plan, the primary fingerprints the recognized Red build and removes only that exact generated directory before the Green lease:

```powershell
$m105RedBuildIdentity = Get-M105TreeIdentity $m105Build
if ($m105RedBuildIdentity.Files -lt 2 -or $m105RedBuildIdentity.Bytes -lt 1) { throw 'Unexpected Red build inventory' }
Remove-Item -LiteralPath (Assert-M105OrdinaryPath $m105Build) -Recurse -Force -ErrorAction Stop
if (Test-Path -LiteralPath $m105Build) { throw 'Red build cleanup failed' }
```

The Green lease ID is exactly `M1-05-20260902-06-integration-green-01`. After the separate Green lease starts, rerun the common prefix above and then run the exact Green invocation:

```powershell
Invoke-M105Command {
  & $m105Node --test --test-timeout=120000 tests/walking-skeleton.test.ts
  $m105Exit = $LASTEXITCODE; Write-Output "M1-05 focused test exit: $m105Exit"
  if ($m105Exit -ne 0) { throw 'M1-05 focused Green failed' }
} $m105ScanTemp
Assert-M105EmptyDirectory $m105ScanTemp
Assert-M105EmptyDirectory $m105IntegrationTemp
$m105AcceptedGreenBuildIdentity = Get-M105TreeIdentity $m105Build
```

The test invocation and arguments are byte-for-byte identical between phases; only the expected exit assertion differs. Green requires zero failure, cancellation, skip, todo, or focused-only marker. Do not rebuild or delete it unless a same-contract Green correction is accepted; in that case fingerprint and remove only the exact failed-attempt build before attempt 2.

### M105-CMD-GREEN-EVIDENCE — one frozen source/test/build/runtime/guard tuple

The original Green lease closed before the owner-authorized test recoveries and S3 correction. Immediately after the asset-hardening Green lease closed—and before this plan maintenance or complete-verification replay—the primary ran the recovery-aware block below once. It required fresh `closed-compliant` asset-hardening Green status with no post-close drift, the immutable compliant recovery, failed compile-only, direct-expression, asset-hardening Red, local-entry, original Green, and asset-hardening Green receipts, exact protected inputs, the expected eleven worktree paths, no active lease, and one simultaneous snapshot of the whole source tree, whole test tree, seven production paths, three accepted tests, five protected build inputs, retained build, retained browser, and all seven terminal receipts. Its replacement object is frozen below as `M105-ACCEPTED-GREEN-TUPLE-001`; do not rerun this one-shot capture after plan maintenance.

```powershell
$m105WalkingTestLeaseId = 'M1-05-20260902-06-integration-final-recovery-evidence-01'
$m105WalkingTestContractDigest = 'a048065f8c16adeb53bdd19d2bbad290d88eccc1a31f8b6f4629805ad815ae30'
$m105WalkingTypeLeaseId = 'M1-05-20260902-06-integration-walking-type-evidence-01'
$m105WalkingTypeContractDigest = 'f3044338dfe88af7929670f007b71872381ea77ea2c1c7b67ac4fafe7b11965a'
$m105WalkingDirectLeaseId = 'M1-05-20260902-06-integration-walking-direct-evidence-01'
$m105WalkingDirectContractDigest = '7915de58e568d8ad297a473afab2610a6a5fc551ea3d7b8d3f5a18513af362c2'
$m105AssetRedLeaseId = 'M1-05-20260902-06-integration-asset-hardening-red-01'
$m105AssetRedContractDigest = 'bc03d8e13e96338e8ba447dec0ea0f901b7338945a89ab7074d207c00f14bf03'
$m105LocalEntryLeaseId = 'M1-05-20260902-06-integration-local-entry-evidence-01'
$m105LocalEntryContractDigest = 'a7554c1f6b314234c131f4c701a30b2b996c2d437ca18133b320dff7cdfd2e32'
$m105AcceptedTestHashes = [ordered]@{
  'tests/walking-skeleton.test.ts'='9CF2120512BA0936D6BFD8585FEA320D4FEE127E8136FCA2EE954D4A3BEF233F'
  'tests/helpers/m105-walking-skeleton-harness.ts'='58B811C0826FD707630B907830EBDF3565202AD03E5680926768BA5F7F1C9A43'
  'tests/local-service.test.ts'='C00F7F66F7819EA856ED2F86C526F0FFD8915B2CC296BEF057DD3024BB8308B0'
}
$m105GreenLeaseId = 'M1-05-20260902-06-integration-green-02'
$m105GreenContractDigest = 'fa59652954523ec0a8df6eba8cf83184d7e37bc6ca3780fe44dd60baceb6905b'
$m105AssetGreenLeaseId = 'M1-05-20260902-06-integration-asset-hardening-green-01'
$m105AssetGreenContractDigest = '400170c789bf38ed1941ba586c860aed9ccff46b263d3c8b7e21196a99eec039'
$m105AssetGreenStatusText = (& python -B .codex/leases/lease_guard.py status `
  --lease-id $m105AssetGreenLeaseId --contract-digest $m105AssetGreenContractDigest) -join "`n"
$m105AssetGreenStatusExit = $LASTEXITCODE
$m105AssetGreenStatus = $m105AssetGreenStatusText | ConvertFrom-Json
if ($m105AssetGreenStatusExit -ne 0 -or $m105AssetGreenStatus.status -cne 'closed-compliant' -or
    $m105AssetGreenStatus.post_close_drift -ne $false) { throw 'Asset-hardening Green lease is not freshly closed and stable' }
Assert-M105GitEndpoint (@('docs/plans/m1-05-walking-skeleton-integration.md') + $m105AcceptedTestPaths + $m105ProductionPaths)
Assert-M105FileHashes $m105AcceptedTestHashes 'Accepted test boundary'
$m105WalkingTestReceipt = Get-M105LeaseReceiptEvidence $m105WalkingTestLeaseId `
  $m105WalkingTestContractDigest $m105WalkingTestPaths
$m105WalkingTypeReceipt = Get-M105LeaseReceiptEvidence $m105WalkingTypeLeaseId `
  $m105WalkingTypeContractDigest $m105WalkingFilePath
$m105WalkingDirectReceipt = Get-M105LeaseReceiptEvidence $m105WalkingDirectLeaseId `
  $m105WalkingDirectContractDigest $m105WalkingFilePath
$m105AssetRedReceipt = Get-M105LeaseReceiptEvidence $m105AssetRedLeaseId `
  $m105AssetRedContractDigest $m105WalkingFilePath
$m105LocalEntryReceipt = Get-M105LeaseReceiptEvidence $m105LocalEntryLeaseId `
  $m105LocalEntryContractDigest $m105LocalEntryTestPaths
$m105GreenReceipt = Get-M105LeaseReceiptEvidence $m105GreenLeaseId $m105GreenContractDigest $m105ProductionPaths
$m105AssetGreenReceipt = Get-M105LeaseReceiptEvidence $m105AssetGreenLeaseId `
  $m105AssetGreenContractDigest @('src/server/local-service/client-assets.ts')
$m105GreenTuple = [ordered]@{
  ProductionHashes=(Get-M105FileHashes $m105ProductionPaths)
  AcceptedTestHashes=(Get-M105FileHashes $m105AcceptedTestPaths)
  ProtectedHashes=(Get-M105FileHashes $m105ProtectedPaths)
  SourceTree=(Get-M105TreeIdentity (Join-Path $m105Repo 'src'))
  TestTree=(Get-M105TreeIdentity (Join-Path $m105Repo 'tests'))
  Build=(Get-M105TreeIdentity $m105Build)
  Runtime=(Get-M105TreeIdentity $m105Runtime)
  WalkingTestLease=[ordered]@{ Id=$m105WalkingTestLeaseId; ContractDigest=$m105WalkingTestContractDigest;
    ReceiptDigest=$m105WalkingTestReceipt.Digest; ReceiptFileHash=$m105WalkingTestReceipt.FileHash }
  WalkingTypeLease=[ordered]@{ Id=$m105WalkingTypeLeaseId; ContractDigest=$m105WalkingTypeContractDigest;
    ReceiptDigest=$m105WalkingTypeReceipt.Digest; ReceiptFileHash=$m105WalkingTypeReceipt.FileHash }
  WalkingDirectLease=[ordered]@{ Id=$m105WalkingDirectLeaseId; ContractDigest=$m105WalkingDirectContractDigest;
    ReceiptDigest=$m105WalkingDirectReceipt.Digest; ReceiptFileHash=$m105WalkingDirectReceipt.FileHash }
  AssetRedLease=[ordered]@{ Id=$m105AssetRedLeaseId; ContractDigest=$m105AssetRedContractDigest;
    ReceiptDigest=$m105AssetRedReceipt.Digest; ReceiptFileHash=$m105AssetRedReceipt.FileHash }
  LocalEntryTestLease=[ordered]@{ Id=$m105LocalEntryLeaseId; ContractDigest=$m105LocalEntryContractDigest;
    ReceiptDigest=$m105LocalEntryReceipt.Digest; ReceiptFileHash=$m105LocalEntryReceipt.FileHash }
  GreenLease=[ordered]@{ Id=$m105GreenLeaseId; ContractDigest=$m105GreenContractDigest;
    ReceiptDigest=$m105GreenReceipt.Digest; ReceiptFileHash=$m105GreenReceipt.FileHash }
  AssetGreenLease=[ordered]@{ Id=$m105AssetGreenLeaseId; ContractDigest=$m105AssetGreenContractDigest;
    ReceiptDigest=$m105AssetGreenReceipt.Digest; ReceiptFileHash=$m105AssetGreenReceipt.FileHash }
}
$m105GreenTuple | ConvertTo-Json -Depth 7
```

Before complete verification, replace every slot in the following block with that single emitted object. Thereafter run `M105-CMD-PREP`, this entire block, and its final assertion in every new complete-verification, review-evidence, public-smoke, or pre-cleanup shell. The block is the one reusable tuple; later recapture is forbidden. Its slots are primary-accepted evidence, not worker discretion.

```powershell
$m105AcceptedProductionHashes = [ordered]@{
  'src/server/service.ts'='F4287C98B45ED44486F5A37730C032D251767647789986D0C9505C48B475266B'
  'src/server/main.ts'='2FF29908663A66A8A8A3D265964E3A1D23A6F25C3EED6644B495A51496CCB591'
  'src/server/local-service/contracts.ts'='4419C369C86B3AAEF1402DC9EC9E8075A7995DA767FCA4C87F37C3BBCB6F4EC5'
  'src/server/local-service/input-validation.ts'='FA917578ED8F778138B0B9BFA841570C6B7347A33F17DC7E917C44B1F027F289'
  'src/server/local-service/loopback-api.ts'='8E978B9D892BBA1E07B0CAAFB03A8B291CB2A676F0723899DFA783B7E1CC22FE'
  'src/server/local-service/client-assets.ts'='E6471020C61D34F8C108281F5448391C8A55BF577F365D68CDAFA9E887228C8D'
  'src/client/main.tsx'='C71D80711AD25ABCFF25B5AAFA1790C71588C85F1816B843F210DA459EDF4411'
}
$m105AcceptedTestHashes = [ordered]@{
  'tests/walking-skeleton.test.ts'='9CF2120512BA0936D6BFD8585FEA320D4FEE127E8136FCA2EE954D4A3BEF233F'
  'tests/helpers/m105-walking-skeleton-harness.ts'='58B811C0826FD707630B907830EBDF3565202AD03E5680926768BA5F7F1C9A43'
  'tests/local-service.test.ts'='C00F7F66F7819EA856ED2F86C526F0FFD8915B2CC296BEF057DD3024BB8308B0'
}
$m105AcceptedProtectedHashes = [ordered]@{
  'package.json'='C2C8718FA44813288ABBA5792FACB3D39400446912EC73DE2A8C93E2A6D92C98'
  'package-lock.json'='ECE19CD10739D5C4139E4700B5A712B89FEFE1F898BE29C4FBF18DD54682C553'
  'tsconfig.json'='3957F80AF41B23DC4CCEFAA6B24823C367E6984980420B596275B8692DF5ABDE'
  'vite.config.ts'='8D75B9863C86A8ECA2267C74D8875BE46061C288F5EAEF6BEA93C427D3DACD07'
  'index.html'='91BEF948D015F0E084708FDECFB79F765437B439D76B1ED70AF55580D815DC88'
}
$m105AcceptedSourceTree = [pscustomobject]@{ Entries=52; Files=40; Directories=12; Bytes=155794;
  Digest='1CDEF37A13522636497B196180E537B098C2610E4498C355690C61AB55606B75' }
$m105AcceptedTestTree = [pscustomobject]@{ Entries=11; Files=10; Directories=1; Bytes=344299;
  Digest='4D8800E7ACF958D5C914AB686CDBD03A3AE2D5965954D7F8DE7B54F01BDE240C' }
$m105AcceptedBuild = [pscustomobject]@{ Entries=4; Files=3; Directories=1; Bytes=225483;
  Digest='1D1198338F4C1E267737F5F9D8F5540854A33A7C7E52BFC3EDC36C35164A503F' }
$m105AcceptedRuntime = [pscustomobject]@{ Entries=332; Files=318; Directories=14; Bytes=451193922;
  Digest='4FDF9490EDBA2FC4662FF487C591F769F682D8031B3E59FC26C0C35AEE8371CC' }
$m105AcceptedWalkingRecoveryLease = [pscustomobject]@{ Id='M1-05-20260902-06-integration-final-recovery-evidence-01';
  ContractDigest='a048065f8c16adeb53bdd19d2bbad290d88eccc1a31f8b6f4629805ad815ae30';
  ReceiptDigest='67e621ce21c60caece0367f86e4685016ebc801d3ec8af4b87ec2820b11bff4d';
  ReceiptFileHash='D599F06A7D76BCB310FFC9B9CBB0E9BC677E66EE5889620ABDA6334A6E344DE8' }
$m105AcceptedWalkingTypeLease = [pscustomobject]@{ Id='M1-05-20260902-06-integration-walking-type-evidence-01';
  ContractDigest='f3044338dfe88af7929670f007b71872381ea77ea2c1c7b67ac4fafe7b11965a';
  ReceiptDigest='acbce985d4297737b7445ed96fdbe408105d72c9a26d272417e13d4a338a937d';
  ReceiptFileHash='12FED60D3E8F8CDFB0834FE73D66B4662CDEC6A1FE8D314F7C26B73E7F8C1866' }
$m105AcceptedWalkingDirectLease = [pscustomobject]@{ Id='M1-05-20260902-06-integration-walking-direct-evidence-01';
  ContractDigest='7915de58e568d8ad297a473afab2610a6a5fc551ea3d7b8d3f5a18513af362c2';
  ReceiptDigest='d1e439f5b09a405227c1367370b596038635e78f5655d009a994cb6fabdd0ab2';
  ReceiptFileHash='B105E1F644EEBCF455C3A3F897B5FA0FE3A96911B847F80C3817E486B20DC571' }
$m105AcceptedAssetRedLease = [pscustomobject]@{ Id='M1-05-20260902-06-integration-asset-hardening-red-01';
  ContractDigest='bc03d8e13e96338e8ba447dec0ea0f901b7338945a89ab7074d207c00f14bf03';
  ReceiptDigest='10ab999d0a3cc2b4a4d517aa91d1442d29309a7ee9f78de8b0dac45ac5eb9aca';
  ReceiptFileHash='72A67B2C0CDCC3D05D53FFAA7F3594F18EBEE738A680D232DEBFEF2F6EEB2F0A' }
$m105AcceptedLocalEntryTestLease = [pscustomobject]@{ Id='M1-05-20260902-06-integration-local-entry-evidence-01';
  ContractDigest='a7554c1f6b314234c131f4c701a30b2b996c2d437ca18133b320dff7cdfd2e32';
  ReceiptDigest='be48bbb2c9b4b8e08317795e3b9f33b5dc4c981076589d0a0456c325a7bd2236';
  ReceiptFileHash='22F3C7F188C7D76841C1F271CD0DEB93704AE74E3CBC404C3ECD047850DAC385' }
$m105AcceptedGreenLease = [pscustomobject]@{ Id='M1-05-20260902-06-integration-green-02';
  ContractDigest='fa59652954523ec0a8df6eba8cf83184d7e37bc6ca3780fe44dd60baceb6905b';
  ReceiptDigest='a3d6e2b5cb2a0caa681b1938797976160aec5179068e61f3a8f759617f193940';
  ReceiptFileHash='937046A19A00C8CD42D706AD1739A3593A0BED4275FF80F0086F17423EB20059' }
$m105AcceptedAssetGreenLease = [pscustomobject]@{ Id='M1-05-20260902-06-integration-asset-hardening-green-01';
  ContractDigest='400170c789bf38ed1941ba586c860aed9ccff46b263d3c8b7e21196a99eec039';
  ReceiptDigest='cba84a48dc02e75ec18914da183954804051867f08e32e6b596f6dd26843132d';
  ReceiptFileHash='2E5898AD3AB1A8072F108F09D2FB9EDA385F441437719EFB0AD3966E013E422D' }
function Assert-M105AcceptedGreenTuple {
  $m105RequiredGreenPaths = @('docs/plans/m1-05-walking-skeleton-integration.md') +
    $m105AcceptedTestPaths + $m105ProductionPaths
  $m105AllowedGreenPaths = $m105PreArchiveDocumentationPaths + $m105AcceptedTestPaths + $m105ProductionPaths
  Assert-M105GitEndpoint $m105RequiredGreenPaths $m105AllowedGreenPaths
  Assert-M105FileHashes $m105AcceptedProductionHashes 'Accepted Green production'
  Assert-M105FileHashes $m105AcceptedTestHashes 'Accepted tests'
  Assert-M105FileHashes $m105AcceptedProtectedHashes 'Accepted protected input'
  Assert-M105TreeRecord (Join-Path $m105Repo 'src') $m105AcceptedSourceTree 'Accepted source tree'
  Assert-M105TreeRecord (Join-Path $m105Repo 'tests') $m105AcceptedTestTree 'Accepted test tree'
  Assert-M105TreeRecord $m105Build $m105AcceptedBuild 'Accepted Green build'
  Assert-M105TreeRecord $m105Runtime $m105AcceptedRuntime 'Accepted retained browser'
  $m105WalkingRecoveryReceipt = Get-M105LeaseReceiptEvidence $m105AcceptedWalkingRecoveryLease.Id `
    $m105AcceptedWalkingRecoveryLease.ContractDigest $m105WalkingTestPaths
  $m105WalkingTypeReceipt = Get-M105LeaseReceiptEvidence $m105AcceptedWalkingTypeLease.Id `
    $m105AcceptedWalkingTypeLease.ContractDigest $m105WalkingFilePath
  $m105WalkingDirectReceipt = Get-M105LeaseReceiptEvidence $m105AcceptedWalkingDirectLease.Id `
    $m105AcceptedWalkingDirectLease.ContractDigest $m105WalkingFilePath
  $m105AssetRedReceipt = Get-M105LeaseReceiptEvidence $m105AcceptedAssetRedLease.Id `
    $m105AcceptedAssetRedLease.ContractDigest $m105WalkingFilePath
  $m105LocalEntryTestReceipt = Get-M105LeaseReceiptEvidence $m105AcceptedLocalEntryTestLease.Id `
    $m105AcceptedLocalEntryTestLease.ContractDigest $m105LocalEntryTestPaths
  $m105GreenReceipt = Get-M105LeaseReceiptEvidence $m105AcceptedGreenLease.Id `
    $m105AcceptedGreenLease.ContractDigest $m105ProductionPaths
  $m105AssetGreenReceipt = Get-M105LeaseReceiptEvidence $m105AcceptedAssetGreenLease.Id `
    $m105AcceptedAssetGreenLease.ContractDigest @('src/server/local-service/client-assets.ts')
  if ($m105WalkingRecoveryReceipt.Digest -cne $m105AcceptedWalkingRecoveryLease.ReceiptDigest -or
      $m105WalkingRecoveryReceipt.FileHash -cne $m105AcceptedWalkingRecoveryLease.ReceiptFileHash -or
      $m105WalkingTypeReceipt.Digest -cne $m105AcceptedWalkingTypeLease.ReceiptDigest -or
      $m105WalkingTypeReceipt.FileHash -cne $m105AcceptedWalkingTypeLease.ReceiptFileHash -or
      $m105WalkingDirectReceipt.Digest -cne $m105AcceptedWalkingDirectLease.ReceiptDigest -or
      $m105WalkingDirectReceipt.FileHash -cne $m105AcceptedWalkingDirectLease.ReceiptFileHash -or
      $m105AssetRedReceipt.Digest -cne $m105AcceptedAssetRedLease.ReceiptDigest -or
      $m105AssetRedReceipt.FileHash -cne $m105AcceptedAssetRedLease.ReceiptFileHash -or
      $m105LocalEntryTestReceipt.Digest -cne $m105AcceptedLocalEntryTestLease.ReceiptDigest -or
      $m105LocalEntryTestReceipt.FileHash -cne $m105AcceptedLocalEntryTestLease.ReceiptFileHash -or
      $m105GreenReceipt.Digest -cne $m105AcceptedGreenLease.ReceiptDigest -or
      $m105GreenReceipt.FileHash -cne $m105AcceptedGreenLease.ReceiptFileHash -or
      $m105AssetGreenReceipt.Digest -cne $m105AcceptedAssetGreenLease.ReceiptDigest -or
      $m105AssetGreenReceipt.FileHash -cne $m105AcceptedAssetGreenLease.ReceiptFileHash) {
    throw 'Accepted terminal lease identity changed'
  }
  $m105Marker = Get-Item -LiteralPath (Join-Path $m105Browsers 'chromium-1234/DEPENDENCIES_VALIDATED') -Force
  if ($m105Marker.LastWriteTimeUtc -gt [DateTime]::UtcNow -or $m105Marker.LastWriteTimeUtc -lt [DateTime]::UtcNow.AddDays(-30) -or
      (Get-FileHash -Algorithm SHA256 -LiteralPath $m105Marker.FullName).Hash -cne
        'E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855' -or
      (Get-FileHash -Algorithm SHA256 -LiteralPath (Join-Path $m105Browsers 'chromium-1234/chrome-win64/chrome.exe')).Hash -cne
        '409805A16D6416087E6B2F778DF1CF8F7BBB267D6B99F6B5BB0A618EACE234F2' -or
      (Test-Path -LiteralPath (Join-Path $m105Repo '.vite-temp')) -or
      (Test-Path -LiteralPath (Join-Path $m105Repo 'node_modules/.vite-temp'))) {
    throw 'Accepted browser/build environment changed'
  }
}
Assert-M105AcceptedGreenTuple
```

### M105-CMD-COMPLETE — exact sequential verification barrier

Each of the six backend/scanner/integration files runs in its own process and in the listed order; do not combine or parallelize them. The unchanged UI file then runs separately with its own scratch. Strict TypeScript and all changed server-file syntax checks are separate checks; the native production build was created by the exact Green common prefix and is accepted here only if its frozen identity is unchanged. Require the retained runtime identity unchanged, all three scratch roots empty, both `.vite-temp` paths absent, and the exact accepted build identity afterward.

```powershell
Assert-M105AcceptedGreenTuple
Invoke-M105Command { & $m105Node --test --test-timeout=120000 tests/run-contract.test.ts; if ($LASTEXITCODE -ne 0) { throw 'run-contract suite failed' } }
Invoke-M105Command { & $m105Node --test --test-timeout=120000 tests/run-repository.test.ts; if ($LASTEXITCODE -ne 0) { throw 'run-repository suite failed' } }
Invoke-M105Command { & $m105Node --test --test-timeout=120000 tests/local-service.test.ts; if ($LASTEXITCODE -ne 0) { throw 'local-service suite failed' } }
Invoke-M105Command { & $m105Node --test --test-timeout=120000 tests/scan-normalization.test.ts; if ($LASTEXITCODE -ne 0) { throw 'scan-normalization suite failed' } }
Assert-M105EmptyDirectory $m105ScanTemp
Invoke-M105Command { & $m105Node --test --test-timeout=120000 tests/scan-page.test.ts; if ($LASTEXITCODE -ne 0) { throw 'scan-page suite failed' } } $m105ScanTemp
Assert-M105EmptyDirectory $m105ScanTemp
Assert-M105EmptyDirectory $m105IntegrationTemp
Invoke-M105Command { & $m105Node --test --test-timeout=120000 tests/walking-skeleton.test.ts; if ($LASTEXITCODE -ne 0) { throw 'walking-skeleton suite failed' } } $m105ScanTemp
Assert-M105EmptyDirectory $m105ScanTemp
Assert-M105EmptyDirectory $m105IntegrationTemp
Invoke-M105Command { & $m105Node --test --test-timeout=120000 tests/target-results-ui.test.ts; if ($LASTEXITCODE -ne 0) { throw 'target/results UI suite failed' } } $m105UiTemp
Assert-M105EmptyDirectory $m105UiTemp
Invoke-M105Command { & $m105Node node_modules/typescript/bin/tsc --project tsconfig.json; if ($LASTEXITCODE -ne 0) { throw 'Strict TypeScript failed' } }
Invoke-M105Command {
  foreach ($m105Source in @('src/server/service.ts','src/server/main.ts','src/server/local-service/contracts.ts',
      'src/server/local-service/input-validation.ts','src/server/local-service/loopback-api.ts',
      'src/server/local-service/client-assets.ts')) {
    & $m105Node --check $m105Source
    if ($LASTEXITCODE -ne 0) { throw ('Syntax failed: ' + $m105Source) }
  }
}
if (Test-Path -LiteralPath (Join-Path $m105Repo '.vite-temp')) { throw 'Unexpected repository Vite cache' }
if (Test-Path -LiteralPath (Join-Path $m105Repo 'node_modules/.vite-temp')) { throw 'Unexpected node_modules Vite cache' }
Assert-M105EmptyDirectory $m105ScanTemp
Assert-M105EmptyDirectory $m105UiTemp
Assert-M105EmptyDirectory $m105IntegrationTemp
Assert-M105AcceptedGreenTuple
```

### M105-CMD-PUBLIC-SMOKE — exact start, observation, validation, and stop

This command has two PowerShell shells because the production entry intentionally waits for `stop` on stdin. In both shells run `M105-CMD-PREP`, the populated `M105-CMD-GREEN-EVIDENCE` reusable-tuple block, and its final assertion before continuing. This proves that the exact accepted source, tests, protected inputs, build, runtime, browser executable/marker, terminal receipts, Git endpoint, and Vite-cache state still match; no later source recapture may replace that tuple. Then run the following scratch check. No write lease may be active.

```powershell
Assert-M105EmptyDirectory $m105ScanTemp
Assert-M105EmptyDirectory $m105UiTemp
Assert-M105EmptyDirectory $m105IntegrationTemp
```

In shell A, run the following block; copy only the emitted loopback `service-ready` URL. Do not use `Start-Process`, background the service, redirect output to a tracked file, or launch the user browser automatically.

```powershell
$m105ApplicationRevision = (& git rev-parse HEAD).Trim()
if ($LASTEXITCODE -ne 0 -or $m105ApplicationRevision -notmatch '^[0-9a-f]{40}$') { throw 'Invalid application revision' }
$m105SavedRevision = [Environment]::GetEnvironmentVariable('A11Y_APPLICATION_REVISION','Process')
$m105SavedPort = [Environment]::GetEnvironmentVariable('A11Y_PORT','Process')
try {
  [Environment]::SetEnvironmentVariable('A11Y_APPLICATION_REVISION',$m105ApplicationRevision,'Process')
  [Environment]::SetEnvironmentVariable('A11Y_PORT','0','Process')
  Invoke-M105Command {
    $m105ServerEnvironmentNames = @((Get-ChildItem Env: | Select-Object -ExpandProperty Name | Sort-Object))
    $m105ServerEnvironmentNameDigest = [Convert]::ToHexString([Security.Cryptography.SHA256]::HashData(
      [Text.Encoding]::UTF8.GetBytes(($m105ServerEnvironmentNames -join "`n"))))
    Write-Output "M1-05 server environment-name digest: $m105ServerEnvironmentNameDigest"
    & $m105Npm @toolchainOptions run start
    $m105Exit = $LASTEXITCODE; Write-Output "M1-05 production service exit: $m105Exit"
    if ($m105Exit -ne 0) { throw 'M1-05 production service failed' }
  } $m105ScanTemp
} finally {
  [Environment]::SetEnvironmentVariable('A11Y_APPLICATION_REVISION',
    $(if ($null -eq $m105SavedRevision) { [NullString]::Value } else { $m105SavedRevision }),'Process')
  [Environment]::SetEnvironmentVariable('A11Y_PORT',
    $(if ($null -eq $m105SavedPort) { [NullString]::Value } else { $m105SavedPort }),'Process')
  if ([Environment]::GetEnvironmentVariable('A11Y_APPLICATION_REVISION','Process') -cne $m105SavedRevision -or
      [Environment]::GetEnvironmentVariable('A11Y_PORT','Process') -cne $m105SavedPort) { throw 'Production environment restore mismatch' }
}
```

In shell B, take the before snapshot before touching the browser, enter the owner-approved URL only at the private prompt, and type `DISPOSABLE` only if the owner has made that declaration. The script does not persist or print the target. Supply the exact service-ready URL and selected mode. Open that URL manually in Chrome or Edge, enter the same approved target, select the same mode, activate Analyze once, inspect the result, and then continue the script.

```powershell
$m105ServiceUrl = Read-Host 'Exact emitted loopback service URL'
try { $m105ServiceUri = [Uri]$m105ServiceUrl } catch { throw 'Invalid enumerated service URL' }
if ($m105ServiceUrl -notmatch '^http://127\.0\.0\.1:[1-9][0-9]{0,4}$' -or
    $m105ServiceUri.Scheme -cne 'http' -or $m105ServiceUri.Host -cne '127.0.0.1' -or
    $m105ServiceUri.Port -lt 1 -or $m105ServiceUri.Port -gt 65535 -or $m105ServiceUri.AbsolutePath -cne '/') {
  throw 'Invalid enumerated service URL'
}
$m105Mode = Read-Host 'Selected mode: local or groq'
if ($m105Mode -cne 'local' -and $m105Mode -cne 'groq') { throw 'Invalid selected mode' }
$m105ApprovedTarget = Read-Host 'Owner-approved trusted public HTTPS target'
try { $m105TargetUri = [Uri]$m105ApprovedTarget } catch { throw 'Invalid approved target' }
if ($m105TargetUri.Scheme -cne 'https' -or -not $m105TargetUri.Host -or $m105TargetUri.UserInfo) { throw 'Target is outside trusted HTTPS admission' }
if ((Read-Host 'Type DISPOSABLE to authorize deletion after final review') -cne 'DISPOSABLE') { throw 'Disposable-run declaration missing' }
$null = Assert-M105OrdinaryPath $m105RunRoot
$m105SiblingSetDigest = Get-M105RunSetDigest
$m105Before = @{}
foreach ($m105Entry in @(Get-ChildItem -LiteralPath $m105RunRoot -Force)) {
  if (-not $m105Entry.PSIsContainer -or ($m105Entry.Attributes -band [IO.FileAttributes]::ReparsePoint) -ne 0) { throw 'Unsafe pre-smoke run-root entry' }
  $m105Before[$m105Entry.Name] = Get-M105TreeIdentity $m105Entry.FullName
}
$null = Read-Host 'After the one browser Analyze action has visibly completed, press ENTER'
$m105After = @(Get-ChildItem -LiteralPath $m105RunRoot -Force)
$m105New = @($m105After | Where-Object { -not $m105Before.ContainsKey($_.Name) })
if ($m105New.Count -ne 1 -or -not $m105New[0].PSIsContainer -or
    ($m105New[0].Attributes -band [IO.FileAttributes]::ReparsePoint) -ne 0) { throw 'Expected exactly one new ordinary smoke run' }
$m105SmokeRunId = $m105New[0].Name
if ((Get-M105RunSetDigest $m105SmokeRunId) -cne $m105SiblingSetDigest) { throw 'Pre-existing run set changed during smoke' }
$m105SmokeRunPath = Assert-M105OrdinaryPath $m105New[0].FullName
$m105SmokeChildren = @(Get-ChildItem -LiteralPath $m105SmokeRunPath -Force)
if ($m105SmokeChildren.Count -ne 1 -or $m105SmokeChildren[0].Name -cne 'run.json' -or
    $m105SmokeChildren[0].PSIsContainer -or ($m105SmokeChildren[0].Attributes -band [IO.FileAttributes]::ReparsePoint) -ne 0) {
  throw 'Smoke run is not the one-file aggregate'
}
$m105RunJson = $m105SmokeChildren[0].FullName
$m105Validation = @'
import fs from 'node:fs';
import { isDeepStrictEqual } from 'node:util';
import { validateRun } from './src/server/domain/run-contract.ts';
const [serviceUrl, runId, file, mode] = process.argv.slice(1);
const disk = validateRun(JSON.parse(fs.readFileSync(file, 'utf8')));
if (!disk.ok || disk.value.status !== 'completed' || disk.value.providerContext.mode !== mode) throw Error('invalid disk aggregate');
const response = await fetch(`${serviceUrl}/api/runs/${runId}`);
const envelope = await response.json();
const read = validateRun(envelope?.run);
if (!response.ok || envelope?.ok !== true || !read.ok || !isDeepStrictEqual(read.value, disk.value)) throw Error('validated application read mismatch');
const rules = Object.keys(disk.value.scan.coverage);
if (!isDeepStrictEqual(rules, ['image-alt', 'label', 'color-contrast'])) throw Error('invalid rule coverage');
console.log(JSON.stringify({ status: disk.value.status, rules,
  findings: disk.value.scan.findings.length, scannerReviewObservations: disk.value.scan.scannerReviewObservations.length }));
'@
Invoke-M105Command { & $m105Node --input-type=module --eval $m105Validation $m105ServiceUrl $m105SmokeRunId $m105RunJson $m105Mode; if ($LASTEXITCODE -ne 0) { throw 'Smoke aggregate validation failed' } }
$m105SmokeHash = (Get-FileHash -Algorithm SHA256 -LiteralPath $m105RunJson).Hash
$m105BuildIdentity = Get-M105TreeIdentity $m105Build
$m105BrowserIdentity = Get-M105TreeIdentity $m105Runtime
[pscustomobject]@{ RunId=$m105SmokeRunId; RunJsonSha256=$m105SmokeHash; Mode=$m105Mode;
  BuildDigest=$m105BuildIdentity.Digest; BrowserDigest=$m105BrowserIdentity.Digest;
  SiblingSetDigest=$m105SiblingSetDigest }
```

Now type `stop` followed by Enter in shell A. Require exactly one `service-stopped` event and exit 0, then in shell B run `Assert-M105EmptyDirectory $m105ScanTemp`, `Assert-M105EmptyDirectory $m105IntegrationTemp`, and `Assert-M105AcceptedGreenTuple`. Rehash the smoke aggregate and all pre-existing run directories, freeze the content-safe values in this living plan as `M105-SMOKE-RETAINED-001`, and retain them through the final integrated review. This post-stop tuple assertion proves that the source, accepted tests, protected inputs, build, runtime, and receipts remain the same as Green rather than merely recapturing a new state. Do not retain `$m105ApprovedTarget` or terminal history in tracked evidence.

### M105-SMOKE-RETAINED-001 — accepted public observation

Accepted on 2026-09-03 after the owner-authorized outside-sandbox environment correction. This observation is not reusable as future live-page evidence. The source, tests, protected inputs, and seven terminal receipts remain the exact `M105-ACCEPTED-GREEN-TUPLE-001` values.

| Identity or check | Frozen result |
| --- | --- |
| Run ID | `run-0caa2763-a445-4576-a296-c714b6403f74` |
| `run.json` SHA-256 | `1264348A4B1B09B4E80D9CDC711E5B0CF09FA071F182A8121480416AC821F1F8` |
| Application revision | `552f57ec93f23cde164e3327fba06ba961fa1286` |
| Mode / status | `local` / `completed` |
| Complete rule coverage | `image-alt`, `label`, `color-contrast` |
| Collections | 0 Findings; 20 ScannerReviewObservations, all color contrast |
| Build digest | `1D1198338F4C1E267737F5F9D8F5540854A33A7C7E52BFC3EDC36C35164A503F` |
| Browser-runtime digest | `4FDF9490EDBA2FC4662FF487C591F769F682D8031B3E59FC26C0C35AEE8371CC` |
| Pre-existing sibling-set digest | `E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855` (empty) |
| Outside-service environment-name digest | `94B3F339FAFFDE52EE4F7E3622209CF60AB3A11E221802FED168BA959F39CA21` |
| Validation / read | Exact smoke validator and disk/live-response equality passed; closed aggregate allowlist passed; no provider invocation |
| UI observation | Completed Results, all three groups, distinct manual-review items, non-certification limitation, and selected evidence detail observed |
| Stop / post-stop | One `service-stopped` event, exit 0; socket refused; exact tuple, run hash, empty sibling set, and all scratch checks passed |
| Retention / review | Inspected by different final critical reviewer; authorized aggregate, exact build, and three empty scratch roots removed after review follow-up resolution; siblings and browser runtime unchanged |

The public URL, redirect, page content, evidence values, screenshots, raw responses, and terminal history are deliberately excluded. Only the local aggregate may be inspected during final review; it must be removed by the exact reviewed cleanup afterward.

### M105-FINAL-REVIEW-CANDIDATE-001 — closure preparation

The primary's test-relevance audit inspected all three changed test-owned paths, the real integration and UI harnesses, and the complete seven-file suite. The new controlled pages are permanent synthetic test inputs, not production substitutes or revised RD-003 gold fixtures. Managed-browser interception changes only test transport while retaining real Chromium, axe, production capture, service, disk, and UI. The synthetic shutdown callback checks only deliverable HTTP status projection; the real blocked scan separately proves socket disconnection, durable shutdown, clean stop, and sibling preservation. The two local-entry expectations now reflect configured production scanning; API-only expectations remain unchanged. No focused-only, skipped, todo, snapshot, or implementation-layout assertion was introduced. Existing M1-04 keyboard, 320px, 200%, and Narrator evidence remains applicable because rendered components and styles are unchanged; the current 30-case browser suite also passes.

The updated README's exact sequential seven-file command was executed on 2026-09-03 against the retained build: 58 contract, 55 repository, 69 service, 20 normalization, 88 scanner, four integration, and 30 UI tests passed (324 total; zero failure, cancellation, skip, or todo). Independent strict TypeScript and the final frozen-tuple assertion passed. The public aggregate remains unchanged. Documentation validation resolved 1,892 relative links and 529 fragments across 86 Markdown files, parsed 21 changed PowerShell examples, and passed UTF-8, newline, whitespace, and `git diff --check` checks.

Current-status and developer-operation text is reconciled in README, the documentation/architecture/plan/progress indexes, roadmap, product context/concept, delivery readiness, and lifecycle model. Requirements and ADR semantics do not change; later retrieval, generation, review, comparison, hostile-target hardening, and release work remain outside scope. The exact cleanup and post-archive validator below now contain the frozen smoke identities, all three accepted test hashes, and all seven terminal receipt records copied from the accepted tuple rather than recaptured. M1-05 remains In progress. A different fresh integrated critical reviewer must inspect this complete candidate and the still-retained aggregate/build before any deletion or status promotion.

### M105-FINAL-CLOSURE-001 — accepted review and exact cleanup

Different fresh S3 review `M105-FINAL-INTEGRATED-REVIEW-01` returned PASS WITH FOLLOW-UPS on 2026-09-03. It covered applicable M1-05 authorities, all production/test changes, transport and privilege boundaries, lifecycle and persistence, evidence minimization, asset identity, recovery provenance, and the exact cleanup/closure commands. There was no Blocker or new actionable Major; the historical wrong-digest packet finding remains preserved. The sole Minor was a missing revision-history entry, resolved by primary before cleanup and checked against `PLANS.md` plus the unchanged 86-file / 1,892-link / 529-fragment / 21-PowerShell-block documentation barrier. All seven changed production modules remain RETAINED.

Independent review revalidated the frozen tuple, strict TypeScript, six syntax checks, asset-copy/link rejection, descriptor-safe intake, eight invalid inputs, eight failure projections, stream settlement and route precedence, retained aggregate identity, production/client admission, and 14 negative aggregate mutations. The exact-identity 324-test complete barrier remains reusable; the reviewer performed no public request, browser/service startup, or write. Primary accepted the review only after resolving its sole follow-up.

The unchanged `M105-CMD-FINAL-CLEANUP` then passed after the reusable tuple check. It removed only `run-0caa2763-a445-4576-a296-c714b6403f74`, the exact four-entry client build, and the three empty task scratch roots. The run sibling set remains empty; both Vite caches are absent; the browser runtime retains its frozen identity. The scan record was disposable and not backed up; the build is reproducible. No shared cache, dependency, source, test, receipt, or Git state was changed by cleanup.

The primary reconciled every materially affected current-status owner and developer instruction. Requirements, ADRs, and evaluation literals remain unchanged. Documentation closure covers exact identities and residue, 28 roadmap tasks with 8 Complete and 20 Not started, archived navigation, required plan sections, all relative Markdown links/fragments, changed PowerShell syntax, UTF-8, final newlines, whitespace, and Git endpoint/index/allowed-path checks. No next task, commit, or push is authorized. The final post-archive run passed all checks: 86 Markdown files, 1,892 links, 529 fragments, 21 parsed PowerShell blocks, and 24 changed paths.

### M105-CMD-FINAL-CLEANUP — post-review deletion and generated-output cleanup

The following execution-populated slots are now frozen from the accepted smoke with literal values: `M105-SMOKE-RUN-ID`, `M105-SMOKE-RUN.JSON-SHA256`, `M105-SMOKE-BUILD-DIGEST`, `M105-SMOKE-BROWSER-DIGEST`, and `M105-SMOKE-SIBLING-SET-DIGEST`. The reviewer verifies those values while the aggregate and build still exist. After PASS, a new shell runs `M105-CMD-PREP`, the populated reusable Green-tuple block, and then the frozen smoke literals below before performing this deterministic cleanup. Any mismatch preserves the tree and stops.

```powershell
Assert-M105AcceptedGreenTuple
$m105SmokeRunId = 'run-0caa2763-a445-4576-a296-c714b6403f74'
$m105SmokeHash = '1264348A4B1B09B4E80D9CDC711E5B0CF09FA071F182A8121480416AC821F1F8'
$m105SiblingSetDigest = 'E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855'
$m105SmokeBuildDigest = '1D1198338F4C1E267737F5F9D8F5540854A33A7C7E52BFC3EDC36C35164A503F'
$m105SmokeBrowserDigest = '4FDF9490EDBA2FC4662FF487C591F769F682D8031B3E59FC26C0C35AEE8371CC'
if ($m105SmokeBuildDigest -cne $m105AcceptedBuild.Digest -or
    $m105SmokeBrowserDigest -cne $m105AcceptedRuntime.Digest) { throw 'Smoke identity differs from accepted Green tuple' }
$m105SmokeRunPath = Assert-M105OrdinaryPath (Join-Path $m105RunRoot $m105SmokeRunId)
$m105RunJson = Assert-M105OrdinaryPath (Join-Path $m105SmokeRunPath 'run.json')
if (@(Get-ChildItem -LiteralPath $m105SmokeRunPath -Force).Count -ne 1 -or
    (Get-FileHash -Algorithm SHA256 -LiteralPath $m105RunJson).Hash -cne $m105SmokeHash) { throw 'Smoke aggregate changed before deletion' }
Remove-Item -LiteralPath $m105SmokeRunPath -Recurse -Force -ErrorAction Stop
if (Test-Path -LiteralPath $m105SmokeRunPath) { throw 'Smoke run deletion failed' }
if ((Get-M105RunSetDigest) -cne $m105SiblingSetDigest) { throw 'Pre-existing run set changed during smoke cleanup' }
foreach ($m105Scratch in @($m105ScanTemp,$m105UiTemp,$m105IntegrationTemp)) {
  Assert-M105EmptyDirectory $m105Scratch
  Remove-Item -LiteralPath $m105Scratch -ErrorAction Stop
  if (Test-Path -LiteralPath $m105Scratch) { throw ('Scratch cleanup failed: ' + $m105Scratch) }
}
$m105OwnedBuildIdentity = Get-M105TreeIdentity $m105Build
if ($m105OwnedBuildIdentity.Digest -cne $m105SmokeBuildDigest) { throw 'Build changed before cleanup' }
Remove-Item -LiteralPath $m105Build -Recurse -Force -ErrorAction Stop
if (Test-Path -LiteralPath $m105Build) { throw 'Build cleanup failed' }
if (Test-Path -LiteralPath (Join-Path $m105Repo '.vite-temp')) { throw 'Unexpected repository Vite cache' }
if (Test-Path -LiteralPath (Join-Path $m105Repo 'node_modules/.vite-temp')) { throw 'Unexpected node_modules Vite cache' }
if ((Get-M105TreeIdentity $m105Runtime).Digest -cne $m105SmokeBrowserDigest) {
  throw 'Retained browser changed during cleanup'
}
```

The literal identities are copied only from the accepted smoke and frozen before final review; they are not worker discretion. No parent root, shared npm cache, dependency tree, retained browser, unrelated run, or user data may be removed.

### M105-CMD-DOCUMENTATION-CLOSURE — exact post-mutation validation

The smoke values below are frozen from `M105-SMOKE-RETAINED-001`; every executable identity was copied byte-for-byte from `M105-ACCEPTED-GREEN-TUPLE-001`, including the three accepted tests and all seven receipt records. Recapturing later state is forbidden. The reviewer checks those duplicates against the retained tuple while the build still exists. Run this command only after that review passes, `M105-CMD-FINAL-CLEANUP` deletes the reviewed build and smoke run, all authority/status/developer-instruction updates are made, and the plan moves. In a fresh PowerShell shell, first run `M105-CMD-PREP` from the archived plan to define its read-only helpers and then run this whole block. It is intentionally after every documentation mutation. It reasserts the frozen executable state without requiring the intentionally deleted build, and it neither repairs nor stages anything; any failure leaves M1-05 visibly incomplete for correction.

```powershell
$m105ArchivedPlan = Join-Path $m105Repo 'docs/plans/completed/m1-05-walking-skeleton-integration.md'
$m105ActivePlan = Join-Path $m105Repo 'docs/plans/m1-05-walking-skeleton-integration.md'
$m105FinalSmokeRunId = 'run-0caa2763-a445-4576-a296-c714b6403f74'
$m105FinalSiblingSetDigest = 'E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855'
if (Test-Path -LiteralPath $m105ActivePlan) { throw 'Active M1-05 plan still exists after archive move' }
$null = Assert-M105OrdinaryPath $m105ArchivedPlan
if ((Get-Item -LiteralPath $m105ArchivedPlan -Force).PSIsContainer) { throw 'Archived M1-05 plan is not a file' }
$null = Assert-M105OrdinaryPath $m105ActiveLease -AllowMissing
if (Test-Path -LiteralPath $m105ActiveLease) { throw 'A write lease remains active at closure' }
foreach ($m105Absent in @($m105Build,$m105ScanTemp,$m105UiTemp,$m105IntegrationTemp,
    (Join-Path $m105Repo '.vite-temp'),(Join-Path $m105Repo 'node_modules/.vite-temp'),
    (Join-Path $m105RunRoot $m105FinalSmokeRunId))) {
  $null = Assert-M105OrdinaryPath $m105Absent -AllowMissing
  if (Test-Path -LiteralPath $m105Absent) { throw ('Unexpected M1-05 closure residue: ' + $m105Absent) }
}
if ((Get-M105RunSetDigest) -cne $m105FinalSiblingSetDigest) { throw 'Run siblings changed after final cleanup' }
Assert-M105TreeRecord $m105Runtime ([pscustomobject]@{
  Entries=332; Files=318; Directories=14; Bytes=451193922;
  Digest='4FDF9490EDBA2FC4662FF487C591F769F682D8031B3E59FC26C0C35AEE8371CC'
}) 'Closure retained browser'
$m105ClosureMarker = Get-Item -LiteralPath (Join-Path $m105Browsers 'chromium-1234/DEPENDENCIES_VALIDATED') -Force
if ($m105ClosureMarker.LastWriteTimeUtc -gt [DateTime]::UtcNow -or
    $m105ClosureMarker.LastWriteTimeUtc -lt [DateTime]::UtcNow.AddDays(-30) -or
    (Get-FileHash -Algorithm SHA256 -LiteralPath $m105ClosureMarker.FullName).Hash -cne
      'E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855' -or
    (Get-FileHash -Algorithm SHA256 -LiteralPath (Join-Path $m105Browsers 'chromium-1234/chrome-win64/chrome.exe')).Hash -cne
      '409805A16D6416087E6B2F778DF1CF8F7BBB267D6B99F6B5BB0A618EACE234F2') {
  throw 'Closure browser executable or marker changed'
}

$m105ClosureProductionHashes = [ordered]@{
  'src/server/service.ts'='F4287C98B45ED44486F5A37730C032D251767647789986D0C9505C48B475266B'
  'src/server/main.ts'='2FF29908663A66A8A8A3D265964E3A1D23A6F25C3EED6644B495A51496CCB591'
  'src/server/local-service/contracts.ts'='4419C369C86B3AAEF1402DC9EC9E8075A7995DA767FCA4C87F37C3BBCB6F4EC5'
  'src/server/local-service/input-validation.ts'='FA917578ED8F778138B0B9BFA841570C6B7347A33F17DC7E917C44B1F027F289'
  'src/server/local-service/loopback-api.ts'='8E978B9D892BBA1E07B0CAAFB03A8B291CB2A676F0723899DFA783B7E1CC22FE'
  'src/server/local-service/client-assets.ts'='E6471020C61D34F8C108281F5448391C8A55BF577F365D68CDAFA9E887228C8D'
  'src/client/main.tsx'='C71D80711AD25ABCFF25B5AAFA1790C71588C85F1816B843F210DA459EDF4411'
}
$m105ClosureTestHashes = [ordered]@{
  'tests/walking-skeleton.test.ts'='9CF2120512BA0936D6BFD8585FEA320D4FEE127E8136FCA2EE954D4A3BEF233F'
  'tests/helpers/m105-walking-skeleton-harness.ts'='58B811C0826FD707630B907830EBDF3565202AD03E5680926768BA5F7F1C9A43'
  'tests/local-service.test.ts'='C00F7F66F7819EA856ED2F86C526F0FFD8915B2CC296BEF057DD3024BB8308B0'
}
$m105ClosureProtectedHashes = [ordered]@{
  'package.json'='C2C8718FA44813288ABBA5792FACB3D39400446912EC73DE2A8C93E2A6D92C98'
  'package-lock.json'='ECE19CD10739D5C4139E4700B5A712B89FEFE1F898BE29C4FBF18DD54682C553'
  'tsconfig.json'='3957F80AF41B23DC4CCEFAA6B24823C367E6984980420B596275B8692DF5ABDE'
  'vite.config.ts'='8D75B9863C86A8ECA2267C74D8875BE46061C288F5EAEF6BEA93C427D3DACD07'
  'index.html'='91BEF948D015F0E084708FDECFB79F765437B439D76B1ED70AF55580D815DC88'
}
$m105ClosureSourceTree = [pscustomobject]@{ Entries=52; Files=40; Directories=12; Bytes=155794;
  Digest='1CDEF37A13522636497B196180E537B098C2610E4498C355690C61AB55606B75' }
$m105ClosureTestTree = [pscustomobject]@{ Entries=11; Files=10; Directories=1; Bytes=344299;
  Digest='4D8800E7ACF958D5C914AB686CDBD03A3AE2D5965954D7F8DE7B54F01BDE240C' }
$m105ClosureBuild = [pscustomobject]@{ Entries=4; Files=3; Directories=1; Bytes=225483;
  Digest='1D1198338F4C1E267737F5F9D8F5540854A33A7C7E52BFC3EDC36C35164A503F' }
$m105ClosureRuntime = [pscustomobject]@{ Entries=332; Files=318; Directories=14; Bytes=451193922;
  Digest='4FDF9490EDBA2FC4662FF487C591F769F682D8031B3E59FC26C0C35AEE8371CC' }
$m105ClosureWalkingRecoveryLease = [pscustomobject]@{ Id='M1-05-20260902-06-integration-final-recovery-evidence-01';
  ContractDigest='a048065f8c16adeb53bdd19d2bbad290d88eccc1a31f8b6f4629805ad815ae30';
  ReceiptDigest='67e621ce21c60caece0367f86e4685016ebc801d3ec8af4b87ec2820b11bff4d';
  ReceiptFileHash='D599F06A7D76BCB310FFC9B9CBB0E9BC677E66EE5889620ABDA6334A6E344DE8' }
$m105ClosureWalkingTypeLease = [pscustomobject]@{ Id='M1-05-20260902-06-integration-walking-type-evidence-01';
  ContractDigest='f3044338dfe88af7929670f007b71872381ea77ea2c1c7b67ac4fafe7b11965a';
  ReceiptDigest='acbce985d4297737b7445ed96fdbe408105d72c9a26d272417e13d4a338a937d';
  ReceiptFileHash='12FED60D3E8F8CDFB0834FE73D66B4662CDEC6A1FE8D314F7C26B73E7F8C1866' }
$m105ClosureWalkingDirectLease = [pscustomobject]@{ Id='M1-05-20260902-06-integration-walking-direct-evidence-01';
  ContractDigest='7915de58e568d8ad297a473afab2610a6a5fc551ea3d7b8d3f5a18513af362c2';
  ReceiptDigest='d1e439f5b09a405227c1367370b596038635e78f5655d009a994cb6fabdd0ab2';
  ReceiptFileHash='B105E1F644EEBCF455C3A3F897B5FA0FE3A96911B847F80C3817E486B20DC571' }
$m105ClosureAssetRedLease = [pscustomobject]@{ Id='M1-05-20260902-06-integration-asset-hardening-red-01';
  ContractDigest='bc03d8e13e96338e8ba447dec0ea0f901b7338945a89ab7074d207c00f14bf03';
  ReceiptDigest='10ab999d0a3cc2b4a4d517aa91d1442d29309a7ee9f78de8b0dac45ac5eb9aca';
  ReceiptFileHash='72A67B2C0CDCC3D05D53FFAA7F3594F18EBEE738A680D232DEBFEF2F6EEB2F0A' }
$m105ClosureLocalEntryTestLease = [pscustomobject]@{ Id='M1-05-20260902-06-integration-local-entry-evidence-01';
  ContractDigest='a7554c1f6b314234c131f4c701a30b2b996c2d437ca18133b320dff7cdfd2e32';
  ReceiptDigest='be48bbb2c9b4b8e08317795e3b9f33b5dc4c981076589d0a0456c325a7bd2236';
  ReceiptFileHash='22F3C7F188C7D76841C1F271CD0DEB93704AE74E3CBC404C3ECD047850DAC385' }
$m105ClosureGreenLease = [pscustomobject]@{ Id='M1-05-20260902-06-integration-green-02';
  ContractDigest='fa59652954523ec0a8df6eba8cf83184d7e37bc6ca3780fe44dd60baceb6905b';
  ReceiptDigest='a3d6e2b5cb2a0caa681b1938797976160aec5179068e61f3a8f759617f193940';
  ReceiptFileHash='937046A19A00C8CD42D706AD1739A3593A0BED4275FF80F0086F17423EB20059' }
$m105ClosureAssetGreenLease = [pscustomobject]@{ Id='M1-05-20260902-06-integration-asset-hardening-green-01';
  ContractDigest='400170c789bf38ed1941ba586c860aed9ccff46b263d3c8b7e21196a99eec039';
  ReceiptDigest='cba84a48dc02e75ec18914da183954804051867f08e32e6b596f6dd26843132d';
  ReceiptFileHash='2E5898AD3AB1A8072F108F09D2FB9EDA385F441437719EFB0AD3966E013E422D' }
Assert-M105FileHashes $m105ClosureProductionHashes 'Accepted Green production'
Assert-M105FileHashes $m105ClosureTestHashes 'Accepted tests'
Assert-M105FileHashes $m105ClosureProtectedHashes 'Accepted protected input'
Assert-M105TreeRecord (Join-Path $m105Repo 'src') $m105ClosureSourceTree 'Accepted source tree'
Assert-M105TreeRecord (Join-Path $m105Repo 'tests') $m105ClosureTestTree 'Accepted test tree'
Assert-M105TreeRecord $m105Runtime $m105ClosureRuntime 'Accepted retained browser'
$m105WalkingRecoveryReceipt = Get-M105LeaseReceiptEvidence $m105ClosureWalkingRecoveryLease.Id `
  $m105ClosureWalkingRecoveryLease.ContractDigest $m105WalkingTestPaths
$m105WalkingTypeReceipt = Get-M105LeaseReceiptEvidence $m105ClosureWalkingTypeLease.Id `
  $m105ClosureWalkingTypeLease.ContractDigest $m105WalkingFilePath
$m105WalkingDirectReceipt = Get-M105LeaseReceiptEvidence $m105ClosureWalkingDirectLease.Id `
  $m105ClosureWalkingDirectLease.ContractDigest $m105WalkingFilePath
$m105AssetRedReceipt = Get-M105LeaseReceiptEvidence $m105ClosureAssetRedLease.Id `
  $m105ClosureAssetRedLease.ContractDigest $m105WalkingFilePath
$m105LocalEntryTestReceipt = Get-M105LeaseReceiptEvidence $m105ClosureLocalEntryTestLease.Id `
  $m105ClosureLocalEntryTestLease.ContractDigest $m105LocalEntryTestPaths
$m105GreenReceipt = Get-M105LeaseReceiptEvidence $m105ClosureGreenLease.Id `
  $m105ClosureGreenLease.ContractDigest $m105ProductionPaths
$m105AssetGreenReceipt = Get-M105LeaseReceiptEvidence $m105ClosureAssetGreenLease.Id `
  $m105ClosureAssetGreenLease.ContractDigest @('src/server/local-service/client-assets.ts')
if ($m105WalkingRecoveryReceipt.Digest -cne $m105ClosureWalkingRecoveryLease.ReceiptDigest -or
    $m105WalkingRecoveryReceipt.FileHash -cne $m105ClosureWalkingRecoveryLease.ReceiptFileHash -or
    $m105WalkingTypeReceipt.Digest -cne $m105ClosureWalkingTypeLease.ReceiptDigest -or
    $m105WalkingTypeReceipt.FileHash -cne $m105ClosureWalkingTypeLease.ReceiptFileHash -or
    $m105WalkingDirectReceipt.Digest -cne $m105ClosureWalkingDirectLease.ReceiptDigest -or
    $m105WalkingDirectReceipt.FileHash -cne $m105ClosureWalkingDirectLease.ReceiptFileHash -or
    $m105AssetRedReceipt.Digest -cne $m105ClosureAssetRedLease.ReceiptDigest -or
    $m105AssetRedReceipt.FileHash -cne $m105ClosureAssetRedLease.ReceiptFileHash -or
    $m105LocalEntryTestReceipt.Digest -cne $m105ClosureLocalEntryTestLease.ReceiptDigest -or
    $m105LocalEntryTestReceipt.FileHash -cne $m105ClosureLocalEntryTestLease.ReceiptFileHash -or
    $m105GreenReceipt.Digest -cne $m105ClosureGreenLease.ReceiptDigest -or
    $m105GreenReceipt.FileHash -cne $m105ClosureGreenLease.ReceiptFileHash -or
    $m105AssetGreenReceipt.Digest -cne $m105ClosureAssetGreenLease.ReceiptDigest -or
    $m105AssetGreenReceipt.FileHash -cne $m105ClosureAssetGreenLease.ReceiptFileHash) {
  throw 'Accepted terminal lease identity changed'
}

$m105ClosureAllowedPaths = @(
  'README.md','docs/README.md','docs/DEVELOPMENT_ROADMAP.md','docs/PROJECT_CONCEPT.md',
  'docs/PROJECT_CONTEXT.md','docs/architecture/README.md','docs/architecture/CANDIDATE_ARCHITECTURE.md',
  'docs/requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md',
  'docs/requirements/INFORMATION_AND_WORKFLOW_LIFECYCLE.md','docs/plans/README.md',
  'docs/plans/m1-05-walking-skeleton-integration.md',
  'docs/plans/completed/m1-05-walking-skeleton-integration.md','docs/progress/README.md',
  'docs/progress/m1-05-walking-skeleton-integration.md'
) + $m105ProductionPaths + $m105AcceptedTestPaths
$m105ClosureRequiredPaths = @(
  'README.md','docs/README.md','docs/DEVELOPMENT_ROADMAP.md','docs/plans/README.md',
  'docs/plans/m1-05-walking-skeleton-integration.md',
  'docs/plans/completed/m1-05-walking-skeleton-integration.md','docs/progress/README.md',
  'docs/progress/m1-05-walking-skeleton-integration.md'
) + $m105ProductionPaths + $m105AcceptedTestPaths
$m105Head = (& git rev-parse HEAD).Trim()
$m105Branch = (& git branch --show-current).Trim()
if ($m105Head -cne '552f57ec93f23cde164e3327fba06ba961fa1286' -or
    $m105Branch -cne 'codex/m1-05-walking-skeleton-integration') { throw 'Closure Git endpoint changed' }
$m105Staged = @(& git diff --cached --name-only)
if ($LASTEXITCODE -ne 0 -or $m105Staged.Count -ne 0) { throw 'Closure Git index is not empty' }
$m105Status = @(& git -c status.renames=false status --porcelain=v1 --untracked-files=all)
if ($LASTEXITCODE -ne 0) { throw 'Cannot inspect closure worktree' }
$m105ChangedPaths = @($m105Status | ForEach-Object {
  if ($_.Length -lt 4) { throw 'Malformed closure Git status row' }
  $_.Substring(3).Replace('\','/')
} | Sort-Object -Unique)
foreach ($m105Changed in $m105ChangedPaths) {
  if ($m105ClosureAllowedPaths -notcontains $m105Changed) { throw ('Unexpected closure path: ' + $m105Changed) }
}
foreach ($m105Required in $m105ClosureRequiredPaths) {
  if ($m105ChangedPaths -notcontains $m105Required) { throw ('Missing required closure path: ' + $m105Required) }
}

$m105RoadmapText = [IO.File]::ReadAllText((Join-Path $m105Repo 'docs/DEVELOPMENT_ROADMAP.md'))
$m105TaskStatuses = @([regex]::Matches($m105RoadmapText,
  '(?m)^- \*\*Parent (?:milestone|gate) / role / status:\*\* [^\r\n]* / \*\*(Not started|In progress|Blocked|Complete)\*\*\.\r?$') |
  ForEach-Object { $_.Groups[1].Value })
if ($m105TaskStatuses.Count -ne 28 -or @($m105TaskStatuses | Where-Object { $_ -ceq 'Complete' }).Count -ne 8 -or
    @($m105TaskStatuses | Where-Object { $_ -ceq 'Not started' }).Count -ne 20 -or
    @($m105TaskStatuses | Where-Object { $_ -ceq 'In progress' -or $_ -ceq 'Blocked' }).Count -ne 0) {
  throw 'Roadmap task-status totals are not the M1-05 closure state'
}
$m105M105Block = [regex]::Match($m105RoadmapText,
  '(?ms)^### M1-05 — Integrate and verify the walking skeleton\r?\n.*?(?=^### |\z)').Value
if ($m105M105Block -notmatch '(?m)^- \*\*Parent milestone / role / status:\*\* M1 / integration and verification / \*\*Complete\*\*\.\r?$' -or
    $m105M105Block -notmatch 'plans/completed/m1-05-walking-skeleton-integration\.md') {
  throw 'Roadmap M1-05 block is not Complete with the archived plan'
}
$m105PlanIndex = [IO.File]::ReadAllText((Join-Path $m105Repo 'docs/plans/README.md'))
if ($m105PlanIndex -notmatch '\(completed/m1-05-walking-skeleton-integration\.md\).*\*\*Complete\*\*' -or
    $m105PlanIndex -match '\]\(m1-05-walking-skeleton-integration\.md\)') { throw 'Plan index is not archived/Complete' }
$m105ProgressIndex = [IO.File]::ReadAllText((Join-Path $m105Repo 'docs/progress/README.md'))
if ($m105ProgressIndex -notmatch '\.\./plans/completed/m1-05-walking-skeleton-integration\.md\) \| Complete \|') {
  throw 'Progress index does not mirror M1-05 Complete'
}
$m105ProgressRecord = [IO.File]::ReadAllText((Join-Path $m105Repo 'docs/progress/m1-05-walking-skeleton-integration.md'))
if ($m105ProgressRecord -notmatch '(?m)^- \*\*Mirrored roadmap status:\*\* Complete$' -or
    $m105ProgressRecord -notmatch '\.\./plans/completed/m1-05-walking-skeleton-integration\.md') {
  throw 'M1-05 progress record is not closed against the archived plan'
}
$m105CurrentOwners = @('README.md','docs/README.md','docs/DEVELOPMENT_ROADMAP.md',
  'docs/PROJECT_CONCEPT.md','docs/PROJECT_CONTEXT.md','docs/architecture/README.md',
  'docs/architecture/CANDIDATE_ARCHITECTURE.md',
  'docs/requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md',
  'docs/requirements/INFORMATION_AND_WORKFLOW_LIFECYCLE.md','docs/plans/README.md','docs/progress/README.md')
$m105StalePattern = '(?i)M1-05 is In progress|HTTP (?:scan )?integration remains unimplemented|' +
  'service/scanner/UI wiring remains unimplemented|durable scan-to-disk integration; that remains M1-05|' +
  'Public HTTP/scan-to-disk integration and the public-page smoke remain M1-05|' +
  'wiring this callback into the service remains M1-05|M1-05 must preserve'
foreach ($m105Owner in $m105CurrentOwners) {
  $m105OwnerText = [IO.File]::ReadAllText((Join-Path $m105Repo $m105Owner))
  if ($m105OwnerText -match $m105StalePattern) { throw ('Stale M1-05 current-status text: ' + $m105Owner) }
}

function Get-M105MarkdownAnchors([string]$Path) {
  $m105Anchors = [Collections.Generic.HashSet[string]]::new([StringComparer]::Ordinal)
  $m105Counts = @{}; $m105Fence = ''
  foreach ($m105Line in [IO.File]::ReadAllLines($Path)) {
    if ($m105Line -match '^\s*(```+|~~~+)') {
      $m105Mark = $Matches[1].Substring(0,3)
      if (-not $m105Fence) { $m105Fence = $m105Mark } elseif ($m105Fence -eq $m105Mark) { $m105Fence = '' }
      continue
    }
    if ($m105Fence) { continue }
    foreach ($m105IdMatch in [regex]::Matches($m105Line,
        '<a\s+(?:[^>]*?\s)?(?:id|name)=["'']([^"'']+)["'']','IgnoreCase')) {
      [void]$m105Anchors.Add($m105IdMatch.Groups[1].Value)
    }
    if ($m105Line -notmatch '^\s{0,3}#{1,6}\s+(.+?)\s*#*\s*$') { continue }
    $m105Heading = [regex]::Replace($Matches[1],'!\[([^\]]*)\]\([^)]*\)','$1')
    $m105Heading = [regex]::Replace($m105Heading,'\[([^\]]+)\]\([^)]*\)','$1')
    $m105Heading = [regex]::Replace($m105Heading,'<[^>]+>','').ToLowerInvariant()
    $m105Slug = ([regex]::Replace($m105Heading,'[^\p{L}\p{M}\p{Nd}_\- ]','') -replace ' ','-')
    if (-not $m105Counts.ContainsKey($m105Slug)) { $m105Counts[$m105Slug]=0; $m105Anchor=$m105Slug }
    else { $m105Counts[$m105Slug]++; $m105Anchor="$m105Slug-$($m105Counts[$m105Slug])" }
    [void]$m105Anchors.Add($m105Anchor)
  }
  return ,$m105Anchors
}
$m105Markdown = @(@(& git ls-files -- '*.md') + @(& git ls-files --others --exclude-standard -- '*.md') |
  Sort-Object -Unique | Where-Object { Test-Path -LiteralPath (Join-Path $m105Repo $_) })
$m105AnchorCache = @{}; $m105Broken = [Collections.Generic.List[string]]::new()
[int]$m105LinkCount=0; [int]$m105FragmentCount=0; [int]$m105PowerShellCount=0
$m105StrictUtf8 = [Text.UTF8Encoding]::new($false,$true)
foreach ($m105Relative in $m105Markdown) {
  $m105Source = Join-Path $m105Repo $m105Relative
  $m105Bytes = [IO.File]::ReadAllBytes($m105Source)
  try { $m105Text = $m105StrictUtf8.GetString($m105Bytes) } catch { throw ('Invalid UTF-8: ' + $m105Relative) }
  if (-not $m105Text.EndsWith("`n") -or $m105Text -match '(?m)[ \t]+\r?$') {
    throw ('Markdown newline or trailing-whitespace failure: ' + $m105Relative)
  }
  if ($m105ChangedPaths -contains $m105Relative) {
    foreach ($m105Block in [regex]::Matches($m105Text,'(?ms)^```powershell[^\r\n]*\r?\n(.*?)^```\s*$')) {
      $m105Tokens=$null; $m105Errors=$null
      [void][Management.Automation.Language.Parser]::ParseInput($m105Block.Groups[1].Value,
        [ref]$m105Tokens,[ref]$m105Errors)
      if ($m105Errors.Count) { throw ('PowerShell example parse failure: ' + $m105Relative) }
      $m105PowerShellCount++
    }
  }
  $m105Fence=''; $m105LineNumber=0
  foreach ($m105Line in [IO.File]::ReadAllLines($m105Source)) {
    $m105LineNumber++
    if ($m105Line -match '^\s*(```+|~~~+)') {
      $m105Mark=$Matches[1].Substring(0,3)
      if (-not $m105Fence) { $m105Fence=$m105Mark } elseif ($m105Fence -eq $m105Mark) { $m105Fence='' }
      continue
    }
    if ($m105Fence) { continue }
    foreach ($m105Link in [regex]::Matches($m105Line,
        '!?\[[^\]]*\]\((?<target><[^>]+>|[^)\s]+)(?:\s+["''][^"'']*["''])?\)')) {
      $m105Target=$m105Link.Groups['target'].Value.Trim('<','>')
      if ($m105Target -match '^[A-Za-z][A-Za-z0-9+.-]*:') { continue }
      $m105LinkCount++; $m105Parts=$m105Target -split '#',2
      $m105PathPart=[Uri]::UnescapeDataString($m105Parts[0])
      $m105Fragment=$(if($m105Parts.Count -eq 2){[Uri]::UnescapeDataString($m105Parts[1])}else{''})
      $m105TargetPath=$(if([string]::IsNullOrEmpty($m105PathPart)){$m105Source}else{
        [IO.Path]::GetFullPath((Join-Path (Split-Path $m105Source -Parent) $m105PathPart))})
      $m105RepoPrefix=$m105Repo.TrimEnd('\')+'\'
      if (-not $m105TargetPath.StartsWith($m105RepoPrefix,[StringComparison]::OrdinalIgnoreCase) -or
          -not (Test-Path -LiteralPath $m105TargetPath)) {
        $m105Broken.Add("$m105Relative`:$m105LineNumber missing $m105Target"); continue
      }
      if ($m105Fragment) {
        $m105FragmentCount++; $m105Key=$m105TargetPath.ToLowerInvariant()
        if (-not $m105AnchorCache.ContainsKey($m105Key)) {
          $m105AnchorCache[$m105Key]=Get-M105MarkdownAnchors $m105TargetPath
        }
        if (-not $m105AnchorCache[$m105Key].Contains($m105Fragment)) {
          $m105Broken.Add("$m105Relative`:$m105LineNumber fragment $m105Target")
        }
      }
    }
  }
}
if ($m105Broken.Count) { throw ('Broken Markdown targets: ' + ($m105Broken -join '; ')) }
$m105RequiredSections = @('Progress','Surprises & Discoveries','Decision Log','Outcomes & Retrospective',
  'Purpose / Big Picture','Context and Orientation','Scope and Non-Goals','Plan of Work','Concrete Steps',
  'Validation and Acceptance','Idempotence and Recovery','Artifacts and Notes','Interfaces and Dependencies','Revision Note')
$m105ArchivedText = [IO.File]::ReadAllText($m105ArchivedPlan)
foreach ($m105Section in $m105RequiredSections) {
  if ($m105ArchivedText -notmatch ('(?m)^## ' + [regex]::Escape($m105Section) + '\r?$')) {
    throw ('Archived plan missing section: ' + $m105Section)
  }
}
git diff --check
if ($LASTEXITCODE -ne 0) { throw 'git diff --check failed at documentation closure' }
[pscustomobject]@{ MarkdownFiles=$m105Markdown.Count; Links=$m105LinkCount;
  Fragments=$m105FragmentCount; ParsedPowerShellBlocks=$m105PowerShellCount;
  ChangedPaths=$m105ChangedPaths.Count; RoadmapComplete=8; RoadmapNotStarted=20 }
```

## Concrete Steps

Work from `C:\Users\mmjos\Desktop\workbeanch\a11y-evidence-lab`.

The four structural slices, their corrections, the App dead-state cleanup, integration, and public-smoke checkpoints are complete. Commands above preserve the reviewed execution and recovery history; do not replay one-shot evidence capture or cleanup.

1. Recheck M1-05 `In progress`, M1-02/M1-03/M1-04 `Complete`, and the plan-review verdict. After PASS only, the primary runs `M105-CMD-PREP` and `Assert-M105PlanningIdentity`; that executable gate requires the exact HEAD, branch, plan-only worktree path, empty index, absent active lease, whole source/test tree identities, five protected build inputs, retained runtime/executable/marker identities, and generated-path absence. The primary then runs `M105-CMD-PREFLIGHT-SETUP`, records the three created ignored empty roots, and stops on drift or an unresolved finding.
2. Create Milestone Assignment Packet v2 for `M105-WALKING-SKELETON-INTEGRATION-06`, filling every field including the responsibility/cohesion map, exact two-file Red scope, exact seven-file Green scope, forbidden test/component/style/configuration paths, commands, side effects, evidence identities, budget, and stops.
3. Send the packet with `Lease ID: None` to one persistent `test_worker` for read-only preflight. In a fresh shell it runs `M105-CMD-PREP` and exactly `M105-CMD-PREFLIGHT`; the block asserts the planning identity before and after, records separate counts/exits/identities, and proves zero net build/cache/scratch residue. Accept only `MISSING`, or a primary-reconciled `PARTIAL` whose missing boundary remains exactly the frozen same-origin integration outcome.
4. Start attempt-1 Red lease `M1-05-20260902-06-integration-red-01` for only `tests/walking-skeleton.test.ts` and `tests/helpers/m105-walking-skeleton-harness.ts`, insert and verify the guard digest, and let the same test worker add the smallest complete controlled matrix. Terminally close the lease and accept Red only when the failure is caused by the absent production route/static/client wiring and all existing environment checks pass. Before any other write, run the exact Red receipt/path/test-hash block, freeze its literals in this plan, fingerprint the Red build, and remove only that recognized build.
5. Freeze the accepted two-file test boundary. Start separate attempt-1 Green lease `M1-05-20260902-06-integration-green-01` for only the seven named production paths, explicitly forbid the accepted tests plus all UI components/styles and executable configuration, insert and verify the digest, and assign one `code_worker` to reach minimum Green. The worker may perform only the permitted local Refactor and must return a cohesion disposition.
6. Terminally close the Green lease. Inspect the actual diff, request/result boundaries, static response table, imports, runtime calls, lifecycle and persistence ownership, unchanged tests, absence of provider paths, focused result, and cohesion disposition before accepting Green. Before plan maintenance or another command, run `M105-CMD-GREEN-EVIDENCE`; require fresh guard status and freeze its single source/test/protected-input/build/runtime/receipt object as `M105-ACCEPTED-GREEN-TUPLE-001`. Populate the one reusable assertion block from that object without recapturing later state.
7. In a fresh shell run `M105-CMD-PREP`, the populated reusable tuple block, and `M105-CMD-COMPLETE`: strict TypeScript, changed-file syntax, each of the six backend/scanner/integration files sequentially, the unchanged 30-case UI suite separately, asset-route checks, test-relevance audit, and the same tuple assertion before and after. Record exact commands and counts. Retain the identity-frozen build and empty scratch roots for the later smoke; any failure or stale/mutable evidence stops.
8. Obtain a fresh S3 `critical_reviewer` verdict for the slice. Apply at most one supported same-contract correction through the original role, scope, phase, and attempt-2 lineage; a changed contract or unresolved finding stops.
9. Update this plan and the M1-05 progress record only after the controlled integration checkpoint is accepted. Copy the already frozen tuple literals; do not recapture or replace its seven production, two test, protected-input, build, runtime, or receipt identities. Primary-owned documentation changes occur between leases; no worker edits evidence or authority documents.
10. Obtain the exact owner-authorized public target and disposable-run declaration, then run `M105-TRUSTED-PUBLIC-SMOKE-07` once through `M105-CMD-PUBLIC-SMOKE`. Both shells assert the same accepted Green tuple before execution; after clean stop, assert it again. Record only content-safe observational evidence, validate the aggregate through HTTP and disk, freeze the exact smoke/build/runtime/sibling-set identities, and retain the aggregate and build.
11. Audit every test/helper/mock/fixture/skip/focus marker; reconcile README developer instructions and every affected authority/status/navigation statement into a review-ready, still-`In progress` state; and recheck source, build, aggregate, sibling-set, browser, scratch, Git, and guard identities. Populate the documentation-closure production, test, protected-input, source-tree, test-tree, and Red/Green receipt literals by byte-for-byte copy from `M105-ACCEPTED-GREEN-TUPLE-001`, and populate its smoke literals from `M105-SMOKE-RETAINED-001`; do not recapture later state. Do not remove any reviewed artifact yet.
12. Obtain a different fresh integrated `critical_reviewer` verdict because critical HTTP/persistence/identity/deletion surfaces remain in the final state. The reviewer must inspect the actual retained smoke aggregate, controlled evidence, build, current worktree, documentation, and exact final-cleanup literals. An unresolved finding stops; a source/test correction invalidates the affected evidence and requires the applicable workflow replay.
13. Only after PASS, run the accepted Green tuple assertion and `M105-CMD-FINAL-CLEANUP`: delete the one declared smoke run, verify all pre-existing run identities unchanged, remove only the exact owned build and empty scratch roots, and verify the retained browser and both forbidden Vite-cache paths. Next update every affected README/developer instruction and authority/status statement, set the roadmap row to Complete, move this plan to `docs/plans/completed/`, repair the plan/progress/documentation links, and record the final progress closure. Only after those mutations, run `M105-CMD-PREP` from the archived plan and exact `M105-CMD-DOCUMENTATION-CLOSURE`; it reasserts the frozen seven production files, three accepted test files, whole source/test trees, five protected inputs, and all seven terminal receipt identities while requiring the reviewed build to remain absent, then validates the archived path, generated state, sibling/runtime identity, allowed/required Git paths, empty index, 8/20 roadmap totals, status mirrors, stale current prose, all current Markdown links/fragments/UTF-8/newlines/whitespace, every changed PowerShell example, required plan sections, and `git diff --check`. Declare M1-05 closed only when that post-change block passes; otherwise preserve the visible incomplete closure diff for correction. Commit and push remain separate owner-authorized actions.

## Validation and Acceptance

Accept `M105-LOCAL-SERVICE-MODULE-REFACTOR-01` only when:

- the test worker independently classifies the behavior as `EXISTING_AND_COVERED` and the exact 69 cases pass;
- `src/server/service.ts` still exports `startLocalService`, `ReadResult`, `ScanOutcome`, `StopResult`, `LocalService`, `StartResult`, and `ServiceOptions` with unchanged signatures and discriminants;
- malformed configuration and malformed scan input cause no storage or network effects;
- all ordering-sensitive behaviors listed in the slice contract remain covered and passing;
- only the five allowed production paths change;
- strict TypeScript, every extracted-module syntax check, and all 290 backend/scanner cases pass;
- the implementation worker reports cohesion `REFACTORED`, primary inspection accepts it, and fresh S3 review returns PASS with no unresolved finding; and
- documentation closure records that the change is internal, preserves public behavior, and does not complete M1-05.

Tests, fixtures, mocks, helpers, skipped tests, and focused markers receive a relevance audit at the slice barrier. The expected outcome is no change: the 69-case service suite remains behavioral, all collaborator fakes still exercise public seams, and there are no layout assertions, snapshots, skipped cases, or focused-only markers to add or remove.

Accept `M105-SCANNER-MODULE-REFACTOR-02` only when:

- the test worker independently classifies the behavior as `EXISTING_AND_COVERED` and the exact 88 scanner cases pass under the required M1-03 environment;
- `scan-page.ts` still exports `prepareScanRequest`, `captureNativeScan`, and `executeScan`, while `normalize-scan.ts` still exports `NormalizationResult` and `normalizeNativeScan`;
- native rules, buckets, validation and failure precedence, evidence minimization, UUID and item ordering, browser options, timeouts, terminal results, late acquisition, cleanup, and failure truthfulness are behaviorally unchanged;
- reporter helpers remain inside the serialized reporter and every named lifecycle local remains inside `executeScan`;
- only the seven allowed production paths change;
- strict TypeScript, every resulting-module syntax check, all 88 scanner cases, and all 290 backend/scanner cases pass;
- scanner scratch is empty, downloads and generated output are unchanged or absent as required, and fixtures, manifests, dependencies, and executable configuration are unchanged;
- the implementation worker reports cohesion `REFACTORED`, primary inspection accepts it, and fresh S3 review returns PASS with no unresolved finding; and
- documentation closure records that the change is internal, preserves public behavior, does not reopen M1-03, and does not complete M1-05.

The scanner tests receive the same relevance audit. The expected outcome is no change: the 20 normalization cases and 68 scan-execution cases remain the behavior boundary, with no file-layout assertions, implementation snapshots, skipped cases, or focused-only markers added.

Accept `M105-RUN-CONTRACT-MODULE-REFACTOR-03` only when:

- the test worker independently classifies the behavior as `EXISTING_AND_COVERED` and the 30 static contract cases execute 58 passing TAP tests unchanged;
- the public façade exports exactly the current seven public types and two runtime validators, and every current consumer continues importing from the same path;
- exact values, key requirements, safe-inspection behavior, bounded errors, immutability, ordering, coverage, identity, chronology, cleanup, and failure semantics remain unchanged;
- every policy tuple exported between internal modules is frozen and has no mutable backing alias;
- only the seven allowed production paths change and the internal import graph is acyclic and points from coordinators to lower validation layers;
- strict TypeScript, seven syntax checks, the 30 focused cases, all 290 backend/scanner cases, and the production build pass;
- scanner scratch and generated build output are removed, protected inputs are unchanged, and the implementation worker reports cohesion `REFACTORED` with primary acceptance;
- fresh S3 review returns PASS with no unresolved finding; and
- documentation closure records that the change is internal, preserves the canonical aggregate and public behavior, and does not complete M1-05.

The 30 static contract cases and their 28 generated concealed-array-extension cases receive the same relevance audit. The expected outcome is no change: all 58 TAP tests remain behavior-oriented through the stable façade, with no file-layout assertions, snapshots, skipped cases, todos, or focused-only markers added.

Accept `M105-RUN-REPOSITORY-MODULE-REFACTOR-04` only when:

- the test worker independently classifies the behavior as `EXISTING_AND_COVERED` and all 55 repository cases pass unchanged;
- the façade preserves the current seven public types and `openRunRepository`, and every current production/test consumer continues importing through it;
- Windows path admission, exact spelling, collision handling, topology and filesystem identity, validation and error precedence, transition rules, serialization, publication ordering, interruption behavior, canonical-byte preservation, and cleanup truthfulness remain unchanged;
- the default `node:fs` value object remains the call surface in every module that performs filesystem operations, and staged publication state remains inside `openRunRepository`;
- only the five allowed production paths change, with no test, fixture, dependency, configuration, persisted-format, generated-output, or Git-state drift;
- strict TypeScript, five syntax checks, all 55 focused cases, and all 290 backend/scanner cases pass, with empty scanner scratch and unchanged retained browser runtime;
- the implementation worker reports cohesion `REFACTORED`, primary inspection accepts it, and fresh S3 review returns PASS with no unresolved finding; and
- documentation closure records that the change is internal, preserves ADR-0021 and completed M1-02 semantics, and does not complete M1-05.

The repository tests receive the same relevance audit. The expected outcome is no change: all 55 cases remain behavior-oriented through the stable façade, with real filesystem and process-interruption coverage and no file-layout assertions, snapshots, skipped cases, todos, or focused-only markers added.

Accept `M105-APP-DEAD-STATE-CLEANUP-05` only when:

- independent preflight returns `EXISTING_AND_COVERED` for all 30 unchanged browser cases;
- the only production diff removes the declaration and two setter calls for `pendingAnalysis`;
- `App`, `AppProps`, `AnalyzeIntent`, orchestration state, lifecycle ordering, rendered output, focus, announcements, and accessibility behavior remain unchanged;
- all 30 focused browser cases, strict TypeScript, production build, and the complete sequential 290 plus 30 regression pass;
- tests, harness, components, admission, styles, dependencies, configuration, and retained browser runtime remain unchanged;
- scanner/UI scratch, `dist/client`, repository-root `.vite-temp`, and `node_modules/.vite-temp` are absent after exact cleanup;
- the worker and primary report cohesion `RETAINED`, fresh S1 review returns PASS with no unresolved finding, and documentation records that M1-05 remains In progress.

Accept `M105-WALKING-SKELETON-INTEGRATION-06` only when:

- read-only preflight returns `MISSING`, or primary-reconciled `PARTIAL`, for exactly the absent same-origin production integration while the current toolchain, existing source, 182 browser-free cases, scanner boundary, and UI boundary remain healthy;
- the guarded two-file Red proves the complete controlled matrix and fails specifically on missing production behavior before any Green write;
- the guarded Green changes only the seven named production paths, leaves the accepted test boundary byte-identical, and introduces no dependency, executable-configuration, fixture, schema, scanner-policy, repository-format, component, style, or product-copy change;
- API-only construction preserves the current read-only behavior byte-for-byte at the JSON value boundary—health `scan: false`, every POST 405, no body consumption, and unchanged read routing—while only a successfully loaded configured client enables `POST /api/runs` and truthful health `scan: true`;
- configured `POST /api/runs` admits only the exact media type and target-plus-mode JSON, settles aborted/error streams once without a run effect, derives all other context on the service side, maps the frozen statuses and existing outcome body, and preserves method/query/health/stopping/API/static/socket precedence;
- the production start path validates the absolute ordinary closed client root before repository/listener effects, reports `client-unavailable` rather than readiness for every frozen invalid build topology, and serves only the exact built entry and finite direct asset table with fixed MIME types and no request-path filesystem access;
- the built client enables the existing Analyze path through same-origin fetch while every M1-04 component, visible state, focus rule, announcement, validation message, omission, and responsive/accessibility contract remains unchanged;
- controlled Local nonzero/multi-finding/native-incomplete, Groq valid-zero, and visible navigation-failure lanes each traverse the actually served browser form, same-origin fetch, exact HTTP intake, real intercepted `executeScan`, service-owned persistence, response admission, and the existing Results/failure presentation; representative malformed input, request-stream failure, contention, startup failure, stop, validated reads, cleanup, sibling preservation, and exact deletion pass at their direct owning boundaries;
- scan execution makes no provider request, browser code gains no privileged authority, raw page/native/network content enters neither the aggregate nor tracked evidence, and the exact-three-rule/fresh-context/top-level/no-interaction/no-download boundaries remain true;
- strict TypeScript, changed-file syntax, native production build, the complete backend/scanner/integration suite, and all 30 unchanged UI cases pass with zero failure, cancellation, skip, todo, or focused-only marker; final exact counts are recorded;
- the implementation worker reports `RETAINED` or `REFACTORED` with exact responsibility-fit evidence, primary inspection accepts both behavior and placement, and a fresh S3 review returns PASS with no unresolved finding; and
- scanner/UI/integration scratch is empty, both `.vite-temp` paths remain absent, and exact build/runtime identities are retained unchanged through the slice review and public smoke; final task cleanup later removes only the reviewed build and empty scratch while preserving the retained browser runtime, dependencies, fixtures, manifests, unrelated data, and user work; and
- after every final authority, status, navigation, progress, and archive mutation, the closure command reasserts the frozen production/test/protected-input/tree/lease-receipt identities without the intentionally deleted build before M1-05 may be marked closed.

The test-relevance audit must confirm that the new integration tests prove only cross-boundary behavior, while the existing contract, repository, service, scanner, and UI suites continue owning their lower-level matrices. Do not duplicate all validation permutations in the browser, assert private module layout, snapshot native payloads, weaken existing cases, or retain a helper that merely wraps one call.

Accept `M105-TRUSTED-PUBLIC-SMOKE-07` only when:

- the owner supplied exactly one permitted, trusted, non-sensitive public HTTPS target and declared the generated smoke run disposable before execution;
- the native production build and developer-started service report readiness, the developer opens the enumerated loopback URL manually in installed Chrome or Edge, and one Analyze action completes through the real managed scanner with all three rules covered;
- the accepted UI visibly presents normalized page identity, result overview/details as applicable, native incomplete items separately when present, and the non-certification limitation without exposing run/scanner/provider internals, a Run ID, or reopen control;
- the canonical `run.json` validates through the application-owned boundary, contains the complete minimized result and no prohibited raw material, and no provider is invoked;
- the service and managed browser resources stop cleanly and all owned scratch is empty;
- the exact aggregate, build, browser, application-revision, environment-name, and pre-existing-run-set identities are frozen and remain present and unchanged through the different final integrated review; and
- only after that review returns PASS, the exact declared run directory is removed and absent, every pre-existing run identity remains unchanged, and the controlled integration lane remains the mandatory sibling-preservation proof. No target content or private result is copied into tracked documentation.

Mark M1-05 Complete only when both remaining checkpoints pass, every earlier accepted slice remains valid, the full closure suite passes from clean owned state, a different fresh integrated critical review inspects the retained aggregate/build and returns PASS, post-review exact deletion/generated cleanup passes, and the documentation gate reconciles the roadmap, README developer instructions and status, plan/progress indexes, this plan, and affected authority navigation. M2-01 remains blocked until that exact closure.

## Idempotence and Recovery

Read-only inspection and verification commands are safe to repeat after confirming no owned processes or test residue remain. The extraction is additive except for moved declarations inside `service.ts`; a stopped worker must not be reset or reverted automatically. Close the lease, inspect the actual five-path state, preserve unrelated work, and issue at most one fresh attempt-2 packet with the same scope and terminal attempt-1 parent when the correction remains inside the frozen contract.

For the run-contract slice, the extraction is additive except for declarations moved from the façade. A stopped worker must preserve the seven-path state; the primary closes the lease, inspects exact exports and dependencies, and may issue one attempt-2 packet only for the same frozen contract. A cycle, public-boundary drift, validation change, mutable policy, or need for another path requires reconciliation rather than automatic continuation.

For the run-repository slice, the extraction is additive except for declarations moved from the façade. A stopped worker must preserve the five-path state; the primary closes the lease, inspects exact exports, filesystem imports, publication placement, and focused behavior, and may issue one attempt-2 packet only for the same frozen contract. Public-boundary drift, changed error or cleanup precedence, movement of publication state, or need for another path requires reconciliation rather than automatic continuation.

For `M105-WALKING-SKELETON-INTEGRATION-06`, every Red or Green write stops at lease closure. Preserve a compliant partial tree and inspect it; never reset or revert user or worker changes automatically. A same-contract correction is permitted once per role only with the identical work-slice contract, phase, path scope, commands, responsibility map, and terminal attempt-1 parent. A new route, status model, component/style change, dependency, asset-serving strategy, request-bound framework, persisted field, scanner policy, or production path changes a binding field and requires a reconciled packet before any write.

Build output and integration scratch are disposable, but cleanup is exact and evidence-backed. Before removing anything, resolve its absolute path inside this workspace, verify ordinary non-link topology and task ownership, and use the narrowest target. Never remove `node_modules`, `m104-browser-runtime`, a shared Playwright cache, `data/runs` as a root, an unrecognized run, or any pre-existing sibling. If a test or smoke leaves a browser/service process, uncertain cleanup, staged file, active lease pointer, or unclassified run directory, stop; preserve the evidence and obtain owner direction rather than hiding it.

The public smoke is not retried automatically. A target/network mutation failure is recorded as non-reusable observation, the service is stopped and task-owned residue is reconciled, and the primary requests one owner-directed target replacement at most. A product defect returns to the already bounded implementation correction route only if the accepted contract and path scope remain unchanged; otherwise execution stops for replanning.

An unexpected file, changed accepted test during Green, Git mutation, public API drift outside the frozen additions, behavior difference, active-resource leak, or need for shared lifecycle state outside `service.ts` freezes writes. The primary reconciles the tree and this plan before any new assignment. No worker stages, commits, pushes, changes refs, stashes, worktrees, remotes, repository configuration, or hooks.

## Artifacts and Notes

Retain in this plan only the accepted preflight identity and result, Red and Green lease/digest/receipt identities, the single accepted Green tuple, exact changed paths, focused/strict/syntax/full results, cohesion disposition, reviewer verdict, and any bounded correction lineage. Guard runtime records remain ignored workflow state and are not copied into tracked documentation.

For the controlled integration checkpoint, retain the exact three test hashes, seven production hashes, complete source/test-tree identities, five protected inputs, all seven terminal receipt identities, focused and sequential command/count results, build/runtime identities, request/asset boundary audit, empty-scratch proof, cohesion disposition, and S3 verdict as the single `M105-ACCEPTED-GREEN-TUPLE-001`. For `M105-SMOKE-RETAINED-001`, retain only the content-safe run ID and `run.json` hash, application/source/build/browser/environment-name identities, mode, date, terminal status, exact rule-coverage names, item counts, validator/read/stop/cleanup results, pre-existing-run-set digest, and final-review verdict. Never retain the public target, redirect, page title/content, Finding/evidence values, raw response, terminal transcript, or secret. The aggregate itself remains local and reviewable only until the post-review exact deletion.

Planning baseline `M105-INTEGRATION-PLAN-BASELINE-002` was captured before this documentation edit at clean HEAD `a9ccb01f19db386e82c5a00f163c6525b66cb9c0` on branch `codex/m1-05-walking-skeleton-integration`. Node reported `v24.20.0`; independent strict TypeScript passed; and `node --test --test-timeout=120000 tests/run-contract.test.ts tests/run-repository.test.ts tests/local-service.test.ts` passed 182/182 with zero failure, cancellation, skip, or todo. The whole source tree was 51 entries / 147,831 bytes / `8960366EC4E34C2C3649C44D7FDED9077AA28EFA90E456FE350988FA735C7A21`; the whole test tree was nine entries / 317,970 bytes / `B96EC7A3DB35396475C5485180D880BB5F36DCC3F19DA475E9D811BFE1216840`. `dist/client`, `temp/m103-scan`, `temp/m104-ui`, `temp/m105-integration`, repository-root `.vite-temp`, and `node_modules/.vite-temp` were absent; `data/runs` was an ordinary empty directory. The retained `m104-browser-runtime` exact command identity was 332 entries, 318 files, 14 directories, 451,193,922 bytes, digest `4FDF9490EDBA2FC4662FF487C591F769F682D8031B3E59FC26C0C35AEE8371CC`, with the marker and executable identities frozen under `M105-CMD-PREFLIGHT-SETUP`. Protected identities were `package.json` `c2c8718fa44813288abba5792facb3d39400446912ec73de2a8c93e2a6d92c98`, `package-lock.json` `ece19cd10739d5c4139e4700b5a712b89fefe1f898be29c4fbf18dd54682c553`, `tsconfig.json` `3957f80af41b23dc4ccefaa6b24823c367e6984980420b596275b8692df5abde`, `vite.config.ts` `8d75b9863c86a8eca2267c74d8875be46061c288f5eaef6bea93c427d3dacd07`, and `index.html` `91bef948d015f0e084708fdecfb79f765437b439d76b1ed70af55580d815dc88`. This proves planning readiness only; it is not Red, Green, browser, public-network, or task-completion evidence.

Historical execution baseline `M105-INTEGRATION-PLAN-BASELINE-003` was captured at clean HEAD `bbce48b27d4f7528ee73c79eacd8ffc27acc24b0` on the same branch before its correction. `git diff --name-status a9ccb01f19db386e82c5a00f163c6525b66cb9c0 bbce48b27d4f7528ee73c79eacd8ffc27acc24b0` returned only `M docs/plans/m1-05-walking-skeleton-integration.md`. Fresh strict TypeScript exited 0, and the exact browser-free command passed 182/182 with zero failure, cancellation, skip, or todo. Source remained 51 entries / 39 files / 12 directories / 147,831 bytes / `8960366EC4E34C2C3649C44D7FDED9077AA28EFA90E456FE350988FA735C7A21`; tests remained nine entries / eight files / one directory / 317,970 bytes / `B96EC7A3DB35396475C5485180D880BB5F36DCC3F19DA475E9D811BFE1216840`. All five protected hashes, the 332-entry retained-runtime identity, browser executable hash, marker hash, and UTC mtime exactly matched baseline 002. No active lease or generated path existed, and the worktree/index were clean. Baselines 002 and 003 remain historical and are not executable endpoints.

Current execution baseline `M105-INTEGRATION-PLAN-BASELINE-004` was captured at clean HEAD `552f57ec93f23cde164e3327fba06ba961fa1286` on the same branch before this correction. `git diff --name-status bbce48b27d4f7528ee73c79eacd8ffc27acc24b0 552f57ec93f23cde164e3327fba06ba961fa1286` returned only `M docs/plans/m1-05-walking-skeleton-integration.md`. Source remained 51 entries / 39 files / 12 directories / 147,831 bytes / `8960366EC4E34C2C3649C44D7FDED9077AA28EFA90E456FE350988FA735C7A21`; tests remained nine entries / eight files / one directory / 317,970 bytes / `B96EC7A3DB35396475C5485180D880BB5F36DCC3F19DA475E9D811BFE1216840`. All five protected hashes, the 332-entry retained-runtime identity, browser executable hash, marker hash and UTC mtime exactly match baseline 003. No active lease or generated path existed, and the worktree/index were clean. After this paragraph and the three executable constants changed, the required entry state is exactly this plan as the sole unstaged worktree path. Strict TypeScript exited 0; the exact browser-free command passed 182/182 with zero failure, cancellation, skip, or todo; all 16 plan PowerShell blocks parsed; 1,898 relative links and 533 fragments resolved across 86 Markdown files; UTF-8, final-newline, trailing-whitespace, and `git diff --check` validation passed; and the actual `Assert-M105PlanningIdentity` command passed. Fresh independent readiness review `M105-REMAINING-WORK-PLAN-REVIEW-08` returned PASS with no unresolved finding against candidate SHA-256 `CBBC600A6D501BCD5774DB2562C39E68FB18AB01455DF0D5527EE55E746996B7`, so preflight is unblocked.

Current integration-surface identities at baseline 004 remain `service.ts` `5f36e64d1abd7605625778599e05bff1291c72f624652f4ab093b2244a262bdf`, `contracts.ts` `11658bf1dfb290aebb7badb5de4e2fd1c720799e58663705040db999dbc9a017`, `input-validation.ts` `797f39aad74860cc4b8e4ce632ca7e90ff3d629b5a744ece376cd50b599fb8ee`, `loopback-api.ts` `d8a7f50102a992fa5a9d3847d87563f2f213e3aa005cde24934f27c35b5a73d1`, `scan-page.ts` `ae5a1885f2fbe3579ca8fb5172d43f0543e849bd662747f0e0fa9c4a52307e1d`, `main.tsx` `e06da9c28bcb3c3a27254a21031d312ef217c10c53bb152edeea7975a27a666a`, `App.tsx` `ccad5872446bdcc9099b9e527ee6c162c3c52a6bf87e26eb766db557fc1ff7be`, `local-service.test.ts` `b9aa1dc1fb6ec5c9dba3e5937de761eb91edeb913cdc93a5989e934ef79aab89`, and `target-results-ui.test.ts` `997f1fcce1c51ca74637ae74ff84dbe4b05786a26c897dc0cbef687c5c48914e`. Preflight must reassert the exact relevant tree and environment before and after its commands; the planning hashes do not waive fresh evidence.

Accepted preflight `M105-WALKING-SKELETON-INTEGRATION-06-PREFLIGHT-02` used exact ordinal full-line selection of `M105-CMD-PREP` and `M105-CMD-PREFLIGHT` after `PREFLIGHT-01` stopped without mutation on a prefix-selection wrapper error. The corrected exact block exited 0: browser-free tests passed 182/182; scanner tests retained 20 normalization and 68 execution leaf cases within 108 passing TAP entries; UI tests passed 30/30 with no external request or page error; strict TypeScript exited 0; scratch roots were empty; build and both cache paths were absent; both planning identity checks passed; and the 332-entry retained browser runtime was unchanged. The accepted classification is `MISSING`: `service.ts` retains the usable lifecycle/persistence `runScan` seam and `App` retains its `analyze` seam, but the current transport rejects all POSTs, advertises `scan: false`, has no static table, configuration has no `clientRoot`, input preparation has no target-plus-mode `prepareScanRequest` boundary, production composition supplies neither the client root nor real scanner callback, `client-assets.ts` is absent, and `main.tsx` renders `App` without a same-origin callback. No source, test, configuration, runtime, Git, or documentation path changed in preflight.

Attempt-1 Red assignment `M105-WALKING-SKELETON-INTEGRATION-06-RED-01` used lease `M1-05-20260902-06-integration-red-01`, guard digest `8f3acdc28a6f38344413bb42263a6691e53122df83318b140e67e8f307a30ace`, and compliant terminal receipt digest `de014e4215e88b977a6119f9d5a9413c0959e1c3fcb25623eb7e6da183b84b05`. The receipt contains only created `tests/walking-skeleton.test.ts` and `tests/helpers/m105-walking-skeleton-harness.ts`, with no forbidden, unleased, index, HEAD, branch, ignore-control, or Git-reference change. Both syntax checks and the native 32-module Vite build passed; the focused command exited 1 with four failures. The first case failed at `Configured-client service must start`, correctly exposing the absent configured-client production behavior, but teardown was registered only after that expected failure point, so the empty `temp/m105-integration/local-populated` directory remained and contaminated the other cases plus the final scratch assertion. No browser, scanner, provider, or external request ran. The result is `RED INVALID`; its test/build identities are not accepted Red evidence. The closed compliant tree may receive one attempt-2 same-contract test-worker correction after the primary removes only the fingerprinted generated build and verified empty residue.

Accepted attempt-2 Red `M105-WALKING-SKELETON-INTEGRATION-06-RED-02` changed only the same two test paths to register teardown before configured startup and make the existing API-only cleanup idempotent. Lease `M1-05-20260902-06-integration-red-02`, parent `M1-05-20260902-06-integration-red-01`, closed compliant with semantic contract digest `96e7cdb206cfd4edf592f029b3594582ea19d4d958f1662d808f80b145ef8b61`, receipt digest `da1e055ed758399c778c46409cf3215784404a1bbaf948f9b2ddff537f44a409`, and receipt-file SHA-256 `61E9E7587E63798F45A2CE4C6FF35F39D1F62473D88915F6263639C7A82A407E`. Accepted test hashes are `walking-skeleton.test.ts` `68B86E660C98EF599AA8FAD9F728589612D7702557D28747B8E73144922AAF8E` and helper `105727F8A0D2713149C77563C36745BF543A3537FE4E8F41B835635739920EA3`. Both syntax checks and the native 32-module build pass; the focused command exits 1 with all four cases failing only at `Configured-client service must start`, zero cancellation/skip/todo, empty scratch, and no browser, scanner, provider, or external request. The retained Red build is four entries / three files / one directory / 225,273 bytes / `9E2ECD85998E5FF2EB851F83F5C12AC045F0A091FD6D47A8B1A40DAEF26971A6`.

Exceptional workflow-integrity audit verdict `ACCEPTABLE-WITH-RECORDED-PROCESS-FINDING` found no Blocker and one permanent Major process finding: the attempt-2 worker packet named active-pointer hash `bd7bfac8c580cf31e863ca3922103f95d8588dcc3421c0b1ae74766ed5cf7422` instead of the semantic contract digest because guard start returned no JSON and the primary incorrectly inferred from `active.json`. The historical packet cannot be called compliant and the exhausted correction budget prevents repetition. The reviewer nevertheless accepted advancement because the guard's immutable contract independently proves the correct workflow/task/slice/phase/role/attempt/parent and exact two-file scope, the receipt closed compliant with no forbidden/unleased/Git drift, and the accepted Red command plus frozen test/build identities are independently verified. This records rather than erases the process defect.

Green attempt 1 used semantic contract digest `23992063b57befc74ffc47e627e45090f512fa0600de6af2fb8daa9d9741bdfe` and closed compliant with receipt digest `31b857887db25a7875a4d84514ae89516f0f03ade5074572009b12158587ba9d` and zero changed paths. The worker stopped before writing after incorrectly comparing that correct semantic digest with active-pointer hash `7da50b585f75649370ecc1ee1ccb5b65c0a2773230242d1bdaf62ba68f247c4e`; this consumed the no-diff attempt-1 handoff.

Green attempt 2 used lease `M1-05-20260902-06-integration-green-02`, parent `M1-05-20260902-06-integration-green-01`, semantic contract digest `fa59652954523ec0a8df6eba8cf83184d7e37bc6ca3780fe44dd60baceb6905b`, compliant receipt digest `a3d6e2b5cb2a0caa681b1938797976160aec5179068e61f3a8f759617f193940`, and receipt-file SHA-256 `937046A19A00C8CD42D706AD1739A3593A0BED4275FF80F0086F17423EB20059`. It changed exactly the seven authorized production paths, but its malformed command extraction executed no build or focused test. Primary inspection found the intended responsibility placement and no forbidden or Git drift, then primary ran the frozen focused Green once after closure. Syntax and the 32-module build passed; the focused suite executed four and failed four with zero cancellation/skip/todo. The Local case failed on an ambiguous validation-text locator; the Groq lane timed out after persisting a 1,225-byte failed browser/cleanup aggregate; the retained `groq-zero` root caused the final two scratch-precondition failures. Therefore the production hashes, source/test trees, Green build, and receipt below are diagnostic only, not `M105-ACCEPTED-GREEN-TUPLE-001`: source 52 entries / 40 files / 12 directories / 155,273 bytes / `3F7BEC463337D6520CFF6667CB511C4A2025BF42482AA90A54324E9ECBC389C5`; tests 11 entries / 10 files / one directory / 337,893 bytes / `4CD07C8064D29B93F8A9A17999BB891C6389CE3403D9596DB58576D95B4579BD`; build four entries / three files / one directory / 225,483 bytes / `1D1198338F4C1E267737F5F9D8F5540854A33A7C7E52BFC3EDC36C35164A503F`; runtime unchanged at the frozen baseline. The failed aggregate remains at exact task-owned scratch with run.json SHA-256 `FD370B9552E1431FCF477FD2634DCF8009974EB1FAAA221AC36531A9968C99C6`. Green is not accepted and automatic correction is exhausted.

Recovery diagnosis `M105-WALKING-SKELETON-INTEGRATION-06-RECOVERY-DIAGNOSIS-01` inspected the unchanged test/source call graph, existing M1-03/M1-04 harness conventions, compliant Green receipt, build, and preserved aggregate without executing or writing. It classified `EXISTING_BUT_UNCOVERED`: `getByText('Choose Local or Groq.')` matches both `#mode-error` and the live-status announcement; UI Chromium creates temporary material in scanner-owned `temp/m103-scan` before the real scan; and browser-harness teardown throws on the expected service `stop-failed` before removing its owned run. The smallest recovery is test-only: scope the validation locator to the Generation mode group, launch only UI Chromium with `TEMP`/`TMP` temporarily set to `temp/m104-ui` and restore them before Analyze, and attempt every acquired-resource close/listener/run-root/scratch cleanup before surfacing errors. The real scanner, controlled target interception, clean-stop assertion, and all four behavior lanes remain unchanged. The next lease is `evidence`, not `red`; any remaining product failure rejects characterization and requires owner reconciliation.

Recovery evidence assignment `M105-WALKING-SKELETON-INTEGRATION-06-RECOVERY-EVIDENCE-01` changed only the two permitted test paths and closed compliant. The resulting test identities are `walking-skeleton.test.ts` `A04D6A1B951F3DA9D7DEA269762FF45F1D686413DFEE32F934AD3F6476D853AB` and helper `1BC023EAE3855912E539A32694F27C504F69AB1A614A6EE960894EAB1DF5496C`. The corrected locator and browser-scratch ownership worked, and the navigation-failure lane passed. The native build retained its diagnostic four-entry / 225,483-byte identity `1D1198338F4C1E267737F5F9D8F5540854A33A7C7E52BFC3EDC36C35164A503F`; all three scratch roots are empty and both Vite caches are absent. The 1/4 focused result is failed evidence, not accepted Green.

Read-only S3 reconciliation `M105-RECOVERY-FAILURE-REVIEW-01` returned `BLOCKED` with one authorization Blocker and three test-contract Majors. `Coverage` is the accepted rule-keyed object with absent zero buckets represented by `null`; the listener check must reuse the accepted fresh `net.connect` refusal probe rather than infer closure from an HTTP reset; and the real immediate-stop lane must accept its in-flight socket disconnection while still proving durable shutdown failure, sibling preservation, clean stop, and listener closure. The actual `shutdown -> 503` projection remains covered separately by constructing the real loopback transport with a narrow callback returning the validated shutdown outcome. This preserves both M1-05 status mapping and M1-02 immediate `closeAllConnections`; no production or authority change is justified. A further test write requires fresh owner authorization because the recovery evidence turn had no correction budget.

Final recovery evidence `M105-WALKING-SKELETON-INTEGRATION-06-FINAL-RECOVERY-EVIDENCE-01` closed compliant with no forbidden, unleased, index, HEAD, ref, or ignore-control drift. Accepted test hashes are `walking-skeleton.test.ts` `4334DA95D2517B697D7982742CCA832D5E5E86ABFE6293C7D45C6A08A55FF585` and helper `58B811C0826FD707630B907830EBDF3565202AD03E5680926768BA5F7F1C9A43`; receipt-file SHA-256 is `D599F06A7D76BCB310FFC9B9CBB0E9BC677E66EE5889620ABDA6334A6E344DE8`. The suite passed 4/4 in 7.613 seconds after two syntax passes and the native build. It proves the four browser/transport lanes, exact keyed coverage, fresh-socket closure, durable shutdown aggregate, sibling preservation, real immediate disconnection, and separate exact 503 projection. The accepted tuple simultaneously freezes source 52/40/12/155,273/`3F7BEC463337D6520CFF6667CB511C4A2025BF42482AA90A54324E9ECBC389C5`, tests 11/10/1/342,244/`BBA32AC1645C132B223545F7A7142969D6E690A360702FAB16EDE34F02478456`, build 4/3/1/225,483/`1D1198338F4C1E267737F5F9D8F5540854A33A7C7E52BFC3EDC36C35164A503F`, and the unchanged retained runtime.

The first complete-barrier run accepted 58/58 run-contract cases and 55/55 repository cases, then stopped on 67/69 local-service cases. Both failures were unchanged production-entry tests; no later suite or check in the barrier ran. Read-only preflight `M105-WALKING-SKELETON-INTEGRATION-06-COMPLETE-FAILURE-PREFLIGHT-01` found the sole stale assertions at `tests/local-service.test.ts` lines 1077 and 1111. M1-05 intentionally changed only the production entry from API-only `scan: false` to configured-client `scan: true`; every other API-only expectation remains correct. A one-file test evidence lease is technically sufficient but requires fresh owner authorization because that path was outside the accepted two-file boundary. If authorized, the current tuple's test evidence is invalidated and must be replaced from the fresh compliant receipt before complete verification resumes; production, protected inputs, build, and runtime remain frozen.

One-file evidence `M105-WALKING-SKELETON-INTEGRATION-06-LOCAL-ENTRY-EVIDENCE-01` modified only `tests/local-service.test.ts`: `health` now has a defaulted `scan = false` parameter, and only the two production-entry calls pass `true`. The file identity is `C00F7F66F7819EA856ED2F86C526F0FFD8915B2CC296BEF057DD3024BB8308B0`. Syntax and 69/69 local-service cases pass; API-only health and POST rejection, persistence, shutdown, entry diagnostics, CRLF/EOF handling, exact deletion, and port closure remain passing. Receipt-file SHA-256 is `22F3C7F188C7D76841C1F271CD0DEB93704AE74E3CBC404C3ECD047850DAC385`. The replacement accepted tuple adds this path and receipt to the two walking-skeleton tests and their receipt; every non-test identity is unchanged.

The replacement complete-barrier replay first encountered an orchestration wrapper tokenization error before any plan block ran; correcting only that whitespace left the repository and evidence unchanged. The actual replay then passed 324/324 runtime tests and stopped at strict TypeScript with TS7022 at the recovered Groq coverage loop. Scratch and `data/runs` were empty, both Vite caches were absent, and the accepted build remained. The first compile-only diagnosis incorrectly attributed TS7022 to the local identifier shadowing the accessed property; the owner-authorized `coverage` to `ruleCoverage` rename proved that diagnosis insufficient.

Compile-only evidence lease `M1-05-20260902-06-integration-walking-type-evidence-01` changed exactly `tests/walking-skeleton.test.ts` and closed fresh compliant under semantic digest `f3044338dfe88af7929670f007b71872381ea77ea2c1c7b67ac4fafe7b11965a`, receipt digest `acbce985d4297737b7445ed96fdbe408105d72c9a26d272417e13d4a338a937d`, and receipt-file SHA-256 `12FED60D3E8F8CDFB0834FE73D66B4662CDEC6A1FE8D314F7C26B73E7F8C1866`. The exact rename produced file SHA-256 `58B7A5E82E0226ABAF6108386AA499866FF057D940DC182FE0B6D3A5CB87A856`, but strict TypeScript still reports TS7022 on `ruleCoverage`; zero correction budget stopped the packet before syntax and focused runtime evidence. The next smallest behavior-preserving candidate is to remove the inferred local entirely and assert against `persisted.scan.coverage[rule]` directly, or add an explicit type annotation. Either changes the authorized contract, so the accepted tuple remains on the earlier evidence and further writing requires fresh owner authorization.

Direct-expression evidence lease `M1-05-20260902-06-integration-walking-direct-evidence-01` then removed only that inferred local and used the same indexed coverage value directly in the unchanged assertions. It closed fresh compliant under semantic digest `7915de58e568d8ad297a473afab2610a6a5fc551ea3d7b8d3f5a18513af362c2`, receipt digest `d1e439f5b09a405227c1367370b596038635e78f5655d009a994cb6fabdd0ab2`, and receipt-file SHA-256 `B105E1F644EEBCF455C3A3F897B5FA0FE3A96911B847F80C3817E486B20DC571`. Strict TypeScript and syntax passed; the four focused cases passed in 6.165 seconds. The replacement tuple freezes current test SHA-256 `807BA472522541DE17598705C47ED11ED2845D56EF9FDB459512ED8C36B39275` and test-tree identity 11/10/1/342,291/`443FE3FC6F0C1A931D0C60875D804B7F6C3889742A6C4444C5E137B37C8F0E04`, with recovery, failed compile-only, direct-expression, local-entry, and Green receipts retained as one provenance chain.

The fresh complete-barrier replay against that tuple passed every runtime suite for 324/324 cases, strict TypeScript, and all six changed-server syntax checks. The final tuple assertion passed after the tests; scratch and `data/runs` remained empty, both Vite-cache paths remained absent, and the retained build and browser identities were unchanged. This accepts complete integration evidence but not the S3 review or public smoke.

Fresh S3 review `M105-WALKING-SKELETON-INTEGRATION-06-S3-01` returned `REVISE`. It independently accepted route precedence, exact input and media-type validation, status/body mapping, same-origin privilege containment, zero-provider call graph, operation/shutdown ownership, publication/read/deletion behavior, API-only preservation, request settlement, cleanup, and the six `RETAINED` changed existing-file cohesion dispositions. It found two Major defects isolated to `client-assets.ts`: `ordinaryFile` checks only the final asset entry and real-path containment, so a linked `assets` ancestor targeting an internal directory can pass; and frozen entries expose the writable `Buffer` used as their response backing. The plan requires ordinary non-link ancestors and a closed immutable startup table. Primary independently reproduced buffer mutation and confirmed the missing descendant-ancestor check by inspection. Quantitative request bounds and broader hostile-loopback hardening remain explicitly Deferred and are not findings.

The smallest correction keeps the accepted public types, dependency direction, closed route table, MIME values, startup ordering, and exact response bytes. One fresh test-worker Red may change only `tests/walking-skeleton.test.ts` to extend the existing direct asset-boundary lane with two behavior assertions: mutation of a returned response body cannot alter a later body/read, and an in-root directory junction used as the literal `assets` ancestor yields `client-unavailable` before storage/listener effects. One separate code-worker Green may change only `src/server/local-service/client-assets.ts`: walk every selected descendant component with `lstat` so all literal ancestors are ordinary and non-link, and keep each loaded `Buffer` private behind a getter that returns a fresh copy. No HTTP, scanner, lifecycle, UI, dependency, configuration, fixture, or other production/test change is supported. Because the original Green correction budget is exhausted, both write turns require fresh explicit owner authorization and their own leases. Any unsupported platform result, additional path, or failed full correction stops for reconciliation.

Asset-hardening Red changed only `tests/walking-skeleton.test.ts` and preserved the existing four-case inventory. Its direct lane loads a separate response table, mutates one exposed alias, creates an in-root ordinary target directory behind a Windows `junction` named `assets`, observes configured startup and storage creation, stops any unexpectedly started service, unlinks the junction before deleting the owned fixture, and performs one combined final assertion. Current production yields `{ mutationIsolation: false, linkedRejectionNoStorage: false }`; the other three integration lanes pass. This is the exact accepted Red for the one-file `client-assets.ts` Green.

Asset-hardening Green changed only `src/server/local-service/client-assets.ts`. `ordinaryFile` now walks the selected relative path's descendant directory components with `lstatSync` and rejects any non-directory or symbolic-link/junction before reading the final ordinary non-link file and retaining the existing real-path containment check. `clientResponse` keeps one private copied startup buffer and exposes a fresh `Buffer` from the frozen entry on each read. No other public type, static key, MIME value, disk-read count, HTTP behavior, startup ordering, dependency edge, or production/test path changed. Syntax and strict TypeScript passed; all four focused cases passed, including exact response bytes and both S3 observations. The module's cohesion disposition is `RETAINED`.

The post-correction complete barrier then passed 324/324 runtime cases in the frozen sequence, strict TypeScript, six changed-server syntax checks, every generated-state check, and the final corrected tuple assertion. This supersedes the pre-review complete evidence for current hashes.

Renewed review `M105-WALKING-SKELETON-INTEGRATION-06-S3-02` returned PASS with no Blocker, Major, or Minor finding. A different fresh critical reviewer accepted the linked-descendant rejection and response-byte isolation corrections, then rechecked the original S3 dimensions: route and method precedence, request/media validation, response mapping, same-origin privilege containment, zero-provider composition, operation and shutdown ordering, persistence/read/delete integrity, API-only preservation, request settlement, cleanup truthfulness, stable public interfaces, dependency direction, test relevance, and status honesty. It independently accepted all seven changed application files as `RETAINED`. Quantitative request bounds, hostile loopback clients, DNS/redirect policy, and malicious same-user filesystem races remain explicitly Deferred rather than defects in this MVP slice. The controlled integration checkpoint is accepted; only the owner-gated public smoke and later final integrated closure review remain.

Accepted preflight `M105-RUN-REPOSITORY-MODULE-REFACTOR-04-PREFLIGHT-01` ran `node --test --test-timeout=120000 tests/run-repository.test.ts` at HEAD `d30c5616342cb92999772250b36f31fb0341f657`: 55 tests passed with zero failures, cancellations, skips, or todos. Source and test identities remained `run-repository.ts` `58ced192be1386e8052f370a12d0bd3b68858dab7127a2843b1652cda74c0625` and `run-repository.test.ts` `20629f51635028cad097831e2d653c41a25aaadfd79458232d8b2dea45263e73`; the domain façade, service, package, lockfile, and TypeScript configuration also retained their recorded identities. The worker independently mapped stable exports and consumers, immutable round trips, schema/ID/transition/error precedence, Windows root and topology protection, repeated identity checks, short-write and flush/close/rename ordering, every staged-write and cleanup fault, canonical-byte preservation, commit-point behavior, and actual child interruption immediately before and after rename. No test write or artificial Red is needed. Two initial fingerprint probes guessed absent paths and exited without changing repository state; corrected inspection used the actual domain façade and npm lockfile.

Accepted Green/Refactor assignment `M105-RUN-REPOSITORY-MODULE-REFACTOR-04-GREEN-01` used lease `M1-05-20260902-04-run-repository-refactor-green-01`, guard digest `f1a8f7d4dbf3884ba66c11f61387c3ac8065f2148dd8b35a032071e8190e2c41`, and fresh compliant receipt `0026f50a4464d7eb23e0c4ed7f56598baa090613a7f60a7c04e33f82bd3e468c`. It modified only `src/server/persistence/run-repository.ts` and created the four approved files under `src/server/persistence/run-repository/`; no test, fixture, dependency, configuration, unrelated source, index, HEAD, branch, or ignore-control drift occurred. The first focused Green run passed 3 and failed 52 because the initial extraction omitted the `ordinaryDirectory` façade import; the worker corrected that same-scope extraction defect within the same lease, and the final focused run passed all 55. Both worker and primary inspection accept cohesion as `REFACTORED`: the façade retains all captured repository/publication/cleanup state, while the four modules own only their declared responsibilities. Current production identities are `run-repository.ts` `0440ac6ed5ede1445b4ffaeeea3b525ef0fe63fc9f4b88cf69bd136d9f41816a`, `contracts.ts` `7b0511655d8b7b20e97823b6a10fdf5aa567bb9320fe9c7fd9ae9215f178394d`, `store-errors.ts` `4c0b21dccc864df7c59fe0f13f4380e67ba5f9632bba6cedebac220ef8bf987d`, `windows-run-paths.ts` `391cfd03d57e82ecdada07d5c0c398a9f14d17a0ed2fe9d14a827b9896e360d0`, and `run-transition.ts` `b844ddfce3c52e9848376c3f9bbec06b676dfe4897987e183186eea9d9807466`.

Post-Green verification passed all 55 focused repository tests and all 290 complete backend/scanner tests with zero failure, cancellation, skip, or todo. Strict TypeScript and five syntax checks passed. Runtime façade inspection found exactly `openRunRepository`; static consumer inspection found no external deep import. Both filesystem-calling modules retain the shared default `node:fs` object, the complete publication state remains inside `openRunRepository`, and no filesystem operation follows successful rename. The test, package, lockfile, and TypeScript-configuration hashes remain unchanged. Scanner scratch was empty and removed, the retained Chromium inventory remained at 331 entries, and `dist/client` and repository-root `.vite-temp` were absent. That cleanup probe did not inspect `node_modules/.vite-temp`; the corrected generated-output evidence is recorded below.

Fresh review `M105-RUN-REPOSITORY-MODULE-REFACTOR-04-REVIEW-01` returned PASS with no Blocker, Major, or Minor production finding and accepted cohesion as `REFACTORED`. The reviewer independently passed all 55 focused repository tests, strict TypeScript, five syntax checks, exact runtime-export inspection, and external-import inspection. It confirmed Windows drive-absolute and reserved-name admission, exact spelling and collision handling, repeated real-path and filesystem-identity checks, link/junction/hard-link rejection, short-write/flush/close/rename ordering, canonical-byte preservation, bounded cleanup ownership, truthful `cleanupFailed`, error precedence, shared default-`node:fs` interception, and the retained stateful publication coordinator. Reviewed production identities matched the accepted Green and exact-identity 290-case regression evidence; the lease receipt remained compliant and the retained Chromium runtime remained intact. Its generated-output conclusion relied on the incomplete cleanup probe above and was superseded by the owner-supplied P3 cleanup review. Final documentation validation resolved 517 relative-link targets across ten changed documents with zero broken target, reconciled every current task-status statement, and passed `git diff --check`. Accepted limitations remain ordinary local Windows filesystem operation without guarantees against malicious same-user races, concurrent writers, operating-system or power loss, storage-filter stalls, or abandoned-stage recovery. No requirement, ADR, public contract, persistence format, test, dependency, or product-authority change is required because this slice preserves the accepted behavior and boundary.

Owner-supplied follow-up review returned REVISE for cleanup evidence only after finding the ordinary empty directory `node_modules/.vite-temp`; it found no persistence source defect, and strict TypeScript, five syntax checks, runtime exports, diff checks, and production/test identities remained accepted. Primary correction resolved the exact absolute target inside the workspace, verified it was an ordinary directory with no link type and zero children, removed only that directory without recursion, and then verified `Test-Path` returned `False` for both `node_modules/.vite-temp` and repository-root `.vite-temp`. Correction documentation validation resolved seven relative-link targets across the two changed documents with zero broken target and passed `git diff --check`. No source, test, dependency, fixture, configuration, persistence, browser-runtime, or Git metadata changed. This exact cleanup and corrected evidence supersede every earlier unqualified `.vite-temp`-absence claim in this plan.

Accepted preflight `M105-RUN-CONTRACT-MODULE-REFACTOR-03-PREFLIGHT-01` ran `node --test --test-timeout=120000 tests/run-contract.test.ts` at HEAD `eb408882fad215b72ca6f6cbc9f8730a3050f145`: the 30 static cases and 28 generated concealed-array-extension cases produced 58 passes, zero failures/cancellations/skips/todos, and 415.943 milliseconds duration. Source and test identities remained `run-contract.ts` `3585bd3621d7e24b234b03e5be68e4feafdf2c3280b102dabb0294b1767df37e` and `run-contract.test.ts` `e97aac5b0e77bda74381a44c3052637d4d46e05e166bc9f6be4495df6b4130c4`. The worker classified `EXISTING_AND_COVERED`; no test write or artificial Red is needed.

Accepted Green/Refactor assignment `M105-RUN-CONTRACT-MODULE-REFACTOR-03-GREEN-01` used lease `M1-05-20260902-03-run-contract-refactor-green-01`, guard digest `b6dfb54651215e5772038e2b0214fc7dad52fde22acfac9180c3bb896872ad26`, and compliant close receipt `88f5727fc0dbb38105ec90811ac8a8e5ae9251780b690213b032257e2857979a`. It modified only `src/server/domain/run-contract.ts` and created the six approved files under `src/server/domain/run-contract/`; no test, dependency, fixture, executable configuration, unrelated source, index, or Git reference changed. The implementation worker reported cohesion `REFACTORED`, and primary inspection accepted the façade, responsibility placement, and acyclic import direction. Current production identities are `run-contract.ts` `0546bd5586145fc3a5e653e189630559ac6399477a7f28bc1ff7a5a9acee8707`, `run-types.ts` `ca5cf83a234d814cd59bdac14058aa8d6ce25d51c201c2576f3c91aa87bc2131`, `run-policy.ts` `0123e4118cc424b3cdb3e58138e1b9eef24cfeee92e6d4399e75f4e7c1e4b969`, `contract-value-reader.ts` `1ffd1c19fda7cd17fc8cb942e16c2dbdbc5fa93403ea9746f8cb59438ceb51b9`, `finding-validation.ts` `a7e693ea43a0557ea2c75937ec90a3fee9ac96f2e1b822f40f1618ce548ae6fe`, `scan-validation.ts` `7bf5dab81ca4a9f1f7d530d47fb40e9dc0c768b167b2eb5ddba3578894b9f648`, and `run-validation.ts` `3491f707d4932106df0f3124f2a9dfc47fac14bf44928536ec6e338369083004`.

Post-Green verification passed 58 of 58 focused TAP tests and 290 of 290 complete backend/scanner tests with zero failure, cancellation, skip, or todo. Strict TypeScript, syntax checks for all seven production modules, and the native Vite production build passed. Runtime inspection found exactly `validateRun` and `validateScan` on the public façade. A process-isolated probe found all 16 exported internal policy arrays frozen, rejected mutation of each, and retained every value. Static import inspection found no dependency cycle. `tests/run-contract.test.ts`, `package.json`, `package-lock.json`, and `tsconfig.json` retained their accepted identities. Repository-owned scanner scratch and generated `dist/client` output were removed after verification; the contemporaneous check found repository-root `.vite-temp` absent but did not inspect `node_modules/.vite-temp`. The exact cleanup correction above supersedes that incomplete cache-location evidence. Fresh S3 review remains the acceptance barrier at this historical checkpoint.

Fresh review `M105-RUN-CONTRACT-MODULE-REFACTOR-03-REVIEW-01` returned PASS with no Blocker, Major, or Minor finding and accepted cohesion as `REFACTORED`. The reviewer independently passed all 58 focused tests, strict TypeScript, seven syntax checks, exact runtime-export inspection, frozen-policy and privacy probes, a deep walk of 92 frozen returned containers, 1,076 deterministic old-monolith versus extracted-validator comparisons, and an exact 216-event proxy inspection-order comparison with zero property-get traps. The reviewed production and protected-input identities matched the accepted Green and complete-regression/build evidence; the lease remained compliant, scanner scratch and `dist/client` were absent, the retained browser runtime remained intact, and M1-05 remained In progress. Its `.vite-temp` conclusion depended on the root-only probe and is superseded by the exact cleanup correction above. No requirement, ADR, public-contract, persistence-format, test, dependency, or product-authority change is required because this slice preserves the accepted behavior and boundary.

Accepted preflight `M105-LOCAL-SERVICE-MODULE-REFACTOR-01-PREFLIGHT-01` ran `node --test --test-timeout=120000 tests/local-service.test.ts` under Node 24.20.0 at HEAD `696042e664d27de83f65a7d8a680f0388b541486`: 69 passed, zero failed/cancelled/skipped/todo. Frozen source/test identities are `service.ts` `3502789d6edea78d93e2659f8731e7ff060f9c897b77bc667be45a0127a78c1f`, `local-service.test.ts` `b9aa1dc1fb6ec5c9dba3e5937de761eb91edeb913cdc93a5989e934ef79aab89`, `main.ts` `854b90af5dd4f94c0144ab8a96369f28f360aa48661c5be044b831b13782ee39`, and `scan-page.test.ts` `f9247f87b8271f1fad308b6b27f3aed5c0dd6836511e6bc83666d038134aff84`. No file changed and no test resource remained.

Accepted Green/Refactor assignment `M105-LOCAL-SERVICE-MODULE-REFACTOR-01-GREEN-01` used lease `M1-05-20260902-01-service-refactor-green-01`, guard digest `9efe09e53ddad00e848930856bcd30e5efff3b38c41a7cccb2d4c6bea3d517d8`, and compliant close receipt `d2f2a365f842d6c609ad961267342bdc96010791e98bb5732d7df8731a638d25`. It changed only `src/server/service.ts` and created `src/server/local-service/contracts.ts`, `input-validation.ts`, `scan-run-records.ts`, and `loopback-api.ts`. The implementation worker reported cohesion `REFACTORED`, and primary inspection accepted the responsibility placement, stable exports, default `node:http` seam, and retained lifecycle state. Current production identities are `service.ts` `a4fd340de25670c9f76042a66100c999e0eea0702d71dcfa9b712782619e66b2`, `contracts.ts` `543a5ed78f99f05bb74f40bdf8d2d9b600742bf0d6a4fea6d35da67555203139`, `input-validation.ts` `dce646e7c3796b7dade9422688373b7acda32c6d06e805966b5c810e20312273`, `scan-run-records.ts` `27b9f7df773202a4e6be52ce771114169ed127399a649bb0a20c620f630111f2`, and `loopback-api.ts` `f9df82120e09eb81a3c3fb64c72f1d33907d182cbd107a10a6b5d2bc836e0f13`.

Post-Green validation passed the unchanged 69-case local-service command, strict TypeScript checking, and `node --check` for all five production modules. The complete backend/scanner command passed 290 of 290 cases with zero failure, cancellation, skip, or todo after applying the required M1-03 environment: retained `m104-browser-runtime/browsers`, `PLAYWRIGHT_SKIP_BROWSER_GC=1`, `PLAYWRIGHT_DOWNLOAD_CONNECTION_TIMEOUT=30000`, repository-owned `TEMP` and `TMP`, and `NODE_DISABLE_COMPILE_CACHE=1`. The scanner scratch directory contained zero entries after the run. An earlier full-suite invocation omitted `TEMP` and `TMP`; its temporary-directory assertion failures were rejected as invalid environment evidence and were not attributed to the implementation.

Fresh S3 review found no production defect and accepted cohesion as `REFACTORED`. Its sole Minor finding identified stale M1-04 status text in `docs/ui/README.md` and `docs/ui/ANALYZE_AND_RESULTS_PRESENTATION.md`. The primary corrected only those authority-owned status lines, and the bounded correction review returned PASS with no Blocker, Major, or Minor finding. Exact cleanup removed the verified ordinary empty `temp/m103-scan` directory; `dist/client` and repository-root `.vite-temp` were absent at that check, the retained pinned browser runtime was unchanged, and the Git index was empty. The later exact cleanup correction above covers `node_modules/.vite-temp`. Changed-document file-link validation passed for 14 documents, `git diff --check` passed, and no current document reports M1-04 implementation as still in progress. No architecture, product behavior, dependency, public API, test, or executable configuration changed, so no ADR or further product-authority update is required. M1-05 remains In progress.

Owner-supplied external review later reported one P3 dependency-clarity finding: the lifecycle coordinator retained a runtime default `node:http` import solely for its `http.Server` annotation. Same-contract correction `M105-LOCAL-SERVICE-MODULE-REFACTOR-01-GREEN-02` used attempt-2 lease `M1-05-20260902-01-service-refactor-green-02`, parent `M1-05-20260902-01-service-refactor-green-01`, guard digest `9c49fbfc40e7ad1958f27eb6a6dc5431941118b8b5576d5e327149f31b1d86ed`, and compliant receipt `78741912904518259422b69258ee2dfd4f03dcc0beabd96b0d19b73daef84e5d`. Only `src/server/service.ts` changed: it now imports the `Server` type and declares `let server: Server`, leaving `loopback-api.ts` as the sole runtime owner of the default HTTP object. The corrected `service.ts` identity is `48f2fa46433fc7b529f9b27ab30216660143d5d923846032991ed8fa1cb3f604`; the other four production identities and all accepted tests remain unchanged. Focused service validation passed 69/69, strict TypeScript and all five syntax checks passed, the complete backend/scanner regression passed 290/290 under the required M1-03 environment, and exact cleanup removed the empty scanner scratch. Bounded correction review returned PASS with no Blocker, Major, or Minor finding and accepted cohesion as `REFACTORED`.

Accepted scanner preflight `M105-SCANNER-MODULE-REFACTOR-02-PREFLIGHT-01R` ran `node --test --test-timeout=120000 tests/scan-normalization.test.ts tests/scan-page.test.ts` under the exact retained-browser and repository-owned scratch environment at the current production/test baseline. It passed all 88 leaf cases—20 normalization and 68 scan execution—with 108 TAP tests including parent groups, zero failures, cancellations, skips, or todos, and 21.676 seconds TAP duration. Scratch contained zero entries before and after; production and test hashes remained `scan-page.ts` `fcd9cbb6e2f632c70a717155ae172ce210ce757ccb24f1d53071f21e05585b33`, `normalize-scan.ts` `8dbb14cbc42845e27ef2193b274fe21da31261e5df0c6edcfbd1e4a84bac9d05`, `scan-page.test.ts` `f9247f87b8271f1fad308b6b27f3aed5c0dd6836511e6bc83666d038134aff84`, and `scan-normalization.test.ts` `c7712f21238949c3873e399c0d380cfe37e25ab5ec98ad5e37ed5010cd4a994e`. The earlier `PREFLIGHT-01` returned `UNKNOWN` without execution because the coordinator supplied a nonexistent historical plan filename; the corrected packet used `docs/plans/completed/m1-03-real-scan-and-evidence.md`. No test write or artificial Red is needed.

Accepted Green/Refactor assignment `M105-SCANNER-MODULE-REFACTOR-02-GREEN-01` used lease `M1-05-20260902-02-scanner-refactor-green-01`, guard digest `d348dbb9c756c270bd0b65b45ec4080a564c5d9e4c0c1486040ad1b81b67496a`, and fresh compliant receipt `b9b0b3b32c810ce06519ee25955866ba35020ee16899823ea5cc6ea4291b509c`. It modified only `scan-page.ts` and `normalize-scan.ts` and created the five approved focused modules; no forbidden, unleased, index, HEAD, branch, or ignore-control drift occurred. The worker and primary accepted cohesion as `REFACTORED`: `executeScan` retains `track`, `bounded`, `close`, `active`, `operation`, browser/deadline/abort/cleanup state and terminal construction; `normalizeNativeScan` retains envelope/options validation, failure precedence, coverage, UUIDs, native order and final assembly. `scan-page.ts` preserves its three public imports through direct re-exports, `normalize-scan.ts` preserves both public exports, and the serialized reporter receives only JSON-literal profile arguments while keeping every helper nested.

Post-Refactor focused verification passed all 88 leaf scanner cases with 108 TAP tests including parents, zero failures/cancellations/skips/todos, and 21.022 seconds duration. Independent primary verification passed the complete 290-case backend/scanner regression in 20.643 seconds, strict TypeScript, and `node --check` for all seven modules. Current production identities are `scan-page.ts` `6b119170612b3a8b90b941f3cd34fb1feb0b6480421043ab02adc873031001be`, `scan-profile.ts` `f089ef8db27a770c265d87b63a4c5af633ac24976f2eaa48e946c69b09edff91`, `scan-request.ts` `56652dd47dd8883fa1810c027a45dc39958c67c7377475326b1eba82e589580a`, `native-scan-capture.ts` `c466f0174c3bd03421b2b0f2515bf15653788c200e00195de2cfe36c8dca6ae1`, `normalize-scan.ts` `af6aabd4c008711e68d4bc06e5b865babe0a0268d999f63bfdeffdc135f005d3`, `native-value-reader.ts` `00affae65054866812719832ae6ec34ea6ae027495a1df41babd883bb7cbfcc7`, and `native-rule-evidence.ts` `2d30bef5d9b117296d8900f44571d84b4cbe14b5074ebeb30cbefb2415dcb3d7`. Accepted test, package, lockfile, and TypeScript-config hashes remain unchanged. Scanner scratch was empty, the retained browser runtime still had 331 descendants, and `dist/client` and repository-root `.vite-temp` were absent at that check. The later exact cleanup correction above covers `node_modules/.vite-temp`. The accepted S3 review and closure are recorded below.

Fresh S3 review `M105-SCANNER-MODULE-REFACTOR-02-S3-REVIEW-01` returned PASS with no Blocker, Major, or Minor finding and independently accepted cohesion as `REFACTORED`. It reproduced exact production/test/config identities, strict TypeScript, seven syntax checks, diff validation, public import and factory-freshness checks, dependency-cycle analysis, isolated `registerReporter.toString()` execution without Node globals, and the pure 20-case normalizer suite. It reused the exact-identity fresh browser and complete-regression evidence because browser execution writes controlled scratch and conflicted with its read-only boundary. The reviewer confirmed all nine critical checks: authorized moves, self-contained reporter serialization, native-value privacy, rule evidence, normalization precedence, browser lifecycle, public imports/dependencies, behavioral tests, and status honesty. Exact cleanup removed the verified ordinary empty scanner scratch; the retained runtime remains unchanged and generated client output remains absent. Final documentation validation passes 529 relative links and 116 Markdown fragments across ten changed documents, UTF-8/final-newline/trailing-whitespace checks, current-status reconciliation, and `git diff --check`. A first naive link diagnostic counted fenced template placeholders as links; its two false positives were rejected, and the corrected fence-aware validator passed. No requirement, ADR, product, API, dependency, M1-03, fixture, or executable-configuration change is needed. M1-05 remains In progress.

Owner-supplied external review later returned one P2 correction for runtime-mutable exported policy arrays. Primary reproduced it without a repository write: `scanRules.pop()` changed later contexts and native options from three rules to two, `nativeBuckets.push()` changed later result types, and `messageKeys.push()` expanded the evidence allowlist. The prior scanner S3 PASS remains valid for the lifecycle, normalization, serialization, dependency, and cohesion dimensions it inspected but is superseded as final slice acceptance until this integrity correction receives new evidence and review. The smallest correction freezes `scanRules`, `nativeBuckets`, `ordinaryReasons`, `attributeStates`, `inputTypes`, and `messageKeys` at construction. A new tracked layout test is not justified: these are scan-feature-internal exports and the accepted tests should remain coupled to stable behavior rather than private file placement. The correction instead requires an isolated direct mutation-resistance probe, unchanged focused and complete regressions, strict typechecking, syntax checks, exact cleanup, and fresh S3 review.

Correction assignment `M105-SCANNER-MODULE-REFACTOR-02-GREEN-02` used attempt-2 lease `M1-05-20260902-02-scanner-refactor-green-02`, parent `M1-05-20260902-02-scanner-refactor-green-01`, guard digest `6d18592be5f4906f9e0f4f462c36cc5e13cefb4d6cdf6ab386e12982e591a76b`, and fresh compliant receipt `b1a69ec6f8820f6cc8b3e1a064899ba9ae073c62aeb80b89fd9ccf3d70867519`. It changed only `scan-profile.ts` and `native-value-reader.ts`, wrapping the six existing tuples with `Object.freeze()` without changing a literal, order, consumer, or type. A process-isolated probe confirmed all six values are frozen, generic array mutation fails without state change, and fresh scan contexts/options still expose the exact three rules and four buckets. The unchanged focused scanner boundary passed all 88 leaf cases with 108 TAP tests in 20.507 seconds, the complete backend/scanner regression passed 290/290 in 20.612 seconds, strict TypeScript and all seven syntax checks passed, and scanner scratch remained empty. Test identities remain `scan-page.test.ts` `f9247f87b8271f1fad308b6b27f3aed5c0dd6836511e6bc83666d038134aff84` and `scan-normalization.test.ts` `c7712f21238949c3873e399c0d380cfe37e25ab5ec98ad5e37ed5010cd4a994e`. Corrected production identities are `scan-profile.ts` `acd6db3b14c616411d5a55c5d9dd2f2d7df3387d6d62502e4ac9bf3c55953d69` and `native-value-reader.ts` `af735b3dcbc6960ddb82ddd5a4e4879eda9bd57a96404cb248d21b1f5ebb7c36`; the other five production identities remain exact. The renewed S3 review result is recorded below.

Renewed review `M105-SCANNER-MODULE-REFACTOR-02-S3-REVIEW-02` returned PASS with no Blocker, Major, or Minor finding and accepted cohesion as `REFACTORED`. It independently verified frozen descriptors and rejection of generic `push`, `pop`, `splice`, `fill`, and `reverse` calls for all six tuples, exact values and readonly tuple inference, detached factory results after hostile mutation attempts, and end-to-end withholding of an injected unknown native message key. It also confirmed unchanged hashes for the five untouched scanner modules and both tests, stable public exports, strict TypeScript, seven syntax checks, the pure 20-case normalization suite, compliant lease scope, and documentation truthfulness. The earlier scanner S3 review remains historical evidence for the original extraction and is superseded by this renewed review as the final correction acceptance. No requirement, ADR, product, public contract, dependency, or M1-03 authority changed. M1-05 remains In progress for HTTP integration and its browser/build checkpoint.

Accepted preflight `M105-APP-DEAD-STATE-CLEANUP-05-PREFLIGHT-01` ran the unchanged `tests/target-results-ui.test.ts` boundary under pinned Chromium `151.0.7922.34` at HEAD `7353f986bf27d56a8a5d4ce5e91d1c318b4f71fe`: all 30 cases passed with zero failure, cancellation, skip, or todo. It classified `EXISTING_AND_COVERED` after confirming that the suite exercises reservation, duplicate admission, captured intent, stale-response rejection, unmount ownership, announcements, and conditional focus replacement without asserting private hook layout. Baseline identities were `App.tsx` `00db6d28f84f3dab9b533a32ffa177db97b58bb99111312a161079fbc0e2c0e2`, UI test `44097b9b35e8c46ad7cf6d64af91489c8884044c1c5ecd008ce19ba811916e39`, harness `6d6809f8647c9bfa48b6c7dfbd46fb7a4a027f5ea51fcd195c1032e9fe9d1357`, and admission helper `8fb8ebdebf0ee90aa2163876042878ec585b37d37a863748252c60f1fcfd89a1`. Browser teardown settled, no external request or page error occurred, and no test-owned residue remained.

Green assignment `M105-APP-DEAD-STATE-CLEANUP-05-GREEN-01` used lease `M1-05-20260902-05-app-dead-state-green-01`, guard digest `2931c96eb4e335b58646e2ac201ef5831bb763cc2390a0d4aec7677f6dc1de9c`, and fresh compliant receipt `764e8ca2141b89e67aa6a0fdf3965580559785b95aae5699668ce72afbf499f5`. It modified only `src/client/App.tsx`, with zero additions and exactly three deletions: the unread `pendingAnalysis` state declaration and its two setter calls. No forbidden, unleased, generated, index, HEAD, reference, or ignore-control drift occurred. Worker and primary accepted cohesion as `RETAINED`; all existing orchestration responsibilities and public exports remain in `App.tsx`. Its new identity is `59c53fd9ced217c4b432f94ef8fbccafd4294f34494e00e8768f1c567acd4ca5`, while the UI test, harness, and admission helper retain their preflight identities.

Post-Green verification passed the focused browser boundary twice—once under the worker and once under primary coordination—with 30 of 30 cases each. The complete backend/scanner regression passed 290 of 290, strict TypeScript passed, and the native Vite production build transformed 32 modules successfully. The primary browser run reported the new App identity through the deterministic full client inventory, owned-origin requests only, no page errors, and settled teardown. Exact cleanup verified `dist/client`, `temp/m103-scan`, `temp/m104-ui`, repository-root `.vite-temp`, and `node_modules/.vite-temp` absent; `temp/m104-setup` remains ordinary and empty, and the retained pinned browser runtime remains at 331 descendants.

Fresh review `M105-APP-DEAD-STATE-CLEANUP-05-S1-REVIEW-01` returned PASS with no Blocker, Major, or Minor finding and independently accepted cohesion as `RETAINED`. The reviewer reproduced strict TypeScript and exact diff, export, hash, guard, cleanup, and dependency inspection; it accepted the exact-identity browser, complete-regression, and build evidence. No requirement, ADR, roadmap status, public interface, UI contract, test, dependency, fixture, or executable-configuration change is required because this slice removes only unread state and preserves observable behavior. M1-05 remains In progress for HTTP integration and its browser/build checkpoint.

## Interfaces and Dependencies

The completed slice preserves the public `src/server/service.ts` import boundary. `contracts.ts` contains types only. `input-validation.ts` depends on domain validation and Node UUID generation only as needed to prepare a running record. `scan-run-records.ts` depends on domain validation, deep equality, and persistence record types. `loopback-api.ts` depends on the default `node:http` object and narrow lifecycle/read callbacks. `service.ts` depends on those internal modules plus the existing repository. No new package, route, environment variable, stored field, build setting, browser runtime, or external service is introduced.

The run-contract slice preserves `src/server/domain/run-contract.ts` as the sole public import boundary. Internally, fixed policy and model types are the lowest layers; hostile-value readers depend on them; finding validation depends on readers; scan validation depends on finding validation; and parent-run validation depends on scan validation. The browser receives only the existing validator through the façade. Scanner-native readers and policies remain separate trust-boundary implementations. No public export, persisted field, package, schema dialect, code generator, or runtime service is introduced.

The run-repository slice preserves `src/server/persistence/run-repository.ts` as the sole public import boundary. Internally, contracts are the type foundation; bounded store errors depend on those contracts; Windows path protection depends on bounded rejection; transition validation depends on contracts and bounded rejection; and the façade/coordinator depends on all four. Filesystem-calling modules use the shared default `node:fs` object. No public export, route, persisted field, format version, package, recovery mechanism, or runtime service is introduced.

The App cleanup preserves `src/client/App.tsx` as the stateful client coordinator and public owner of `App`, `AppProps`, and the `AnalyzeIntent` re-export. It continues to depend on the analysis and results feature components plus `run-admission.ts`; no dependency direction changes. The deletion removes an unread state value and redundant state updates without adding a module, hook, controller, route, package, interface, rendered node, or client/server interaction.

The completed integration extends the existing service rather than adding a second runtime. `ServiceOptions.clientRoot` is the only new configuration field and is optional for API-only focused construction; production `main.ts` supplies the fixed `dist/client` path. `StartResult` adds only `client-unavailable`. `POST /api/runs` accepts URL plus mode and returns the existing `ScanOutcome`; it creates no second domain DTO or persisted contract. `service.ts` calls the stable scan façade, while `loopback-api.ts` sees only narrow callbacks and a closed client-response table. `client/main.tsx` uses same-origin fetch and passes unknown response data to the existing `App` admission boundary. No new package, environment variable, provider interface, browser-to-filesystem edge, or public scan-policy control is introduced.

## Revision Note

2026-09-02: Created the M1-05 ExecPlan after the owner explicitly selected the task and its first structural slice. Recorded completed dependencies, the conservative module boundary, existing characterization route, S3 risk, guarded worker ownership, exact verification commands, and the later integration work that remains before task completion.

2026-09-02: Accepted the independent `EXISTING_AND_COVERED` preflight and exact 69-case characterization identity. No test write or artificial Red is needed; the separate five-path Green/Refactor lease is next.

2026-09-02: Accepted the compliant five-path Green/Refactor and focused, strict, syntax, and corrected complete-regression evidence. Recorded the invalid initial full-suite environment and its successful corrected rerun. Fresh S3 review is next.

2026-09-02: Closed the first M1-05 structural slice after fresh S3 PASS, exact scanner-scratch cleanup, stale M1-04 UI-status correction, link and formatting validation, and documentation closure. M1-05 remains In progress for HTTP scan integration and its later browser/build checkpoint.

2026-09-02: Reopened the structural slice for one owner-supplied P3 dependency-clarity follow-up. The same observable contract and test boundary remain controlling; only `service.ts` may replace the runtime default HTTP import with a type-only `Server` import before renewed verification and review.

2026-09-02: Accepted the fresh compliant attempt-2 correction lease and renewed focused, strict, syntax, complete-regression, and cleanup evidence. Only the type import and annotation changed; bounded correction review is next.

2026-09-02: Closed the owner-supplied P3 follow-up after bounded correction review returned PASS with no finding. The structural slice is accepted again; M1-05 remains In progress for HTTP scan integration and its browser/build checkpoint.

2026-09-02: Added owner-approved `M105-SCANNER-MODULE-REFACTOR-02` as the second behavior-preserving M1-05 structural slice. Recorded the seven-module responsibility boundary, stable public entry points, retained ordering-sensitive coordinators, existing 88-case characterization route, exact scanner environment, S3 triggers, guarded ownership, verification commands, cleanup criteria, and later integration work that remains outside this slice.

2026-09-02: Accepted corrected independent scanner preflight as `EXISTING_AND_COVERED` after the first packet safely stopped on an obsolete authority filename before test execution. The exact 88 leaf cases pass under the required environment with unchanged production/tests and empty scratch; no test write is needed, and the guarded seven-path Green/Refactor is next.

2026-09-02: Accepted the fresh compliant seven-path Green/Refactor lease and independent focused, strict, syntax, complete-regression, identity, and cleanup evidence. The public entry points and both ordering-sensitive coordinators remain stable; five focused stateless modules now own the approved responsibilities. Fresh S3 review is next.

2026-09-02: Closed the scanner structural slice after fresh S3 PASS with no finding, exact scratch cleanup, status/navigation reconciliation, link and formatting validation, and documentation closure. Both M1-05 structural refactors are accepted; M1-05 remains In progress for real HTTP scan integration and its browser/build checkpoint.

2026-09-02: Reopened the scanner slice for the owner-supplied P2 policy-integrity finding. A direct runtime probe reproduced mutation of exported rules, buckets, and message keys; the previous scanner S3 PASS is superseded as final acceptance. The same public behavior, seven-path scope, test boundary, and attempt-2 Green lineage remain controlling.

2026-09-02: Accepted the fresh compliant attempt-2 policy-integrity correction and renewed mutation, focused, complete-regression, strict, syntax, identity, and scratch evidence. Only the six policy tuple constructions changed; renewed S3 review is next.

2026-09-02: Closed the scanner policy-integrity follow-up after renewed S3 review returned PASS with no finding, independently confirmed unknown-key withholding, and accepted cohesion as `REFACTORED`. The scanner structural slice is accepted again; M1-05 remains In progress for HTTP scan integration and its browser/build checkpoint.

2026-09-02: Added owner-approved `M105-RUN-CONTRACT-MODULE-REFACTOR-03` as the third behavior-preserving M1-05 structural slice. Recorded the stable façade, six-module responsibility boundary, frozen internal policy, existing 30-case characterization route, acyclic dependencies, S3 triggers, guarded ownership, build and regression verification, cleanup criteria, and unchanged later integration work.

2026-09-02: Accepted independent run-contract preflight as `EXISTING_AND_COVERED`. Corrected the evidence wording to distinguish 30 static cases from 58 executed TAP tests; source/tests remain unchanged and the guarded seven-path Green/Refactor is next.

2026-09-02: Accepted the compliant seven-path run-contract Green/Refactor, complete focused/regression/type/syntax/build/mutation/export/cleanup evidence, and fresh S3 PASS with no finding. The third structural slice is complete and documentation is reconciled; M1-05 remains In progress for HTTP scan integration and its browser checkpoint.

2026-09-02: Added owner-approved `M105-RUN-REPOSITORY-MODULE-REFACTOR-04` as the fourth behavior-preserving M1-05 structural slice. Recorded the stable façade, four-module responsibility boundary, retained atomic publication coordinator, existing 55-case characterization route, default-filesystem interception constraint, S3 triggers, guarded ownership, verification commands, cleanup criteria, and unchanged later integration work.

2026-09-02: Accepted independent run-repository preflight as `EXISTING_AND_COVERED`. All 55 cases pass with unchanged source/tests and no retained residue; no test write is needed and the guarded five-path Green/Refactor is next.

2026-09-02: Accepted the fresh compliant five-path run-repository Green/Refactor and focused, complete-regression, strict, syntax, export/import, identity, and cleanup evidence. The publication coordinator remains intact and cohesion is `REFACTORED`; fresh S3 review is next.

2026-09-02: Closed the run-repository structural slice after fresh S3 PASS with no finding, exact cleanup, status/navigation reconciliation, formatting validation, and documentation closure. All four approved M1-05 structural slices are accepted; M1-05 remains In progress for real HTTP scan integration and its browser/build checkpoint.

2026-09-02: Corrected the owner-supplied P3 generated-output evidence finding without changing production code. Verified and removed only the ordinary empty `node_modules/.vite-temp` directory, confirmed both cache paths are absent, and superseded the earlier incomplete cleanup claims. M1-05 remains In progress for real HTTP scan integration and its browser/build checkpoint.

2026-09-02: Added and completed owner-approved `M105-APP-DEAD-STATE-CLEANUP-05`. Independent preflight returned `EXISTING_AND_COVERED`; the compliant one-file lease removed exactly the unread state declaration and two setter calls; focused and complete regressions, strict TypeScript, production build, cleanup, and fresh S1 review passed. `App.tsx` remains the orchestration coordinator with cohesion `RETAINED`, and M1-05 remains In progress for HTTP integration.

2026-09-02: Completed the owner-requested post-implementation documentation audit. Updated the public overview, documentation authority index, roadmap status, plan index, and progress index to include and link the accepted App cleanup. The accepted Analyze/Results presentation and completed M1-04 plan remain unchanged because rendered behavior and the historical deferral record are still accurate.

2026-09-02: Reconciled the full current M1-05 state and revised this living plan in place for the remaining walking-skeleton outcome. Recorded clean HEAD and fresh 182-case/typecheck planning evidence; one coherent standard-profile HTTP/browser integration Red-Green slice; exact request, response, asset, responsibility, path, dependency, command, risk, review, recovery, and closure boundaries; and a separate owner-gated public smoke. Preserved all five accepted prior slices. No Decision Review Contract, dependency, product authority, source, test, or task-status change is introduced by this planning revision.

2026-09-02: The first independent remaining-work review returned `REVISE` with five Major findings. This correction preserves API-only health/POST behavior through configured-client capability gating; freezes exact request-stream, media-type, asset-topology, environment, build, sequential-test, production-start/stop, and cleanup literals; adds slice-local authority anchors; requires Local, Groq-zero, and visible-failure browser-form paths; and retains the public aggregate and build through the different final integrated review before exact deletion. The review checkpoint remains open until a different fresh reviewer returns PASS.

2026-09-02: The different fresh re-review accepted the product boundary, workflow ownership, authority mapping, full browser lanes, public-evidence retention, and YAGNI scope but returned `REVISE` on three command/closure gaps. This correction adds primary-owned no-lease scratch preparation and an exact no-write preflight command; makes every Vite build require an absent owned output, removes the recognized Red build before Green, retains one hash-frozen Green build, and asserts all seven production, build, runtime, executable, marker, and protected-input identities before public startup; and moves terminal documentation validation after status, archive, navigation, and progress mutations. The review checkpoint remains open for another fresh verdict.

2026-09-02: The third fresh reviewer again accepted readiness, authorities, capability gating, ownership, full browser paths, public-smoke boundaries, and YAGNI scope but returned `REVISE` on three remaining mechanical gaps. This correction adds an exact plan-only Git/lease/source/test/configuration/runtime identity gate before and after preflight; freezes Red receipt and test identities, then one inseparable Green source/test/protected-input/build/runtime/receipt tuple before plan maintenance and reasserts it through complete verification, smoke, review, and pre-cleanup; and adds a self-contained post-archive documentation command covering status totals/mirrors, allowed and required paths, generated state, links, fragments, encoding, whitespace, PowerShell syntax, required sections, and `git diff --check`. No product, dependency, path scope, test behavior, or architecture boundary changed. A new fresh verdict remains required.

2026-09-02: Primary command validation interrupted the next review before verdict after finding that the new roadmap-total expression targeted a nonexistent standalone `Status` field. The corrected literal parses both existing `Parent milestone / role / status` and `Parent gate / role / status` rows and reproduces the current 28-task baseline as seven Complete, one In progress, and 20 Not started; closure requires exactly eight Complete and 20 Not started. This command-only correction changed no execution scope or product contract, so a fresh review starts against the stable corrected candidate.

2026-09-02: The next fresh reviewer accepted readiness, authorities, scope, capability gating, browser and smoke paths, the preflight gate, the Red/Green evidence tuple, YAGNI boundaries, PowerShell syntax, and the corrected roadmap parser, but returned `REVISE` on one remaining closure-integrity gap. The post-archive command now reasserts byte-for-byte copied values for all seven production files, both accepted tests, the whole source and test trees, five protected inputs, and both terminal lease receipts after every documentation mutation, while deliberately requiring the already reviewed build to be absent. This command-only correction prevents a second edit to an already dirty executable path from escaping closure validation and changes no product contract, path scope, dependency, test behavior, or architecture boundary. A different fresh verdict remains required.

2026-09-02: Fresh final readiness review `M105-REMAINING-WORK-PLAN-REVIEW-05` returned PASS with no Blocker, Major, or Minor finding against candidate SHA-256 `6258258BB57F571EE3AD3E2223461963D1A4251F08305E9F803C1D7C902B3797`. It independently confirmed the closure-integrity correction and regression-checked readiness, routed authorities, exact commands, Red/Green and lease ownership, evidence continuity, capability gating, controlled browser-to-disk lanes, owner-gated public smoke, cleanup/recovery, documentation timing, and YAGNI/KISS scope. Only this result record changed after the reviewed candidate; implementation remains pending.

2026-09-03: Independent review `M105-REMAINING-WORK-PLAN-REVIEW-06` correctly returned `REVISE` after the owner committed the reviewed plan as `bbce48b27d4f7528ee73c79eacd8ffc27acc24b0`. The previous PASS remains historical, but its pre-commit Git endpoint no longer authorized execution: the entry gate expected the plan dirty at `a9ccb01f19db386e82c5a00f163c6525b66cb9c0`, and future receipt and closure checks required that same obsolete commit. This correction establishes baseline 003 at clean `bbce48b27d4f7528ee73c79eacd8ffc27acc24b0`, updates all three executable comparisons consistently, revalidates every source/test/protected/runtime/generated-state identity plus strict TypeScript and 182/182 browser-free behavior, and makes this plan the sole expected dirty path again. No source, test, dependency, product contract, authority, roadmap status, or architecture boundary changed. A fresh readiness verdict remains required before preflight.

2026-09-03: Fresh independent readiness review `M105-REMAINING-WORK-PLAN-REVIEW-07` returned PASS with no Blocker, Major, or Minor finding against candidate SHA-256 `417DF3390B3A8089F1B2AB444EDD10F3C81973DDE27CACB798E2E35AFB32AF8B`. It independently reproduced the exact `Assert-M105PlanningIdentity` PASS, found no executable occurrence of the obsolete HEAD, confirmed the three current endpoint/receipt/closure comparisons and all frozen identities, and regression-checked the complete plan's authorities, TDD/lease ownership, evidence continuity, smoke, cleanup, status, recovery, and YAGNI/KISS boundaries. Only this result record changed after the reviewed candidate; preflight is now unblocked from the documented worktree.

2026-09-03: The owner committed the reviewed plan again as `552f57ec93f23cde164e3327fba06ba961fa1286`, so the executable baseline-003 endpoint became historical before preflight. This plan-only correction establishes `M105-INTEGRATION-PLAN-BASELINE-004`, updates all three executable HEAD/receipt/closure comparisons consistently, preserves `a9ccb01f19db386e82c5a00f163c6525b66cb9c0` and `bbce48b27d4f7528ee73c79eacd8ffc27acc24b0` only as historical evidence, and requires this plan to be the sole unstaged path. Source, tests, protected inputs, retained runtime, active-lease state, generated paths, product scope, architecture, dependencies, and roadmap status are unchanged. Strict TypeScript, the exact 182/182 browser-free baseline, all PowerShell blocks, Markdown links/fragments/formatting, `git diff --check`, and the actual planning-identity gate pass. A fresh independent readiness verdict remains required before preflight.

2026-09-03: Fresh independent readiness review `M105-REMAINING-WORK-PLAN-REVIEW-08` returned PASS with no Blocker, Major, or Minor finding against candidate SHA-256 `CBBC600A6D501BCD5774DB2562C39E68FB18AB01455DF0D5527EE55E746996B7`. It independently reproduced the exact entry gate and frozen identities and regression-checked all authority, TDD/lease, responsibility, risk, smoke, cleanup, closure, and minimal-scope boundaries. Only this result record changed after the reviewed candidate; preflight is authorized from baseline 004.

2026-09-03: The first preflight assignment returned `UNKNOWN` without executing the intended validation because its orchestration wrapper matched `M105-CMD-PREFLIGHT-SETUP` by heading prefix. The mistakenly selected setup block rejected the already-created `temp/m103-scan` root before any write, leaving source, tests, runtime, scratch contents, build/cache state, Git state, and the frozen contract unchanged. One bounded same-worker correction may use an exact full-heading extractor; no reusable preflight evidence exists yet.

2026-09-03: Accepted corrected same-worker preflight `M105-WALKING-SKELETON-INTEGRATION-06-PREFLIGHT-02` as `MISSING`. The exact frozen browser-free, scanner, UI, and typecheck barriers passed with unchanged identities and no residue. Existing lifecycle/persistence and client-admission seams are covered, while the configured-client/static, POST intake, real scanner composition, and same-origin Analyze callback remain the exact missing production boundary. Test-owned Red is next.

2026-09-03: Attempt-1 Red closed compliant after creating only the two authorized test files, but the result is `RED INVALID`. Syntax and build passed and the first case exposed the expected missing configured-client capability; late teardown registration then left one empty owned run root, making the remaining focused failures and scratch result unusable. One same-contract attempt-2 test correction is allowed after exact cleanup; no production or contract change is authorized.

2026-09-03: The automatic command-approval backend returned HTTP 404 for the exact generated-output cleanup even after explicit owner authorization. The owner completed that cleanup manually; primary readback verified `dist/client` and the empty `local-populated` residue absent, both Vite caches absent, all three scratch roots empty, no active lease, the original HEAD/branch/index, and only the plan plus two Red test paths present. Attempt-2 Red is unblocked.

2026-09-03: Accepted attempt-2 Red with exact test, build, semantic guard-contract, and compliant receipt identities after an exceptional independent audit. The audit permanently records a Major workflow process finding for the wrong digest value in the worker packet; the actual immutable guard scope and receipt remove write ambiguity and support advancement, but they do not rewrite that historical packet as compliant. The accepted Red contract itself is unchanged and all four cases fail only on the absent configured-client capability. Exact Red build cleanup is next.

2026-09-03: Removed only the fingerprinted accepted Red build's three generated files and now-empty `assets` and `dist/client` directories after rechecking their exact names, bytes, and hashes; all scratch roots remain empty. The accepted test hashes and Red receipt remain frozen. Separate Green is next.

2026-09-03: Green attempt 1 stopped before writes because the implementation worker incorrectly compared the correct packet contract digest with `active.json.digest`. The immutable contract and guard-start output both confirm the packet value; the active pointer is a different hash. The lease closed compliant with no changes, so one same-contract attempt-2 Green is permitted with this distinction made explicit and the terminal attempt-1 lease as parent.

2026-09-03: Green attempt 2 changed exactly the seven authorized production paths and closed compliant, but its validation wrapper failed before running any command. Primary then ran the exact focused Green once: build and syntax passed, while the four-case suite failed on one ambiguous test locator, one persisted browser/cleanup failure with timeout, and two subsequent scratch-precondition failures. No Green tuple is accepted. The build and failed-run scratch remain preserved; both role correction budgets are exhausted, so further work requires explicit owner-directed recovery rather than another automatic correction.

2026-09-03: The owner explicitly authorized one fresh, bounded, same-contract recovery cycle. It does not erase or relabel the invalid Red, Green command failures, digest process finding, or exhausted automatic attempts. A read-only diagnosis must first classify the locator and managed-browser failure; then one test-owned correction may establish passing characterization or valid Red, and only a valid Red may authorize one same-scope production Green. No correction beyond those owner-directed turns is available.

2026-09-03: Accepted recovery diagnosis as `EXISTING_BUT_UNCOVERED`. Static and preserved aggregate evidence attributes the failures to the test locator, UI-browser scratch ownership, and teardown ordering, with no identified production defect. After exact diagnostic cleanup, one evidence-phase test lease may apply only those corrections and must produce a passing focused characterization against the unchanged seven-path implementation; it has no correction budget.

2026-09-03: Completed the owner-authorized diagnostic cleanup after exact identity and topology readback. Removed only the retained three-file client build, failed Groq `run.json` and its empty owned parents, and the nine-file Vite dependency cache with empty parents. All required scratch roots are empty and retained; all generated build/cache paths are absent; no lease is active. Recovery advances to the one permitted test-owned evidence lease.

2026-09-03: The no-correction recovery evidence lease closed compliant after changing only the two test files, but its exact focused run passed one of four cases and therefore produced no reusable characterization. The retained build is unchanged, scratch is empty, and cache paths are absent. Fresh S3 reconciliation classified every remaining failure as a test defect and found no production defect; workflow advancement is blocked pending explicit owner authorization for one final bounded two-test-path evidence lease.

2026-09-03: The owner explicitly authorized one final no-correction evidence lease limited to the same two test paths and the three reconciled test-contract fixes. Production remains unchanged. The retained diagnostic build must be reverified and removed before that lease because the frozen focused command requires generated output to be absent at entry.

2026-09-03: Reverified and removed only the retained diagnostic build after all three generated file hashes matched the accepted identity. `dist/client` and both Vite caches are absent, the three retained scratch roots are empty, the index is empty, and no lease is active. The final recovery evidence lease is unblocked.

2026-09-03: The owner-authorized final test evidence lease closed fresh and compliant with exactly the two permitted paths. All four focused walking-skeleton cases passed after the three S3-reconciled test corrections, with syntax/build success, empty scratch, absent caches, and unchanged production. Captured and populated the single accepted source/test/protected/build/runtime/test-receipt/Green-receipt tuple before plan maintenance; complete verification is next.

2026-09-03: Complete verification stopped after 58/58 contract, 55/55 repository, and 67/69 local-service cases. Read-only preflight classified the two local-service failures as stale production-entry capability expectations, not a product defect: only the production child now supplies `clientRoot` and must report `scan: true`. Further work requires explicit owner authorization for one no-correction `tests/local-service.test.ts` evidence lease and replacement of the invalidated test portion of the accepted tuple.

2026-09-03: The owner explicitly authorized one no-correction evidence lease limited to `tests/local-service.test.ts`. It may only extend the existing health helper with a defaulted scan capability and pass `true` at the two production-entry assertions identified by preflight; every API-only expectation, production path, and other test remains frozen.

2026-09-03: The one-file local-entry evidence lease closed fresh and compliant, and all 69 local-service cases passed. Replaced only the invalidated test portion of the accepted tuple: it now freezes three test paths through separate walking-skeleton and local-entry receipts plus the updated whole-test-tree identity. All production, protected-input, source-tree, build, runtime, and Green receipt literals remain unchanged. Complete verification restarts from the beginning.

2026-09-03: Complete verification replay passed every runtime suite for 324/324 tests, then strict TypeScript found one test-only TS7022 inference error in the accepted walking-skeleton coverage loop. No product behavior failed, and the barrier stopped before changed-server syntax checks. The exhausted no-correction walking-test lease requires fresh owner authorization for an exact local-variable rename, proportional typecheck/focused evidence, tuple replacement, and full barrier replay.

2026-09-03: The owner explicitly authorized one no-correction evidence lease limited to `tests/walking-skeleton.test.ts` and the exact `coverage` to `ruleCoverage` local-variable rename. Strict TypeScript and the unchanged four-case walking-skeleton suite must both pass before its receipt/hash and the whole-test-tree tuple fields may be replaced.

2026-09-03: The authorized rename lease closed fresh and compliant with exactly one changed test path, but strict TypeScript still reports TS7022 on the renamed local. No syntax or runtime test ran under the packet's fail-fast rule. The accepted tuple and complete evidence remain unaccepted; a different behavior-preserving test expression or explicit type annotation requires fresh owner authorization.

2026-09-03: The owner explicitly authorized one no-correction evidence lease limited to removing the inferred `ruleCoverage` local and using direct indexed coverage expressions in its four unchanged assertions. Production, the helper, all other tests, configuration, and documentation remain frozen during the worker turn.

2026-09-03: The direct-expression lease closed fresh and compliant, strict TypeScript and syntax passed, and all four walking-skeleton cases passed. Replaced only the invalidated walking-test hash, test-tree identity, and test receipt chain in the frozen tuple, then replayed the complete barrier from the beginning. All 324 runtime cases, strict TypeScript, six syntax checks, generated-state checks, and the final tuple assertion passed. Fresh S3 review is next; public smoke remains owner-gated.

2026-09-03: Fresh S3 review returned `REVISE` with two Major asset-loader findings and no other finding. Primary reproduced the mutable backing bytes and confirmed the missing literal descendant-ancestor check against the frozen contract. Further work requires fresh owner authorization for one test-only Red and one separate one-file production Green, followed by tuple replacement, complete replay, and renewed S3 review. Public smoke remains blocked.

2026-09-03: The owner explicitly authorized the exact two-turn S3 correction route: one test-owned Red limited to the walking-skeleton test and, only after accepted behavioral Red, one separate production Green limited to `client-assets.ts`. Neither turn has a correction budget; all other source, tests, configuration, dependencies, fixtures, documentation, and Git state remain frozen during each lease.

2026-09-03: The asset-hardening Red lease closed fresh compliant with one changed test path. Syntax and strict TypeScript passed; 3/4 focused cases passed, and the sole direct-lifecycle failure simultaneously proved mutable response backing and acceptance/storage creation through a linked asset ancestor. The owned junction fixture was safely removed and generated state remained clean. The authorized one-file production Green may begin.

2026-09-03: The one-file asset-hardening Green lease closed fresh compliant. Literal descendant directories are now checked as ordinary non-links, stored startup bytes are private, and every response-body read receives a copy. Syntax, strict TypeScript, and all four focused integration cases pass with unchanged build/runtime and clean generated state. Captured the replacement seven-receipt source/test/build/runtime tuple before plan maintenance; the complete barrier must now replay before renewed S3 review.

2026-09-03: The post-correction complete barrier passed from the beginning: all 324 runtime cases, strict TypeScript, six syntax checks, clean generated-state checks, and the final corrected tuple assertion. A different fresh S3 reviewer now owns the correction and full integration review; public smoke remains blocked until PASS.

2026-09-03: Renewed independent review `M105-WALKING-SKELETON-INTEGRATION-06-S3-02` returned PASS with no Blocker, Major, or Minor finding after rechecking both asset corrections and every original critical dimension. The controlled integration checkpoint is accepted with all seven changed application files classified `RETAINED`. Corrected the plan-only public-smoke aggregate assertion to enumerate the rule-keyed coverage object and require the exact three accepted rule keys. No smoke ran; M1-05 remains In progress at the owner-gated public HTTPS checkpoint.

2026-09-03: The first owner-authorized public smoke produced a validated Local-mode `navigation` failure and was rejected as non-reusable by the completed-status assertion. The service stopped cleanly. Using the owner's disposable-run authorization, primary rechecked the sole ordinary one-file run topology and exact `run.json` hash, removed only that file and its now-empty run directory, and proved `data/runs` empty. The private target is intentionally omitted. No code change or automatic retry is justified; one owner-directed replacement target remains available.

2026-09-03: The owner authorized the sole replacement public target and disposable run. An initial shell-B orchestration typo stopped before tuple execution or prompt input and changed no state; the corrected exact shell then ran. The replacement again produced a validated Local-mode `navigation` failure, so the completed-status smoke assertion rejected it and the service stopped cleanly. A no-run/no-scan diagnostic under the identical managed Chromium configuration captured `net::ERR_NETWORK_ACCESS_DENIED`, while an approved read-only HTTPS HEAD request outside the Codex sandbox returned 200 for the same page. This isolates the blocker to sandbox-denied outbound browser access, not target behavior or an application defect. Primary rechecked the sole ordinary one-file run and exact hash, deleted only that disposable run, and proved `data/runs` empty. The private target remains omitted. Both permitted smoke targets are consumed; any network-capable rerun requires explicit owner reconciliation.

2026-09-03: The owner explicitly requested the test outside the sandbox, authorizing one same-target, same-mode network-capable correction. This does not authorize a third target, provider call, source/test change, or further retry. The frozen tuple and exact smoke blocks remain controlling; only production shell A may cross the sandbox boundary so its managed Chromium child receives outbound access. Any failure stops for direction.

2026-09-03: The first outside-sandbox shell-A wrapper stopped before service startup when the host process was denied access to an ignored lease receipt during the frozen tuple assertion. It created no runtime or repository state. The reconciled orchestration keeps the exact tuple and scratch checks inside the sandbox immediately before and after, runs only PREP plus the unchanged production-start block outside it, and permits no intervening mutation. This preserves the accepted identity proof while granting outbound access only to the production service and its managed-browser child.

2026-09-03: The single owner-authorized network-capable smoke completed in Local mode with exact three-rule coverage, zero Findings and 20 scanner-review observations. Recorded the validated live/disk equality, retained aggregate identity, clean shutdown, and unchanged frozen tuple without public-page content. Reconciled developer instructions and current-status owners; the README's exact seven-file sequence passed all 324 tests and independent strict TypeScript. Populated cleanup and post-archive commands from the existing frozen smoke, three-test, and seven-receipt identities without recapture. Different final integrated review `M105-FINAL-INTEGRATED-REVIEW-01` returned PASS WITH FOLLOW-UPS: no Blocker or new actionable Major, all seven changed modules RETAINED, and one Minor requesting this missing revision entry. This entry resolves that documentation-only follow-up; primary will verify it before accepting review and running exact cleanup. Historical failed evidence and the wrong-digest packet finding remain preserved.

2026-09-03: Resolved and validated the final review's sole Minor, accepted PASS WITH FOLLOW-UPS, and executed the unchanged exact cleanup successfully. Reconciled all affected current-status and operational documentation, recorded final review and cleanup evidence, and completed M1-05 through the documentation gate. Archived this plan with corrected relative links; preserved source/test/protected/runtime identities, seven receipts, all earlier stops and process findings, and the unselected M2 boundary. Final post-archive validation must run after the last documentation mutation.

2026-09-03: The first post-archive closure run passed identity, residue, roadmap, navigation, encoding, and PowerShell checks, then falsely rejected the existing Progress heading because its required-section regex accepted LF only while archival retained CRLF. Primary verified the exact heading and made the documentation-only regex accept an optional carriage return, consistent with the other closure patterns; no required heading or gate was removed. The full exact closure rerun passed after this bounded validator correction: 86 Markdown files, 1,892 links, 529 fragments, 21 parsed PowerShell blocks, 24 changed paths, 8 Complete tasks and 20 Not started tasks. Final source/test/protected/runtime/receipt identities, absent generated residue, empty index, and unchanged Git endpoint passed; the final command is rerun after recording this result.

2026-09-03: The owner authorized two reproduced post-closure P2 corrections at committed baseline 1f92fe8. Reopened the same M1-05 task and plan, preserved all previous evidence and stops, reconciled current status, and added the bounded startup/intake correction contract and fresh verification route. The old commit-pinned capture, cleanup, and closure blocks remain historical and must not be replayed; only their explicitly reused read-only PREP definitions apply. No public smoke or dependent task is authorized.

2026-09-03: Accepted correction preflight PARTIAL, isolating missing stylesheet recognition from existing-but-uncovered stream settlement. Strict/syntax and exact baseline checks passed; primary completed the unchanged README build setup with the original deterministic build identity and empty owned scratch. The next bounded test Red also supplies real abort characterization; only the stylesheet behavior may require production Green.

2026-09-03: Accepted the correction Red and real abort characterization after fresh compliant test-lease closure and primary diff/identity inspection. All four original cases and the quoted CSS control passed; only ten intended stylesheet cases failed. Froze the corrected two-test identities and 15-case boundary for one-file production Green. Historical test counts remain historical; no production or external-page behavior changed in this test turn.

2026-09-03: Separate one-file Green reproduced Red, then passed all 15 unchanged integration cases and strict/syntax checks. Primary closed the Green lease compliant, accepted RETAINED responsibility fit, and ran the complete replacement barrier: 335 tests passed with unchanged runtime/build and empty owned scratch. Recorded both immutable correction receipts, frozen corrected source/test identities, evaluation/fixture preservation, and exact post-review cleanup; updated developer test counts and current progress before fresh review. No public smoke or provider call was repeated.

2026-09-03: Fresh correction S3 review `M105-PC08-S3-01` returned PASS WITH FOLLOW-UPS with no Blocker/Major and RETAINED cohesion. Primary consolidated the sole Minor duplicate progress checkpoint, preserving one chronological replacement-verification entry. The read-only review independently verified 25 tokenizer cases, three real HTTP aborts, timeout failure and hook restoration, strict/syntax, and the frozen tuple. Added the exact new-baseline archived-state validator before different final integrated review; no implementation, test, receipt, or generated-artifact identity changed.

2026-09-03: Different fresh final review `M105-PC08-FINAL-01` returned PASS with no remaining findings and RETAINED cohesion. Independent identity, strict/syntax, Green-start test hashes, integrated asset/HTTP/abort/control checks, and closure isolation passed. Primary accepted the verdict, executed exact build/empty-scratch cleanup with no run deletion, and reconciled current-status owners. The retained runtime and all frozen correction/evaluation/receipt identities remain unchanged. Final archival and post-mutation documentation validation follow; no next task, commit, or push is authorized.

2026-09-03: Archived the same corrected M1-05 plan and repaired every affected navigation link. The new-baseline archived-state validator passed exact identities, both correction receipts, generated-state absence, retained browser, empty run siblings/index, unchanged Git endpoint, 16 changed paths, eight Complete and 20 Not started tasks, 86 Markdown files, 1,892 links, 529 fragments, 26 PowerShell examples, required headings, UTF-8 and whitespace. Recorded this outcome in the progress owner and reran validation after the final documentation mutation. M1-05 is Complete again; original evidence and failures remain historical, with no requirement/ADR change, public-smoke repetition, next-task authorization, commit, or push.
