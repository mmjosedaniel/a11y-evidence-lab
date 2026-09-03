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

The MVP has exactly two generation modes: developer-managed `qwen3.5:4b` through a separately installed Ollama runtime, or the Groq API as the first and only external provider. Before analysis, the user explicitly selects one global mode; the immutable selection and exact model are retained for the run and apply to every later eligible finding. The Analyze form shows no normal provider/model explanation, and provider-independent scan Results do not repeat that metadata. Provider-specific disclosure appears when a later selected-Finding workflow makes generation relevant. Selection performs no provider call or synthetic readiness probe. Each eligible finding still requires an explicit generation action, after which the selected adapter performs only its attempt-time prerequisite check, makes the actual request, and validates the returned structured value. Providers are never mixed, there is no automatic fallback, and provider-invocation provenance exists only when a call is attempted. Local mode remains visibly recommended. In Local mode, generation prompts and responses use only the approved Ollama loopback boundary; corpus/query embedding also remains local in either generation mode. This is not an offline or machine-wide zero-egress claim: trusted-page navigation is external, and an explicitly selected Groq generation action may send only its accepted minimized payload. The fixed Groq evaluation configuration uses model ID `openai/gpt-oss-20b`; this is an evaluation choice, not a release-qualified dependency or availability promise. Local model evaluation remains subject to the documented capacity gate on the existing reference PC; models outside that capacity are excluded. TypeScript, React, and the bounded LangChain role join the other initial evaluation baselines recorded in the [architecture decisions](docs/architecture/decisions/README.md).

## Planned MVP startup and generation setup

The portfolio MVP has no installer, desktop wrapper, Start menu shortcut, or application-controlled webview. The developer starts a local application service on the developer machine and opens its loopback address in Chrome or Edge. The browser is only the unprivileged interface; the local service owns filesystem access, scan-browser automation, the local model-runtime adapter, and the Groq adapter.

For retrieval in either generation mode, the developer manually installs Ollama and runs `ollama pull embeddinggemma` through Ollama's own tooling outside A11y Evidence Lab. Local generation additionally requires `ollama pull qwen3.5:4b`; Groq generation instead requires a Groq credential in the local service. The application does not install or update Ollama, pull or remove models, track acquisition progress, expose a model manager, or provide a separate provider-probe interface. It checks `embeddinggemma` and builds the in-memory vectors only when retrieval is first requested; it checks `qwen3.5:4b` only when an explicit eligible Local generation attempt begins. The actual work and response validation determine success or visible failure. Packaging and installer work are deferred until a demonstrated distribution need justifies them. [ADR-0020](docs/architecture/decisions/ADR-0020-manual-developer-managed-local-model-setup.md) records the developer-managed setup boundary, [ADR-0022](docs/architecture/decisions/ADR-0022-closed-versioned-guidance-corpus.md) records the closed corpus, and [ADR-0023](docs/architecture/decisions/ADR-0023-local-mode-data-boundary.md) records the Local-mode data boundary.

The canonical local artifact for a page analysis is one versioned `data/runs/<run-id>/run.json` aggregate containing the scan and the current nested per-finding workflow data. The MVP generates no Markdown report and adds no database or independently versioned child-record lifecycle. [ADR-0019](docs/architecture/decisions/ADR-0019-in-process-exact-vector-search.md), [ADR-0021](docs/architecture/decisions/ADR-0021-single-file-run-aggregate.md), and [OD-022](docs/requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-022--portfolio-mvp-yagni-simplification) record these portfolio-first YAGNI decisions.

## Planned workflow

