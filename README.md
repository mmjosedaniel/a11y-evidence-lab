# A11y Evidence Lab

## Overview

A11y Evidence Lab is a planned accessibility analysis application whose goal is to help a frontend developer turn automated findings into traceable, guidance-backed remediation decisions that can be reviewed and verified, with QA engineers as secondary users. For one user-supplied public HTTPS page at a time, it would run a deterministic browser scan, preserve minimized evidence behind each Finding, retrieve relevant guidance from a curated corpus, determine whether that Finding's evidence and guidance are sufficient for generation, and use the selected local or Groq-hosted LLM to generate a cited explanation and remediation proposal with one blocking pre-acceptance judgment and one non-blocking post-change verification reminder through a provider-neutral contract. The portfolio MVP treats that URL as trusted developer/operator input; the user remains responsible for authorization and for choosing an appropriate public target.

The portfolio MVP deliberately scans exactly three axe-core rules: `image-alt`, `label`, and `color-contrast`. One atomic, provider-independent scan lists every axe violation node reported by those rules; native `incomplete` observations remain visible and distinct from findings. A completed scan may validly report zero findings, but neither zero nor any other count is an accessibility or compliance verdict. A navigation error, timeout, or scan failure remains visible and is never presented as a completed zero-finding or silently partial result.

The evidence-sufficiency gate has two explicit outcomes. Complete required Finding evidence plus a completed `supported` retrieval may lead to an LLM-generated proposal and then approve/edit/reject human review. Incomplete required Finding evidence, or a completed `incomplete`, `missing`, or `conflicting` retrieval, instead produces a terminal, application-authored abstention that clearly explains why generation was blocked, identifies the absent or conflicting information, confirms that no LLM was called, and provides manual-investigation guidance; it does not enter proposal review. A retrieval execution or integrity failure prevents that gate from completing and fails the FindingWorkflow with no support state, abstention, or LLM call.

This is a deliberate portfolio-scope decision. The project exists to demonstrate the complete implementation and integration of deterministic browser scanning, minimized evidence capture, curated RAG through a bounded LangChain role, structured AI generation, human review, and conservative rescan comparison—not to build a production website crawler or hostile-URL isolation product. It accepts one trusted public page target per analysis run, but performs no link discovery, crawling, authenticated-page access, bulk generation, or broader rule coverage. The fixed synthetic image, label, and contrast scenarios remain reproducible evaluation inputs; they are not user-submitted runtime page inputs. [OD-020](docs/requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-020--authorized-public-page-analysis-scope) records the analysis workflow, and [OD-021](docs/requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-021--trusted-operator-url-boundary-for-the-portfolio-mvp) with [ADR-0018](docs/architecture/decisions/ADR-0018-trusted-operator-url-boundary.md) records its deliberately narrow trust boundary.

The MVP assumes benign developer input and makes no production URL-isolation claim; security hardening for untrusted targets is deferred until a demonstrated product need justifies it.

Users would review each proposal and could approve, edit, or reject it before it becomes an accepted remediation plan. Subsequent scans would first determine whether the evidence pair is comparable; a comparable finding may then be classified as resolved, improved where an ordered measure exists, persistent, regressed, or inconclusive. The application would support accessibility investigation and engineering decisions; it would not provide accessibility certification or legal-compliance determinations, and it would not modify source code automatically.

## Why this matters

Automated accessibility scanners are effective at identifying deterministic issues, but their output often lacks the context engineering teams need to understand impact, select remediation, distinguish automated evidence from human judgment, and verify improvement. A11y Evidence Lab would bring those activities into one traceable workflow.

## Engineering objective

The project objective is to demonstrate the practical use of retrieval-augmented generation in an evidence-centered application without turning the portfolio MVP into a production-scale platform:

