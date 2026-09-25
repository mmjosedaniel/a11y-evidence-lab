# Run the project locally

[Project overview](../README.md) · [Documentation index](README.md)

Follow this guide to run the project on Windows. Use a Git clone of the project, including its `.git` folder. A downloaded source-code ZIP is not enough: startup reads the code version from Git.

| What you want to do | Where to start |
| --- | --- |
| Run the project for the first time | Follow [First-time setup](#first-time-setup), then [Start the application](#start-the-application). |
| Open the app again | Go directly to [Start the application](#start-the-application). |
| Use the app after changing its code | Stop the app. Repeat setup step 1 and [Build the application](#4-build-the-application), then start it. |
| Use the app after `package-lock.json` changes | Stop the app. Repeat setup steps 1–4, then start it. |

The app runs on your computer. You start it in PowerShell, then open it in Chrome or Edge. Keep PowerShell open while using it. You can scan a page without setting up AI. [Guidance and AI proposals](#enable-guidance-and-generation) need extra setup.

## First-time setup

Follow steps 1–4 in the **same PowerShell tab**. For each step:

1. Copy all the commands in the box and paste them into PowerShell.
2. Press Enter and wait until you can type again.
3. Check the result before moving on.

Copy only the commands, not the example results. **If you see an error, stop and fix it before continuing.**

Steps 2 and 3 need an internet connection to download files.

### 1. Open the project in PowerShell

Open **PowerShell 7** from the Windows Start menu or Windows Terminal. Use a new tab for this project. Paste these commands there:

```powershell
Set-Location -LiteralPath 'C:/Users/mmjos/Desktop/workbeanch/a11y-evidence-lab'
$ErrorActionPreference = 'Stop'
$PSVersionTable.PSVersion
node --version
npm.cmd --version
git --version
git rev-parse --is-inside-work-tree
if ($LASTEXITCODE -ne 0) { throw 'Open a Git clone of the project before continuing.' }
```

**Check the result:** PowerShell should show version `7.x`, Node `v24.20.0`, npm `11.19.0`, and Git its version number. The last command should print `true`, confirming that you are in a Git repository. The project requires these Node/npm versions, listed in [package.json](../package.json).

`npm.cmd` is the Windows command for npm. It installs the packages the project needs and runs tasks such as building the app.

If PowerShell shows version `5`, open PowerShell 7 instead. If Node/npm is missing or has a different version, install or switch to [Node.js 24.20.0](https://nodejs.org/en/download/archive/v24.20.0). If Git is missing, install Git. After changing any of these tools, open a new PowerShell tab and repeat this step.

The first command opens your project folder. If your folder is somewhere else, change the path in this step and in the startup commands.

### 2. Install the project dependencies

This downloads the packages the project needs. Run it the first time and whenever `package-lock.json` changes:

```powershell
npm.cmd ci --ignore-scripts --no-audit --no-fund --include=dev --include=optional
if ($LASTEXITCODE -ne 0) { throw 'Dependency installation failed.' }
```

**Expected result:** the command finishes without an error, and you can type again. The packages are now in `node_modules`. Keep the command options as written: they include the Windows build tools and prevent packages from running install scripts.

### 3. Install the scanner browser

The app uses a browser called Chromium to scan pages. Check whether it is already installed for this project:

```powershell
Test-Path -LiteralPath 'm104-browser-runtime/browsers/chromium-1234/chrome-win64/chrome.exe'
```

**`True` means it is installed:** go to step 4. **`False` means it is missing:** run these commands:

```powershell
$env:PLAYWRIGHT_BROWSERS_PATH = Join-Path (Get-Location).Path 'm104-browser-runtime/browsers'
$env:PLAYWRIGHT_SKIP_BROWSER_GC = '1'
$env:PLAYWRIGHT_DOWNLOAD_CONNECTION_TIMEOUT = '120000'
node node_modules/playwright/cli.js install chromium --no-shell
if ($LASTEXITCODE -ne 0) { throw 'Chromium installation failed.' }
```

**Expected result:** the download finishes without an error. Repeat the `Test-Path` command; it should now show `True`. The download command selects the Chromium version this project needs. It does not replace your regular Chrome or Edge browser.

### 4. Build the application

Building prepares the files you will see in the browser. Stop the app if it is running, then paste this whole block into the same PowerShell tab. It checks the code and builds the app. Your saved results are kept.

```powershell
npm.cmd run typecheck
if ($LASTEXITCODE -ne 0) { throw 'TypeScript checking failed.' }
npm.cmd run build -- --configLoader native
if ($LASTEXITCODE -ne 0) { throw 'Client build failed.' }
```

What the commands mean:

| Command | Purpose |
| --- | --- |
| `npm.cmd run typecheck` | Check the code for TypeScript errors. No error message means the check passed. |
| Each `if ($LASTEXITCODE -ne 0) { throw ... }` line | Show an error if the command just above it failed. `0` means success; any other exit code means failure. |
| `npm.cmd run build -- --configLoader native` | Create the browser files in `dist/client`. Keep the extra options: they tell the build tool how to read its settings. |

**Expected result:** both commands finish without errors, the build lists the files it created, and you can type again. Check that the main browser file exists:

```powershell
Test-Path -LiteralPath 'dist/client/index.html'
```

It should show `True`. Only continue if the build also finished without errors. **The app is built but is not running yet.** Next, [start the application](#start-the-application).

The [maintainer reference](DEVELOPMENT_REFERENCE.md#build-and-verify-the-walking-skeleton) explains how to run all project tests. You do not need to run them each time you open the app.

## Start the application

### 1. Run the startup block

Use the same PowerShell tab as before, or open a new **PowerShell 7** tab. Paste and run all the commands below. They open the project folder, set up the scanner, and start the app. **Do not start a second copy while this one is running.**

If you have already set up and built the app, and nothing has changed, these are the only commands you need to run.

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

The scanner needs the temporary folder set above. The commands also record the code version and let Windows choose a free port for the app's address. Keep these settings as written.

### 2. Wait for the ready message

When the app is ready, PowerShell shows a message like this. Do not paste this example into PowerShell:

```json
{"event":"service-ready","url":"http://127.0.0.1:54321"}
```

PowerShell stays busy while the app runs. **You do not need to wait until you can type again.** If you see `service-startup-failed`, check [Troubleshooting](#troubleshooting).

### 3. Open the application in your browser

Copy the address after `"url":`, without the quotes, and open it in Chrome or Edge. Use the address shown in your PowerShell tab; its number may differ from the example. Keep that tab open.

**Expected result:** you see the app's Analyze form. The address may change each time you start the app, so always use the new address from PowerShell.

### 4. Run a scan

Enter the address of a public HTTPS page you have permission to scan. Choose Local or Groq, then click **Analyze**. Either choice lets you scan without setting up AI or an API key. Selecting a mode does not contact an AI provider. Results appear in the app. To get guidance or AI proposals, complete the [extra setup below](#enable-guidance-and-generation).

## Stop the application

Go back to the PowerShell tab where the app is running. Type **`stop`** without quotes and press Enter. Wait for this message:

```json
{"event":"service-stopped"}
```

You should now be able to type PowerShell commands again. Close the tab to clear its temporary settings. Next time, follow [Start the application](#start-the-application).

## Enable guidance and generation

Scanning needs no AI setup. These later actions need extra tools:

| Action | What you need |
| --- | --- |
| Scan a page | The setup above; no model or API key |
| Get guidance in either mode | Ollama **0.33.3** running on your computer with the required `embeddinggemma` model |
| Generate in Local mode | The guidance setup above, plus the required `qwen3.5:4b` model described in the Local setup link below |
| Generate in Groq mode | Your Groq API key in `.env` in the project folder, plus Ollama and `embeddinggemma` for guidance |

The app does not install Ollama or its models for you. Use the Ollama version linked in [Local setup](APPLICATION_GUIDE.md#fixed-local-qwen-adapter), even when you plan to generate with Groq. The app expects Ollama at `http://127.0.0.1:11434`. If it is not already running, run `ollama serve` in a separate PowerShell tab and leave that tab open.

In another tab, install the guidance model:

```powershell
ollama pull embeddinggemma
if ($LASTEXITCODE -ne 0) { throw 'Guidance model download failed.' }
```

The app checks the downloaded model against its [fixed embedding model settings](../src/server/retrieval/embedding-profile.ts). A successful download alone does not prove it matches: if a newer download differs, guidance reports a model-identity error. Do not change those settings just to bypass the check.

For Local proposals, also complete [Local model setup](APPLICATION_GUIDE.md#fixed-local-qwen-adapter). For Groq proposals, complete [Groq API key setup](APPLICATION_GUIDE.md#fixed-groq-adapter). Then follow the steps to [get guidance](APPLICATION_GUIDE.md#getting-guidance-for-one-finding), [generate a proposal](APPLICATION_GUIDE.md#inspecting-generation-for-one-finding), and [review it](APPLICATION_GUIDE.md#reviewing-one-proposal).

## Troubleshooting

| What you see | What to check |
| --- | --- |
| `node`, `npm.cmd`, or `git` is not recognized | Install the missing tool, then open a new PowerShell tab. |
| `client-unavailable` at startup | Repeat setup step 4. The build must finish without errors. |
| `invalid-configuration` at startup | Run the complete startup block. It reads the code version from Git and sets the values the app needs. |
| Git reports `not a git repository` | Use a Git clone with its `.git` folder, and open that project folder in PowerShell. |
| A scan fails with a browser error | Check Chromium as shown in setup step 3. Restart using the complete startup block so the scanner has the correct settings. |
| The scan temporary directory is not empty | Stop the app. Check `temp/m103-scan` for files left by an interrupted scan. Do not delete files you do not recognize or files another program may still be using. |
| A restricted environment blocks access to the page | Run the app from PowerShell on your computer, where the page is reachable. A page that failed to load has not been successfully scanned. |
| Get guidance or Generate fails | Check the extra tools listed above. A working scan does not mean the AI tools are ready. |

Results are saved in `data/runs/<run-id>/run.json`. The app cannot reopen previous results on screen after a restart. See [how to keep or delete saved results](DEVELOPMENT_REFERENCE.md#retained-runs-and-deletion) before removing any files.

<details>
<summary>Maintainer references and older section links</summary>

- <a id="planned-mvp-startup-and-generation-setup"></a>[Startup design and model boundary](DEVELOPMENT_REFERENCE.md#planned-mvp-startup-and-generation-setup)
- <a id="development-toolchain"></a>[Recorded toolchain](DEVELOPMENT_REFERENCE.md#development-toolchain)
- <a id="development-command-preparation"></a>[Environment wrappers for verification and evidence callers](DEVELOPMENT_REFERENCE.md#development-command-preparation)
- <a id="build-and-verify-the-walking-skeleton"></a>[Complete regression procedure](DEVELOPMENT_REFERENCE.md#build-and-verify-the-walking-skeleton)
- <a id="run-the-local-service"></a>[Start the application](#start-the-application)
- <a id="retained-runs-and-deletion"></a>[Retained runs and deletion](DEVELOPMENT_REFERENCE.md#retained-runs-and-deletion)

</details>