1. The user enters one trusted, authorized public HTTPS URL for which they are responsible, explicitly selects the global Local or Groq generation mode, and activates **Analyze** to start one scan under the [trusted-operator boundary](docs/architecture/decisions/ADR-0018-trusted-operator-url-boundary.md). The ready Analyze form shows no normal provider explanation, and mode selection does not contact a provider.
2. In a fresh non-persistent browser context with no imported user profile, credentials, or authentication state, the scan runs exactly `image-alt`, `label`, and `color-contrast` against the entire top-level document in its current rendered state at the configured readiness condition, with iframe documents excluded, then [captures every reported violation node and its minimized evidence](docs/architecture/candidates/ACCESSIBILITY_FINDING_EVIDENCE_CAPTURE_ASSESSMENT.md) while keeping native incomplete observations separate. It performs no crawling, clicks, form submission, uploads, or download workflow, uses one ordinary navigation timeout, and cleans up its browser context after success or failure.
3. The application lists the findings; the user selects one finding at a time for [curated guidance retrieval](docs/architecture/candidates/guidance-retrieval/README.md) through the accepted in-process exact-vector path, which returns at most three ranked passages and requires no persistent vector service.
4. For that Finding, the application [gates generation on evidence sufficiency](docs/architecture/candidates/EVIDENCE_GROUNDED_REMEDIATION_GENERATION_ASSESSMENT.md). Complete required Finding evidence plus a completed `supported` retrieval permits an explicit attempt through only the selected provider and may produce a cited proposal with confidence, uncertainty, a blocking pre-acceptance judgment, and a non-blocking post-change verification reminder after application-owned validation. Incomplete required Finding evidence, or a completed `incomplete`, `missing`, or `conflicting` retrieval, produces a terminal application-authored abstention with a clear reason and manual-investigation guidance, without a model call or proposal-review decision. A retrieval execution or integrity failure instead fails the FindingWorkflow with no support state, abstention, or model call.
5. For a validated proposal only, the application [presents it for individual approval, editing, or rejection](docs/architecture/candidates/HUMAN_REMEDIATION_REVIEW_ASSESSMENT.md); it never creates one combined proposal for the page.
6. From any retained baseline Finding, a later analysis of the same authorized page [compares evidence conservatively per finding](docs/architecture/candidates/RESCAN_EVIDENCE_COMPARISON_ASSESSMENT.md). Retrieval, generation or abstention, and review are not prerequisites for this separate scan-evidence path.

Public comparison always starts from a baseline Finding. For binary `image-alt` and `label` evidence, a uniquely correlated target may therefore be `resolved` or `persistent`; a later-only violation remains visible but is not labeled `regressed`. Reversing the controlled positive/failing fixture pair may exercise binary regression only as a non-persisted deterministic evaluation case. For `color-contrast`, the retained contrast margin supplies an ordered measure: a comparable later failure may be `improved`, `persistent`, or `regressed`, while a later non-failing observation may be `resolved`. Changed or ambiguous live-page structure may require `inconclusive` or `not comparable`. None of these outcomes establishes whole-page accessibility or conformance.

## Project status

Development ready. The [development roadmap](docs/DEVELOPMENT_ROADMAP.md) owns implementation order and status. [RD-002](docs/plans/completed/rd-002-minimum-development-toolchain-literals.md) completed the pinned toolchain, and [RD-003](docs/plans/completed/rd-003-scan-evaluation-boundary.md) completed the six controlled fixtures and scan-only evaluation manifest, including reviewed reproducibility and cleanup corrections. [M1-01](docs/plans/completed/m1-01-run-and-scan-contracts.md) completed the pure run/scan validators and 58 contract tests.

[M1-02 — Local service and aggregate](docs/plans/completed/m1-02-local-service-and-aggregate.md) is Complete. At its closure, all 182 product tests, independent strict typechecking, actual startup/reopen/stop and exact synthetic-run deletion passed. Both slice S3 reviews and the different final integrated critical review passed; documentation closure is accepted. The service is runnable with the instructions below. M1-05 now connects HTTP scanning to the completed internal scanner and Results UI. Retrieval, generation, provider calls, review, and comparison remain unimplemented.

[M1-03 — Real scan and evidence](docs/plans/completed/m1-03-real-scan-and-evidence.md) is Complete after owner-authorized execution and verified closure. Both scanner slices and their S3 reviews are accepted. All 290 integrated tests and independent strict typechecking pass, including the failed-launch residue regression. The different final integrated critical review, exact task-owned runtime cleanup and documentation closure passed. At M1-03 closure, M1-04 and M1-05 were unselected.