- **RAG** would ground explanations and remediation proposals in a curated, versioned accessibility corpus.
- **LangChain** is the initial evaluation baseline for the small retrieve-then-generate integration. For the fixed corpus, it would use in-process `MemoryVectorStore` retrieval with local `embeddinggemma` vectors, exact cosine similarity, and a fixed top three. Application startup performs no embedding work: the disposable vector collection is built on the first explicit retrieval request and rebuilt only when the process, corpus, or relevant configuration requires it. The MVP has no Chroma or other vector-database service.
- Plain TypeScript application state is sufficient for the first linear workflow and one current human decision at a time.
- Each page analysis would be retained as one versioned `data/runs/<run-id>/run.json` aggregate, with no canonical child files, Markdown report, database, or audit graph.
- **LangGraph** remains a later candidate only if a demonstrated resume or recovery need justifies it.
- **LangSmith** is deferred outside the MVP; content-safe local records and diagnostics are sufficient for the portfolio workflow.

The MVP has exactly two generation modes: developer-managed `qwen3.5:4b` through a separately installed Ollama runtime, or the Groq API as the first and only external provider. Before analysis, the user selects one global mode and sees one concise run-level disclosure; the immutable selection and exact model remain visible for the run and apply to every later eligible finding. Selection performs no provider call or synthetic readiness probe. Each eligible finding still requires an explicit generation action, after which the selected adapter performs only its attempt-time prerequisite check, makes the actual request, and validates the returned structured value. Providers are never mixed, there is no automatic fallback, and provider-invocation provenance exists only when a call is attempted. Local mode remains the recommended initial choice. In Local mode, generation prompts and responses use only the approved Ollama loopback boundary; corpus/query embedding also remains local in either generation mode. This is not an offline or machine-wide zero-egress claim: trusted-page navigation is external, and an explicitly selected Groq generation action may send only its accepted minimized payload. The fixed Groq evaluation configuration uses model ID `openai/gpt-oss-20b`; this is an evaluation choice, not a release-qualified dependency or availability promise. Local model evaluation remains subject to the documented capacity gate on the existing reference PC; models outside that capacity are excluded. TypeScript, React, and the bounded LangChain role join the other initial evaluation baselines recorded in the [architecture decisions](docs/architecture/decisions/README.md).

## Planned MVP startup and generation setup

The portfolio MVP has no installer, desktop wrapper, Start menu shortcut, or application-controlled webview. The developer starts a local application service on the developer machine and opens its loopback address in Chrome or Edge. The browser is only the unprivileged interface; the local service owns filesystem access, scan-browser automation, the local model-runtime adapter, and the Groq adapter.

For retrieval in either generation mode, the developer manually installs Ollama and runs `ollama pull embeddinggemma` through Ollama's own tooling outside A11y Evidence Lab. Local generation additionally requires `ollama pull qwen3.5:4b`; Groq generation instead requires a Groq credential in the local service. The application does not install or update Ollama, pull or remove models, track acquisition progress, expose a model manager, or provide a separate provider-probe interface. It checks `embeddinggemma` and builds the in-memory vectors only when retrieval is first requested; it checks `qwen3.5:4b` only when an explicit eligible Local generation attempt begins. The actual work and response validation determine success or visible failure. Packaging and installer work are deferred until a demonstrated distribution need justifies them. [ADR-0020](docs/architecture/decisions/ADR-0020-manual-developer-managed-local-model-setup.md) records the developer-managed setup boundary, [ADR-0022](docs/architecture/decisions/ADR-0022-closed-versioned-guidance-corpus.md) records the closed corpus, and [ADR-0023](docs/architecture/decisions/ADR-0023-local-mode-data-boundary.md) records the Local-mode data boundary.

The canonical local artifact for a page analysis is one versioned `data/runs/<run-id>/run.json` aggregate containing the scan and the current nested per-finding workflow data. The MVP generates no Markdown report and adds no database or independently versioned child-record lifecycle. [ADR-0019](docs/architecture/decisions/ADR-0019-in-process-exact-vector-search.md), [ADR-0021](docs/architecture/decisions/ADR-0021-single-file-run-aggregate.md), and [OD-022](docs/requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-022--portfolio-mvp-yagni-simplification) record these portfolio-first YAGNI decisions.

## Planned workflow

