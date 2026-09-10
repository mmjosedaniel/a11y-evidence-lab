# A11y Evidence Lab

## Overview

A11y Evidence Lab is an accessibility analysis application in development whose goal is to help a frontend developer turn automated findings into traceable, guidance-backed remediation decisions that can be reviewed and verified, with QA engineers as secondary users. For one user-supplied public HTTPS page at a time, it would run a deterministic browser scan, preserve minimized evidence behind each Finding, retrieve relevant guidance from a curated corpus, determine whether that Finding's evidence and guidance are sufficient for generation, and use the selected local or Groq-hosted LLM to generate a cited explanation and remediation proposal with one blocking pre-acceptance judgment and one non-blocking post-change verification reminder through a provider-neutral contract. The portfolio MVP treats that URL as trusted developer/operator input; the user remains responsible for authorization and for choosing an appropriate public target.

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

Development ready. The [development roadmap](docs/DEVELOPMENT_ROADMAP.md) owns task order, selection, and status; the [task plans](docs/plans/README.md) preserve verification, reviews, limitations, and earlier failures.

The application integrates same-origin HTTP scanning, durable run publication, and the Analyze/Results UI. Selected-Finding guidance uses the closed corpus and local exact-vector retrieval, authenticates citations, evaluates evidence sufficiency and guidance support, and durably records abstention or retrieval failure. The detail UI presents native evidence, complete cited passages, source notices and the resulting guidance state. The [M2-03 closure record](docs/plans/completed/m2-03-sufficiency-abstention-and-detail-ui.md#m203-c-post01-closure--renewed-task-closure) preserves its implementation evidence and visual-check deferral.

The [shared generation stage](#shared-generation-apis) validates selected-only input, configuration-bound context fit, one transport attempt, bounded failures and cited proposals. Its internal service continuation durably records generation and preserves completed scan, retrieval and sibling evidence. [M3-02 verification](docs/plans/completed/m3-02-shared-generation-stage.md#m302-regression-01--complete-authoritative-suite) covers controlled adapters and real aggregate persistence. The fixed Local Qwen adapter is implemented with contract and service tests; real Qwen capacity remains unverified. The Groq adapter, Generate UI, proposal review and comparison remain later work.

M2-04 is complete. Its [checkpoint observations](docs/plans/completed/m2-04-retrieval-checkpoint.md#m204-b-accept-01--bounded-checkpoint-observations) exercise all three fixed synthetic Finding profiles through the real local retrieval path: each returns an acceptable gold passage, while missing guidance roles correctly produce no-generation-call abstention. Controlled cases separately demonstrate supported eligibility and adverse outcomes. The [final closure](docs/plans/completed/m2-04-retrieval-checkpoint.md#m204-final-01--integrated-review-and-task-closure) records verification and limitations; these observations are not general retrieval-quality qualification.

The [generation evaluation package](#frozen-generation-evaluation-package) freezes the controlled inputs and shared output contract for later Local and Groq evaluations. This static definition does not implement generation or establish model capacity or provider availability.

See [how to inspect guidance in the UI](#inspecting-m2-02-retrieval-evidence) and [where to find the M2-04 checkpoint evidence](#inspecting-m2-04-checkpoint-evidence).

## Development toolchain

Use exactly [Node.js 24.20.0 with its bundled npm 11.19.0](https://nodejs.org/en/download/archive/v24.20.0). Provision these developer prerequisites yourself; the project has no runtime installer. RD-002 used a temporary official Windows x64 distribution for verification and removed it and its task-specific cache after review; the machine's global runtime was not changed. The exact package pins live in [package.json](package.json), and [package-lock.json](package-lock.json) is the only authoritative dependency lock.

### Development command preparation

Use PowerShell 7 (`pwsh`; verified here with 7.6.5). The preparation uses `[IO.Path]::GetRelativePath`, which is unavailable in Windows PowerShell 5.1. First run `Set-Location -LiteralPath 'C:/Users/mmjos/Desktop/workbeanch/a11y-evidence-lab'`.

The definitions below are maintained for this verified Windows checkout. Run them from the repository root in each new PowerShell command session. When loading the block from a script, dot-source it so its functions remain available in the calling session. They read the location and environment and define values/functions; they do not install, launch, create, or remove anything. The pinned paths are checkout-specific, not a portable installer. Their existing `M105` names preserve compatibility with the commands below.

This is the current preparation source. Its required definitions are extracted unchanged from the historical [M105-CMD-PREP](docs/plans/completed/m1-05-walking-skeleton-integration.md#m105-cmd-prep--exact-shell-literals-and-environment-restoration); task-specific path contracts, hashes, lease state, and cleanup procedures stay in that archive. Do not replay those historical task procedures for current development.

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
```

Every npm or Node invocation below runs through `Invoke-M105Command`. With no scratch argument it disables compilation caching and restores the prior value exactly; browser commands additionally use the assigned scratch path and browser environment. Check prerequisites and restore the lock with lifecycle scripts disabled only when dependency restoration is intended:

```powershell
Invoke-M105Command {
  if ((& $m105Node --version) -ne 'v24.20.0' -or $LASTEXITCODE -ne 0) { throw 'Node 24.20.0 is required.' }
  if ((& $m105Npm @toolchainOptions --version) -ne '11.19.0' -or $LASTEXITCODE -ne 0) { throw 'npm 11.19.0 is required.' }
  & $m105Npm @toolchainOptions ci
  if ($LASTEXITCODE -ne 0) { throw 'Locked dependency restore failed.' }
  & $m105Npm @toolchainOptions run typecheck
  if ($LASTEXITCODE -ne 0) { throw 'Strict TypeScript failed.' }
}
```

Retain optional dependencies: they supply the platform-specific compiler and build binaries. Do not enable install scripts to work around a failure, regenerate the lock during a restore, or introduce another package manager. The independent `typecheck` runs strict `tsc` with no emitted JavaScript; native Node TypeScript execution does not replace it.

The focused runner is Node's built-in test runner. Server modules and tests use erasable TypeScript and explicit `.ts` imports; `.tsx` is client-bundled code, not native Node input. Native execution and the Vite build do not replace strict typechecking.

## Build and verify the walking skeleton

The production entry now serves the built React client and its enumerated assets from the same loopback origin as the API. Vite uses `--configLoader native`, emits only `dist/client`, and needs no React plugin. Missing or invalid client output fails startup as `client-unavailable`; the service does not fall back to a dev server or arbitrary files.

First run the [development command preparation](#development-command-preparation) above. Keep the same prepared shell for build, tests, and service commands.

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

Run the complete nineteen-file suite sequentially, with no running application service or concurrent browser test. The production-entry tests also require the built client. The scanner and walking-skeleton suites use scanner scratch; both UI suites use separate UI scratch:

```powershell
foreach ($m105Test in @('run-contract','run-repository','local-service','scan-normalization','retrieval-contract','embedding-retrieval','retrieval-service','finding-sufficiency','finding-guidance-api','generation-contract','generation-stage','generation-service','ollama-generation-contract','ollama-generation','ollama-generation-service')) {
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
foreach ($m105Test in @('target-results-ui','finding-guidance-ui')) {
  Assert-M105EmptyDirectory $m105UiTemp
  Invoke-M105Command {
    & $m105Node --test --test-timeout=120000 ("tests/" + $m105Test + ".test.ts")
    if ($LASTEXITCODE -ne 0) { throw 'UI suite failed.' }
  } $m105UiTemp
}
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

Production health reports `readRuns: true`, `scan: true`, and `guidance: true` when serving the built client. Analyze posts only target and mode to `POST /api/runs`; the service validates, scans, and publishes one minimized `run.json` before returning a completed result. `POST /api/finding-guidance` accepts exactly `{runId, findingId}` and returns the selected durable outcome with its authenticated citation view, or a bounded failure. `GET /api/runs/<run-id>` remains a validated internal read, not a UI reopen/history action. API-only programmatic construction without `clientRoot` reports `scan: false` and `guidance: false`, serves no UI, and rejects these POST routes with 405. Neither service exposes configuration, upload, shutdown, or arbitrary-file routes.

Type exactly `stop` and press Enter in the service terminal, then require `service-stopped` and exit 0. EOF, SIGINT, and SIGBREAK also request stop. Forced Windows termination is not proof of clean cleanup. Startup errors emit only `service-startup-failed` with a closed error code and exit 1; failed stop emits `service-stop-failed` and exit 1.

The service refuses overlapping operations without a queue. Cleanup uncertainty closes admission, and a stop deadline permanently forbids late publication. Publication writes the complete validated JSON to an exclusive same-directory staging file, flushes and closes it, then renames it to `run.json`. A failed update preserves prior canonical bytes. This is verified on the local Windows filesystem for the specified single-writer boundary; it is not a universal power-loss, OS-crash, filesystem-filter, malicious-race, or hard OS-call deadline guarantee.

## Retained runs and deletion

Run data stays in the ignored `data/runs/<run-id>/run.json` tree. Reads never repair invalid records, promote staging residue, or automatically resume interrupted work. The parent completed/failed scan state is terminal. Selected-Finding updates retain assessed retrieval outcomes, terminal abstention, and M3-02's running, failed or pending-proposal generation branches inside a completed aggregate. Completed scan evidence and sibling data stay immutable. Historical records remain readable without automatic resumption; a running generation record without invocation has unknown call history. Review and comparison updates remain later work. No backup, hidden copy, sweep, or synchronization mechanism is added.

For manual deletion, first stop the service and confirm its normal exit. Verify the resolved absolute target is the exact, correctly spelled direct run-directory child of this checkout's `data/runs`, all ancestors and the target are ordinary directories rather than links or junctions, and its inventory contains only the expected ordinary single-link `run.json`. If any check fails, preserve the directory for inspection. Remove only that verified directory using PowerShell's `Remove-Item` with `-LiteralPath` and `-Recurse`; never use a wildcard or target `data/runs`, its parents, another run, or a corpus directory. Local deletion does not remove any provider-side records.

The repeatable synthetic demonstration creates exactly two exclusive `m102-demo-<UUID>` runs, starts and cleanly stops the actual entry twice, reopens a retained run, then deletes one exact run while checking the other run, a test-owned corpus marker, and pre-existing directory names. It removes its second run and temporary marker afterward; an empty `data/runs` may remain:

```powershell
Invoke-M105Command {
  & $m105Npm @toolchainOptions run test:focused -- --test-name-pattern='M102 entry-point reopen and exact deletion' tests/local-service.test.ts
  if ($LASTEXITCODE -ne 0) { throw 'Reopen and exact-deletion demonstration failed.' }
}
```

This filtered demonstration does not replace either the core subset or the complete nineteen-file suite. Tests use only project-owned synthetic records, isolated `temp/m102-*` roots, and bounded owned child processes; they never acquire or delete a real corpus or user run.

## Current scope

The [capability summary](#project-status) distinguishes implemented behavior from later work. Source entry points are the [domain contract](src/server/domain/run-contract.ts), [run repository](src/server/persistence/run-repository.ts), [local service](src/server/service.ts), [scanner](src/server/scan/scan-page.ts), and [scan minimization](src/server/scan/normalize-scan.ts). Internal retrieval APIs and their boundaries are described with the [closed corpus](#closed-corpus-snapshot).

### Shared generation APIs

[LocalService.generateFinding](src/server/local-service/contracts.ts) continues only the exact live supported retrieval workflow for one `{runId, findingId}`. It saves generation-running before invoking the [shared stage](src/server/generation/generation-stage.ts), then publishes a validated pending proposal or bounded failure through [RunRepository.updateGeneration](src/server/persistence/run-repository/contracts.ts). Failure results distinguish the last durable run from separately returned, unpersisted invocation provenance. Failed publication retains ownership, uncertain cleanup closes admission, and restart never reconstructs a generation capability.

The [adapter contract](src/server/generation/generation-contract.ts) defines preparation, the bounded transport attempt and invocation provenance; the [proposal validator](src/server/generation/proposal-contract.ts) admits only the shared structured output and authenticated selected citations. Missing adapters fail before transport; no production success double or default provider exists. This API has no HTTP route or UI action yet.

The [generation contract](tests/generation-contract.test.ts), [shared-stage](tests/generation-stage.test.ts) and [service continuation](tests/generation-service.test.ts) suites are included in the complete verification command above. Service tests use exclusive `temp/m302-generation-*` roots and owned loopback ports. The [M3-02 closure record](docs/plans/completed/m3-02-shared-generation-stage.md#m302-final-01--final-integrated-review-and-documentation-closure) preserves accepted verification and its limits: controlled adapters do not prove actual provider conformance, model capacity or semantic grounding.

### Fixed Local Qwen adapter

Construct [createOllamaGenerationAdapter](src/server/generation/ollama-generation.ts) and pass it explicitly to `LocalService.generateFinding({runId, findingId}, adapter)` for the current live supported retrieval owner. Import, construction, service startup and mode selection perform no generation I/O. Preparation first proves the complete request fits, then reads version, model metadata and tags from fixed `127.0.0.1:11434`; dispatch uses one bounded `/api/chat` attempt. No default adapter or Generate HTTP/UI action is installed.

This implementation admits the developer-managed [Ollama v0.33.3 release](https://github.com/ollama/ollama/releases/tag/v0.33.3) and `qwen3.5:4b` Q4_K_M manifest SHA-256 `2a654d98e6fba55d452b7043684e9b57a947e393bbffa62485a7aac05ee4eefd`. Install the retained official runtime outside the repository and acquire the model through Ollama's own `ollama pull qwen3.5:4b` command only after the [local capacity prefilter](docs/LOCAL_MVP_FEASIBILITY.md) passes; the application performs no acquisition. A fresh pull must match the admitted digest and metadata. Missing prerequisites or drift fail before chat. Preserve the runtime/model configuration while an eligible action is in progress; observed metadata does not lock a mutable model tag atomically.

The fixed request reserves 4096 output tokens within an explicit 32768-token context, uses temperature 0 and top-p 1, and disables thinking, streaming, input truncation and context shifting. The [accepted configuration and accounting contract](docs/plans/m3-03-qwen-adapter-and-capacity-screen.md#m303-g-contract-01--authored-local-adapter-contract) records the complete bound, inherited settings, parser identity and setup receipt. The three `ollama-generation` suites above use injected transport and controlled service fixtures, including exclusive `temp/m303-generation-*` roots; they do not establish loaded model capacity or real output quality. The required real capacity smoke remains pending supported live retrieval and the implemented reviewer interface.

## Documentation

Start with the [project documentation index](docs/README.md) for the recommended reading order, current concept, context, [project requirements](docs/PROJECT_REQUIREMENTS.md), [development roadmap](docs/DEVELOPMENT_ROADMAP.md), local MVP feasibility assessment, and the derived [documentation-only Gherkin specifications](docs/specs/README.md).

## License

Project-authored code and documentation are licensed under the [MIT License](LICENSE). The W3C text in the closed corpus retains its source-specific terms below.

## Frozen generation evaluation package

The [M3-01 manifest](evaluation/m301-generation-v1.json) defines three shared controlled cases, six future Local/Groq bindings, one output/instruction contract, material controls, the rubric and one provider-independent no-call case. The [accepted evaluation-only exception](docs/requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md#controlled-generation-input-exception) permits independently assembled canonical support for those six executions. Actual M2-04 retrieval abstentions, production eligibility and later integration obligations remain unchanged.

In the original development checkout, the nine exact files under `temp/m301-generation-freeze-v1/` contain the inputs, separate provenance, instruction, schema and no-call definition. They are ignored and absent from a fresh checkout; the manifest records their identities without publishing raw prompts or payloads. The [freeze receipt](docs/plans/completed/m3-01-generation-evaluation-package.md#m301-freeze-01--exact-static-package-and-verification) and [final acceptance](docs/plans/completed/m3-01-generation-evaluation-package.md#m301-final-01--final-review-and-documentation-closure) preserve the evidence and its limits.

For read-only verification, load only the [development command definitions](#development-command-preparation), then run the preserved verification block in [M301-COMMAND-02](docs/plans/completed/m3-01-generation-evaluation-package.md#m301-command-02--resolved-preparation-validation-and-closure-callers) from the repository root. It also requires the retained M2-04 run/seed files named there and makes no model request. Historical creation and task-closure instructions are not steps to replay. Missing or mismatched exact files block downstream use until the existing [recovery conditions](docs/plans/completed/m3-01-generation-evaluation-package.md#idempotence-and-recovery) are satisfied; do not regenerate or overwrite the frozen package merely to make a check pass.

## Closed corpus snapshot

The accepted M2-01 snapshot consists of the [source manifest](corpus/wcag22-mvp-v1/manifest.json), [canonical passages](corpus/wcag22-mvp-v1/passages.json), and [three-profile gold mappings](evaluation/m201-corpus-v1.json). It contains 16 manually selected, complete paragraph/list units from exactly eight W3C artifacts for `image-alt` / 1.1.1, `label` / 4.1.2, and `color-contrast` / 1.4.3. The dated 12 December 2024 Recommendation is normative; Understanding and Techniques are informative. Techniques are examples, not mandatory methods. No unresolved material conflict remains in the selected units after curator review with normative precedence.

Read the manifest, catalog, gold mappings and these notices together. Paragraph/list line breaks represent HTML layout; entities are decoded and wording is preserved. Definition terms retain their exact glossary locator. Source references inside quoted units do not expand the closed source pack or its supported profile tags. Stable passage IDs are manual labels, not ranks. Required roles and conflict declarations are inputs for deterministic support evaluation; gold IDs are acceptable direct-support targets for the fixed cases, not a required ordering or instruction to return all targets.

The catalog is the sole canonical selected-text snapshot. Reconstruct it from its existing JSON without refetching sources or changing IDs, headings, boundaries, text, roles or mappings. A source or passage change needs a new corpus version and affected gold/evaluation evidence. The [M2-01 plan](docs/plans/completed/m2-01-closed-corpus-snapshot.md#m201-cmd-validate--future-static-candidate-read-only) records the read-only structural, reconstruction, negative and semantic checks. The internal retrieval APIs below consume this frozen snapshot. See the [retrieval evidence guide](#inspecting-m2-02-retrieval-evidence) for the accepted observation and current UI boundary. Gold evidence is an expected subset grounded in frozen RD-003 fixtures and historical observations, not a newly scanned Finding or a model result.

To repeat the static checks in the documented development environment, run the plan's read-only PREP block and then VALIDATE in the same PowerShell session from the repository root. PREP initializes the fixed source table and scan manifest used by VALIDATE. Do not run ACQUIRE or CLEANUP: the eight temporary full-page captures were verified and removed at closure. Source-semantic review is preserved in the [curation record](docs/plans/completed/m2-01-closed-corpus-snapshot.md#m201-corpus-candidate-01--primary-curation-and-verification), and accepted artifact identities and final status are in the [freeze record](docs/plans/completed/m2-01-closed-corpus-snapshot.md#m201-closure-01--final-freeze-and-documentation-impact).

M2-02's slice-A APIs are [loadCorpusCatalog/createCorpusDocuments](src/server/retrieval/corpus-catalog.ts), [createFindingQuery](src/server/retrieval/finding-query.ts), and [validateRetrievalResult](src/server/retrieval/retrieval-contract.ts). The loader accepts only the fixed normalized corpus identities and preserves the manifest notices; query/result validation is pure and imports no corpus I/O or model runtime. M2-02 wired these APIs into the internal service; M2-03 adds the guidance HTTP boundary and its selected-Finding UI. The browser-free retrieval-contract test above covers them without Ollama, model files or a tokenizer installation.

M2-02's slice-B APIs are [createExactRetrieval](src/server/retrieval/exact-retrieval.ts) and its [bounded Ollama session](src/server/retrieval/ollama-embedding.ts), [input-fit guard](src/server/retrieval/embedding-input-fit.ts), and [exact ranking](src/server/retrieval/retrieval-ranking.ts). Imports and factory construction perform no model or corpus I/O; only an explicit retrieval call uses the fixed local Ollama boundary. The engine builds all 16 document vectors lazily, reuses only a compatible verified collection, and returns at most three canonical passages. Deterministic embedding-retrieval tests use fake transport and supplied vectors, with the actual in-memory search library; they do not establish real model compatibility or capacity. M2-02's slice C integrated the engine into the internal service. The separate [real retrieval-capacity observation](docs/LOCAL_MVP_FEASIBILITY.md#m2-02-retrieval-only-observation--2026-09-08) passed for the recorded model/runtime configuration; M2-03 provides the selected-Finding UI; its evidence does not extend that capacity observation.

[LocalService.retrieveFinding](src/server/local-service/contracts.ts) and [RunRepository.updateRetrieval](src/server/persistence/run-repository/contracts.ts) now implement M2-03's evidence-first extension of M2-02's selected-Finding service. Guidance accepts exactly one `{runId, findingId}`, reserves the shared operation, and durably activates only that Finding. Incomplete required evidence produces an application-authored abstention without retrieval; complete evidence uses the lazy default engine, authenticates exact citations, and evaluates support before publication. Insufficient completed guidance produces terminal abstention; supported guidance remains active and retains its service owner for a later workflow stage. Execution or integrity failure has no support state. Return values identify the actual durable aggregate and preserve native evidence and siblings; a failed write keeps the last valid aggregate. Startup, scans and reads do not start model work.

### Inspecting M2-02 retrieval evidence

Follow [Run the local service](#run-the-local-service) to open the Analyze/Results UI. Select a Finding to inspect its native evidence, then activate **Get guidance** once. The application first checks captured evidence; complete evidence uses the developer-managed local embedding runtime. The detail shows complete cited passages and source notices, evidence sufficiency, and supported eligibility, a no-generation-call abstention, or a distinct retrieval failure. Citation links open in a separate tab to preserve the current results session. The exact corpus version remains visible even when retrieval returns no passages. Similarity describes ranking, not support or confidence. Opening the UI and selecting an item do not start model work. Scanner review observations remain evidence-only; no saved-run reopen/import, Generate, retry or review control is provided. A supported unfinished workflow retains ownership and prevents another guidance operation. The [M2-03 closure record](docs/plans/completed/m2-03-sufficiency-abstention-and-detail-ui.md#m203-c-post01-closure--renewed-task-closure) records completed verification and its limits; the [M2-04 observations](docs/plans/completed/m2-04-retrieval-checkpoint.md#m204-b-accept-01--bounded-checkpoint-observations) record the fixed three-profile integration evaluation separately from general retrieval quality.

M2-02's actual retrieval evidence is a saved JSON result, not a new retrieval screen. In the original development checkout, inspect these retained, ignored files in an editor without rerunning inference:

- `temp/m202-capacity-01/capacity-evidence.json`: three ranked canonical references and scores, the 3846.0786-ms duration, and durable-readback/preservation checks.
- `temp/m202-capacity-01/runs/m202-capacity-01/run.json`: the full synthetic run with the completed selected-Finding retrieval result and preserved scan/sibling evidence.

These local files are not included in a fresh checkout. The tracked [capacity evidence record](docs/plans/completed/m2-02-embedding-retrieval-capacity-gate.md#capacity-screen-and-integration-closure) preserves their identities and the bounded observation; the [closure record](docs/plans/completed/m2-02-embedding-retrieval-capacity-gate.md#m202-closure-01--final-integrated-verification-and-documentation-impact) records accepted verification and review. This was one retrieval-capacity observation, not retrieval-quality qualification. Browser interaction timing was not instrumented, and the driver exited 1 during post-success shutdown control; neither limitation invalidated the accepted durable result, but neither is an exit-zero or UI-latency claim.

### Inspecting M2-04 checkpoint evidence

The [accepted checkpoint record](docs/plans/completed/m2-04-retrieval-checkpoint.md#m204-b-accept-01--bounded-checkpoint-observations) contains the ordered passage IDs, scores, gold observations, missing roles and retained-file identities for the three real cases. Its [final closure](docs/plans/completed/m2-04-retrieval-checkpoint.md#m204-final-01--integrated-review-and-task-closure) records independent review, verification and the remaining visual-check limits.

In the original development checkout, inspect the retained, ignored files under `temp/m204-retrieval-checkpoint/` in an editor:

- `g1/`, `g2/` and `g3/` hold the actual image, email-label and contrast retrieval observations.
- `s/`, `a/`, `z/`, `f/` and `i/` hold the controlled supported, incomplete, missing, embedding-failure and corpus-integrity cases.
- Each case directory contains `evidence.json` and `runs/m204-<case>/run.json`, using the lowercase case ID, such as `g1/runs/m204-g1/run.json`.

These files are absent from a fresh checkout; the tracked records above preserve the accepted outcomes and their identities. All three real results abstained, and supported eligibility was demonstrated only by a controlled case. Conflict evidence is limited to pure policy, display and canonical-rejection checks; there is no persisted conflict run. The archived callers describe consumed, bounded evaluations and are not replay instructions. Inspecting retained JSON requires no model request.

### Closed corpus notices

The manifest identifies every original title, URL, status, observed version, copyright and attribution. This catalog includes material copied from **Web Content Accessibility Guidelines (WCAG) 2.2**, [W3C Recommendation, 12 December 2024](https://www.w3.org/TR/2024/REC-WCAG22-20241212/), Copyright © 2020-2024 World Wide Web Consortium. It also includes material copied from the seven informative Understanding/Technique documents individually identified and linked in the [manifest](corpus/wcag22-mvp-v1/manifest.json), Copyright © 2026 World Wide Web Consortium. Authorship is attributed to the W3C Accessibility Guidelines Working Group and contributors. Selection and plain-text layout are described above; quoted wording is unchanged. No W3C endorsement is implied.

The actual Recommendation footer links to the [W3C Document License](https://www.w3.org/copyright/document-license/), [liability](https://www.w3.org/policies/#Legal_Disclaimer) and [trademark](https://www.w3.org/policies/#W3C_Trademarks) notices. The seven supporting-page footers link to the [W3C Software and Document License](https://www.w3.org/copyright/software-license/), [liability](https://www.w3.org/policies/#disclaimers) and [trademark](https://www.w3.org/policies/#trademarks) notices. Both license links resolved to their 2023 versions when reviewed on 2026-09-03. These are accompanying source notices, not additional retrieval sources. Keep the source metadata and applicable full notice viewable with every later copied or displayed portion; a later UI, package or public distribution requires its own presentation review. M2-01 authorizes local preparation only.

#### W3C Document License — 2023

The following license and disclaimers are reproduced from the [2023 Document License](https://www.w3.org/copyright/document-license-2023/), in effect since 1 January 2023.

> By using and/or copying this document, or the W3C document from which this statement is linked, you (the licensee) agree that you have read, understood, and will comply with the following terms and conditions:
>
> Permission to copy, and distribute the contents of this document, or the W3C document from which this statement is linked, in any medium for any purpose and without fee or royalty is hereby granted, provided that you include the following on ALL copies of the document, or portions thereof, that you use:
>
> - A link or URL to the original W3C document.
> - The pre-existing copyright notice of the original author, or if it doesn't exist, a notice (hypertext is preferred, but a textual representation is permitted) of the form: "Copyright © [$date-of-document] World Wide Web Consortium. https://www.w3.org/copyright/document-license-2023/"
> - If it exists, the STATUS of the W3C document.
>
> When space permits, inclusion of the full text of this NOTICE should be provided. We request that authorship attribution be provided in any software, documents, or other items or products that you create pursuant to the implementation of the contents of this document, or any portion thereof.
>
> No right to create modifications or derivatives of W3C documents is granted pursuant to this license, except as follows: To facilitate implementation of the technical specifications set forth in this document, anyone may prepare and distribute derivative works and portions of this document in software, in supporting materials accompanying software, and in documentation of software, PROVIDED that all such works include the notice below.
>
> HOWEVER, the publication of derivative works of this document for use as a technical specification is expressly prohibited.
>
> In addition, "Code Components" —Web IDL in sections clearly marked as Web IDL; and W3C-defined markup (HTML, CSS, etc.) and computer programming language code clearly marked as code examples— are licensed under the W3C Software License.
>
> The notice is:
>
> "Copyright © 2023 W3C®. This software or document includes material copied from or derived from [title and URI of the W3C document]."
>
> THIS DOCUMENT IS PROVIDED "AS IS," AND COPYRIGHT HOLDERS MAKE NO REPRESENTATIONS OR WARRANTIES, EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR TITLE; THAT THE CONTENTS OF THE DOCUMENT ARE SUITABLE FOR ANY PURPOSE; NOR THAT THE IMPLEMENTATION OF SUCH CONTENTS WILL NOT INFRINGE ANY THIRD PARTY PATENTS, COPYRIGHTS, TRADEMARKS OR OTHER RIGHTS.
>
> COPYRIGHT HOLDERS WILL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, SPECIAL OR CONSEQUENTIAL DAMAGES ARISING OUT OF ANY USE OF THE DOCUMENT OR THE PERFORMANCE OR IMPLEMENTATION OF THE CONTENTS THEREOF.
>
> The name and trademarks of copyright holders may NOT be used in advertising or publicity pertaining to this document or its contents without specific, written prior permission. Title to copyright in this document will at all times remain with copyright holders.

#### W3C Software and Document License — 2023

The following license and disclaimers are reproduced from the [2023 Software and Document License](https://www.w3.org/copyright/software-license-2023/), in effect since 1 January 2023.

> By obtaining and/or copying this work, you (the licensee) agree that you have read, understood, and will comply with the following terms and conditions.
>
> Permission to copy, modify, and distribute this work, with or without modification, for any purpose and without fee or royalty is hereby granted, provided that you include the following on ALL copies of the work or portions thereof, including modifications:
>
> - The full text of this NOTICE in a location viewable to users of the redistributed or derivative work.
> - Any pre-existing intellectual property disclaimers, notices, or terms and conditions. If none exist, the W3C software and document short notice should be included.
> - Notice of any changes or modifications, through a copyright statement on the new code or document such as "This software or document includes material copied from or derived from [title and URI of the W3C document]. Copyright © [$year-of-document] World Wide Web Consortium. https://www.w3.org/copyright/software-license-2023/"
>
> THIS WORK IS PROVIDED "AS IS," AND COPYRIGHT HOLDERS MAKE NO REPRESENTATIONS OR WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO, WARRANTIES OF MERCHANTABILITY OR FITNESS FOR ANY PARTICULAR PURPOSE OR THAT THE USE OF THE SOFTWARE OR DOCUMENT WILL NOT INFRINGE ANY THIRD PARTY PATENTS, COPYRIGHTS, TRADEMARKS OR OTHER RIGHTS.
>
> COPYRIGHT HOLDERS WILL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, SPECIAL OR CONSEQUENTIAL DAMAGES ARISING OUT OF ANY USE OF THE SOFTWARE OR DOCUMENT.
>
> The name and trademarks of copyright holders may NOT be used in advertising or publicity pertaining to the work without specific, written prior permission. Title to copyright in this work will at all times remain with copyright holders.