[M1-04 — Target and results UI](docs/plans/completed/m1-04-target-and-results-ui.md) is Complete after the OD-027 [Analyze and results presentation](docs/ui/ANALYZE_AND_RESULTS_PRESENTATION.md), purpose-named component extraction, integrated-review correction, complete regression, independent reviews, exact cleanup, and documentation closure. [M1-05](docs/plans/completed/m1-05-walking-skeleton-integration.md) is Complete again. Both post-closure corrections pass 335 tests and strict TypeScript; fresh independent reviews, exact cleanup, and renewed documentation closure passed. The earlier public-page smoke remains historical and was not repeated. [M2-01 — Closed corpus snapshot](docs/plans/m2-01-closed-corpus-snapshot.md) is In progress for owner-selected planning only. Corpus execution and source acquisition still require explicit authorization; no corpus or retrieval behavior is implemented.

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

The focused runner is Node's built-in test runner. Server modules and tests use erasable TypeScript and explicit `.ts` imports; `.tsx` is client-bundled code, not native Node input. Native execution and the Vite build do not replace strict typechecking.

## Build and verify the walking skeleton

The production entry now serves the built React client and its enumerated assets from the same loopback origin as the API. Vite uses `--configLoader native`, emits only `dist/client`, and needs no React plugin. Missing or invalid client output fails startup as `client-unavailable`; the service does not fall back to a dev server or arbitrary files.