1. The user enters one trusted, authorized public HTTPS URL for which they are responsible, selects the global Local or Groq generation mode after its concise run-level disclosure, and activates **Analyze** to start one scan under the [trusted-operator boundary](docs/architecture/decisions/ADR-0018-trusted-operator-url-boundary.md). Mode selection does not contact a provider.
2. In a fresh non-persistent browser context with no imported user profile, credentials, or authentication state, the scan runs exactly `image-alt`, `label`, and `color-contrast` against the entire top-level document in its current rendered state at the configured readiness condition, with iframe documents excluded, then [captures every reported violation node and its minimized evidence](docs/architecture/candidates/ACCESSIBILITY_FINDING_EVIDENCE_CAPTURE_ASSESSMENT.md) while keeping native incomplete observations separate. It performs no crawling, clicks, form submission, uploads, or download workflow, uses one ordinary navigation timeout, and cleans up its browser context after success or failure.
3. The application lists the findings; the user selects one finding at a time for [curated guidance retrieval](docs/architecture/candidates/guidance-retrieval/README.md) through the accepted in-process exact-vector path, which returns at most three ranked passages and requires no persistent vector service.
4. For that Finding, the application [gates generation on evidence sufficiency](docs/architecture/candidates/EVIDENCE_GROUNDED_REMEDIATION_GENERATION_ASSESSMENT.md). Complete required Finding evidence plus a completed `supported` retrieval permits an explicit attempt through only the selected provider and may produce a cited proposal with confidence, uncertainty, a blocking pre-acceptance judgment, and a non-blocking post-change verification reminder after application-owned validation. Incomplete required Finding evidence, or a completed `incomplete`, `missing`, or `conflicting` retrieval, produces a terminal application-authored abstention with a clear reason and manual-investigation guidance, without a model call or proposal-review decision. A retrieval execution or integrity failure instead fails the FindingWorkflow with no support state, abstention, or model call.
5. For a validated proposal only, the application [presents it for individual approval, editing, or rejection](docs/architecture/candidates/HUMAN_REMEDIATION_REVIEW_ASSESSMENT.md); it never creates one combined proposal for the page.
6. From any retained baseline Finding, a later analysis of the same authorized page [compares evidence conservatively per finding](docs/architecture/candidates/RESCAN_EVIDENCE_COMPARISON_ASSESSMENT.md). Retrieval, generation or abstention, and review are not prerequisites for this separate scan-evidence path.

Public comparison always starts from a baseline Finding. For binary `image-alt` and `label` evidence, a uniquely correlated target may therefore be `resolved` or `persistent`; a later-only violation remains visible but is not labeled `regressed`. Reversing the controlled positive/failing fixture pair may exercise binary regression only as a non-persisted deterministic evaluation case. For `color-contrast`, the retained contrast margin supplies an ordered measure: a comparable later failure may be `improved`, `persistent`, or `regressed`, while a later non-failing observation may be `resolved`. Changed or ambiguous live-page structure may require `inconclusive` or `not comparable`. None of these outcomes establishes whole-page accessibility or conformance.

## Project status

Development ready. The [development roadmap](docs/DEVELOPMENT_ROADMAP.md) owns implementation order and status. [RD-002](docs/plans/completed/rd-002-minimum-development-toolchain-literals.md) completed the pinned toolchain, and [RD-003](docs/plans/completed/rd-003-scan-evaluation-boundary.md) completed the six controlled fixtures and scan-only evaluation manifest, including reviewed reproducibility and cleanup corrections. [M1-01](docs/plans/completed/m1-01-run-and-scan-contracts.md) completed the pure run/scan validators and 58 contract tests.

[M1-02 — Local service and aggregate](docs/plans/completed/m1-02-local-service-and-aggregate.md) is Complete. At its closure, all 182 product tests, independent strict typechecking, actual startup/reopen/stop and exact synthetic-run deletion passed. Both slice S3 reviews and the different final integrated critical review passed; documentation closure is accepted. The service is runnable with the instructions below. HTTP scanning, retrieval, generation, provider calls and later workflows are not implemented; the internal M1-03 scanner is Complete as described below.

