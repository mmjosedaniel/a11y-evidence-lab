# M2-01 — Closed corpus snapshot

This ExecPlan is a living document. Maintain `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` as work proceeds. This document must be maintained in accordance with `PLANS.md`.

This living ExecPlan follows [PLANS.md](../../PLANS.md) and owns only [M2-01](../DEVELOPMENT_ROADMAP.md#m2-01--prepare-the-authorized-closed-corpus-snapshot). The roadmap owns status; requirements and Accepted ADRs control scope. Read the [authority map](../README.md), [agent workflow](../../.codex/README.md), [worker-first workflow](../../.codex/execplan-implementation-workflow.md), and [write-lease guard](../../.codex/write-lease-guard.md) before execution.

**Current boundary:** In progress for planning only. The owner's request selects M2-01 and authorizes this plan and its status/navigation updates, not source acquisition or execution. Obtain explicit M2-01 execution **and eight-source acquisition** authorization before making local W3C copies. A ready plan is not a validated corpus or permission to start M2-02.

## Purpose / Big Picture

Prepare the small, inspectable knowledge snapshot that later retrieval can cite: exactly eight accepted W3C artifacts, manually selected passages, and gold mappings for the existing image, label, and contrast profiles. Success is a reviewed static corpus with resolvable provenance and stable passage identities, not a running retrieval system. This task adds no visible application behavior.

## Progress

- [x] 2026-09-03: Reviewed the clean repository, roadmap, M1 closure evidence, applicable corpus/evaluation authorities, source-use guidance, and current Finding contract.
- [x] 2026-09-03: Fresh strict TypeScript and 78 pure contract/normalization tests passed; no source, dependency, fixture, or runtime artifact changed.
- [x] 2026-09-03: Created this task-scoped plan and activated planning only.
- [x] 2026-09-03: Independent readiness review accepted with no Blocker/Major; primary resolved its sole Minor by restoring the required living-document statement. Planning documentation and in-memory command-recipe checks passed.
- [ ] Owner authorizes execution and acquisition; primary accepts per-artifact use review and freezes the acquisition packet.
- [ ] One guarded non-TDD acquisition setup, compliant closure, primary inspection, and proportional setup review accepted.
- [ ] Primary manually curates the manifest, passages, conflict declarations, and three gold mappings; structural, semantic, rebuild, and negative checks pass.
- [ ] Fresh final independent review, exact staging cleanup, documentation closure, roadmap completion, and plan archival accepted.

## Surprises & Discoveries

- M1-05 is Complete again after two post-closure corrections. Its 335-test result and public smoke are historical evidence, not newly executed observations in this planning task.
- The sole commit after the M1 integration merge changes only `AGENTS.md` and `.codex/execplan-implementation-workflow.md`; application source, tests, dependencies, and frozen scan inputs are unchanged.
- The lease guard rejects an explicitly ignored allowed path. Acquisition therefore uses eight exact **unignored, temporary** files under `corpus/m201-source-staging/`, not `temp/`. These are review inputs, never the canonical corpus, and must be removed before closure or any later publication.
- W3C public availability does not alone establish permission for every intended representation. Actual page notices and the intended exact-excerpt use still need execution-stage review.

## Decision Log

- 2026-09-03: Preserve ADR-0022's existing decision; do not compare source packs, select a new architecture, or create a Decision Review Contract without a consequential decision trigger. File names, ordinary JSON fields, and manually assigned passage labels below are task-local literals, not a new identity or serialization protocol.
- 2026-09-03: Use the non-TDD route for source capture and static curation. `TDD: Not applicable` — this task has no new executable product behavior. Structural, source-semantic, provenance, rebuild, and negative evidence replace a fabricated Red. Any proposed application loader/validator moves back to its owning M2-02 task; it is not smuggled into setup.
- 2026-09-03: Keep all research-derived manifest, passage, gold, use-review, and developer-documentation writes with the primary. A `code_worker` may capture only the eight approved source responses under a setup lease; it cannot choose passages or edit evidence documents.
- 2026-09-03: Record the planning commit as history, then capture the actual intentional execution baseline at entry. Do not require the plan itself to stay uncommitted or compare future leases against the commit preceding this plan.

## Outcomes & Retrospective

The planning deliverable is complete after independent readiness review and resolution of one editorial convention follow-up. The nine-path documentation-only change preserves the Accepted pack, non-TDD setup, sole-writer curation, and later-task boundaries. No source snapshot, canonical passage, gold mapping, embedding, retrieval result, or new application behavior exists from M2-01 yet. The roadmap task remains In progress; its next boundary is explicit execution/source-acquisition authorization and per-artifact use review.

## Context and Orientation

Planning began at clean `da146553d373196f39140abb67b5fd6c703f0976` on `codex/m2-01-closed-corpus-snapshot`. RD-001 through RD-003 and M1-01 through M1-05 are Complete; M2-01's sole implementation dependency, M1-05, passes. After this planning activation the task totals are eight Complete, one In progress, and nineteen Not started.

The implemented path is same-origin target entry, provider-independent three-rule scanning, minimized Finding evidence, durable `run.json` publication, and Results presentation. [M1-05 replacement verification](completed/m1-05-walking-skeleton-integration.md#m105-pc08-accepted-verification--replacement-evidence) records 335 tests, strict TypeScript, fresh reviews, and cleanup. No retrieval/provider call exists. `dist/client` was cleaned at closure and is deliberately not rebuilt for this static task. Node 24.20.0, TypeScript 7.0.2, PowerShell 7.6.4, and Windows curl 8.21.0 were observed during planning; no new dependency is needed.

The [RD-003 manifest](../../evaluation/rd003-scan-v1.json) owns six exact fixture states and `rd003-scan-v1`. [Finding and rule-evidence types](../../src/server/domain/run-contract/run-types.ts) own the current application shape and `m1-public-v1` evidence policy. RD-003's evaluation target keys are not runtime Finding UUIDs; its earlier evaluation field names are not a replacement for the implemented M1 contract. Gold mappings must preserve that distinction.

### Controlling authorities and readiness

| Authority | M2-01 obligation and boundary |
| --- | --- |
| [REQ-CORP-001, 003–007](../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#corpus-and-retrieval), all Accepted | Closed eight sources; manual complete paragraph/list units; exact headings/URLs; one immutable version; stable passages; required roles and reviewed conflicts; use conditions; no usable claim after failed validation. Runtime retrieval/support behavior remains later work. |
| [ADR-0022](../architecture/decisions/ADR-0022-closed-versioned-guidance-corpus.md), Accepted | Exact pack, normative/informative separation, no crawler/splitter/refresh, authorization and use-review gate, unchanged rebuilds, new version on source/heading/segmentation/text change. |
| [REQ-EVAL-003–005 and freeze boundary](../requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md), Accepted | Three directly supporting gold mappings with exact fixture/scan/corpus provenance; freeze before model output; preserve earlier evidence and rerun affected cases after material change. Full generation packages remain M3-01. |
| [OD-004, OD-016, OD-022, OD-025](../requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md#resolved-decisions-for-the-first-portfolio-slice) | Accepted source pack/manual segmentation/YAGNI/task authorization. No open significant decision blocks planning; execution and acquisition remain separately ungranted. |
| [ADR-0024](../architecture/decisions/ADR-0024-milestone-slice-tdd-with-independent-ownership.md) | Non-TDD static corpus preparation, separate worker setup, primary evidence ownership, bounded review/correction and closure. |
| [Curated corpus assessment](../architecture/candidates/guidance-retrieval/CURATED_GUIDANCE_CORPUS_ASSESSMENT.md) | Supporting Proposed detail for source-use review, selected sections, roles, errata, and provenance. It cannot expand or override the Accepted pack. |

M2-01 has no separately assigned SPEC/HS runtime scenario. Its gold data enables the later SPEC-002 retrieval check; it does not claim to execute that behavior. The already frozen scan inputs satisfy entry conditions. Exact passages and gold references are this task's output, not a reason to fabricate them before authorized acquisition.

## Scope and Non-Goals

In scope: read current source-use conditions; capture the eight direct sources once after authorization; select only the needed sections; author one small versioned manifest and passage catalog; record normative precedence and any remaining material conflict; freeze one gold case per existing profile; verify and document the static snapshot.

Out of scope: application source/tests, package or lockfile changes, corpus loader, schema framework, ingestion service, crawler, automatic extraction/segmentation/refresh, arbitrary uploads, broader WCAG coverage, target-page/scanner-help/ACT material in the corpus, embeddings, Ollama acquisition, LangChain, vector storage, ranking, context/token tuning, support-state execution, UI, providers, generation, comparison, public distribution, legal conclusions, and M2-02 activation. Do not create a permanent acquisition/validation tool, per-passage license copies, checksums as product fields, modification ledger, source-version graph, or workflow telemetry.

## Plan of Work

### 1. Authorization, source-use review, and execution packet

The primary confirms the exact user authorization and current readiness, runs `M201-CMD-PREP`, and records its output in Artifacts and Notes. Reconcile every pre-existing dirty path; never discard unrelated changes. Check that no lease or other writer is active. Record current HEAD, branch, index state, protected-input identity, runtime, and intended dirty paths. An intentional plan-only commit is not a failure: inspect it, refresh the entry record, and retain old evidence as history. Unexplained source/test/dependency/fixture drift stops execution until reconciled.

Before local copying, inspect each of the eight official pages and its actual license/footer using read-only browsing. Record source title/type, URL, publisher, status/version, access date, headings to inspect, copyright, attribution, applicable terms, and the intended local exact-excerpt representation. For the dated Recommendation, record the current errata-review disposition without silently substituting latest WCAG text. The [WAI use guidance](https://www.w3.org/WAI/about/using-wai-material/) requires source attribution and generally unmodified content; the [2023 W3C Document License](https://www.w3.org/copyright/document-license-2023/) specifies original URL, copyright, and status on copies/portions. Reviewed 2026-09-03 for planning; recheck actual artifact conditions at execution. This is a source-condition review, not a legal opinion or distribution clearance.

Keep excerpt wording intact and metadata separate. Review how mandatory notices accompany the combined catalog/manifest and any future displayed portion; do not assume the project's MIT license covers W3C text. Stop for owner direction if an artifact's terms conflict with the planned representation or need unresolved permission. Do not contact W3C, translate/adapt wording, claim endorsement, publish, or rely silently on a derivative-use exception. Later UI/package/public distribution must check its own presentation of notices; M2-01 does not authorize it.

Primary freezes this review and the complete setup packet before the lease. The URL/path table and acquisition command below are binding. Exact source metadata, selected headings/paragraph boundaries, passage labels/text, and gold references are deliberately unresolved until permitted source inspection; the primary resolves them, never the acquisition worker. No downstream artifact may be called frozen while any of these values remains unresolved.

### 2. M201-SOURCE-SETUP — bounded acquisition

Use one `code_worker`, phase `setup`, under Milestone Assignment Packet v2 and a fresh primary-opened lease. This is the only implementation-worker write slice planned.

| Packet field | Binding content |
| --- | --- |
| Identity | Workflow `M2-01`; slice `M201-SOURCE-SETUP`; unique assignment/lease IDs; phase `setup`; attempt 1; correction parent None; actual worker identity and guard digest supplied by primary. |
| Acceptance and authorities | Exactly the eight approved HTTP-200 source captures, ordinary nonempty files, unchanged URLs/no recursive requests, no canonical/evidence edits; REQ-CORP-006, ADR-0022 closed boundary, and accepted per-artifact use review above. |
| Readiness and test boundary | Owner execution/acquisition grant and primary use-review record; fresh entry evidence. TDD Not applicable. Accepted test boundary None; existing tests are protected, not a Red. |
| Responsibilities and dependencies | None — no application-source responsibility changes. Source responses are temporary review inputs; canonical data is primary-owned. No runtime dependency or import is added; no structural refactor permitted. Cohesion disposition None. |
| Allowed files | Only the eight exact `corpus/m201-source-staging/<name>.html` paths in `M201-CMD-PREP`; allowed directory roots empty. |
| Forbidden scope | `src/`, `tests/`, `fixtures/`, `evaluation/`, `docs/`, `.agents/`, `.codex/`, `corpus/wcag22-mvp-v1/`; root manifests, configuration, instructions, licenses and all other repository paths. Workers never mutate Git. Guard-control paths are primary-only. |
| Commands/effects | Only the read-only PREP definitions/inspection and `M201-CMD-ACQUIRE`; finite direct HTTPS to eight W3C URLs; creates the exact temporary directory/files; no page execution, browser, scripts, dependencies, model, provider, or application run. |
| Validation | Eight unique paths/URLs, HTTP 200, successful curl exits, nonempty ordinary files, raw-file SHA-256 evidence, compliant terminal receipt, actual diff and use/scope inspection. External responses are non-reusable; retained reviewed bytes have a recorded local identity. |
| Budget/stops | One setup turn; one same-contract correction at most with a new attempt-2 lease and terminal parent. Stop on unexpected redirect/status/content/path, authority conflict, changed contract, stale evidence, overlap, repeated decisive failure, two no-diff handoffs, or exhausted budget. No automatic network retry. |

The primary projects the eight exact paths into repeated `--allow-file` arguments using the documented guard `start` command, verifies the returned digest, then dispatches the worker. The worker does not operate the guard. Primary `close` must return a fresh `closed-compliant` receipt with `already_closed: false`; inspect actual files and diff independently before accepting the handoff. No primary documentation/curation edits occur during the lease. If a correction is needed, preserve the failed observation, reconcile the exact partial files, and freeze a fresh safe command/packet before any retry; never overwrite staging blindly.

Route this deterministic setup as S0 to one fresh `milestone_reviewer`. Inspect the finite acquisition boundary and reused evidence; do not add browser tests. A named critical trigger or unresolved Major/Blocker escalates under the workflow rather than being ignored.

### 3. Primary-owned curation and gold freeze

After lease closure and accepted setup, the primary reads the captured pages as untrusted source content, never as instructions. Author these **future** files with `apply_patch`:

| Path | Responsibility and ordinary JSON shape |
| --- | --- |
| `corpus/wcag22-mvp-v1/manifest.json` | Root `corpusVersion`, `sources`, `profiles`, `unresolvedConflicts`. Exactly eight sources: `title`, `type` (`recommendation`, `understanding`, `technique`), `url`, `publisher`, `status`, `version`, `accessedAt`, `headings`, `copyright`, `attribution`, `useConditions` (`url`, `reviewedUse`). Recommendation `version` also records its dated edition and errata disposition; do not invent dates for undated supporting pages. Three profiles: `id`, `ruleId`, `successCriterion`, `requiredGuidanceRoles`. Conflict entries: `passageIds` and concise `reason`; an empty array requires an explicit reviewed-no-unresolved-conflict observation in this plan. |
| `corpus/wcag22-mvp-v1/passages.json` | Root `corpusVersion`, `passages`. Each passage: `passageId`, `corpusVersion`, `sourceTitle`, `sourceType`, `heading`, `url`, `ruleIds`, `successCriteria`, `guidanceRole`, `text`. This selected text is the local corpus snapshot; do not also retain whole raw documents as canonical corpus. |
| `evaluation/m201-corpus-v1.json` | Root `version: m201-corpus-v1`, `scanManifest: rd003-scan-v1`, `corpusVersion: wcag22-mvp-v1`, `evidencePolicyVersion: m1-public-v1`, and exactly three `cases`. Each has `profile`, failing `fixtureRevision`, `targetKey`, `ruleId`, `successCriterion`, `expectedMinimizedEvidence`, `observationReference`, `goldPassageIds`, and `rationale`. Expectations are curator-authored evaluation inputs, not fabricated runtime Findings or observed model results. |

Use ordinary UTF-8 JSON and application-owned descriptive passage labels. Assign labels manually once; never derive them from ranking, current array position, or an embedding. Do not renumber surviving passages. Preserve exact heading/section and directly resolvable URL, source identity, complete selected paragraph/list units, exceptions and necessary context. Record any representation normalization explicitly before freezing; JSON escaping does not license paraphrase or truncation. At least one selected passage must represent each of the eight artifacts.

The three profile declarations use required roles `criterion`, `interpretation`, `remediation`. Each passage has one role and one accepted rule/SC pair in its tag arrays for this first snapshot. A role describes retrieval function, not legal/normative authority. A profile must have applicable catalog material for all three roles, allowing later top-three coverage without forcing ranking. Do not set an arbitrary passage count, trim to a model budget, or require all alternative techniques to appear together in three results.

| Profile / rule / SC | Selected-content boundary and gold intent |
| --- | --- |
| `informative-image-alt` / `image-alt` / `1.1.1` | Criterion and needed definitions; Understanding purpose/context/exceptions; H37 and H67 complete relevant units. The controlled informative-image gold must not treat a decorative-image exception as its unconditional remedy. Image purpose and wording remain human judgments. |
| `form-input-label` / `label` / `4.1.2` | Criterion; Understanding programmatic name context; H44 applicability and label association. Do not add SC 1.3.1/3.3.2 coverage or claim that an association proves useful wording. |
| `text-contrast` / `color-contrast` / `1.4.3` | Criterion thresholds/exceptions and needed definitions; Understanding context; G18 applicable measurement/remediation guidance. Keep native measurements separate from guidance and human classification/exception judgments. |

For each gold case, use the RD-003 failing revision/target key and its frozen outcome together with the verified M1 rule-specific evidence contract. Record the exact supporting observation/test reference and only the needed minimized evidence expectations using current M1 names. Resolve any field/value discrepancy before freeze; do not invent a Finding UUID, borrow a public smoke, change fixtures, or confuse native scanner evidence with curator interpretation. Freeze at least one directly supporting acceptable gold passage per profile with a short explanation. `goldPassageIds` names acceptable direct-support targets, not a forced ranking or a requirement to return every ID. M2-04 will test retrieval; M3-01 will freeze complete generation inputs. No embedding/model output is inspected here.

Apply normative precedence while curating. Keep ordinary differences in applicability or informative alternatives distinct from actual contradictions. Declare only genuine unresolved material conflicts with resolvable passage references and reasons. Do not manufacture a W3C contradiction to create a negative test; later policy tests may use explicitly synthetic test-only conflict declarations outside the canonical corpus.

Research routing: local baseline checks are R0; the planning source-use question was R1 with one `technology_researcher` and primary synthesis. Execution curation spans provenance and semantic/gold fit, so use the R2 route with primary synthesis and at most two read-only researchers **only for named unresolved evidence dimensions**, each with Research Assignment Capsule v1 and at most one targeted follow-up. No analyst/drafter is needed by default, no alternative pack is compared, and untriggered `DRAFT READY` is the checkpoint. A newly proposed critical mechanism, conflicting source condition, owner choice, or consequential comparison stops this route for the workflow's required reconciliation/DRC/escalation. All artifact writes remain primary-owned; research roles never receive a write lease.

### 4. Validation, independent review, and closure

Run `M201-CMD-VALIDATE` and the manual checks below. Record exact file hashes, current tree/environment identity, outcomes, and limitations in this plan. Failed checks leave the candidate unusable and M2-01 In progress. This is ordinary S2-equivalent provenance/gold review, not custom serialization or security qualification. Use one fresh `independent_reviewer` for the complete static corpus and integrated documentation candidate, different from the setup reviewer and this plan's readiness reviewer. Supply the full research capsule, controlling rows, exact candidate paths/diff, source capture identities, source-use record, gold rationale, and check results. This final artifact review also examines integration/closure; do not add a duplicate curation review merely because data lives in two directories.

Permit one bounded supported correction and proportional fresh re-review. Stop on a changed contract, the same decisive gap twice, exhausted budget, or an unresolved Major/Blocker; use the workflow escalation rather than cycling. A reviewer verdict cannot accept use permission, change an authority, or complete the roadmap task.

After accepted review, primary removes only the eight verified temporary captures and their now-empty staging directory using `M201-CMD-CLEANUP`. Keep canonical data. Complete the documentation gate: update the roadmap, README's corpus/license/developer guidance, authority-map navigation, evaluation freeze note, directly affected status owners, plan index, and progress record. Add no ADR or requirement change unless new accepted semantics actually require one. Validate the candidate closure, then reconcile M2-01 Complete and archive this same plan with repaired links. M2-02 remains Not started until separately selected.

## Concrete Steps

All commands run in PowerShell from `C:/Users/mmjos/Desktop/workbeanch/a11y-evidence-lab`. Command blocks below are planned execution recipes; only the planning checks recorded in Artifacts and Notes have run. They require the authorization and review gates above. Use no bare npm, package installation, build, application service, or browser launch.

### M201-CMD-PREP — read-only baseline and fixed acquisition table

```powershell
$ErrorActionPreference = 'Stop'
$m201Root = (Get-Location).Path
if ($m201Root -ne 'C:\Users\mmjos\Desktop\workbeanch\a11y-evidence-lab') { throw 'Wrong checkout.' }
$m201Node = 'C:/nvm4w/nodejs/node.exe'
$m201Curl = 'C:/Windows/System32/curl.exe'
$m201ExecutionHead = (git rev-parse HEAD).Trim()
if ($LASTEXITCODE -ne 0) { throw 'Cannot read HEAD.' }
git branch --show-current
git status --short
git diff --cached --name-only
git diff --check
if ($LASTEXITCODE -ne 0) { throw 'Diff formatting failed.' }
if ((& $m201Node --version) -ne 'v24.20.0') { throw 'Pinned Node required.' }
& $m201Curl --version
if ($LASTEXITCODE -ne 0) { throw 'Windows curl unavailable.' }
$m201Sources = [ordered]@{
  'wcag22.html' = 'https://www.w3.org/TR/2024/REC-WCAG22-20241212/'
  'understanding-111.html' = 'https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html'
  'h37.html' = 'https://www.w3.org/WAI/WCAG22/Techniques/html/H37'
  'h67.html' = 'https://www.w3.org/WAI/WCAG22/Techniques/html/H67'
  'understanding-412.html' = 'https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html'
  'h44.html' = 'https://www.w3.org/WAI/WCAG22/Techniques/html/H44'
  'understanding-143.html' = 'https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html'
  'g18.html' = 'https://www.w3.org/WAI/WCAG22/Techniques/general/G18'
}
$m201Stage = Join-Path $m201Root 'corpus/m201-source-staging'
$m201AcquisitionPaths = @($m201Sources.Keys | ForEach-Object { 'corpus/m201-source-staging/' + $_ })
$m201Protected = @(git ls-files -- src tests fixtures evaluation package.json package-lock.json tsconfig.json vite.config.ts .gitattributes .gitignore AGENTS.md PLANS.md .codex .agents)
if ($LASTEXITCODE -ne 0) { throw 'Cannot enumerate protected inputs.' }
$m201ProtectedHashes = @($m201Protected | ForEach-Object { Get-FileHash -LiteralPath $_ -Algorithm SHA256 })
$m201Scan = Get-Content -LiteralPath 'evaluation/rd003-scan-v1.json' -Raw | ConvertFrom-Json
if ($m201Scan.version -cne 'rd003-scan-v1' -or $m201Scan.cases.Count -ne 6) { throw 'Scan baseline mismatch.' }
foreach ($m201Case in $m201Scan.cases) {
  if ([IO.File]::ReadAllText((Join-Path $m201Root $m201Case.path)) -cne $m201Case.content) { throw 'Frozen fixture drift.' }
}
$m201ExecutionHead
```

Before leasing, primary verifies each acquisition path is unignored/untracked and absent (`git check-ignore --no-index -- <path>` must exit 1; `git ls-files -- <path>` must be empty), the staging directory is absent, and the workspace/corpus ancestors are ordinary directories, not junctions or links. Preserve and inspect any existing state; do not delete it as preflight. Freeze actual HEAD/index/dirty paths and the protected hashes in the evidence record. Do not rerun PREP midway to reset a failed baseline comparison.

### M201-CMD-ACQUIRE — worker only, after use review and lease start

```powershell
if (Test-Path -LiteralPath $m201Stage) { throw 'Staging already exists; reconcile before acquisition.' }
New-Item -ItemType Directory -Path $m201Stage -ErrorAction Stop | Out-Null
foreach ($m201Source in $m201Sources.GetEnumerator()) {
  $m201Output = Join-Path $m201Stage $m201Source.Key
  if (Test-Path -LiteralPath $m201Output) { throw 'Never overwrite a capture.' }
  $m201Http = & $m201Curl --disable --fail --silent --show-error --proto '=https' --connect-timeout 10 --max-time 45 --output $m201Output --write-out '%{http_code}' $m201Source.Value
  if ($LASTEXITCODE -ne 0 -or $m201Http -cne '200') { throw 'Source acquisition failed; stop without retry.' }
  if ((Get-Item -LiteralPath $m201Output).Length -eq 0) { throw 'Empty capture.' }
  Get-FileHash -LiteralPath $m201Output -Algorithm SHA256
}
```

`--disable` is curl's first option to exclude personal curl configuration. No `--location`, recursive request, asset fetch, script execution, or retry is permitted. A redirect or non-source response is not an accepted artifact even if it creates a file. Primary checks the exact eight-file inventory, ordinary topology, intended source title/status/notices, and final hashes after terminal lease closure; save those hashes as `$m201CaptureHashes` for cleanup. HTTPS/network unavailability is a blocker, not permission to change URLs or disable TLS.

### M201-CMD-VALIDATE — future static candidate, read-only

Use PREP's frozen table and scan object. All three files must exist before this block; it creates no corpus or validation program. These mechanical checks complement, not replace, complete manual source and gold review.

```powershell
$m201ManifestPath = 'corpus/wcag22-mvp-v1/manifest.json'
$m201PassagesPath = 'corpus/wcag22-mvp-v1/passages.json'
$m201GoldPath = 'evaluation/m201-corpus-v1.json'
$m201Manifest = Get-Content -LiteralPath $m201ManifestPath -Raw | ConvertFrom-Json
$m201Catalog = Get-Content -LiteralPath $m201PassagesPath -Raw | ConvertFrom-Json
$m201Gold = Get-Content -LiteralPath $m201GoldPath -Raw | ConvertFrom-Json
function Assert-M201Candidate($manifest, $catalog, $gold) {
  foreach ($item in @($manifest,$catalog,$gold)) {
    if ($item.corpusVersion -cne 'wcag22-mvp-v1') { throw 'Wrong corpus version.' }
  }
  $urls = @($manifest.sources.url)
  if ($urls.Count -ne 8 -or @($urls | Select-Object -Unique).Count -ne 8 -or @(Compare-Object $urls @($m201Sources.Values) -CaseSensitive).Count) { throw 'Source set mismatch.' }
  $ids = @($catalog.passages.passageId)
  if ($ids.Count -lt 8 -or @($ids | Select-Object -Unique).Count -ne $ids.Count) { throw 'Passage identity mismatch.' }
  $roles = @('criterion','interpretation','remediation')
  foreach ($passage in $catalog.passages) {
    $source = @($manifest.sources | Where-Object { $_.url -ceq ($passage.url -split '#',2)[0] })
    if ($source.Count -ne 1 -or $passage.corpusVersion -cne 'wcag22-mvp-v1' -or [string]::IsNullOrWhiteSpace($passage.passageId) -or [string]::IsNullOrWhiteSpace($passage.text)) { throw 'Unresolved passage.' }
    if ($source[0].title -cne $passage.sourceTitle -or $source[0].type -cne $passage.sourceType -or $source[0].headings -cnotcontains $passage.heading -or $roles -cnotcontains $passage.guidanceRole) { throw 'Passage provenance mismatch.' }
    $profile = @($m201Scan.profiles | Where-Object { @($passage.ruleIds).Count -eq 1 -and @($passage.successCriteria).Count -eq 1 -and $_.rule -ceq $passage.ruleIds[0] -and $_.successCriterion -ceq $passage.successCriteria[0] })
    if ($profile.Count -ne 1) { throw 'Passage mapping mismatch.' }
  }
  foreach ($source in $manifest.sources) {
    if (-not @($catalog.passages | Where-Object { ($_.url -split '#',2)[0] -ceq $source.url }).Count) { throw 'Unrepresented source.' }
  }
  if (@($manifest.profiles).Count -ne 3 -or @($gold.cases).Count -ne 3 -or $gold.version -cne 'm201-corpus-v1' -or $gold.scanManifest -cne 'rd003-scan-v1' -or $gold.evidencePolicyVersion -cne 'm1-public-v1') { throw 'Evaluation identity mismatch.' }
  foreach ($profile in $m201Scan.profiles) {
    $declared = @($manifest.profiles | Where-Object { $_.id -ceq $profile.id -and $_.ruleId -ceq $profile.rule -and $_.successCriterion -ceq $profile.successCriterion })
    if ($declared.Count -ne 1 -or @($declared[0].requiredGuidanceRoles).Count -ne 3 -or @(Compare-Object @($declared[0].requiredGuidanceRoles) $roles -CaseSensitive).Count) { throw 'Required-role mismatch.' }
    $eligible = @($catalog.passages | Where-Object { $_.ruleIds -ccontains $profile.rule -and $_.successCriteria -ccontains $profile.successCriterion })
    foreach ($role in $roles) { if ($eligible.guidanceRole -cnotcontains $role) { throw 'Missing catalog role.' } }
    $case = @($gold.cases | Where-Object { $_.profile -ceq $profile.id })
    $fixture = @($m201Scan.cases | Where-Object { $_.profile -ceq $profile.id -and $_.stateRole -ceq 'failing' })[0]
    if ($case.Count -ne 1 -or $case[0].fixtureRevision -cne $fixture.revision -or $case[0].targetKey -cne $fixture.targetKey -or $case[0].ruleId -cne $profile.rule -or $case[0].successCriterion -cne $profile.successCriterion -or @($case[0].goldPassageIds).Count -eq 0) { throw 'Gold mapping mismatch.' }
    foreach ($id in $case[0].goldPassageIds) { if ($eligible.passageId -cnotcontains $id) { throw 'Unresolved gold passage.' } }
  }
  foreach ($conflict in $manifest.unresolvedConflicts) {
    if (@($conflict.passageIds).Count -lt 2 -or [string]::IsNullOrWhiteSpace($conflict.reason)) { throw 'Invalid conflict declaration.' }
    foreach ($id in $conflict.passageIds) { if ($ids -cnotcontains $id) { throw 'Unresolved conflict passage.' } }
  }
}
Assert-M201Candidate $m201Manifest $m201Catalog $m201Gold
$m201RoundTrip = $m201Catalog | ConvertTo-Json -Depth 100 | ConvertFrom-Json
Assert-M201Candidate $m201Manifest $m201RoundTrip $m201Gold
if (($m201RoundTrip | ConvertTo-Json -Depth 100 -Compress) -cne ($m201Catalog | ConvertTo-Json -Depth 100 -Compress)) { throw 'Round-trip changed canonical data.' }
Get-FileHash -LiteralPath $m201ManifestPath,$m201PassagesPath,$m201GoldPath -Algorithm SHA256
git diff --check
if ($LASTEXITCODE -ne 0) { throw 'Diff formatting failed.' }
```

Negative checks use fresh **in-memory** JSON-round-trip clones only: duplicate a passage ID; remove one source; replace a gold ID with an unknown ID; remove all `remediation` passages for one profile; change a catalog's corpus version. Each must make `Assert-M201Candidate` throw. Never write these corruptions to canonical files. Separately compare all accepted file hashes before/after rebuild and review; a same-version changed text/heading/role/mapping is a rejected candidate, never an automatic repair. This checks the static artifact and preservation rule, not a future runtime integrity implementation.

### M201-CMD-CLEANUP — primary only, after accepted review

Primary first rechecks that the staging directory is the exact resolved `corpus/m201-source-staging` child, all ancestors and files are ordinary/no reparse points, and inventory is exactly the eight saved paths with no extra children. Capture hashes must still equal the post-lease accepted `$m201CaptureHashes`; otherwise stop. Then:

```powershell
foreach ($m201Capture in $m201CaptureHashes) {
  if ((Get-FileHash -LiteralPath $m201Capture.Path -Algorithm SHA256).Hash -cne $m201Capture.Hash) { throw 'Capture changed; preserve it.' }
}
foreach ($m201Capture in $m201CaptureHashes) { Remove-Item -LiteralPath $m201Capture.Path -ErrorAction Stop }
if (@(Get-ChildItem -LiteralPath $m201Stage -Force).Count -ne 0) { throw 'Unexpected staging residue.' }
Remove-Item -LiteralPath $m201Stage -ErrorAction Stop
```

No recursive deletion, broad root deletion, glob deletion, canonical-corpus cleanup, user-run cleanup, dependency cleanup, or Git mutation is permitted. If interrupted, inspect the exact remaining inventory and hashes before completing removal; do not redownload or manufacture missing evidence. Report that only temporary W3C captures were removed and that the reviewed canonical excerpts remain.

## Validation and Acceptance

M2-01 completes only when all of these pass:

1. Authorization and artifact-specific use review are recorded; exactly eight accepted sources are represented, with actual publisher/status/version/heading/attribution/copyright/use information. Review unresolved fields and extra fields manually against the small shapes above; placeholder or unsupported metadata fails.
2. Every passage resolves to its reviewed captured source and exact heading/locator, contains an intact selected unit with necessary context, retains the accepted scope and source authority, and has a unique stable label. Manually inspect **every** selected passage; a JSON pass is not semantic evidence. The catalog is the sole selected-text snapshot; no raw staging documents remain at closure.
3. Exactly the three accepted mappings and required roles are declared. Gold evidence names/values and fixture references match their actual authorities; every gold ID directly supports its specific controlled case. Conflict declarations reflect manual normative-precedence review, not a fabricated test condition or absence assumed from parsing.
4. Static validation, unchanged in-memory reconstruction, five rejected negative candidates, before/after accepted-file identities, and preserved protected inputs pass. No need for a custom checksum/version graph or re-fetch on rebuild.
5. Setup receipt and actual capture inspection, proportional setup review, fresh final semantic/integrated review, exact cleanup, links/fragments, UTF-8/final newline/trailing whitespace, and `git diff --check` pass. No worker report or receipt is self-validating proof.
6. Reconcile every affected current-status/navigation/developer/evaluation statement; preserve historical evidence and source-specific license boundaries. Only then mark M2-01 Complete and archive the plan. A plan review or a successful download alone satisfies none of the corpus/gold acceptance claims.

The relevant complete task suite is the static corpus/provenance/gold/rebuild/negative package above. Existing application tests, helpers, fixtures, skip/focus markers, and imports remain unchanged; inspect that at closure. Reuse the unchanged M1 regression evidence rather than rebuilding browsers/UI for data that has no runtime consumer yet. If executable paths change, stop and replan the selected-task boundary and TDD/review route; do not claim the 335-test suite was rerun.

## Idempotence and Recovery

Read-only checks can repeat against the same recorded identity. Reuse a source capture only after verifying its recorded hash and source-use review; mutable web responses are not reusable evidence. Do not reacquire to make an unchanged rebuild pass. An absent/partial/wrong capture is a failed setup outcome requiring primary reconciliation and the remaining correction budget, not fallback or a blanket retry.

The `wcag22-mvp-v1` directory is a candidate until its checks and review pass. Once frozen, changed source/text/heading/segmentation or material role/mapping changes require a new corpus version and affected gold/evaluation evidence; never silently edit a validated snapshot under the same version. This is manual versioning, not an update manager. A need for new-version implementation outside the accepted task packet stops for explicit reconciliation.

No existing user data is removed. Preserve unexpected overlapping changes and ask for direction when ownership is unclear. Lease errors stop writes; never delete guard state or reuse a terminal lease. Plan/status/review notes can evolve between leases without changing the accepted source bytes; refresh evidence affected by each revision rather than resetting a baseline to hide drift.

## Artifacts and Notes

- `M201-PLAN-BASELINE-01`: clean planning HEAD and branch above. `git diff --name-only 12b05f6 HEAD` listed only `AGENTS.md` and `.codex/execplan-implementation-workflow.md`. Source/tests/dependencies/fixtures/evaluation are unchanged from the M1 merge. This is historical inspection, not an executable HEAD requirement.
- `M201-PLAN-CHECKS-01`: from the repository root, `C:/nvm4w/nodejs/node.exe node_modules/typescript/bin/tsc --project tsconfig.json` exited 0; `C:/nvm4w/nodejs/node.exe --test --test-timeout=120000 tests/run-contract.test.ts tests/scan-normalization.test.ts` exited 0, 78/78, no skipped/todo tests. `NODE_DISABLE_COMPILE_CACHE=1` was applied and the previous process value restored in `finally`; no generated files or browser/service activity. Evidence identity: clean planning HEAD, Node 24.20.0, installed TypeScript 7.0.2, unchanged relevant inputs. No full-suite rerun claimed.
- `M201-PLAN-SOURCE-USE-01`: one read-only R1 `technology_researcher` returned RESEARCH COMPLETE; primary checked the two official source-use pages, incorporated attribution/unmodified-content and per-artifact review gates, and made no legal or distribution conclusion. No W3C source artifact was copied to the workspace.
- `M201-PLAN-REVIEW-01`: fresh `independent_reviewer` returned PASS WITH FOLLOW-UPS, no Blocker or Major, and one Minor for the missing mandatory opening statement. Primary inserted the exact PLANS.md statement and accepted the review after verifying the correction. The reviewer independently checked the nine-path scope, four PowerShell blocks, and positive/five-negative structural recipe using synthetic in-memory inputs; none is corpus acceptance evidence.
- `M201-PLAN-DOCS-01`: nine changed Markdown files passed 557 local links, 120 fragments, fourteen required section checks, UTF-8/final newline/trailing-whitespace checks, and `git diff --check`. Roadmap totals are eight Complete, one In progress, nineteen Not started. All four PowerShell blocks parse. Primary's source-free, file-free recipe probe accepted a synthetic positive and unchanged JSON reconstruction and rejected all five specified mutations. Protected executable inputs remain unchanged; `corpus/` and `dist/client/` are absent.
- Execution records remain pending: owner grant; current baseline/dirty-path reconciliation; artifact use review; setup packet/digest and receipt; eight local capture hashes; selected headings/text/gold rationale; static/negative/manual outcomes; final review; cleanup; closure identities. Keep concise records here, not a new ledger or raw transcript.

## Interfaces and Dependencies

The only new handoff is static data: one manifest, one canonical passage catalog, and one gold mapping file. The manifest owns source notices, required roles and conflicts; passages own canonical selected text; gold owns controlled expectations. Later M2-02 reads them without changing canonical segmentation or inventing a new source pack; its runtime loader, compatibility validation, model configuration, input-fit test and ranking remain unimplemented. M2-03 owns support-policy execution/citation presentation, M2-04 owns real retrieval verification, and M3-01 owns complete generation packages.

Reuse the existing Node/PowerShell/Git toolchain and Windows curl for this finite authorized acquisition. No package, runtime service, source module, public interface, run schema, or rendered UI changes. The frontend-quality overlay is not applicable because no rendered interface changes.

## Revision Note

2026-09-03: Created the M2-01 plan after current-state and authority review. Preserved the exact eight-source boundary, planning-only authorization, source-use gate, primary curation ownership, one guarded acquisition setup, non-TDD proof, future-task exclusions, and execution-time baseline capture. No corpus or application implementation was performed.

2026-09-03: Accepted independent plan-readiness review after restoring the mandatory living-document statement, its sole Minor. Recorded documentation and source-free in-memory recipe evidence; no command, scope, acquisition permission, requirement, or ADR changed. Planning is complete; M2-01 execution remains pending.