For this verified Windows checkout, first run only the read-only definitions in [M105-CMD-PREP](docs/plans/completed/m1-05-walking-skeleton-integration.md#m105-cmd-prep--exact-shell-literals-and-environment-restoration). They define the pinned Node path, retained browser path, environment-restoring `Invoke-M105Command`, and ordinary-path checks. Do not replay the historical planning, lease, evidence-capture, or task-cleanup blocks. The preparation block contains this checkout's absolute path; it is not a portable installer.

The retained browser is full Playwright-managed Chromium revision 1234 / version 151.0.7922.34 under `m104-browser-runtime/browsers`. It remains a developer prerequisite, not a general support claim. If absent, use the reviewed [RD-003 acquisition procedure](docs/plans/completed/rd-003-scan-evaluation-boundary.md#current-reproduction--rd003-procedure-003) and reconcile the resulting browser path before running anything; the application never downloads a browser. The seven frozen evaluation artifacts retain their LF policy and original native outcomes.

In the same prepared shell, create only missing task scratch directories, reject unexpected contents, and build only when the generated output is absent:

```powershell
foreach ($m105Scratch in @($m105ScanTemp,$m105UiTemp,$m105IntegrationTemp)) {
  $null = Assert-M105OrdinaryPath $m105Scratch -AllowMissing
  if (-not (Test-Path -LiteralPath $m105Scratch)) {
    New-Item -ItemType Directory -Path $m105Scratch -ErrorAction Stop | Out-Null
  }
  Assert-M105EmptyDirectory $m105Scratch
}
$null = Assert-M105OrdinaryPath $m105Build -AllowMissing
if (Test-Path -LiteralPath $m105Build) { throw 'Inspect existing client output before rebuilding.' }
Invoke-M105Command {
  & $m105Node node_modules/typescript/bin/tsc --project tsconfig.json
  if ($LASTEXITCODE -ne 0) { throw 'Strict TypeScript failed.' }
  & $m105Node node_modules/vite/bin/vite.js build --configLoader native
  if ($LASTEXITCODE -ne 0) { throw 'Client build failed.' }
}
```

The complete current suite has seven files and passed 335 tests after the post-closure correction. Run them sequentially, with no running application service or concurrent browser test. The production-entry tests also require the built client. The scanner and walking-skeleton suites use scanner scratch; the UI suite uses separate UI scratch:

```powershell
foreach ($m105Test in @('run-contract','run-repository','local-service','scan-normalization')) {
  Invoke-M105Command {
    & $m105Node --test --test-timeout=120000 ("tests/" + $m105Test + ".test.ts")
    if ($LASTEXITCODE -ne 0) { throw 'Browser-free suite failed.' }
  }
}
foreach ($m105Test in @('scan-page','walking-skeleton')) {
  Assert-M105EmptyDirectory $m105ScanTemp
  Assert-M105EmptyDirectory $m105IntegrationTemp
  Invoke-M105Command {
    & $m105Node --test --test-timeout=120000 ("tests/" + $m105Test + ".test.ts")
    if ($LASTEXITCODE -ne 0) { throw 'Scanner or integration suite failed.' }
  } $m105ScanTemp
}
Invoke-M105Command {
  & $m105Node --test --test-timeout=120000 tests/target-results-ui.test.ts
  if ($LASTEXITCODE -ne 0) { throw 'UI suite failed.' }
} $m105UiTemp
foreach ($m105Scratch in @($m105ScanTemp,$m105UiTemp,$m105IntegrationTemp)) {
  Assert-M105EmptyDirectory $m105Scratch
}
```

The controlled tests use the six project-owned states and intercepted project-owned HTTPS responses. They are not live-public-site qualification. The separate authorized public-page smoke passed only after the production service and managed browser ran outside a network-restricted sandbox; `net::ERR_NETWORK_ACCESS_DENIED` in that sandbox was an environment failure, not a valid zero result. Do not disable browser isolation or broaden target scope to work around it. Work and cleanup deadlines remain cooperative, not an OS process-kill guarantee.

## Run the local service

After the build and scratch checks above, run this in the prepared shell. It supplies the scanner's process-start environment before Node starts, restores it afterward, and makes no model or provider call:

```powershell
$m105PriorRevision = [Environment]::GetEnvironmentVariable('A11Y_APPLICATION_REVISION','Process')
$m105PriorPort = [Environment]::GetEnvironmentVariable('A11Y_PORT','Process')
try {
  $env:A11Y_APPLICATION_REVISION = (git rev-parse HEAD).Trim()
  $env:A11Y_PORT = '0'
  Assert-M105EmptyDirectory $m105ScanTemp
  Invoke-M105Command {
    & $m105Node src/server/main.ts
    if ($LASTEXITCODE -ne 0) { throw 'Local service did not stop successfully.' }
  } $m105ScanTemp
  Assert-M105EmptyDirectory $m105ScanTemp
} finally {
  [Environment]::SetEnvironmentVariable('A11Y_APPLICATION_REVISION',$m105PriorRevision,'Process')
  [Environment]::SetEnvironmentVariable('A11Y_PORT',$m105PriorPort,'Process')
}
```

The revision must be exactly 40 lowercase hexadecimal characters. Optional `A11Y_PORT` accepts decimal 0 through 65535 without spaces, signs, or leading zeroes; absent or zero asks Windows for an available port. The entry reads no provider credentials, model settings, or arbitrary data-root setting. No Ollama installation or model is needed for scanning. Run only one service instance against this checkout; separate processes are not coordinated.

A successful start prints one JSON `service-ready` event with the actual `http://127.0.0.1:<port>` URL. Open that exact URL in Chrome or Edge, enter one permitted trusted public HTTPS target, explicitly select Local or Groq, and activate Analyze once. The service owns a separate fresh managed Chromium context; it does not use your UI browser profile. Keep the target and ordinary redirect destination non-sensitive. Local/Groq selection records context only and makes no provider call.

Production health reports `readRuns: true`, `scan: true`. The built client posts only target and mode to `POST /api/runs`; the service validates, scans, and publishes one minimized `run.json` before returning a completed result. `GET /api/runs/<run-id>` remains a validated internal read, not a UI reopen/history action. API-only programmatic construction without `clientRoot` still reports `scan: false`, serves no UI, and rejects POST with 405. Neither service exposes configuration, upload, shutdown, or arbitrary-file routes.

Type exactly `stop` and press Enter in the service terminal, then require `service-stopped` and exit 0. EOF, SIGINT, and SIGBREAK also request stop. Forced Windows termination is not proof of clean cleanup. Startup errors emit only `service-startup-failed` with a closed error code and exit 1; failed stop emits `service-stop-failed` and exit 1.

The service refuses overlapping operations without a queue. Cleanup uncertainty closes admission, and a stop deadline permanently forbids late publication. Publication writes the complete validated JSON to an exclusive same-directory staging file, flushes and closes it, then renames it to `run.json`. A failed update preserves prior canonical bytes. This is verified on the local Windows filesystem for the specified single-writer boundary; it is not a universal power-loss, OS-crash, filesystem-filter, malicious-race, or hard OS-call deadline guarantee.

## Retained runs and deletion

Run data stays in the ignored `data/runs/<run-id>/run.json` tree. Reads never repair invalid records, promote staging residue, or automatically resume interrupted work. A completed or failed record is terminal in the current schema; downstream Finding updates remain later tasks. No backup, hidden copy, sweep, or synchronization mechanism is added.

For manual deletion, first stop the service and confirm its normal exit. Verify the resolved absolute target is the exact, correctly spelled direct run-directory child of this checkout's `data/runs`, all ancestors and the target are ordinary directories rather than links or junctions, and its inventory contains only the expected ordinary single-link `run.json`. If any check fails, preserve the directory for inspection. Remove only that verified directory using PowerShell's `Remove-Item` with `-LiteralPath` and `-Recurse`; never use a wildcard or target `data/runs`, its parents, another run, or a corpus directory. Local deletion does not remove any provider-side records.

The repeatable synthetic demonstration creates exactly two exclusive `m102-demo-<UUID>` runs, starts and cleanly stops the actual entry twice, reopens a retained run, then deletes one exact run while checking the other run, a test-owned corpus marker, and pre-existing directory names. It removes its second run and temporary marker afterward; an empty `data/runs` may remain:

```powershell
npm.cmd @toolchainOptions run test:focused -- --test-name-pattern='M102 entry-point reopen and exact deletion' tests/local-service.test.ts
```

This filtered demonstration does not replace either the core subset or the complete seven-file suite. Tests use only project-owned synthetic records, isolated `temp/m102-*` roots, and bounded owned child processes; they never acquire or delete a real corpus or user run.

## Current scope

This repository contains the Accepted planning baseline, frozen scan evaluation inputs, pinned toolchain, pure run/scan validators, concrete run repository, loopback service, entry point, focused tests, and the completed M1-04 target/results UI narrowed by OD-026 and OD-027. The [M1-02 plan](docs/plans/completed/m1-02-local-service-and-aggregate.md) records ordinary literals, implementation evidence, review state and limitations. The [domain contract](src/server/domain/run-contract.ts) still owns record validation; [storage](src/server/persistence/run-repository.ts) and the [service](src/server/service.ts) reuse it without adding later workflow fields. [Real scanning](src/server/scan/scan-page.ts) and [minimization](src/server/scan/normalize-scan.ts) pass 88 scan tests, 20 normalization tests and both S3 reviews. M1-04's final evidence-first interface passed its controlling 290-plus-30 regression, strict, build, review, browser/accessibility, cleanup and documentation gates. [M1-05](docs/plans/completed/m1-05-walking-skeleton-integration.md#m105-pc08-accepted-verification--replacement-evidence) now verifies same-origin HTTP integration and real scan-to-disk publication. All 335 tests, strict TypeScript, fresh independent reviews, exact cleanup, and renewed documentation closure passed after the post-closure corrections. The earlier authorized public-page smoke remains historical evidence and was not repeated. Retrieval, generation, review, and comparison remain separately selected roadmap work.

## Documentation

Start with the [project documentation index](docs/README.md) for the recommended reading order, current concept, context, [project requirements](docs/PROJECT_REQUIREMENTS.md), [development roadmap](docs/DEVELOPMENT_ROADMAP.md), local MVP feasibility assessment, and the derived [documentation-only Gherkin specifications](docs/specs/README.md).

## License

This project is licensed under the [MIT License](LICENSE).