[M1-03 — Real scan and evidence](docs/plans/completed/m1-03-real-scan-and-evidence.md) is Complete after owner-authorized execution and verified closure. Both scanner slices and their S3 reviews are accepted. All 290 integrated tests and independent strict typechecking pass, including the failed-launch residue regression. The different final integrated critical review, exact task-owned runtime cleanup and documentation closure passed. At M1-03 closure, M1-04 and M1-05 were unselected.

[M1-04 — Target and results UI](docs/plans/m1-04-target-and-results-ui.md) is Blocked only on owner direction for one final cleanup retry after two no-change worker stops. Its corrected UI passes the controlling 329-test regression, static S3 and different final integrated reviews, and accepted human browser-menu 200% zoom/reflow and Narrator checks. All retained artifacts remain intact; exact cleanup and closure remain pending. M1-05 is unselected.

## Development toolchain

Use exactly [Node.js 24.20.0 with its bundled npm 11.19.0](https://nodejs.org/en/download/archive/v24.20.0). Provision these developer prerequisites yourself; the project has no runtime installer. RD-002 used a temporary official Windows x64 distribution for verification and removed it and its task-specific cache after review; the machine's global runtime was not changed. The exact package pins live in [package.json](package.json), and [package-lock.json](package-lock.json) is the only authoritative dependency lock.

From the repository root in PowerShell, use the reviewed [M1-03 command wrappers](docs/plans/completed/m1-03-real-scan-and-evidence.md#l38-exact-commands-environment-and-effects). Every npm invocation below is an inner command: apply the nonbrowser wrapper, including to npm version, restore, typecheck, service start and nonbrowser tests. It disables Node compilation caching for that invocation and restores the prior value exactly. The full browser suite uses the separate six-variable browser wrapper. Do not run these npm snippets bare. Check the prerequisites and restore the lock with dependency lifecycle scripts disabled:

```powershell
if ((node --version) -ne 'v24.20.0') { throw 'Node 24.20.0 is required.' }
$toolchainOptions = @('--global=false', '--prefix', (Get-Location).Path, '--cache', (Join-Path (Get-Location).Path 'temp/rd002-npm-cache'), '--ignore-scripts=true', '--audit=false', '--fund=false', '--update-notifier=false', '--logs-max=0', '--registry=https://registry.npmjs.org/', '--strict-ssl=true', '--package-lock=true', '--include=dev', '--include=optional')
if ((npm.cmd @toolchainOptions --version) -ne '11.19.0') { throw 'npm 11.19.0 is required.' }
npm.cmd @toolchainOptions ci
npm.cmd @toolchainOptions run typecheck
```

Retain optional dependencies: they supply the platform-specific compiler and build binaries. Do not enable install scripts to work around a failure, regenerate the lock during a restore, or introduce another package manager. The independent `typecheck` runs strict `tsc` with no emitted JavaScript; native Node TypeScript execution does not replace it.

The focused runner is Node's built-in test runner. The browser-free core subset contains the domain, repository and service tests. Run these three files and the independent strict typecheck inside the nonbrowser wrapper; the complete five-file suite is described below:

```powershell
npm.cmd @toolchainOptions run test:focused -- tests/run-contract.test.ts tests/run-repository.test.ts tests/local-service.test.ts
npm.cmd @toolchainOptions run typecheck
```

No test is retained solely to make the runner pass: RD-002 proved an intentional assertion failure and corrected pass, then removed its disposable probe. Server modules and tests use erasable TypeScript and explicit `.ts` imports; `.tsx` is client-bundled code, not native Node input.

Vite 8 builds the React client without a React plugin and emits only the client bundle to `dist/client`. The M1-04 HTML/client entries pass strict typechecking and `build -- --configLoader native` under the live plan's environment and output-ownership controls. The `start` script (`node src/server/main.ts`) runs the local service described below; it does not serve the UI. The M1-04 tests render the actual UI through a disposable Vite transport; no production dev-server topology or service integration is added. RD-003 has verified full Playwright-managed Chromium revision 1234 / version 151.0.7922.34 against the [scan-only manifest](evaluation/rd003-scan-v1.json). Its [evaluation procedure and native evidence](docs/plans/completed/rd-003-scan-evaluation-boundary.md#accepted-setup-and-native-observations--rd003-observations-001) use the pinned Node/npm and libraries directly over six authored static states; that evaluation created no permanent probe or application scanner. The original task-local runtime/browser was removed after its review and verified cleanup; global installations and shared browser caches remain unchanged. This is an evaluation result, not a support claim. M1-03 now exercises these same inputs through its application capture/normalization modules; its distinct native capture profile and task status are recorded above.

For RD-003 reproduction after task-local cleanup, use the reviewed [current clean-start procedure](docs/plans/completed/rd-003-scan-evaluation-boundary.md#current-reproduction--rd003-procedure-003), after restoring the RD-002 dependencies above. The scoped [.gitattributes](.gitattributes) preserves the seven frozen artifacts' LF bytes; all 21 checkout-filter comparisons pass. The single owner-authorized network-enabled retry passed acquisition, binary/package identity checks, and strict typechecking. The independently reviewed task-local files were removed after verified cleanup; the first attempt's socket-permission failure is preserved. The original failed bootstrap and preserved-cache resume command remain historical.

## Verify the real scanner

M1-03 adds an internal backend capability. It does not add an Analyze route, UI, provider call or scan-to-disk wiring. The production entry still needs no browser because it exposes only the existing service capabilities.

The internal API in [scan-page.ts](src/server/scan/scan-page.ts) separates input preparation from execution. `prepareScanRequest(url, mode)` validates and normalizes the target and mode without creating a run or contacting a browser or provider. After successful preparation and service-owned run creation, `executeScan(run, signal)` consumes the validated running record and returns a completed or failed terminal record. It does not publish that record to disk; wiring this callback into the service remains M1-05.

The M1-03 task-local runtime and both scratch directories were removed after accepted review. To reproduce browser verification, provision the pinned Playwright-managed Chromium again and use exclusive ownership of the exact task scratch roots. Follow [L3.8 setup, environment and cleanup](docs/plans/completed/m1-03-real-scan-and-evidence.md#l38-exact-commands-environment-and-effects) from this checkout: provision the task-local cache, verify its inventory and dependency marker, and create ordinary empty setup/scan scratch directories. Set both TEMP and TMP to the exact scan scratch path **before starting Node**, using the reviewed browser wrapper; per-run application code neither changes the environment nor installs a browser. M1-05 must preserve this process-start prerequisite when wiring the callback.

Inside that browser wrapper, the complete suite command is:

```powershell
npm.cmd @toolchainOptions run test:focused -- tests/run-contract.test.ts tests/run-repository.test.ts tests/local-service.test.ts tests/scan-normalization.test.ts tests/scan-page.test.ts
```

Run the independent typecheck separately inside the nonbrowser wrapper. The accepted run passes 290 tests and strict typechecking. Tests load all six unchanged gold states offline with truthful about:blank identity and use intercepted project-owned HTTPS responses for navigation. They do not qualify public DNS, TLS, redirects, arbitrary hostile pages or other platforms. The application capture profile m103-native-dom-v1 is distinct from RD-003's scan-only reporter profile. Work/cleanup deadlines are cooperative, not an OS process-kill guarantee.

## Run the local service

After the prerequisite checks and locked restore above, start from the repository root in PowerShell:

```powershell
$env:A11Y_APPLICATION_REVISION = (git rev-parse HEAD).Trim()
npm.cmd @toolchainOptions run start
```

The revision must be exactly 40 lowercase hexadecimal characters. Optional `A11Y_PORT` accepts decimal 0 through 65535 without spaces, signs, or leading zeroes; absent or zero asks Windows for an available port. The entry point reads no provider credentials, model settings, or arbitrary data-root setting. It needs no browser or model setup. Run only one service instance against this working copy: separate processes are not coordinated.

A successful start prints one JSON `service-ready` event containing the actual `http://127.0.0.1:<port>` URL. Use that URL for `GET /api/health` or `GET /api/runs/<run-id>`. Health reports service readiness, current reservation, and capabilities `readRuns: true`, `scan: false`. Run reads validate the retained aggregate and mark historical `running` records as `interrupted: true`; they do not resume work. There is no Analyze, aggregate-upload, configuration, shutdown, static-file, or UI route. The internal `runScan` collaborator handoff is reserved for later scanner integration and is exercised only with synthetic collaborators in these tests.

Type exactly `stop` and press Enter in the service terminal, then wait for `service-stopped` and exit 0. The entry also handles stdin EOF, SIGINT, and SIGBREAK. Tests exercise LF/CRLF stop and EOF; forced Windows process termination is not evidence of a clean stop. Startup errors emit only `service-startup-failed` with a closed error code and exit 1. A failed stop emits `service-stop-failed` and exits 1; do not interpret that process exit as proof of resource cleanup.

The service refuses overlapping operations without a queue. Cleanup uncertainty closes admission, and a stop deadline permanently forbids late publication. Publication writes the complete validated JSON to an exclusive same-directory staging file, flushes and closes it, then renames it to `run.json`. A failed update preserves prior canonical bytes. This is verified on the local Windows filesystem for the specified single-writer boundary; it is not a universal power-loss, OS-crash, filesystem-filter, malicious-race, or hard OS-call deadline guarantee.

## Retained runs and deletion

Run data stays in the ignored `data/runs/<run-id>/run.json` tree. Reads never repair invalid records, promote staging residue, or automatically resume interrupted work. A completed or failed record is terminal in the current schema; downstream Finding updates remain later tasks. No backup, hidden copy, sweep, or synchronization mechanism is added.

For manual deletion, first stop the service and confirm its normal exit. Verify the resolved absolute target is the exact, correctly spelled direct run-directory child of this checkout's `data/runs`, all ancestors and the target are ordinary directories rather than links or junctions, and its inventory contains only the expected ordinary single-link `run.json`. If any check fails, preserve the directory for inspection. Remove only that verified directory using PowerShell's `Remove-Item` with `-LiteralPath` and `-Recurse`; never use a wildcard or target `data/runs`, its parents, another run, or a corpus directory. Local deletion does not remove any provider-side records.

The repeatable synthetic demonstration creates exactly two exclusive `m102-demo-<UUID>` runs, starts and cleanly stops the actual entry twice, reopens a retained run, then deletes one exact run while checking the other run, a test-owned corpus marker, and pre-existing directory names. It removes its second run and temporary marker afterward; an empty `data/runs` may remain:

```powershell
npm.cmd @toolchainOptions run test:focused -- --test-name-pattern='M102 entry-point reopen and exact deletion' tests/local-service.test.ts
```

This filtered demonstration does not replace either the core subset or the complete five-file suite. Tests use only project-owned synthetic records, isolated `temp/m102-*` roots, and bounded owned child processes; they never acquire or delete a real corpus or user run.

## Current scope

This repository contains the Accepted planning baseline, frozen scan evaluation inputs, pinned toolchain, pure run/scan validators, concrete run repository, loopback service, entry point, and focused tests. The current [M1-02 plan](docs/plans/completed/m1-02-local-service-and-aggregate.md) records ordinary literals, implementation evidence, review state and limitations. The [domain contract](src/server/domain/run-contract.ts) still owns record validation; [storage](src/server/persistence/run-repository.ts) and the [service](src/server/service.ts) reuse it without adding later workflow fields. [Real scanning](src/server/scan/scan-page.ts) and [minimization](src/server/scan/normalize-scan.ts) pass 88 scan tests, 20 normalization tests and both S3 reviews. Final integrated review and documentation closure passed. M1-04 has a corrected rendering candidate with 39 passing UI tests and a controlling 329-test sequential regression, strict typing, a client build, accepted zoom/Narrator evidence, and passing final integrated review; only owner-directed exact cleanup retry and closure remain pending. HTTP integration, retrieval, generation, review and comparison remain their separately selected roadmap tasks.

## Documentation

Start with the [project documentation index](docs/README.md) for the recommended reading order, current concept, context, [project requirements](docs/PROJECT_REQUIREMENTS.md), [development roadmap](docs/DEVELOPMENT_ROADMAP.md), local MVP feasibility assessment, and the derived [documentation-only Gherkin specifications](docs/specs/README.md).

## License

This project is licensed under the [MIT License](LICENSE).
