# Development and local operation

[Documentation index](README.md) · [Project overview](../README.md)

This guide owns the maintained developer prerequisites, shell preparation, verification commands, local-service startup and retained-run cleanup. Commands run from the repository root in the documented Windows checkout. Implementation status belongs to the [roadmap](DEVELOPMENT_ROADMAP.md); setup does not authorize another development task.

In this guide: [Startup and model setup](#planned-mvp-startup-and-generation-setup) · [Toolchain and shell preparation](#development-toolchain) · [Build and verification](#build-and-verify-the-walking-skeleton) · [Start and stop the service](#run-the-local-service) · [Retained runs and deletion](#retained-runs-and-deletion).

## Planned MVP startup and generation setup

The portfolio MVP has no installer, desktop wrapper, Start menu shortcut, or application-controlled webview. The developer starts a local application service on the developer machine and opens its loopback address in Chrome or Edge. The browser is only the unprivileged interface; the local service owns filesystem access, scan-browser automation, the local model-runtime adapter, and the Groq adapter.

For retrieval in either generation mode, the developer manually installs Ollama and runs `ollama pull embeddinggemma` through Ollama's own tooling outside A11y Evidence Lab. Local generation additionally requires `ollama pull qwen3.5:4b`; Groq generation instead requires a Groq credential in the local service. The application does not install or update Ollama, pull or remove models, track acquisition progress, expose a model manager, or provide a separate provider-probe interface. It checks `embeddinggemma` and builds the in-memory vectors only when retrieval is first requested; it checks `qwen3.5:4b` only when an explicit eligible Local generation attempt begins. The actual work and response validation determine success or visible failure. Packaging and installer work are deferred until a demonstrated distribution need justifies them. [ADR-0020](architecture/decisions/ADR-0020-manual-developer-managed-local-model-setup.md) records the developer-managed setup boundary, [ADR-0022](architecture/decisions/ADR-0022-closed-versioned-guidance-corpus.md) records the closed corpus, and [ADR-0023](architecture/decisions/ADR-0023-local-mode-data-boundary.md) records the Local-mode data boundary.

The canonical local artifact for a page analysis is one versioned `data/runs/<run-id>/run.json` aggregate containing the scan and the current nested per-finding workflow data. The MVP generates no Markdown report and adds no database or independently versioned child-record lifecycle. [ADR-0019](architecture/decisions/ADR-0019-in-process-exact-vector-search.md), [ADR-0021](architecture/decisions/ADR-0021-single-file-run-aggregate.md), and [OD-022](requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-022--portfolio-mvp-yagni-simplification) record these portfolio-first YAGNI decisions.


## Development toolchain

Use exactly [Node.js 24.20.0 with its bundled npm 11.19.0](https://nodejs.org/en/download/archive/v24.20.0). Provision these developer prerequisites yourself; the project has no runtime installer. RD-002 used a temporary official Windows x64 distribution for verification and removed it and its task-specific cache after review; the machine's global runtime was not changed. The exact package pins live in [package.json](../package.json), and [package-lock.json](../package-lock.json) is the only authoritative dependency lock.


### Development command preparation

Use PowerShell 7 (`pwsh`; verified here with 7.6.5). The preparation uses `[IO.Path]::GetRelativePath`, which is unavailable in Windows PowerShell 5.1. First run `Set-Location -LiteralPath 'C:/Users/mmjos/Desktop/workbeanch/a11y-evidence-lab'`.

The definitions below are maintained for this verified Windows checkout. Run them from the repository root in each new PowerShell command session. When loading the block from a script, dot-source it so its functions remain available in the calling session. They read the location and environment and define values/functions; they do not install, launch, create, or remove anything. The pinned paths are checkout-specific, not a portable installer. Their existing `M105` names preserve compatibility with the commands below.

This is the current preparation source. Its required definitions are extracted unchanged from the historical [M105-CMD-PREP](plans/completed/m1-05-walking-skeleton-integration.md#m105-cmd-prep--exact-shell-literals-and-environment-restoration); task-specific path contracts, hashes, lease state, and cleanup procedures stay in that archive. Do not replay those historical task procedures for current development.

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

The retained browser is full Playwright-managed Chromium revision 1234 / version 151.0.7922.34 under `m104-browser-runtime/browsers`. It remains a developer prerequisite, not a general support claim. If absent, use the reviewed [RD-003 acquisition procedure](plans/completed/rd-003-scan-evaluation-boundary.md#current-reproduction--rd003-procedure-003) and reconcile the resulting browser path before running anything; the application never downloads a browser. The seven frozen evaluation artifacts retain their LF policy and original native outcomes.

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

Run the complete fifty-four-file suite sequentially, with no running application service or concurrent browser test. Production-entry, review and rescan integration tests also require the built client. Scanner, walking-skeleton and rescan integration suites use scanner scratch; the nine UI/checkpoint suites use separate UI scratch:

```powershell
if ($null -ne [Environment]::GetEnvironmentVariable('A11Y_M305_CAPTURE_PROOF','Process') -or
    $null -ne [Environment]::GetEnvironmentVariable('A11Y_M402_CAPTURE_PROOF','Process') -or
    $null -ne [Environment]::GetEnvironmentVariable('A11Y_M501_CAPTURE_PROOF','Process') -or
    $null -ne [Environment]::GetEnvironmentVariable('A11Y_M503_CAPTURE_PROOF','Process') -or
    $null -ne [Environment]::GetEnvironmentVariable('A11Y_M504_CAPTURE_PROOF','Process') -or
    $null -ne [Environment]::GetEnvironmentVariable('A11Y_M603_CAPTURE_PROOF','Process') -or
    $null -ne [Environment]::GetEnvironmentVariable('A11Y_M601_FROZEN_NO_CALL','Process')) {
  throw 'Ordinary regression requires capture and frozen-case flags absent.'
}
foreach ($m105Test in @('tests/run-contract.test.ts','tests/run-repository.test.ts','tests/local-service.test.ts','tests/scan-normalization.test.ts','tests/retrieval-contract.test.ts','tests/embedding-retrieval.test.ts','tests/retrieval-service.test.ts','tests/finding-sufficiency.test.ts','tests/finding-guidance-api.test.ts','tests/generation-contract.test.ts','tests/generation-stage.test.ts','tests/generation-service.test.ts','tests/ollama-generation-contract.test.ts','tests/ollama-generation.test.ts','tests/ollama-generation-service.test.ts','tests/groq-generation-contract.test.ts','tests/groq-generation.test.ts','tests/groq-generation-service.test.ts','tests/finding-generation-admission.test.ts','tests/review-contract.test.ts','tests/review-repository.test.ts','tests/review-service.test.ts','tests/rescan-service.test.ts','tests/comparison-pair.test.ts','tests/m602-generation.test.ts','tests/m602-followup.test.ts','tests/m602-successor.test.ts','tests/m602-case-schema.test.ts','tests/m602-reasoning.test.ts','tests/m602-native-schema.test.ts')) {
  Invoke-M105Command {
    & $m105Node --test --test-timeout=120000 $m105Test
    if ($LASTEXITCODE -ne 0) { throw 'Browser-free suite failed.' }
  }
}
Invoke-M105Command {
  & $m105Node --experimental-test-module-mocks --test --test-timeout=120000 tests/m602-judgment-profile.test.ts
  if ($LASTEXITCODE -ne 0) { throw 'Profile judgment suite failed.' }
}
Invoke-M105Command {
  & $m105Node --experimental-test-module-mocks --test --test-timeout=120000 tests/finding-generation-api.test.ts
  if ($LASTEXITCODE -ne 0) { throw 'Generation API suite failed.' }
}
foreach ($m105Test in @('tests/finding-review-api.test.ts','tests/finding-review-admission.test.ts','tests/rescan-api.test.ts','tests/rescan-admission.test.ts','tests/comparison-outcome.test.ts','tests/rescan-comparison.test.ts','tests/comparison-persistence.test.ts','tests/comparison-service.test.ts','tests/comparison-admission.test.ts','tests/m504-public-comparison.test.ts')) {
  Invoke-M105Command {
    & $m105Node --experimental-test-module-mocks --test --test-timeout=120000 $m105Test
    if ($LASTEXITCODE -ne 0) { throw 'Review, rescan or comparison suite failed.' }
  }
}
foreach ($m105Test in @('tests/scan-page.test.ts','tests/walking-skeleton.test.ts','tests/rescan-integration.test.ts')) {
  Assert-M105EmptyDirectory $m105ScanTemp
  Assert-M105EmptyDirectory $m105IntegrationTemp
  Invoke-M105Command {
    & $m105Node --test --test-timeout=120000 $m105Test
    if ($LASTEXITCODE -ne 0) { throw 'Scanner or integration suite failed.' }
  } $m105ScanTemp
}
foreach ($m105Test in @('tests/target-results-ui.test.ts','tests/finding-guidance-ui.test.ts','tests/finding-generation-ui.test.ts','tests/finding-review-ui.test.ts','tests/review-checkpoint.test.ts','tests/intentional-rescan-ui.test.ts','tests/comparison-ui.test.ts','tests/m601-frozen-abstention.test.ts','tests/application-accessibility-ui.test.ts')) {
  Assert-M105EmptyDirectory $m105UiTemp
  Invoke-M105Command {
    & $m105Node --test --test-timeout=120000 $m105Test
    if ($LASTEXITCODE -ne 0) { throw 'UI suite failed.' }
  } $m105UiTemp
}
foreach ($m105Scratch in @($m105ScanTemp,$m105UiTemp,$m105IntegrationTemp)) {
  Assert-M105EmptyDirectory $m105Scratch
}
```

For whitespace review, replace `<base>` with the reviewed base commit: `git diff <base> --check` checks the cumulative tracked working-tree changes, while `git diff <base> HEAD --check` checks only committed changes. `git diff --check` alone omits changes already committed. These diff checks exclude untracked files, which need separate inspection before they enter a commit. The [M3-05 EOF correction](plans/completed/m3-05-generation-checkpoint.md#m305-eof-01--post-closure-whitespace-correction) records this distinction.

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
  $m105RestoreRevision = if ($null -eq $m105PriorRevision) { [System.Management.Automation.Language.NullString]::Value } else { $m105PriorRevision }
  $m105RestorePort = if ($null -eq $m105PriorPort) { [System.Management.Automation.Language.NullString]::Value } else { $m105PriorPort }
  [Environment]::SetEnvironmentVariable('A11Y_APPLICATION_REVISION',$m105RestoreRevision,'Process')
  [Environment]::SetEnvironmentVariable('A11Y_PORT',$m105RestorePort,'Process')
  if ([Environment]::GetEnvironmentVariable('A11Y_APPLICATION_REVISION','Process') -cne $m105PriorRevision -or
      [Environment]::GetEnvironmentVariable('A11Y_PORT','Process') -cne $m105PriorPort) { throw 'Service environment restoration failed.' }
}
```

The revision must be exactly 40 lowercase hexadecimal characters. Optional `A11Y_PORT` accepts decimal 0 through 65535 without spaces, signs, or leading zeroes; absent or zero asks Windows for an available port. The entry reads no provider credentials, model settings, or arbitrary data-root setting. No Ollama installation or model is needed for scanning. Run only one service instance against this checkout; separate processes are not coordinated.

A successful start prints one JSON `service-ready` event with the actual `http://127.0.0.1:<port>` URL. Open that exact URL in Chrome or Edge, enter one permitted trusted public HTTPS target, explicitly select Local or Groq, and activate Analyze once. The service owns a separate fresh managed Chromium context; it does not use your UI browser profile. Keep the target and ordinary redirect destination non-sensitive. Local/Groq selection records context only and makes no provider call.

Production health reports `readRuns: true`, `scan: true`, and `guidance: true` when serving the built client. Analyze posts only target and mode to `POST /api/runs`; the service validates, scans, and publishes one minimized `run.json` before returning a completed result. `POST /api/finding-guidance` accepts exactly `{runId, findingId}` and returns the selected durable outcome with its authenticated citation view, or a bounded failure. `POST /api/finding-generation` accepts exactly the same two IDs and continues only their supported live workflow through the fixed run-selected adapter. Its bounded response distinguishes durable results, attempted invocation, unsaved outcomes and uncertainty. The health JSON shape is unchanged. `GET /api/runs/<run-id>` remains a validated internal read, not a UI reopen/history action. API-only programmatic construction without `clientRoot` reports `scan: false` and `guidance: false`, serves no UI, and rejects these POST routes with 405. Neither service exposes configuration, upload, shutdown, or arbitrary-file routes.

Type exactly `stop` and press Enter in the service terminal, then require `service-stopped` and exit 0. EOF, SIGINT, and SIGBREAK also request stop. Forced Windows termination is not proof of clean cleanup. Startup errors emit only `service-startup-failed` with a closed error code and exit 1; failed stop emits `service-stop-failed` and exit 1.

The service refuses overlapping operations without a queue. Cleanup uncertainty closes admission, and a stop deadline permanently forbids late publication. Publication writes the complete validated JSON to an exclusive same-directory staging file, flushes and closes it, then renames it to `run.json`. A failed update preserves prior canonical bytes. This is verified on the local Windows filesystem for the specified single-writer boundary; it is not a universal power-loss, OS-crash, filesystem-filter, malicious-race, or hard OS-call deadline guarantee.


## Retained runs and deletion

Run data stays in the ignored `data/runs/<run-id>/run.json` tree. Reads never repair invalid records, promote staging residue, or automatically resume interrupted work. The parent completed/failed scan state is terminal. Selected-Finding updates retain assessed retrieval outcomes, terminal abstention, and M3-02's running, failed or pending-proposal generation branches inside a completed aggregate. Completed scan evidence and sibling data stay immutable. Historical records remain readable without automatic resumption; a running generation record without invocation has unknown call history. Selected pending proposals can now receive one immutable review decision through the [internal review API](APPLICATION_GUIDE.md#proposal-review-apis); M5-03 adds one append-only comparison while preserving those decisions. No backup, hidden copy, sweep, or synchronization mechanism is added.

For manual deletion, first stop the service and confirm its normal exit. Verify the resolved absolute target is the exact, correctly spelled direct run-directory child of this checkout's `data/runs`, all ancestors and the target are ordinary directories rather than links or junctions, and its inventory contains only the expected ordinary single-link `run.json`. If any check fails, preserve the directory for inspection. Remove only that verified directory using PowerShell's `Remove-Item` with `-LiteralPath` and `-Recurse`; never use a wildcard or target `data/runs`, its parents, another run, or a corpus directory. Local deletion does not remove any provider-side records.

The repeatable synthetic demonstration creates exactly two exclusive `m102-demo-<UUID>` runs, starts and cleanly stops the actual entry twice, reopens a retained run, then deletes one exact run while checking the other run, a test-owned corpus marker, and pre-existing directory names. It removes its second run and temporary marker afterward; an empty `data/runs` may remain:

```powershell
Invoke-M105Command {
  & $m105Npm @toolchainOptions run test:focused -- --test-name-pattern='M102 entry-point reopen and exact deletion' tests/local-service.test.ts
  if ($LASTEXITCODE -ne 0) { throw 'Reopen and exact-deletion demonstration failed.' }
}
```

This filtered demonstration does not replace either the core subset or the complete suite. Tests use only project-owned synthetic records, isolated `temp/m102-*` roots, and bounded owned child processes; they never acquire or delete a real corpus or user run.


Continue with the [application guide](APPLICATION_GUIDE.md) for guidance, generation, review and rescans. See the fixed [Local](APPLICATION_GUIDE.md#fixed-local-qwen-adapter) and [Groq](APPLICATION_GUIDE.md#fixed-groq-adapter) setup details before generation.
