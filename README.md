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
- **LangChain** is the initial evaluation baseline for the small retrieve-then-generate integration. For the fixed corpus, it would use in-process `MemoryVectorStore` retrieval with local `embeddinggemma` vectors, exact cosine similarity, and at most three passages selected as the highest-ranked passage for each required guidance role after complete filtered ranking. The [2026-09-12 selection amendment](docs/architecture/decisions/ADR-0019-in-process-exact-vector-search.md#selection-amendment--2026-09-12) preserves earlier global-three results and distinguishes role coverage from measured relevance. Application startup performs no embedding work: the disposable vector collection is built on the first explicit retrieval request and rebuilt only when the process, corpus, or relevant configuration requires it. The MVP has no Chroma or other vector-database service.
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

The [shared generation stage](#shared-generation-apis) validates selected-only input, configuration-bound mode-specific admission, one transport attempt, bounded failures and cited proposals. The current native-schema Local profile checks initial-prompt fit and permits bounded runtime failure of its internal second pass; historical Local profiles retain complete token-fit checking; the accepted Groq branch checks its fixed serialized-body byte policy without claiming hosted token fit. Its internal service continuation durably records generation and preserves completed scan, retrieval and sibling evidence. [M3-02 verification](docs/plans/completed/m3-02-shared-generation-stage.md#m302-regression-01--complete-authoritative-suite) covers controlled adapters and real aggregate persistence. The fixed Local Qwen and [Groq adapters](#fixed-groq-adapter) are implemented with controlled contract and service tests; one real Local run and one real Groq run have each saved a mechanically validated proposal. Those original records remain unchanged in the pending state; the completed review checkpoint below used isolated copies. The [M3-03 capacity observation](docs/plans/completed/m3-03-qwen-adapter-and-capacity-screen.md#m303-c-observation-01--successful-full-local-stack-capacity-screen) passes for the recorded exact local configuration.

M3-05 adds the explicit Generate action, same-origin generation API and original proposal detail. The [review API](#proposal-review-apis) records one final decision through the existing aggregate writer. [M4-02](docs/plans/completed/m4-02-accessible-review-ui.md) is Complete after verified transport/admission, accessible individual review, all 706 tests, independent critical reviews and documentation closure.

[M4-03](docs/plans/completed/m4-03-review-checkpoint.md#m403-final-01--integrated-review-and-task-closure) is Complete: all three human-authorized review outcomes passed actual publication/readback on isolated authentic-source copies, independent critical review and documentation closure. Originals are preserved, disposable copies are removed and evidence is retained. The [completed M3-05 checkpoint](docs/plans/completed/m3-05-generation-checkpoint.md#m305-final-06--integrated-review-and-task-closure) records implementation verification and both successful real-provider observations with their limits.

M2-04 is complete. Its [checkpoint observations](docs/plans/completed/m2-04-retrieval-checkpoint.md#m204-b-accept-01--bounded-checkpoint-observations) exercise all three fixed synthetic Finding profiles through the real local retrieval path: each returns an acceptable gold passage, while missing guidance roles correctly produce no-generation-call abstention. Controlled cases separately demonstrate supported eligibility and adverse outcomes. The [final closure](docs/plans/completed/m2-04-retrieval-checkpoint.md#m204-final-01--integrated-review-and-task-closure) records verification and limitations; these observations are not general retrieval-quality qualification.

The [generation evaluation package](#frozen-generation-evaluation-package) freezes the controlled inputs and shared output contract for later Local and Groq evaluations. This static definition does not implement generation or establish model capacity or provider availability.

See [how to inspect guidance in the UI](#inspecting-m2-02-retrieval-evidence), [how to generate and inspect one proposal](#inspecting-generation-for-one-finding), and [where to find the M2-04 checkpoint evidence](#inspecting-m2-04-checkpoint-evidence).

M5-01 implements [intentional rescans](#intentional-rescans): an explicitly chosen mode starts a distinct linked run while preserving the baseline, with truthful uncertainty handling and one read-only baseline preview. Its [completed plan](docs/plans/completed/m5-01-intentional-rescan.md#m501-final-01--integrated-review-and-task-closure) records verification, independent review and closure.

M5-02 implements conservative comparison at the [internal rescan boundary](#internal-comparison). It uses exact scan-profile compatibility, unique target correlation and sufficient native evidence, with bounded rationale and explicit limitations. M5-03 saves and presents that result, preserves completed scans when comparison fails, and validates immediate-lineage readback. Its native scanner/service/disk/browser proof also preserves saved comparison after exact synthetic baseline deletion. Verification and final critical PASS are recorded in the [completed plan](docs/plans/completed/m5-03-comparison-persistence-and-ui.md).

M5-04 comparison verification exercises controlled native transitions, conservative uncertainty, preserved baseline/downstream state and exact synthetic deletion. Its [actual public observation](docs/plans/completed/m5-04-comparison-checkpoint.md#m504-public-02--actual-selected-finding-comparison-accepted) saved a persistent contrast comparison from a selected W3C demo Finding, with no retrieval or generation request. Its recorded 45-file regression passed 881 tests, followed by final independent critical review and documentation closure. M5-04 is Complete.

[M6-01](docs/plans/completed/m6-01-shared-deterministic-evaluation.md#m601-final-01--integrated-review-and-documentation-closure) is Complete. Its [shared result matrix](docs/plans/completed/m6-01-shared-deterministic-evaluation.md#m601-b-matrix-01--separate-shared-observations) separates controlled native, synthetic, policy-only and historical public evidence. The [three actual retrieval observations](docs/plans/completed/m6-01-shared-deterministic-evaluation.md#m601-b-retrieval-02--three-current-actual-observations) retain G1's unsuitable decorative-image guidance despite complete roles; G2/G3 return their frozen gold passages. [M6-02](docs/plans/completed/m6-02-six-fixed-generation-executions.md#m602-native-final--six-case-verification-and-task-closure) is Complete. Current native-schema capacity and all three affected Local cases pass; the three unchanged Groq results are inherited after exact compatibility verification. All six proposals pass runtime validation, with source-support and contextual wording limitations recorded separately. Earlier failures remain preserved. M6-04 is Complete; its [bounded evidence report](docs/BOUNDED_MVP_EVIDENCE.md) joins the audited observations and limitations after integrated review and documentation closure. Fresh strict TypeScript, 124 pure contract checks and evidence audits pass; build evidence is reused by exact relevant identity. The 1061-test regression remains historical because its full saved byte fingerprint differs. These observations establish neither whole-page accessibility nor release qualification.

[M6-03](docs/plans/completed/m6-03-application-accessibility-verification.md#m603-final-01--independent-review-and-task-closure) is Complete: at its checkpoint, all 1061 tests across 54 files, independent strict TypeScript, the build and the bounded desktop/narrow visual path passed. One new continuous-keyboard characterization reuses the existing App harness; production code is unchanged. Outcomes are controlled, and 200% zoom testing and manual screen-reader speech remain outside this proof. Final independent review and documentation closure pass.

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

For whitespace review, replace `<base>` with the reviewed base commit: `git diff <base> --check` checks the cumulative tracked working-tree changes, while `git diff <base> HEAD --check` checks only committed changes. `git diff --check` alone omits changes already committed. These diff checks exclude untracked files, which need separate inspection before they enter a commit. The [M3-05 EOF correction](docs/plans/completed/m3-05-generation-checkpoint.md#m305-eof-01--post-closure-whitespace-correction) records this distinction.

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

Run data stays in the ignored `data/runs/<run-id>/run.json` tree. Reads never repair invalid records, promote staging residue, or automatically resume interrupted work. The parent completed/failed scan state is terminal. Selected-Finding updates retain assessed retrieval outcomes, terminal abstention, and M3-02's running, failed or pending-proposal generation branches inside a completed aggregate. Completed scan evidence and sibling data stay immutable. Historical records remain readable without automatic resumption; a running generation record without invocation has unknown call history. Selected pending proposals can now receive one immutable review decision through the [internal review API](#proposal-review-apis); M5-03 adds one append-only comparison while preserving those decisions. No backup, hidden copy, sweep, or synchronization mechanism is added.

For manual deletion, first stop the service and confirm its normal exit. Verify the resolved absolute target is the exact, correctly spelled direct run-directory child of this checkout's `data/runs`, all ancestors and the target are ordinary directories rather than links or junctions, and its inventory contains only the expected ordinary single-link `run.json`. If any check fails, preserve the directory for inspection. Remove only that verified directory using PowerShell's `Remove-Item` with `-LiteralPath` and `-Recurse`; never use a wildcard or target `data/runs`, its parents, another run, or a corpus directory. Local deletion does not remove any provider-side records.

The repeatable synthetic demonstration creates exactly two exclusive `m102-demo-<UUID>` runs, starts and cleanly stops the actual entry twice, reopens a retained run, then deletes one exact run while checking the other run, a test-owned corpus marker, and pre-existing directory names. It removes its second run and temporary marker afterward; an empty `data/runs` may remain:

```powershell
Invoke-M105Command {
  & $m105Npm @toolchainOptions run test:focused -- --test-name-pattern='M102 entry-point reopen and exact deletion' tests/local-service.test.ts
  if ($LASTEXITCODE -ne 0) { throw 'Reopen and exact-deletion demonstration failed.' }
}
```

This filtered demonstration does not replace either the core subset or the complete suite. Tests use only project-owned synthetic records, isolated `temp/m102-*` roots, and bounded owned child processes; they never acquire or delete a real corpus or user run.

## Current scope

The [capability summary](#project-status) distinguishes implemented behavior from later work. Source entry points are the [domain contract](src/server/domain/run-contract.ts), [run repository](src/server/persistence/run-repository.ts), [local service](src/server/service.ts), [scanner](src/server/scan/scan-page.ts), and [scan minimization](src/server/scan/normalize-scan.ts). Internal retrieval APIs and their boundaries are described with the [closed corpus](#closed-corpus-snapshot).

### Intentional rescans

For a selected Finding, choose **New scan mode** and use **Start intentional rescan**. Either mode must be chosen explicitly, including when repeating the previous mode. Retrieval, generation and review are not prerequisites; scanner manual-review observations have no rescan action. The service scans the baseline's requested page with all three supported checks and saves a separate run with immutable `baselineRunId`. It preserves the baseline's evidence and human work.

The client-enabled service accepts `POST /api/rescans` with exactly `{runId, baselineRunId, findingId, mode}`, JSON content type, a 4096-byte body limit and a 30000-ms body deadline. The service validates the retained completed baseline and selected Finding under its existing operation reservation. Success returns `{ok:true,run}` after publication; known failures retain truthful later-run, persistence and cleanup information. Malformed or lost replies do not prove that no run was created.

Pending or failed rescans preserve the visible baseline. An unknown outcome blocks further mutations, with no automatic retry or recovery read. Validated success opens the later run and retires prior transient workflow capabilities. **Return to baseline** shows one read-only snapshot; **Return to later results** resumes viewing the same active later workflow. For a saved comparison, initial presentation and explicit return navigation refresh immediate-baseline availability through the read API. The response changes availability metadata only; it cannot replace newer human work or restore earlier workflow capabilities. A new successful rescan replaces that pair, and successful independent Analyze clears it.

#### Internal comparison

The [internal comparison executor](src/server/local-service/rescan-comparison.ts) consumes selected-rule native pass candidates during the rescan operation, then releases them. It delegates calculation to the pure [comparison policy](src/server/comparison/compare-finding.ts) and its [closed input/result contract](src/server/comparison/comparison-contract.ts). It validates both scans, checks exact page/scan-profile compatibility before target correlation, and requires a unique native non-failing observation with sufficient evidence to resolve a baseline Finding. Missing or ambiguous targets remain inconclusive. Comparable binary failures remain persistent; sufficient contrast failures use the retained margin ordering. The executor supplies a bounded result only after successful completed-run publication and its lifetime checks. M5-03 then appends that result through the aggregate writer before announcing durable comparison. Invalid comparison evidence or a comparison exception preserves an independently valid scan result.

The service now appends one optional closed `comparison` to the completed later aggregate and returns the exact durable run. Historical aggregates without comparison remain readable. The append preserves every other field; subsequent selected-Finding updates preserve the comparison. Transient candidate collections remain absent from saved records and responses.

Comparison calculation, lineage, save, abort or shutdown failures after scan completion return the completed run without comparison, with `persisted:true`, `comparisonPersisted:false` and truthful cleanup information. They never convert it to a failed scan. A successful append is authoritative even if stop or abort becomes observable at commit; an unknown transport outcome remains unknown and cannot be retried automatically.

Validated `GET /api/runs/<runId>` adds `comparisonLineage` only for a saved comparison. It reports availability of the immediate baseline's referenced native evidence and context; missing or unreadable lineage leaves the later comparison readable. A comparison-bearing baseline with unavailable immediate lineage cannot start another comparison. Client admission applies only this metadata and cannot overwrite newer human work.

The run-level **Comparison** region presents Before/After evidence, outcome, rationale, limitations and follow-up even when the later scan has zero Findings. Native passes are labeled observations; unavailable after-evidence has an explicit reason. Verified baseline proposal and human work are optional, separately labeled context. Failed availability verification withholds that context and preview, disables another comparison and explains why. Availability changes preserve focus, restoring Results only when the focused content disappears. M5-03's [completed verification and final review](docs/plans/completed/m5-03-comparison-persistence-and-ui.md#m503-final-01--integrated-review-and-task-closure) include native scanner/service/disk/browser persistence and exact synthetic baseline-deletion proof.

[M5-02 final verification](docs/plans/completed/m5-02-conservative-comparison.md#m502-final-01--integrated-review-and-task-closure) records three real controlled pairs over the six frozen states, separate policy-only cases and checkout-byte preservation for the [frozen comparison companion](evaluation/m502-comparison-v1.json). These observations establish neither public-site qualification nor accessibility, conformance or remediation causality. History browsing and reopening retained runs remain Deferred.

### Shared generation APIs

[LocalService.generateFinding](src/server/local-service/contracts.ts) continues only the exact live supported retrieval workflow for one `{runId, findingId}`. It saves generation-running before invoking the [shared stage](src/server/generation/generation-stage.ts), then publishes a validated pending proposal or bounded failure through [RunRepository.updateGeneration](src/server/persistence/run-repository/contracts.ts). Failure results distinguish the last durable run from separately returned, unpersisted invocation provenance. Failed publication retains ownership, uncertain cleanup closes admission, and restart never reconstructs a generation capability.

The [adapter contract](src/server/generation/generation-contract.ts) defines preparation, the bounded transport attempt and invocation provenance; the [proposal validator](src/server/generation/proposal-contract.ts) admits only the shared structured output and authenticated selected citations. The service resolves the fixed Local or Groq adapter from the durable run's immutable provider context only after consuming the supported owner and saving generation-running. An explicitly supplied adapter remains the internal controlled-test seam. The same-origin generation API and Generate action pass only the selected run and Finding IDs; browser input cannot configure a provider.

The [generation contract](tests/generation-contract.test.ts), [shared-stage](tests/generation-stage.test.ts) and [service continuation](tests/generation-service.test.ts) suites are included in the complete verification command above. Service tests use exclusive `temp/m302-generation-*` roots and owned loopback ports. The [M3-02 closure record](docs/plans/completed/m3-02-shared-generation-stage.md#m302-final-01--final-integrated-review-and-documentation-closure) preserves accepted verification and its limits: controlled adapters do not prove actual provider conformance, model capacity or semantic grounding.

### Proposal review APIs

[LocalService.reviewFinding](src/server/local-service/contracts.ts) accepts exactly `{runId, findingId, review}` for one valid pending proposal in a completed run. It reserves the service before inspecting caller input, rejects active or retained workflows, and publishes through [RunRepository.updateReview](src/server/persistence/run-repository/contracts.ts). A clean retained pending proposal can be reviewed through this service method after restart without reconstructing a generation owner. Browser reopening remains Deferred.

The same-origin `POST /api/finding-review` route accepts that exact outer object with `Content-Type: application/json`, no query or fragment, at most 131072 received bytes and a 30000-ms body deadline. It checks declared length, decodes UTF-8 strictly and dispatches once. Known failures retain the service envelope with HTTP 400 for input validation, 404 for absence, 409 for admission/eligibility, 503 for stopping/shutdown and 500 for read/publication failures. Unexpected callback failure or an unusable result returns HTTP 500 with `{ok: false, error: 'review-outcome-unknown'}`, without claiming non-publication. API-only startup without client assets exposes no review route; health capabilities are unchanged. [A acceptance](docs/plans/completed/m4-02-accessible-review-ui.md#m402-a-accept-01--transport-and-admission-accepted) records this boundary; the individual review controls are implemented and verified.

| Review action | Final Finding state | Required action-specific input |
| --- | --- | --- |
| `approve` | `accepted` | `supportConfirmed: true` |
| `edit-and-accept` | `edited-and-accepted` | `supportConfirmed: true` and complete `editedProposal` |
| `reject` | `rejected` | Neither confirmation nor edited content is allowed |

Every review requires `blockingJudgment`. Approval/edit admit `{status: 'supports-proposal'}` or `{status: 'not-applicable', reason}`; rejection also permits `unresolved` and `contradicts-proposal`. N/A requires a nonblank reason of at most 500 raw UTF-16 units. An optional `note` must be nonblank and at most 1000 raw UTF-16 units. Supplied text is preserved exactly. Unknown keys, partial edits, unconfirmed acceptance and action-inapplicable fields fail. Edited content uses the existing complete Proposal validator with the selected Finding and retained guidance; confirmation and judgment concern that resulting proposal. These mechanical gates cannot establish the truth of a person's support assessment.

The service owns canonical `decidedAt`, at least the generation finish time. The one nested `review` stores action, time, judgment, optional note and edited content only for edit; input confirmation is not retained. Original proposal, reminder, invocation, native evidence, retrieval, analysis, siblings and parent remain unchanged. The post-change reminder is neither completed nor an acceptance gate. Format-version-1 historical records remain readable. Final decisions cannot be replaced or repeated.

Success returns `{ok: true, run}` only after publication. Failure returns `{ok: false, error, run, persisted: false, cleanupFailed}`; `run` is the last validated read when available and is null for stale-transition failure. Closed errors distinguish request/body validation, eligibility/admission, stored-read failure, publication failure and shutdown. Precommit failure preserves the last valid file. Cleanup uncertainty closes admission and remains visible to stop; a successful rename retains its existing commit meaning. A lost response does not establish whether publication occurred; never automatically resubmit a final decision.

[Client review admission](src/client/finding-review-admission.ts) requires the returned HTTP status and body to agree and binds success to the captured action, complete edited content, judgment and exact note. Restoring the selected Finding to pending must reproduce the entire captured run, preserving the original proposal, siblings, order, evidence and invocation. Invalid or mismatched responses cannot publish success. [Transport](tests/finding-review-api.test.ts) and [admission](tests/finding-review-admission.test.ts) tests use synthetic inputs.

The [pure review](tests/review-contract.test.ts), [repository](tests/review-repository.test.ts) and [service](tests/review-service.test.ts) suites use synthetic proposals, exclusive `temp/m401-review-repository-*` / `temp/m401-review-service-*` leaves and owned loopback ports. They perform no actual provider or retrieval work and do not review retained owner proposals. The [M4-03 checkpoint](docs/plans/completed/m4-03-review-checkpoint.md#m403-a-accept-01--caller-integrity-accepted) adds a source-bound test-only caller. Its ordinary regression uses synthetic data; actual-case commands are finite, require exact human decisions and must follow that plan. All three human-authorized outcomes are saved on isolated copies of one authentic retained proposal; the originals remain unchanged. Integrated critical review, exact cleanup and documentation closure passed. Actual-case allowances are consumed; they must not be replayed.

### Reviewing one proposal

For a selected valid pending proposal, choose **Approve**, **Edit and accept**, or **Reject**, complete its blocking judgment and optional note, then use **Save decision**. Approval/edit require explicit support confirmation; changing any relevant input clears it. Edit-and-accept exposes a complete plain-field proposal editor with existing validation bounds and recorded evidence/guidance choices. Selecting another item discards unsaved edits. Abstentions, failed generation and scanner manual-review observations have no proposal-review controls.

A saved decision preserves the original AI proposal and provider invocation, displays human action/time/judgment/note, and labels any complete accepted edit as reviewer-authored. Rejection accepts no remediation plan. Post-change reminders remain visible without a completion gate. The shared announcement and native controls support the existing keyboard, focus and semantic contract; [M4-02 verification](docs/plans/completed/m4-02-accessible-review-ui.md#m402-final-01--integrated-review-and-task-closure) passes automated accessibility, keyboard/focus, desktop/narrow visual checks and the complete suite. Native 200% was omitted at owner direction and is not claimed as passed. The subsequent [verification amendment](docs/requirements/quality-security-and-operations/APPLICATION_ACCESSIBILITY.md#200-zoom-verification-deferral--2026-09-15-utc) defers every 200% zoom test until after MVP, including the earlier M2-03 carry to M6-03; accessible behavior requirements remain Accepted.

Review requests have a 30000-ms local deadline. A definite refusal is distinct from **Save outcome unknown**, which means the decision may have been saved. Unknown or retained refusal blocks further mutations, including Analyze, while preserving list and citation inspection. Only a validated release permits explicit correction and submission; there is no automatic retry or recovery read. This does not change the existing generation-unknown path's independent Analyze behavior. Controlled UI tests perform all three final actions and a lost-response case through the real service and disposable disk records; M4-03 records the separate actual-proposal observations and their evidence limits.

### Fixed Local Qwen adapter

The service selects [createNativeSchemaOllamaGenerationAdapter](src/server/generation/ollama-generation.ts) for the current live supported Local retrieval owner. Import, construction, service startup and mode selection perform no generation I/O. Preparation first checks the complete initial messages and schema against the initial-prompt budget, then reads version, model metadata and tags from fixed `127.0.0.1:11434`; dispatch uses one bounded `/api/chat` attempt.

This implementation admits the developer-managed [Ollama v0.33.3 release](https://github.com/ollama/ollama/releases/tag/v0.33.3) and `qwen3.5:4b` Q4_K_M manifest SHA-256 `2a654d98e6fba55d452b7043684e9b57a947e393bbffa62485a7aac05ee4eefd`. Install the retained official runtime outside the repository and acquire the model through Ollama's own `ollama pull qwen3.5:4b` command only after the [local capacity prefilter](docs/LOCAL_MVP_FEASIBILITY.md) passes; the application performs no acquisition. A fresh pull must match the admitted digest and metadata. Missing prerequisites or drift fail before chat. Preserve the runtime/model configuration while an eligible action is in progress; observed metadata does not lock a mutable model tag atomically.

The ordinary Local request enables reasoning and native schema enforcement within an explicit 32768-token context, with temperature 1 and top-p 0.95. One application request can use up to two native completions, each capped at 12288 tokens, for an aggregate ceiling of 24576. The full case schema appears in the measured system message and in native `format`; streaming, input truncation and context shifting are disabled. Initial admission reserves the first completion only; a later internal prompt can fail capacity after invocation. The [native contract](docs/plans/completed/m6-02-six-fixed-generation-executions.md#m602-native-contract--frozen-implementation-semantics-for-review) owns these limits and the fixed neutral post-change reminder. A fixed300000-ms server budget covers admission through generation; the browser has its own300000-ms wait. Groq and the explicit legacy Local factory retain120000ms. Only the final answer is validated and retained; hidden reasoning is discarded.

The preceding single-pass profile passed [corrected integration](docs/plans/completed/m6-02-six-fixed-generation-executions.md#m602-deadline-pass--corrected-integration-and-live-admission) and a [genuine reasoning capacity smoke](docs/plans/completed/m6-02-six-fixed-generation-executions.md#m602-resolve-capacity-pass--genuine-capacity-accepted). The separate [current native-schema capacity screen](docs/plans/completed/m6-02-six-fixed-generation-executions.md#m602-native-capacity--genuine-current-profile-screen-accepted) now passes for the recorded workload, followed by three runtime-valid fixed Local cases. The explicit legacy factory preserves its4096-token, thinking-disabled profile and historical records. The [M3-03 capacity observation](docs/plans/completed/m3-03-qwen-adapter-and-capacity-screen.md#m303-c-observation-01--successful-full-local-stack-capacity-screen) applies to that earlier profile. Neither controlled tests nor a capacity observation establishes semantic quality or broad hardware support.

### Fixed Groq adapter

The service selects [createUncertaintyGroqGenerationAdapter](src/server/generation/groq-generation.ts) for the current live supported Groq retrieval owner. Import, construction, startup and mode selection perform no credential or provider I/O. The adapter uses only the fixed `openai/gpt-oss-20b` model and one HTTPS Chat Completions attempt at `api.groq.com`, with normal certificate and hostname verification.

Create your own API key using the [Groq quickstart](https://console.groq.com/docs/quickstart), then set the single `GROQ_API_KEY=` entry in the existing repository-root `.env`. Confirm that `.env` is Git-ignored and untracked before adding the key. Preserve other local content and never paste the key into chat or tracked files. The service reads only this selected file entry when preparing an eligible Groq request; it does not load credentials from the process environment. Missing or invalid credentials fail before a provider attempt.

Preparation preserves both complete shared messages, the strict `m301_proposal_v1` schema and fixed controls. Its versioned policy admits at most 65536 UTF-8 bytes for the complete serialized request body, then sends that exact body with a 4096-token completion limit. The byte cap is an application policy, not a token estimate or proof of hosted context fit or full input consumption. [The accepted contract](docs/plans/completed/m3-04-groq-adapter.md#m304-g-contract-01--authored-groq-adapter-contract) records the exposed defaults and provider-processing limits.

Groq and the historical Local uncertainty factory use the [uncertainty correction](docs/plans/completed/m6-02-six-fixed-generation-executions.md#m602-uncertainty-01--nonblank-uncertainty-and-content-free-rejection-detail): `m602-uncertainty-instructions-v1` and `m602-uncertainty-schema-v1` retain the exact application-defined pre-acceptance human task and require nonblank uncertainty in the schema. Instructions and the field description request one sentence explaining unresolved image, label or contrast context. Historical profiles, proposal readers and human editing remain available with unchanged semantics. That correction preserves its models, controls and deadlines; hidden reasoning is discarded. The current Local native profile extends those instructions with a fixed reminder under distinct prompt/schema/adapter identities. Offline checks establish request construction and validation, not supported prose or provider success. The [bounded live evaluation](docs/plans/completed/m6-02-six-fixed-generation-executions.md#m602-uncertainty-result--six-observations-with-local-validation-blockers) confirms Groq admission of the exact new schemas for all three requests; it does not establish general schema support or semantic quality.

The adapter rejects credential echoes before publication, bounds response bodies and cleanup, and preserves authentication, quota, rate-limit, network and provider failure provenance without retry or fallback. The three `groq-generation` suites use virtual credentials, injected native transport and actual service/repository fixtures in exclusive `temp/m304-groq-*` roots. These controlled tests establish adapter behavior. The separate [M3-05 integration observation](docs/plans/completed/m3-05-generation-checkpoint.md#m305-f-observation-02--corrected-local-failure-and-groq-proposal) records one successful actual Groq proposal, without establishing continued availability, output quality or the later fixed evaluation results.

Before an authorized evaluation, check the fixed model's current [availability](https://console.groq.com/docs/models), [deprecations](https://console.groq.com/docs/deprecations) and [strict-output support](https://console.groq.com/docs/structured-outputs), and confirm your account's access and limits without sharing its credential. Documentation listings alone do not prove account access.


## Documentation

Start with the [project documentation index](docs/README.md) for the recommended reading order, current concept, context, [project requirements](docs/PROJECT_REQUIREMENTS.md), [development roadmap](docs/DEVELOPMENT_ROADMAP.md), local MVP feasibility assessment, and the derived [documentation-only Gherkin specifications](docs/specs/README.md).

## License

Project-authored code and documentation are licensed under the [MIT License](LICENSE). The W3C text in the closed corpus retains its source-specific terms below.

## Frozen generation evaluation package

The [M3-01 manifest](evaluation/m301-generation-v1.json) defines three shared controlled cases, six fixed Local/Groq bindings, one output/instruction contract, material controls, the rubric and one provider-independent no-call case. The [accepted evaluation-only exception](docs/requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md#controlled-generation-input-exception) permits independently assembled canonical support for those six executions. Actual M2-04 retrieval abstentions, production eligibility and later integration obligations remain unchanged.

In the original development checkout, the nine exact files under `temp/m301-generation-freeze-v1/` contain the inputs, separate provenance, instruction, schema and no-call definition. They are ignored and absent from a fresh checkout; the manifest records their identities without publishing raw prompts or payloads. The [freeze receipt](docs/plans/completed/m3-01-generation-evaluation-package.md#m301-freeze-01--exact-static-package-and-verification) and [final acceptance](docs/plans/completed/m3-01-generation-evaluation-package.md#m301-final-01--final-review-and-documentation-closure) preserve the evidence and its limits.

For read-only verification, load only the [development command definitions](#development-command-preparation), then run the preserved verification block in [M301-COMMAND-02](docs/plans/completed/m3-01-generation-evaluation-package.md#m301-command-02--resolved-preparation-validation-and-closure-callers) from the repository root. It also requires the retained M2-04 run/seed files named there and makes no model request. Historical creation and task-closure instructions are not steps to replay. Missing or mismatched exact files block downstream use until the existing [recovery conditions](docs/plans/completed/m3-01-generation-evaluation-package.md#idempotence-and-recovery) are satisfied; do not regenerate or overwrite the frozen package merely to make a check pass.

M6-01 executed the [exact frozen no-call case](docs/plans/completed/m6-01-shared-deterministic-evaluation.md#m601-b-no-call-01--exact-frozen-abstention-accepted), verifying application-authored abstention, durable aggregate preservation, rendered manual guidance and zero generation effects. That proof uses the frozen controlled retrieval result and does not establish actual embedding behavior; the [actual retrieval observations](docs/plans/completed/m6-01-shared-deterministic-evaluation.md#m601-b-retrieval-02--three-current-actual-observations) are separate. These records identify retained local artifacts for inspection without inference. Their bounded execution allowances are consumed, and archived commands are not replay instructions. The ordinary regression command above requires the frozen-case flag to remain absent. Exactly six Local/Groq generation cases remain assigned to [M6-02](docs/DEVELOPMENT_ROADMAP.md#m6-02--execute-exactly-six-fixed-generation-cases).

### Inspecting M6-02 generation evidence

The [M6-02 closure record](docs/plans/completed/m6-02-six-fixed-generation-executions.md#m602-native-final--six-case-verification-and-task-closure) authenticates three new native-schema Local results and three unchanged inherited Groq results against the [new manifest](evaluation/m602-native-schema-v1.json). All six pass runtime validation; separate semantic limitations remain explicit. Local records and final-readback.json are retained in `temp/m602-test-eba31f85-30de-429b-8cdc-cfa9c6502d7d`; inherited Groq records remain in `temp/m602-test-710e2836-7b2d-4f4f-9dc5-b6c8b293901c`. Current capacity is recorded in `temp/m602-native-capacity-v1`. These ignored local artifacts are absent from a fresh checkout. All execution allowances are consumed; historical inspection commands below do not rerun this campaign or renew a call.

M6-02's original Local image operation failed response validation, and the remaining five cases stopped. After loading the development command definitions above, authenticate the original record without generation:

```powershell
Invoke-M105Command {
  & $m105Node tests/helpers/m602-run-case.ts --inspect-original --case local-image
  if ($LASTEXITCODE -ne 0) { throw 'Original M6-02 evidence inspection failed.' }
}
```

This command requires the exact retained original files and reports `historical-only` with `eligibleForContinuation:false`. Ordinary current-code readback remains strict; the historical reader neither migrates the original records nor admits another execution. The [offline follow-up contract](docs/plans/completed/m6-02-six-fixed-generation-executions.md#m602-fup-contract-01--offline-diagnostics-and-observation-contract) defines separate content-free diagnostic and observation-timing reports. Timing records alone do not establish actual UI responsiveness, resource measurements or semantic quality. Current qualification and remaining gates are recorded in the ExecPlan.

The separate [successor manifest](evaluation/m602-successor-v1.json) binds the unchanged M3-01 inputs to its own entry, observation and stop rules. Its [actual qualification](docs/plans/completed/m6-02-six-fixed-generation-executions.md#m602-suc-qualify-01--actual-observer-qualification-accepted) passed, but [Local image prerequisite admission failed](docs/plans/completed/m6-02-six-fixed-generation-executions.md#m602-suc-exec-01--successor-local-image-prerequisite-failure-and-stop) before generation. The entry is consumed and the other five successor cases are not-run. Complete observer-owned cleanup does not resolve the separate native metadata transport cleanup uncertainty.

In the original development checkout, inspect `temp/m602-successor-v1/qualification.json` and `temp/m602-successor-v1/local-image/{entered,result,observation}.json` in an editor. There is no successor dispatch or assessment record. These ignored files are absent from a fresh checkout; the linked execution record preserves their hashes and limitations. Successor readback requires matching producer, build and application-revision identities; a later checkout is not automatically eligible. The [revision note](docs/plans/completed/m6-02-six-fixed-generation-executions.md#m602-doc-01--documentation-review-and-execution-revision) explains the current mismatch. Do not change retained identities, overwrite qualification or replay execution to make readback pass.


The [completion manifest](evaluation/m602-completion-v1.json) uses the same frozen inputs in a separate `temp/m602-completion-v1` evidence root. Its only new CLI modes are `--qualify-completion-observers`, `--execute-completion --case LABEL` and `--readback-completion --case LABEL`. Actual qualification and each execution are individually gated by the [owning command contract](docs/plans/completed/m6-02-six-fixed-generation-executions.md#verification-commands-and-actual-execution); these mode names are not replay authorization. Readback requires matching current producer, build and application-revision identities and performs no generation. Changed helper bytes also invalidate earlier current-code readback; preserve the historical files and inspect their pinned records without spoofing identities.

The [instrumented manifest](evaluation/m602-instrumented-v1.json) binds the same frozen inputs to `temp/m602-instrumented-v1`. Its CLI modes are `--qualify-instrumented-observers`, `--execute-instrumented --case LABEL` and `--readback-instrumented --case LABEL`; the [owning contract](docs/plans/completed/m6-02-six-fixed-generation-executions.md#m602-inst-01--authorized-instrumented-continuation) controls their use. Qualification and Local image execution are consumed. Readback is read-only, requires matching producer/build/application-revision identities through the maintained revision wrapper, and authenticates evidence without asserting case acceptance. The [actual record](docs/plans/completed/m6-02-six-fixed-generation-executions.md#m602-inst-exec-01--actual-instrumented-failure-and-stop) pins qualification and four Local image files; there is no assessment. These ignored local files are absent from a fresh checkout.

The additional `OutputValidationDetailSink` is opt-in: the new Local factory accepts it as its third argument, `dispatchOllamaGeneration` as its eighth, and `validateProposalCandidate` as its fifth. It distinguishes final-content JSON syntax from non-object output, or identifies the affected field and one fixed lexical rule. Events contain no generated wording or hidden reasoning. Existing callback events, validation decisions and cleanup semantics remain unchanged; historical campaign readers do not capture this new channel.

The optional diagnostic callbacks on `validateProposalCandidate` and `prepareM602SuccessorObservers` provide fixed content-free candidate field/reason or runtime failure categories. The instrumented campaign captures them; earlier campaigns do not, and discarded historical output cannot be recovered. Its failed Local image records `remediation.evidenceReferences/reference-value` and runtime `target-cardinality`; the exact rejected value and model-match count are unknown. Callbacks are trusted application-owned code, not an isolation boundary: return promptly, preserve Promise constructor/species/prototype machinery and globals, and own any detached work. Ordinary callback exceptions and supported promise/thenable failures are contained; corrupted Promise machinery can still leave an unhandled rejection. The [callback contract](docs/plans/completed/m6-02-six-fixed-generation-executions.md#m602-diag2-callback-01--trusted-callback-boundary-and-runtime-review-disposition) records the precise guarantee and evidence. No new generation or qualification is implied.

The [repaired manifest](evaluation/m602-repaired-v1.json) separately binds the unchanged inputs, models, instructions and generation controls to exact case-specific schemas and the loading-observation policy. At that historical checkpoint, ordinary production factories retained their original schema behavior. The new evidence root is `temp/m602-repaired-v1`; its finite CLI modes are `--qualify-repaired-observers`, `--execute-repaired --case LABEL` and `--readback-repaired --case LABEL`. The [repair contract](docs/plans/completed/m6-02-six-fixed-generation-executions.md#m602-repair-g--bounded-repair-decision-contract) owns individual admission, the existing revision/environment wrapper and first-failure stop. Qualification explicitly records runtime sampling as `not-exercised`; it cannot establish actual in-call observation or output quality. Current-code readback requires matching producer, build and revision identities. These mode names do not authorize retries.

The [prompt revision manifest](evaluation/m602-prompt-v1.json) binds the [evaluation-only instructions](evaluation/m602-grounded-instructions-v1.txt), unchanged inputs/schema/controls and new wire identities to `temp/m602-prompt-v1`. Its finite modes are `--qualify-prompt-observers`, `--execute-prompt --case LABEL` and `--readback-prompt --case LABEL`. The [owning contract](docs/plans/completed/m6-02-six-fixed-generation-executions.md#m602-prompt-01--bounded-instruction-revision) controls the same revision/environment wrapper and individual admission. Qualification and Local image entry/dispatch are consumed; the five later cases are stopped. Readback authenticates current producer/build/revision identities and the original rejected assessment without generation. The new evaluation prompt does not replace ordinary production instructions or prove model quality. Earlier current-code readback may reject changed producer/build identities; preserve those historical files without rewriting their pins.

The historical [reasoning manifest](evaluation/m602-reasoning-v1.json) pins the preceding profile and `temp/m602-reasoning-v1` evidence. Qualification and the Local image and label entries are consumed. Use `--readback-reasoning --case local-image` or `--readback-reasoning --case local-label` through the unchanged development preparation and revision/environment wrapper in the [owning caller](docs/plans/completed/m6-02-six-fixed-generation-executions.md#m602-resolve-exec-01--frozen-six-case-caller-and-accounting) for read-only authentication. Image readback returns accepted=false with continuation eligibility; label returns accepted=false and no continuation eligibility, stopping the sequence. No readback creates a model call. Current producer/build/revision identities must match; preserve historical pins on mismatch. The separate capacity evidence is in `temp/m602-reasoning-capacity-v1`. The later continuation uses `temp/m602-test-87df0508-29ae-4b18-a49b-8455633ccfc2`, with provenance and final authenticated readback in `temp/m602-reasoning-continuation-v1`. Its image and qualification are inherited exact bytes, not new observations. Use the existing callable with the native dependencies and pinned root described in [M602-REMAIN-01](docs/plans/completed/m6-02-six-fixed-generation-executions.md#m602-remain-01--five-case-continuation-with-inherited-evidence); the default CLI still reads the original stopped root. All five new allowances are consumed. These ignored records are absent from a fresh checkout.

The historical [profile judgment manifest](evaluation/m602-judgment-v1.json) binds its evaluated prompt/schema, unchanged reasoning controls and six request identities. Its stopped evidence is in `temp/m602-test-c2bfd09b-b671-4a27-99f7-1ca21a350c88`; `temp/m602-judgment-v2/final-readback.json` binds the recorded results and assessments. The [result record](docs/plans/completed/m6-02-six-fixed-generation-executions.md#m602-judgment-result-01--profile-judgment-evaluation-and-remaining-failures) provides hashes and limits. The later approved three-request Groq continuation is recorded in `temp/m602-test-6cf53412-654b-489e-9782-936480fd01e4`, whose `final-readback.json` binds three inherited Local results and three new Groq results. The [continuation result](docs/plans/completed/m6-02-six-fixed-generation-executions.md#m602-judgment-cont-result--completed-observations-with-remaining-validation-failures) owns those outcomes. These ignored artifacts are unavailable in a fresh checkout, and inspection grants no retry.

The current [uncertainty manifest](evaluation/m602-uncertainty-v1.json) binds the reviewed caller, current producer/build and six exact request bodies. Its retained evidence is under temp/m602-test-710e2836-7b2d-4f4f-9dc5-b6c8b293901c, with entered.json, dispatch.json, result.json, observation.json and assessment.json per case. The root final-readback.json authenticates all six outcomes and preservation. These ignored files are local inspection artifacts; reading them requires no generation and grants no retry.

## Closed corpus snapshot

The accepted M2-01 snapshot consists of the [source manifest](corpus/wcag22-mvp-v1/manifest.json), [canonical passages](corpus/wcag22-mvp-v1/passages.json), and [three-profile gold mappings](evaluation/m201-corpus-v1.json). It contains 16 manually selected, complete paragraph/list units from exactly eight W3C artifacts for `image-alt` / 1.1.1, `label` / 4.1.2, and `color-contrast` / 1.4.3. The dated 12 December 2024 Recommendation is normative; Understanding and Techniques are informative. Techniques are examples, not mandatory methods. No unresolved material conflict remains in the selected units after curator review with normative precedence.

Read the manifest, catalog, gold mappings and these notices together. Paragraph/list line breaks represent HTML layout; entities are decoded and wording is preserved. Definition terms retain their exact glossary locator. Source references inside quoted units do not expand the closed source pack or its supported profile tags. Stable passage IDs are manual labels, not ranks. Required roles and conflict declarations are inputs for deterministic support evaluation; gold IDs are acceptable direct-support targets for the fixed cases, not a required ordering or instruction to return all targets.

The catalog is the sole canonical selected-text snapshot. Reconstruct it from its existing JSON without refetching sources or changing IDs, headings, boundaries, text, roles or mappings. A source or passage change needs a new corpus version and affected gold/evaluation evidence. The [M2-01 plan](docs/plans/completed/m2-01-closed-corpus-snapshot.md#m201-cmd-validate--future-static-candidate-read-only) records the read-only structural, reconstruction, negative and semantic checks. The internal retrieval APIs below consume this frozen snapshot. See the [retrieval evidence guide](#inspecting-m2-02-retrieval-evidence) for the accepted observation and current UI boundary. Gold evidence is an expected subset grounded in frozen RD-003 fixtures and historical observations, not a newly scanned Finding or a model result.

To repeat the static checks in the documented development environment, run the plan's read-only PREP block and then VALIDATE in the same PowerShell session from the repository root. PREP initializes the fixed source table and scan manifest used by VALIDATE. Do not run ACQUIRE or CLEANUP: the eight temporary full-page captures were verified and removed at closure. Source-semantic review is preserved in the [curation record](docs/plans/completed/m2-01-closed-corpus-snapshot.md#m201-corpus-candidate-01--primary-curation-and-verification), and accepted artifact identities and final status are in the [freeze record](docs/plans/completed/m2-01-closed-corpus-snapshot.md#m201-closure-01--final-freeze-and-documentation-impact).

M2-02's slice-A APIs are [loadCorpusCatalog/createCorpusDocuments](src/server/retrieval/corpus-catalog.ts), [createFindingQuery](src/server/retrieval/finding-query.ts), and [validateRetrievalResult](src/server/retrieval/retrieval-contract.ts). The loader accepts only the fixed normalized corpus identities and preserves the manifest notices; query/result validation is pure and imports no corpus I/O or model runtime. M2-02 wired these APIs into the internal service; M2-03 adds the guidance HTTP boundary and its selected-Finding UI. The browser-free retrieval-contract test above covers them without Ollama, model files or a tokenizer installation.

M2-02's slice-B APIs are [createExactRetrieval](src/server/retrieval/exact-retrieval.ts) and its [bounded Ollama session](src/server/retrieval/ollama-embedding.ts), [input-fit guard](src/server/retrieval/embedding-input-fit.ts), and [exact ranking](src/server/retrieval/retrieval-ranking.ts). Imports and factory construction perform no model or corpus I/O; only an explicit retrieval call uses the fixed local Ollama boundary. The engine builds all 16 document vectors lazily, reuses only a compatible verified collection, and returns at most three canonical passages. Deterministic embedding-retrieval tests use fake transport and supplied vectors, with the actual in-memory search library; they do not establish real model compatibility or capacity. M2-02's slice C integrated the engine into the internal service. The separate [real retrieval-capacity observation](docs/LOCAL_MVP_FEASIBILITY.md#m2-02-retrieval-only-observation--2026-09-08) passed for the recorded model/runtime configuration; M2-03 provides the selected-Finding UI; its evidence does not extend that capacity observation.

[LocalService.retrieveFinding](src/server/local-service/contracts.ts) and [RunRepository.updateRetrieval](src/server/persistence/run-repository/contracts.ts) now implement M2-03's evidence-first extension of M2-02's selected-Finding service. Guidance accepts exactly one `{runId, findingId}`, reserves the shared operation, and durably activates only that Finding. Incomplete required evidence produces an application-authored abstention without retrieval; complete evidence uses the lazy default engine, authenticates exact citations, and evaluates support before publication. Insufficient completed guidance produces terminal abstention; supported guidance remains active and retains its service owner for a later workflow stage. Execution or integrity failure has no support state. Return values identify the actual durable aggregate and preserve native evidence and siblings; a failed write keeps the last valid aggregate. Startup, scans and reads do not start model work.

### Inspecting M2-02 retrieval evidence

Follow [Run the local service](#run-the-local-service) to open the Analyze/Results UI. Select a Finding to inspect its native evidence, then activate **Get guidance** once. The application first checks captured evidence; complete evidence uses the developer-managed local embedding runtime. The detail shows complete cited passages and source notices, evidence sufficiency, and supported eligibility, a no-generation-call abstention, or a distinct retrieval failure. Citation links open in a separate tab to preserve the current results session. The exact corpus version remains visible even when retrieval returns no passages. Similarity describes ranking, not support or confidence. Opening the UI and selecting an item do not start model work. Scanner review observations remain evidence-only; no saved-run reopen/import, retry or review control is provided. Supported live eligibility enables the separate [explicit generation action](#inspecting-generation-for-one-finding). A supported unfinished workflow retains ownership and prevents another guidance operation. The [M2-03 closure record](docs/plans/completed/m2-03-sufficiency-abstention-and-detail-ui.md#m203-c-post01-closure--renewed-task-closure) records completed verification and its limits; the [M2-04 observations](docs/plans/completed/m2-04-retrieval-checkpoint.md#m204-b-accept-01--bounded-checkpoint-observations) record the fixed three-profile integration evaluation separately from general retrieval quality.

M2-02's actual retrieval evidence is a saved JSON result, not a new retrieval screen. In the original development checkout, inspect these retained, ignored files in an editor without rerunning inference:

- `temp/m202-capacity-01/capacity-evidence.json`: three ranked canonical references and scores, the 3846.0786-ms duration, and durable-readback/preservation checks.
- `temp/m202-capacity-01/runs/m202-capacity-01/run.json`: the full synthetic run with the completed selected-Finding retrieval result and preserved scan/sibling evidence.

These local files are not included in a fresh checkout. The tracked [capacity evidence record](docs/plans/completed/m2-02-embedding-retrieval-capacity-gate.md#capacity-screen-and-integration-closure) preserves their identities and the bounded observation; the [closure record](docs/plans/completed/m2-02-embedding-retrieval-capacity-gate.md#m202-closure-01--final-integrated-verification-and-documentation-impact) records accepted verification and review. This was one retrieval-capacity observation, not retrieval-quality qualification. Browser interaction timing was not instrumented, and the driver exited 1 during post-success shutdown control; neither limitation invalidated the accepted durable result, but neither is an exit-zero or UI-latency claim.

### Inspecting generation for one Finding

In a new analysis, select a Finding and activate **Get guidance**. Complete captured evidence and supported guidance from the current service session enable **Generate** for that Finding. Read the fixed provider/model and data-flow disclosure, then activate Generate once. Local uses the approved Ollama loopback boundary; Groq sends the permitted minimized selected facts and guidance to its fixed external endpoint. Mode selection and scanning make no generation request.

The pending state keeps selection available. The result distinguishes a confirmed pre-call failure, an attempted call, durable publication, an unsaved attempt and an unknown outcome. A browser timeout or lost response does not prove that service/provider work stopped. The consumed action cannot be retried; ordinary Analyze can start an independent run when the service accepts it. Restart does not recover a supported workflow capability.

A validated proposal keeps its original cited summary, user impact and remediation separate from scanner evidence and curated guidance. Evidence sufficiency, model confidence, uncertainty, assumptions, blocking human judgment and the post-change verification reminder remain visible. The [individual review controls](#reviewing-one-proposal) now support approve, edit-and-accept and reject. Use [intentional rescans and saved comparison](#intentional-rescans) to inspect later scanner evidence separately from proposal review.

The [M3-05 plan](docs/plans/completed/m3-05-generation-checkpoint.md) records implementation verification and bounded actual-provider checks. The clarified runtime prompt preserves historical invocation identities. One Local and one Groq run saved and displayed original proposals that pass mechanical validation under the same runtime version. Both remain pending human review, including their judgment and remediation limitations. The successful Local diagnostic did not reproduce the earlier rejection; its exact cause remains unknown. The selection amendment also retains an informative-image relevance failure despite complete guidance-role coverage. These observations do not establish model capacity, semantic quality or release readiness.

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
