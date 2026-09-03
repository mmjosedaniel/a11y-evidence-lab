# M2-01 — Closed corpus snapshot

This ExecPlan is a living document. Maintain `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` as work proceeds. This document must be maintained in accordance with `PLANS.md`.

This living ExecPlan follows [PLANS.md](../../../PLANS.md) and owns only [M2-01](../../DEVELOPMENT_ROADMAP.md#m2-01--prepare-the-authorized-closed-corpus-snapshot). The roadmap owns status; requirements and Accepted ADRs control scope. Read the [authority map](../../README.md), [agent workflow](../../../.codex/README.md), [worker-first workflow](../../../.codex/execplan-implementation-workflow.md), and [write-lease guard](../../../.codex/write-lease-guard.md) before execution.

**Current boundary:** Complete after accepted verification, reviews, exact cleanup and documentation closure. The snapshot is frozen; M2-02 remains Not started. On 2026-09-03 the owner explicitly authorized M2-01 execution, artifact-specific source-use review, direct HTTPS acquisition/local copies of exactly the eight approved artifacts, canonical corpus/gold artifacts, verification, independent reviews, exact capture cleanup, and documentation closure. This supersedes the planning-only boundary; it does not waive source-use conditions or authorize publication, third-party contact, M2-02, commits, or pushes.

## Purpose / Big Picture

Prepare the small, inspectable knowledge snapshot that later retrieval can cite: exactly eight accepted W3C artifacts, manually selected passages, and gold mappings for the existing image, label, and contrast profiles. Success is a reviewed static corpus with resolvable provenance and stable passage identities, not a running retrieval system. This task adds no visible application behavior.

## Progress

- [x] 2026-09-03: Owner authorized continuation outside the sandbox. Primary rechecked the unchanged HEAD, nine intentional documentation paths, no active lease and empty ordinary staging; the one remaining same-contract setup correction is authorized with network escalation.

- [x] 2026-09-03: Reviewed the clean repository, roadmap, M1 closure evidence, applicable corpus/evaluation authorities, source-use guidance, and current Finding contract.
- [x] 2026-09-03: Fresh strict TypeScript and 78 pure contract/normalization tests passed; no source, dependency, fixture, or runtime artifact changed.
- [x] 2026-09-03: Created this task-scoped plan and activated planning only.
- [x] 2026-09-03: Independent readiness review accepted with no Blocker/Major; primary resolved its sole Minor by restoring the required living-document statement. Planning documentation and in-memory command-recipe checks passed.
- [x] 2026-09-03: Owner authorized execution/acquisition; primary accepted the per-artifact local-use review and froze the acquisition packet in `M201-EXEC-ENTRY-01` and `M201-USE-01` below.
- [x] 2026-09-03: Authorized attempt 2 captured all eight sources; fresh compliant closure, primary inspection and fresh S0 setup review PASS accepted with no findings.
- [x] 2026-09-03: At the attempt-1 checkpoint, acquisition stopped on the first HTTPS connection failure; primary freshly closed its lease compliantly and verified zero captures and unchanged protected inputs. It then awaited owner direction without retry. The subsequent authorized correction is recorded separately.
- [x] 2026-09-03: Primary authored the eight-source manifest, 16 manually selected passages and three gold mappings; structural, semantic, unchanged reconstruction and five-negative checks pass.
- [x] 2026-09-03: Fresh final independent review accepted after its sole documentation Minor was resolved; exact staging cleanup, documentation closure and roadmap completion passed. The plan is archived with repaired links.

## Surprises & Discoveries

- At the first execution checkpoint, acquisition failed before receiving HTTP content: Windows curl exit 7 connecting to `www.w3.org:443`. No file was captured and the other seven were not requested. The empty staging directory was preserved then, and reconciled before the later authorized successful correction.
- The seven current supporting pages link to the W3C Software and Document License, while the dated Recommendation links to the W3C Document License. The local-use review records each actual notice rather than assuming a uniform footer.

- M1-05 is Complete again after two post-closure corrections. Its 335-test result and public smoke are historical evidence, not newly executed observations in this planning task.
- At planning entry, the sole commit after the M1 integration merge changed only `AGENTS.md` and `.codex/execplan-implementation-workflow.md`; application source, tests, dependencies, and frozen scan inputs were unchanged. The later intentional planning commit is separately identified in M201-EXEC-ENTRY-01.
- The lease guard rejects an explicitly ignored allowed path. Acquisition therefore uses eight exact **unignored, temporary** files under `corpus/m201-source-staging/`, not `temp/`. These are review inputs, never the canonical corpus, and must be removed before closure or any later publication.
- Planning established that W3C public availability does not alone establish permission for every intended representation. The subsequently completed execution-stage review records actual page notices and intended exact-excerpt use in M201-USE-01.

## Decision Log

- 2026-09-03: Resume once with network-enabled execution following the owner's explicit continuation. Remove only the verified empty staging directory to restore the unchanged acquisition command's absent-directory precondition, then open attempt 2 with the original terminal parent. Keep the original connection failure and all source/use/path boundaries; stop on another decisive acquisition failure.

- 2026-09-03: The owner's execution/acquisition grant supersedes the planning-only boundary. Preserve the current intentional planning commit as the execution baseline. After curl's first connection failure, stop acquisition without retry or TLS/URL changes; retain the empty staging directory, record the fresh compliant receipt, and request direction for a network-enabled same-contract correction.

- 2026-09-03: Preserve ADR-0022's existing decision; do not compare source packs, select a new architecture, or create a Decision Review Contract without a consequential decision trigger. File names, ordinary JSON fields, and manually assigned passage labels below are task-local literals, not a new identity or serialization protocol.
- 2026-09-03: Use the non-TDD route for source capture and static curation. `TDD: Not applicable` — this task has no new executable product behavior. Structural, source-semantic, provenance, rebuild, and negative evidence replace a fabricated Red. Any proposed application loader/validator moves back to its owning M2-02 task; it is not smuggled into setup.
- 2026-09-03: Keep all research-derived manifest, passage, gold, use-review, and developer-documentation writes with the primary. A `code_worker` may capture only the eight approved source responses under a setup lease; it cannot choose passages or edit evidence documents.
- 2026-09-03: Record the planning commit as history, then capture the actual intentional execution baseline at entry. Do not require the plan itself to stay uncommitted or compare future leases against the commit preceding this plan.

## Outcomes & Retrospective

M2-01 is Complete. The frozen wcag22-mvp-v1 corpus contains eight attributed W3C sources and 16 complete manually selected passages with three gold mappings. Exact structural checks, unchanged reconstruction, five rejected corruptions, complete source/gold inspection, fresh S0 and integrated reviews, verified temporary-source cleanup and documentation closure passed. All 82 protected inputs remain unchanged. The original network failure, authorized correction and one resolved review Minor are preserved. The task delivered the inspectable static handoff it intended; model input fit, runtime retrieval/support, generation and UI consumers remain later selected tasks. M2-02 is Not started. No commit or push occurred.

## Context and Orientation

Planning began at clean `da146553d373196f39140abb67b5fd6c703f0976` on `codex/m2-01-closed-corpus-snapshot`. RD-001 through RD-003 and M1-01 through M1-05 are Complete; M2-01's sole implementation dependency, M1-05, passes. After this planning activation the task totals are eight Complete, one In progress, and nineteen Not started.

The implemented path is same-origin target entry, provider-independent three-rule scanning, minimized Finding evidence, durable `run.json` publication, and Results presentation. [M1-05 replacement verification](m1-05-walking-skeleton-integration.md#m105-pc08-accepted-verification--replacement-evidence) records 335 tests, strict TypeScript, fresh reviews, and cleanup. No retrieval/provider call exists. `dist/client` was cleaned at closure and is deliberately not rebuilt for this static task. Node 24.20.0, TypeScript 7.0.2, PowerShell 7.6.4, and Windows curl 8.21.0 were observed during planning; no new dependency is needed.

The [RD-003 manifest](../../../evaluation/rd003-scan-v1.json) owns six exact fixture states and `rd003-scan-v1`. [Finding and rule-evidence types](../../../src/server/domain/run-contract/run-types.ts) own the current application shape and `m1-public-v1` evidence policy. RD-003's evaluation target keys are not runtime Finding UUIDs; its earlier evaluation field names are not a replacement for the implemented M1 contract. Gold mappings must preserve that distinction.

### Controlling authorities and readiness

| Authority | M2-01 obligation and boundary |
| --- | --- |
| [REQ-CORP-001, 003–007](../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#corpus-and-retrieval), all Accepted | Closed eight sources; manual complete paragraph/list units; exact headings/URLs; one immutable version; stable passages; required roles and reviewed conflicts; use conditions; no usable claim after failed validation. Runtime retrieval/support behavior remains later work. |
| [ADR-0022](../../architecture/decisions/ADR-0022-closed-versioned-guidance-corpus.md), Accepted | Exact pack, normative/informative separation, no crawler/splitter/refresh, authorization and use-review gate, unchanged rebuilds, new version on source/heading/segmentation/text change. |
| [REQ-EVAL-003–005 and freeze boundary](../../requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md), Accepted | Three directly supporting gold mappings with exact fixture/scan/corpus provenance; freeze before model output; preserve earlier evidence and rerun affected cases after material change. Full generation packages remain M3-01. |
| [OD-004, OD-016, OD-022, OD-025](../../requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md#resolved-decisions-for-the-first-portfolio-slice) | Accepted source pack/manual segmentation/YAGNI/task authorization. Execution and exact-eight acquisition are now explicitly granted; the first acquisition failed and automatic retry is prohibited. |
| [ADR-0024](../../architecture/decisions/ADR-0024-milestone-slice-tdd-with-independent-ownership.md) | Non-TDD static corpus preparation, separate worker setup, primary evidence ownership, bounded review/correction and closure. |
| [Curated corpus assessment](../../architecture/candidates/guidance-retrieval/CURATED_GUIDANCE_CORPUS_ASSESSMENT.md) | Supporting Proposed detail for source-use review, selected sections, roles, errata, and provenance. It cannot expand or override the Accepted pack. |

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

All commands run in PowerShell from `C:/Users/mmjos/Desktop/workbeanch/a11y-evidence-lab`. PREP and the authorized second ACQUIRE attempt passed after the preserved first connection failure. VALIDATE passed on the static candidate; CLEANUP passed after accepted final review. Blocks remain the bounded recipes and must not be replayed automatically. Use no bare npm, package installation, build, application service, or browser launch.

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

### M201-EXEC-ENTRY-01 — execution baseline and authorization

The 2026-09-03 owner grant supersedes planning-only execution restrictions throughout this plan. PREP passed at intentional HEAD `b5347b47ffa98618e8ae37b73dfc5bf8b55574f9`, branch `codex/m2-01-closed-corpus-snapshot`, with empty index delta and no dirty paths. The sole intervening commit `b5347b4` changes only the nine planning/status Markdown files; no material executable drift exists. M1-05 remains Complete, M2-01 In progress, and M2-02 Not started. Applicable REQ-CORP-001/003–007, REQ-EVAL-003–005, OD-004/016/022/025, and ADR-0022 remain Accepted. All six frozen fixture contents still exactly match `rd003-scan-v1`.

PREP observed Node `v24.20.0`, PowerShell `7.6.4`, Windows curl `8.21.0` with Schannel, and Python `3.12.10`. The logical index listing SHA-256 is `bf0a843ea2ff79b0354dd23ca2f07e40d12f7eb377c5aa7aba1f5865f18143ab`. The 82 tracked PREP-protected files were individually SHA-256 captured for later comparison; they match this clean HEAD. Decisive identities: RD-003 manifest `13C9722BE9EA2E3B0AAF020EA91F429A701180A83814FE7AB21BAF2DDAD57459`; M1 types `1C8E67653EAAA839FC1D5353CD1837A416D7FB40D2CA98290F1AE53FF97DC068`; lease guard `21B1B7F6FBAC8580C85E57E7FE8796FF2816ED4971BE92D947BD37FB0FE1BA99`. The immutable HEAD and PREP path selection identify the remaining protected inputs without a new ledger. No lease is active; staging is absent; all eight exact paths are absent, untracked, and unignored. Workspace ancestors are ordinary directories. Primary documentation changes after this baseline are intentional and precede the setup lease.

### M201-USE-01 — frozen artifact-specific local-use review

Primary inspected all eight official pages, their actual footers, [WAI use guidance](https://www.w3.org/WAI/about/using-wai-material/), the [Document License](https://www.w3.org/copyright/document-license-2023/), the supporting pages' linked [Software and Document License](https://www.w3.org/copyright/software-license-2023/), and [errata](https://www.w3.org/WAI/WCAG22/errata/) on 2026-09-03 before local capture. This is a source-condition review for the authorized local representation, not a legal opinion or public-distribution clearance.

| Exact acquisition entry | Title, type and observed version/status | Notice and intended selection |
| --- | --- | --- |
| `wcag22.html` | Web Content Accessibility Guidelines (WCAG) 2.2; Recommendation, 12 December 2024 | Copyright © 2020-2024 World Wide Web Consortium; Document License. Inspect SC 1.1.1, 4.1.2, 1.4.3 and directly necessary definitions. Preserve the dated URL and text; no errata merge. |
| `understanding-111.html` | Understanding Success Criterion 1.1.1: Non-text Content; informative; updated 10 August 2026 | Copyright © 2026 World Wide Web Consortium; Software and Document License. Inspect Intent and applicable purpose/exception context. |
| `h37.html` | H37: Using alt attributes on img elements; informative technique; updated 12 January 2026 | Same 2026 notice and supporting-page license. Inspect About this Technique and Description for meaningful images. |
| `h67.html` | H67: Using null alt text and no title attribute on img elements for images that assistive technology should ignore; informative technique; updated 12 January 2026 | Same 2026 notice and supporting-page license. Inspect About this Technique, Description and its null-versus-absent note; retain decorative applicability. |
| `understanding-412.html` | Understanding Success Criterion 4.1.2: Name, Role, Value; informative; updated 12 July 2026 | Same 2026 notice and supporting-page license. Inspect Intent/programmatic-name context. |
| `h44.html` | H44: Using label elements to associate text labels with form controls; informative technique; updated 12 January 2026 | Same 2026 notice and supporting-page license. Inspect applicability and Description; preserve qualifications without adding other SC mappings. |
| `understanding-143.html` | Understanding Success Criterion 1.4.3: Contrast (Minimum); informative; updated 01 June 2026 | Same 2026 notice and supporting-page license. Inspect Intent, thresholds and exceptions. |
| `g18.html` | G18: Ensuring that a contrast ratio of at least 4.5:1 exists between text (and images of text) and background behind the text; informative technique; updated 10 August 2026 | Same 2026 notice and supporting-page license. Inspect applicability, Description, and calculation/testing context. |

Publisher is W3C for every entry; supporting pages attribute development to the Accessibility Guidelines Working Group. Exact URLs are the unchanged PREP table. The supporting-page permissive license is an observed artifact-specific notice, not a replacement of ADR-0022 or an assumption that project MIT terms apply. Keep all existing notice links, source URL, status, date and copyright in manifest metadata. Include the full applicable license notice in the combined artifact's accompanying developer documentation, viewable with the manifest and catalog. Require notices to travel with any later copied or displayed portion; later UI/package/public use needs its own review. No W3C endorsement is implied.

Representation is a local catalog of manually selected complete source paragraph/list units with exact headings and fragment locators. Preserve wording, punctuation, list membership, notes and necessary qualifications; decode HTML entities and represent HTML layout whitespace as ordinary spaces and paragraph/list newlines. Metadata, curator rationale and guidance roles stay outside quoted text. Do not translate, paraphrase, truncate, rewrite equations, or automatically select/split passages. This uses the Document License's express permission for portions in any medium, without relying on its derivative-use exception. The seven supporting pages additionally permit modification, but exact wording remains the project contract. Full raw HTML captures are temporary review inputs only, with their embedded notices preserved until verified cleanup.

Errata disposition: reviewed entries through 17 August 2026, including general capitalization/expanded-SC-name edits and other-section/definition changes. No changed text is incorporated; the approved 12 December 2024 Recommendation remains the sole normative artifact. Later semantic review must compare supporting passages to this edition. No source substitution or extra corpus artifact is authorized.

Acquisition packet freeze: workflow `M2-01-20260903-EXEC`, slice `M201-SOURCE-SETUP`, assignment `M201-SOURCE-SETUP-01`, lease `M201-SOURCE-SETUP-01A`, owner `m201_source_setup` (agent `/root/m201_source_setup`), role `code_worker`, setup attempt 1, no correction parent. Guard input validation rejected the initial owner spelling containing slashes before returning any contract or digest; no worker or acquisition ran. The replacement uses a valid owner label and unused lease ID. The binding packet in Plan of Work and unchanged PREP/ACQUIRE blocks applies: only eight exact files, no allowed directory roots, no test boundary, no production responsibility/dependency/refactor, S0 review, one turn, at most one separately reconciled same-contract correction, and no automatic acquisition retry. Primary inserts the actual guard digest in the worker packet after start. Local preparation is R0; curation is R2 primary synthesis with no unresolved researcher assignment or consequential alternative decision. Source-use review is accepted for this local representation; passage/gold freeze remains pending.

- `M201-PLAN-BASELINE-01`: clean planning HEAD and branch above. `git diff --name-only 12b05f6 HEAD` listed only `AGENTS.md` and `.codex/execplan-implementation-workflow.md`. Source/tests/dependencies/fixtures/evaluation are unchanged from the M1 merge. This is historical inspection, not an executable HEAD requirement.
- `M201-PLAN-CHECKS-01`: from the repository root, `C:/nvm4w/nodejs/node.exe node_modules/typescript/bin/tsc --project tsconfig.json` exited 0; `C:/nvm4w/nodejs/node.exe --test --test-timeout=120000 tests/run-contract.test.ts tests/scan-normalization.test.ts` exited 0, 78/78, no skipped/todo tests. `NODE_DISABLE_COMPILE_CACHE=1` was applied and the previous process value restored in `finally`; no generated files or browser/service activity. Evidence identity: clean planning HEAD, Node 24.20.0, installed TypeScript 7.0.2, unchanged relevant inputs. No full-suite rerun claimed.
- `M201-PLAN-SOURCE-USE-01`: one read-only R1 `technology_researcher` returned RESEARCH COMPLETE; primary checked the two official source-use pages, incorporated attribution/unmodified-content and per-artifact review gates, and made no legal or distribution conclusion. No W3C source artifact was copied to the workspace.
- `M201-PLAN-REVIEW-01`: fresh `independent_reviewer` returned PASS WITH FOLLOW-UPS, no Blocker or Major, and one Minor for the missing mandatory opening statement. Primary inserted the exact PLANS.md statement and accepted the review after verifying the correction. The reviewer independently checked the nine-path scope, four PowerShell blocks, and positive/five-negative structural recipe using synthetic in-memory inputs; none is corpus acceptance evidence.
- `M201-PLAN-DOCS-01`: nine changed Markdown files passed 557 local links, 120 fragments, fourteen required section checks, UTF-8/final newline/trailing-whitespace checks, and `git diff --check`. Roadmap totals are eight Complete, one In progress, nineteen Not started. All four PowerShell blocks parse. Primary's source-free, file-free recipe probe accepted a synthetic positive and unchanged JSON reconstruction and rejected all five specified mutations. Protected executable inputs remain unchanged; `corpus/` and `dist/client/` are absent.
- The initial execution checkpoint recorded the grant, baseline, use review, setup packet, failed acquisition and terminal receipt. Later entries below record the authorized successful correction, capture identities, accepted reviews and canonical verification; they supersede that checkpoint's pending-work list while preserving its failure evidence.

### M201-SOURCE-SETUP-01 — preserved failed acquisition

Worker `/root/m201_source_setup` ran the unchanged PREP and ACQUIRE blocks in memory from the repository root under lease `M201-SOURCE-SETUP-01A`, digest `263e8ea4724b9760e638bc67967563428a42b5844f87c515c348cd7fc99a5b2c`. PREP and exact absent/untracked/unignored/topology checks passed. The first fixed dated-Recommendation request returned curl exit `7`: connection to `www.w3.org:443` failed after 38 ms. The enclosing PowerShell command stopped with exit `1`; no HTTP content, output file or capture hash exists. The remaining seven requests did not run. No permission escalation, automatic retry, URL substitution, redirect following, TLS relaxation, browser, application test or model operation occurred. This establishes a connection failure in the restricted execution environment, not its underlying network cause.

Primary waited for the worker to stop and freshly closed the lease: exit `0`, `closed: true`, `status: closed-compliant`, receipt digest `8ab8a4ba9b669365c044605132264b39f460ab3d9c30e952db56631b6d9db0be`. It was not a replay; there were no created/deleted/modified/forbidden/unleased files and no HEAD, symbolic-ref, index or ignore-control drift. Primary separately inspected the ordinary `corpus` and `corpus/m201-source-staging` directories, confirmed the staging inventory is empty, inspected actual status/diff, and compared all 82 protected file hashes with the pre-lease record: unchanged. Cohesion disposition None; TDD Not applicable. No capture or setup acceptance is claimed. Empty directories are outside the guard's endpoint proof and were inspected directly.

The S0 setup reviewer and final independent reviewer have not run because no successful setup or corpus candidate exists. No review allowance is consumed. The setup attempt-1 write turn is consumed; at most one same-contract attempt-2 correction remains, subject to owner direction and a fresh primary packet/lease naming this terminal parent. Preserve and verify the exact empty staging directory before any authorized correction; the absent-directory acquisition precondition must be reconciled without overwriting or deleting unexpected data. Do not reacquire, run corpus validators on invented inputs, mark Complete, or archive this plan at this stop. M2-02 remains Not started.

`M201-STOP-DOCS-01`: the nine changed Markdown files pass UTF-8, final-newline and trailing-whitespace checks, 559 local links and 122 fragments, plus `git diff --check`. The first ad hoc link scan mistakenly included two placeholders inside the existing fenced progress template; excluding fenced examples resolved both without changing repository content. HEAD and the logical index remain identical to entry, no active lease remains, staging is empty, and canonical corpus/gold paths are absent. Documentation impact: updated this plan, roadmap, root/documentation/plan/progress indexes, requirements and delivery current-status summaries, and the task progress record to preserve the grant, failure, remaining gates and recovery boundary. Requirement/ADR semantics and all executable inputs are unchanged. This is a verified stopping-state documentation checkpoint, not M2-01 completion or corpus validation.

### M201-SOURCE-SETUP-02 — authorized network correction

The owner subsequently directed continuation outside the sandbox. This grants the one network-enabled same-contract correction and supersedes the preceding wait-for-direction boundary. HEAD remains `b5347b47ffa98618e8ae37b73dfc5bf8b55574f9`; the nine documentation changes are intentional, no source drift or active lease exists, and the staging directory is ordinary and empty. Primary removes only that exact empty directory before the lease; this is precondition reconciliation, not corpus cleanup or deletion of captured evidence. Use workflow `M2-01-20260903-EXEC`, slice `M201-SOURCE-SETUP`, assignment/lease `M201-SOURCE-SETUP-02`, attempt 2, parent `M201-SOURCE-SETUP-01A`, same owner/role and exact eight-file scope. PREP/ACQUIRE remain unchanged; only the execution permission changes to `require_escalated` for the finite acquisition. No further automatic retry is authorized.

### M201-SOURCE-SETUP-02 result

The authorized outside-sandbox PREP/ACQUIRE attempt exited 0: all eight fixed requests returned HTTP 200 and nonempty HTML with the expected titles. No retries, redirect following or source substitutions occurred. Primary freshly closed contract `0c24282b6b05a3158a6fe0feb96c644fb7877c5f7e477efa4e54921b422c48ea`: exit 0, closed-compliant, receipt `abd3d6acb818f5ee3cd3b76e130f2b23db16cdb8efcf4d2bdbe529188b15068f`. The receipt reports exactly eight created allowed files and no other file, index, HEAD, ref or ignore-control drift. Primary independently inspected the ordinary files, titles, dates, license links, lengths and SHA-256 values below. Cohesion disposition None; TDD Not applicable. Fresh S0 review was pending at capture handoff and subsequently passed as recorded below.

The initial start response was not retained by the tool-output wrapper. Before worker dispatch, primary read the guard's actual contract, reconciled a rejected verification using the active-pointer digest, and successfully verified the correct pinned contract digest above. No guard state was edited or bypassed; the failed verification made no mutation.

| Capture | Bytes | SHA-256 |
| --- | --- | --- |
| g18.html | 38928 | C376E72C32B6A1DE78478BB05385B6D6248259031D3BCA78DE29A96486CF25EE |
| h37.html | 31532 | 954F862548E8C42E58DA8563F0C5CB80EB4B28478B6BDFBB438FC94FDC12066E |
| h44.html | 40651 | F7A2FD71DA158395F9F71033429ADEBADBD32BEAF91159ADDCB645327D20294A |
| h67.html | 30565 | 2FA687F31651774426E4E112D4042C0D8F83B4D5786ECB1E34ED329B513554B8 |
| understanding-111.html | 79061 | A9B933E0A1717F139BEAD7D36340777F4074B7EC3F07F68CADBEBF744B89E8A9 |
| understanding-143.html | 75590 | 3352AAF477E9739155628467C4B62997E18EA4CAB917C0EB4FC4FB39C5238A2E |
| understanding-412.html | 66428 | 8C62F3E1F2DC70597A4B290E76354C4CA2639762FA76032D7BCCB113C7B96641 |
| wcag22.html | 512457 | 6E3C5FE397257CAE509A2FB4752B73062CF8CBEB92C2CEC618989B17E4CF7057 |

`M201-SETUP-REVIEW-01`: fresh `milestone_reviewer` returned PASS with no findings. It independently reproduced the exact ordinary-file inventory, eight sizes/hashes, title/notice presence and nine-document-plus-eight-capture scope, and passed diff formatting. Primary accepts S0 setup only; semantic curation, canonical license presentation, validation, cleanup and integrated review remain separate gates. No external request was repeated.

### M201-CORPUS-CANDIDATE-01 — primary curation and verification

Primary authored only the three planned static artifacts with apply_patch after setup acceptance. Source selection is manual: three complete normative criteria with every exception and note; the complete name, large-scale and contrast-ratio glossary entries; image-purpose and decorative interpretation; complete H37/H67 descriptions; complete 4.1.2 Intent; H44's association paragraphs and complete applicability lists; contrast intent, non-rounding/anti-aliasing paragraphs; and the complete G18 Description. Sixteen descriptive IDs are independent of ordering. No model input fitting or automated segmentation determined boundaries.

Primary read every unit and compared its exact wording, heading and fragment to the retained captured HTML. A read-only HTMLParser probe independently confirmed every selected text sequence with only layout whitespace normalized; all 16 exact headings and fragments resolve. Nested H44 text-input membership retains indentation. Notes, criterion exceptions, definition qualifications and formula wording remain intact. Source attribution, status, dates, errata disposition and both full applicable notices accompany the combined artifact through the manifest and root README.

Normative-precedence review found no unresolved material conflict for these selected profiles. H67 is conditional on an image intended to be ignored and is excluded from informative-image remediation gold. H44's separate HTML name/id statement is retained as source wording, but does not impose an HTML name attribute as a normative 4.1.2 requirement: the normative name definition explicitly distinguishes it, and RD-003's corrected association remains unchanged. Cross-criterion references in H44/G18 do not create additional tags or profiles. G18's approximate pixel conversion does not replace the normative point-size definition; the controlled normal 12pt text is unambiguously below the large-text boundary. Contrast-definition notes about unspecified colors do not conflict for the controlled case with both colors specified. No source text or erratum was rewritten to resolve these distinctions.

Every gold target was checked for direct support against its fixed failing fixture, target key, rule/criterion and historical native observation. Image purpose and useful alt wording, label usefulness and text applicability are human-authored expectations, not inferred minimized scanner facts. M1 field names and Fact wrappers are preserved; contrast retains observed 3.54 and the normalizer's numeric 4.5 threshold without recalculation. Gold is a subset, not a fabricated full Finding; unretained shadow/message fields are not invented. Source, fixture, contract and regression references resolve. No current application or model execution is claimed.

The exact M201-CMD-VALIDATE block passed with the PREP source table and unchanged scan manifest. Catalog JSON reconstruction preserved all data and file bytes. Fresh in-memory clones rejected duplicate ID, removed source, unknown gold ID, removed image remediation and wrong corpus version. The missing-remediation clone fails first at the stricter unrepresented-source check because H37/H67 contain only that role; the positive and other checks still cover role declarations. No corruption was written. Candidate SHA-256 values: manifest `475F66CF68F6245707CAACC3E1FE423E4B0153B1A91FD967A0F1DB82ADB89E4F`; passages `8C396C2C5472DA9A199363410F8E89A13BB4AC04B30192DFD985371890C9B4AB`; gold `13F4555CFBA49965E406D8318E1DBC05FF1909640DB9AC6D323CDA65CED1C9B8`. These identify the candidate for independent review; final acceptance and freeze are recorded at closure below.

### M201-FINAL-REVIEW-01 — integrated review accepted

A fresh `independent_reviewer`, distinct from setup and planning reviewers, returned PASS WITH FOLLOW-UPS: no Blocker/Major and one Minor for earlier acquisition/pending-use/candidate statements expressed as current. Primary qualified all named statements as historical and independently inspected the exact correction; no canonical artifact changed. The follow-up is resolved. The reviewer reproduced all eight capture and three canonical identities, all 82 protected inputs and six fixture bytes, all 16 source units/locators, gold alignment, the exact structural/reconstruction/five-negative checks and diff formatting. It accepted the local notices and normative-precedence dispositions. Primary accepts the complete candidate review; exact cleanup and final documentation/status/archive remain the next gate. No new research or application test is claimed.

`M201-CANDIDATE-DOCS-01`: all 82 baseline protected hashes remain unchanged. The ten affected Markdown files pass 585 local links, 129 fragments, UTF-8, final-newline and trailing-whitespace checks; all three JSON files parse with final newlines. Exact-source text/heading checks pass again after preserving nested H44 list indentation. Diff formatting passes. Candidate status owners and evaluation navigation now describe the static candidate and pending final review/cleanup; no requirement or ADR semantics changed. Historical application tests are reused solely under unchanged identity and are not reported as new executions.

### M201-CLEANUP-01 — exact source cleanup

After accepted review, primary verified the exact resolved staging child, ordinary Directory attributes and absence of reparse points on every ancestor, the exact eight-file inventory and every saved capture SHA-256, then executed the unchanged M201-CMD-CLEANUP block. It exited 0 and removed only those eight literal files and their empty staging directory. The canonical manifest/catalog and gold remain. No raw capture or new persistent validation tool remains.

The first pre-cleanup topology probe stopped before any deletion because PowerShell's PSIsContainer extension is absent on DirectoryInfo.Parent objects. Primary inspected all ancestors and the unchanged eight-file inventory, corrected that probe to test the actual Directory attribute, and repeated all safety/hash preconditions. This was a probe error, not a linked path or acquisition retry; no evidence was deleted before successful verification.

### M201-CLOSURE-01 — final freeze and documentation impact

The primary compared all delivered paths and evidence with the authority map. The task's complete static verification package and both fresh review barriers passed; the sole integrated-review Minor was resolved without changing canonical data. Exact source cleanup passed. Before completion, ten affected Markdown files passed 585 local links, 129 fragments, UTF-8/final-newline/trailing-whitespace and diff checks; all JSON parsed. The roadmap is now Complete and this same plan is archived, preserving its history. Final archival validation passed all ten Markdown files, 586 local links and 131 fragments, text/JSON formatting and diff checks. All 82 protected and three canonical hashes, HEAD and logical index match the accepted identities; no active lease or staging directory remains, and corpus inventory contains only the manifest and catalog.

The accepted file identities remain those in M201-CORPUS-CANDIDATE-01; this freezes wcag22-mvp-v1 and m201-corpus-v1 before any model output. No canonical source/text/heading/segmentation/role/gold mapping changed during review or cleanup. All 82 protected application/test/dependency/fixture/configuration/instruction inputs, the logical index and HEAD remain unchanged. Existing M1 application-test evidence is historical and reused under that identity, not newly executed. No runtime quality, model-fit, accessibility-conformance, legal-compliance or release claim follows from this static result.

Documentation impact: updated the root README's corpus usage and source-specific full notices, documentation/plan/progress indexes, roadmap, requirement-index and delivery current-status summaries, evaluation freeze navigation, this ExecPlan and its concise progress record. The roadmap records nine Complete and nineteen Not started; M2-02 was not activated. No requirement, ADR, source-pack decision, task dependency, application contract or executable configuration changed. No permanent acquisition/validation tool, raw capture, commit, publication or push was added. The next work requires a separately selected existing roadmap task.

## Interfaces and Dependencies

The only new handoff is static data: one manifest, one canonical passage catalog, and one gold mapping file. The manifest owns source notices, required roles and conflicts; passages own canonical selected text; gold owns controlled expectations. Later M2-02 reads them without changing canonical segmentation or inventing a new source pack; its runtime loader, compatibility validation, model configuration, input-fit test and ranking remain unimplemented. M2-03 owns support-policy execution/citation presentation, M2-04 owns real retrieval verification, and M3-01 owns complete generation packages.

Reuse the existing Node/PowerShell/Git toolchain and Windows curl for this finite authorized acquisition. No package, runtime service, source module, public interface, run schema, or rendered UI changes. The frontend-quality overlay is not applicable because no rendered interface changes.

## Revision Note

2026-09-03: Created the M2-01 plan after current-state and authority review. Preserved the exact eight-source boundary, planning-only authorization, source-use gate, primary curation ownership, one guarded acquisition setup, non-TDD proof, future-task exclusions, and execution-time baseline capture. No corpus or application implementation was performed.

2026-09-03: Accepted independent plan-readiness review after restoring the mandatory living-document statement, its sole Minor. Recorded documentation and source-free in-memory recipe evidence; no command, scope, acquisition permission, requirement, or ADR changed. Planning is complete; M2-01 execution remains pending.

2026-09-03: Recorded the subsequent explicit execution/acquisition grant, current intentional baseline and protected identities, actual per-artifact notices and local-use review, guarded attempt-1 connection failure, fresh compliant terminal closure, and unchanged-input verification. Execution is stopped for direction before any acquisition retry. No corpus/gold artifact, runtime change, completed review, cleanup, task completion, commit or push is claimed.

2026-09-03: Owner authorized continuation outside the sandbox. Recorded exact empty-staging reconciliation and one fresh attempt-2 lease with terminal parent; source scope, source-use conditions and acquisition command remain unchanged.

2026-09-03: Completed authorized acquisition and primary static curation; accepted structural/reconstruction/negative/manual evidence and both fresh reviews, resolved historical-state wording, cleaned exact captures, froze the corpus/gold, completed documentation closure and archived this plan. M2-02 remains Not started.
