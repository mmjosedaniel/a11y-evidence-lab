# Run the project locally

[Project overview](../README.md) · [Documentation index](README.md)

This guide takes you from a local checkout to the application open in your browser on Windows. **If this checkout is already set up and built, go straight to [Start the application](#start-the-application).**

You run one local server, then open the address it prints in Chrome or Edge. Keep the terminal open while using the application. Scanning works without Ollama or a Groq account; those are needed only for the [optional guidance and generation steps](#enable-guidance-and-generation).

## First-time setup

### 1. Open the project in PowerShell

Use a new **PowerShell 7** terminal tab dedicated to this project. The environment settings below last only in that terminal and its child processes; close the tab after stopping the application.

```powershell
Set-Location -LiteralPath 'C:/Users/mmjos/Desktop/workbeanch/a11y-evidence-lab'
$ErrorActionPreference = 'Stop'
node --version
npm.cmd --version
```

The required versions are **Node.js 24.20.0** and **npm 11.19.0**, as recorded in [package.json](../package.json). If either command is missing or reports another version, install or select the [pinned Node.js distribution](https://nodejs.org/en/download/archive/v24.20.0), then open a new terminal. Git must also be available in that terminal.

The path above is your current checkout. If you move or clone the project elsewhere, change that path; the remaining startup paths are calculated from it.

### 2. Install the project dependencies

Run this once after cloning, and again when the dependency lockfile changes:

```powershell
npm.cmd ci --ignore-scripts --no-audit --no-fund --include=dev --include=optional
if ($LASTEXITCODE -ne 0) { throw 'Dependency installation failed.' }
```

This installs the versions in `package-lock.json`. Keep lifecycle scripts disabled and retain optional dependencies, which include the Windows compiler and build binaries.

### 3. Install the scanner browser

The scanner uses its own Chromium installation, separate from the browser you use to view the app. If `m104-browser-runtime/browsers/chromium-1234/chrome-win64/chrome.exe` already exists in this checkout, skip this download.

```powershell
$env:PLAYWRIGHT_BROWSERS_PATH = Join-Path (Get-Location).Path 'm104-browser-runtime/browsers'
$env:PLAYWRIGHT_SKIP_BROWSER_GC = '1'
$env:PLAYWRIGHT_DOWNLOAD_CONNECTION_TIMEOUT = '120000'
node node_modules/playwright/cli.js install chromium --no-shell
if ($LASTEXITCODE -ne 0) { throw 'Chromium installation failed.' }
```

The installed Playwright package selects Chromium revision 1234. The application itself does not download browsers.

### 4. Build the application

Run this after dependency setup and whenever you change application code. Stop a running application before rebuilding. The build replaces generated files under `dist/client`; saved analysis runs are stored separately.

```powershell
npm.cmd run typecheck
if ($LASTEXITCODE -ne 0) { throw 'TypeScript checking failed.' }
npm.cmd run build -- --configLoader native
if ($LASTEXITCODE -ne 0) { throw 'Client build failed.' }
```

When both commands succeed, continue below. The complete regression suite is documented separately in the [maintainer reference](DEVELOPMENT_REFERENCE.md#build-and-verify-the-walking-skeleton); it is not a daily startup step.

## Start the application

Use a new PowerShell 7 terminal tab, or continue in the one used for setup. Run this entire block from the project checkout. Start only one server for this checkout.

```powershell
Set-Location -LiteralPath 'C:/Users/mmjos/Desktop/workbeanch/a11y-evidence-lab'
$ErrorActionPreference = 'Stop'
$projectRoot = (Get-Location).Path
$scanTemp = Join-Path $projectRoot 'temp/m103-scan'
New-Item -ItemType Directory -Path $scanTemp -Force | Out-Null
if (@(Get-ChildItem -LiteralPath $scanTemp -Force).Count -ne 0) {
  throw 'The scan temporary directory is not empty. See Troubleshooting before starting.'
}
$env:TEMP = $scanTemp
$env:TMP = $scanTemp
$env:NODE_DISABLE_COMPILE_CACHE = '1'
$env:PLAYWRIGHT_BROWSERS_PATH = Join-Path $projectRoot 'm104-browser-runtime/browsers'
$env:PLAYWRIGHT_SKIP_BROWSER_GC = '1'
$env:PLAYWRIGHT_DOWNLOAD_CONNECTION_TIMEOUT = '30000'
$env:A11Y_APPLICATION_REVISION = (git rev-parse HEAD).Trim()
if ($LASTEXITCODE -ne 0) { throw 'Could not read the Git revision.' }
$env:A11Y_PORT = '0'
node src/server/main.ts
if ($LASTEXITCODE -ne 0) { throw 'The local service exited with an error.' }
```

The temporary-directory settings are required by the current scanner. The Git revision identifies the application in saved records. Port `0` asks Windows to choose an available port.

A successful start prints a message like this; your port may differ:

```json
{"event":"service-ready","url":"http://127.0.0.1:54321"}
```

**Open the exact URL printed in your terminal** in Chrome or Edge. The terminal stays busy because it is running the server; that is expected.

Enter one public HTTPS page you are authorized to analyze, choose Local or Groq, and click **Analyze**. Choosing a mode does not call a model. The scanner opens its own browser context and returns the findings to this interface.

## Stop the application

Return to the server terminal, type `stop`, and press Enter. Wait for:

```json
{"event":"service-stopped"}
```

Then close the terminal tab. To use the app again, repeat [Start the application](#start-the-application); reinstalling dependencies and rebuilding are unnecessary unless they changed.

## Enable guidance and generation

These are additional prerequisites for actions you take after a scan:

| Action | What you need |
| --- | --- |
| Scan a page | The setup above; no model or API key |
| Get guidance in either mode | A running local Ollama installation with `embeddinggemma` |
| Generate in Local mode | The admitted Ollama runtime and `qwen3.5:4b` model |
| Generate in Groq mode | Your Groq key in the repository-root `.env`, plus local Ollama/`embeddinggemma` for guidance |

Ollama and its models are installed manually outside the application. Follow the [exact Local prerequisites](APPLICATION_GUIDE.md#fixed-local-qwen-adapter) or [Groq credential setup](APPLICATION_GUIDE.md#fixed-groq-adapter). For the interface steps, continue with [getting guidance](APPLICATION_GUIDE.md#getting-guidance-for-one-finding), [generating a proposal](APPLICATION_GUIDE.md#inspecting-generation-for-one-finding), and [reviewing it](APPLICATION_GUIDE.md#reviewing-one-proposal).

## Troubleshooting

| What you see | What to check |
| --- | --- |
| `node`, `npm.cmd`, or `git` is not recognized | Install/select the prerequisite and open a new PowerShell terminal. |
| `client-unavailable` at startup | Complete the build step and confirm `dist/client/index.html` exists. |
| `invalid-configuration` at startup | Run the whole startup block; `A11Y_APPLICATION_REVISION` must come from this checkout's `git rev-parse HEAD`. |
| A scan fails with a browser error | Check that Chromium is installed and that you used the whole startup block, including `TEMP`, `TMP`, and `PLAYWRIGHT_BROWSERS_PATH`. |
| The scan temporary directory is not empty | Stop any running server. Inspect `temp/m103-scan` for leftovers from an interrupted operation; do not delete unfamiliar files or clear the directory while a process may own it. |
| The page cannot be reached from a restricted execution environment | Run the app from your normal local terminal with access to the authorized target. A failed navigation is not a zero-finding scan. |
| Get guidance or Generate fails | Check the prerequisites for that action above. Successful startup or scanning does not prove model readiness. |

Analysis records are saved under `data/runs/<run-id>/run.json`. Restarting the app does not reopen previous results in the UI. See [retention and deliberate deletion](DEVELOPMENT_REFERENCE.md#retained-runs-and-deletion) when managing saved files.

<details>
<summary>Maintainer references and older section links</summary>

- <a id="planned-mvp-startup-and-generation-setup"></a>[Startup design and model boundary](DEVELOPMENT_REFERENCE.md#planned-mvp-startup-and-generation-setup)
- <a id="development-toolchain"></a>[Recorded toolchain](DEVELOPMENT_REFERENCE.md#development-toolchain)
- <a id="development-command-preparation"></a>[Environment wrappers for verification and evidence callers](DEVELOPMENT_REFERENCE.md#development-command-preparation)
- <a id="build-and-verify-the-walking-skeleton"></a>[Complete regression procedure](DEVELOPMENT_REFERENCE.md#build-and-verify-the-walking-skeleton)
- <a id="run-the-local-service"></a>[Start the application](#start-the-application)
- <a id="retained-runs-and-deletion"></a>[Retained runs and deletion](DEVELOPMENT_REFERENCE.md#retained-runs-and-deletion)

</details>
