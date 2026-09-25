# BUG-0004 - Ordinary regression depends on unpublished evaluation inputs

- **Status:** Verified
- **Impact:** P2. Four ordinary regression suites fail in a checkout without ignored historical evaluation inputs.
- **Responsible task or policy scope:** Owner-authorized test-workflow maintenance associated with completed M6-02; primary coordinator owns integration and documentation. Application behavior and roadmap status are unchanged.
- **ExecPlan:** No new application task or execution plan. This bounded maintenance follows the owner-approved correction plan and the [existing M6-02 tracking](../progress/m6-02-six-fixed-generation-executions.md); the [archived evaluation plan](../plans/completed/m6-02-six-fixed-generation-executions.md) remains historical evidence, not replay authorization.
- **Affected revision and environment:** `b37c5ad70fb26f40c7594b5740b154225c4f11b4`; Windows, Node 24.20.0, npm 11.19.0, PowerShell 7.6.5.
- **Last updated:** 2026-09-24
- **Next action or blocker:** None for this defect. Ordinary regression and optional historical authentication have separate documented commands.

## Expected and actual behavior

The [ordinary regression command](../DEVELOPMENT_REFERENCE.md#build-and-verify-the-walking-skeleton) should exercise controlled behavior without unpublished evaluation inputs. Historical artifacts are deliberately ignored, as documented in the [evaluation guide](../EVALUATION_GUIDE.md#frozen-generation-evaluation-package).

Three test helpers and two mixed behavioral/evidence tests call the default filesystem-backed `loadM602Package` family and require a ready result. Missing retained M3-01 inputs or M2-04 seed/run records therefore fail ordinary tests even when application behavior is correct.

## Reproduction and evidence

Before correction, copy the tracked source, tests, corpus, evaluation manifests, fixtures and package/configuration files into an isolated directory, excluding ignored inputs. With installed dependencies available, run the four affected suites using Node's test runner, a 120000-ms timeout, and module mocks for the judgment suite. The generation-file reproduction can be limited with `--test-name-pattern="^(prompt package, manifest|reasoning package, CLI)"`.

The fresh pre-change reproduction on 2026-09-24 confirms:

| Selection | Passed | Failed |
| --- | ---: | ---: |
| `m602-case-schema.test.ts` | 0 | 5 |
| `m602-native-schema.test.ts` | 1 | 5 |
| `m602-judgment-profile.test.ts` | 2 | 8 |
| Two prompt/reasoning tests in `m602-generation.test.ts` | 0 | 2 |

All four invocations exit 1; no selected test is skipped. The complete original development checkout previously passed 1061 tests in 54 files. The reproduction reuses installed dependencies and is not a new-machine installation test. Original ignored inputs remain untouched.

## Investigation

Confirmed cause: default package reads require nine files under `temp/m301-generation-freeze-v1/` and six seed/run files under `temp/m204-retrieval-checkpoint/`. Those files are absent from Git by design. The existing synthetic package builder and injectable readers already support independent behavioral testing; no production fallback or publication of private artifacts is necessary.

## Correction contract and ownership

Preserve default loader integrity checks, frozen manifests, original hashes and retained bytes. Extract the existing synthetic builder into a purpose-specific helper; ordinary test entry files must not import another test entry file. Keep behavioral assertions in ordinary regression and move only exact retained-input authentication into an explicitly invoked `.evidence.ts` suite. Missing originals must fail that optional command clearly, never silently skip or regenerate them.

The test worker owns the four test entry files and the two new synthetic/evidence modules under a bounded `evidence` lease. A separate code worker owns the npm script under a `setup` lease. The primary owns this record, documentation, command execution, actual-diff acceptance and closure between leases. This is test-workflow correction, not new production behavior: TDD is not applicable; the existing failing tests, preserved assertion mapping, isolated repaired run and historical positive/negative checks supply replacement evidence. No artificial product Red/Green cycle is introduced.

Risk is S1, with specific attention to preserving historical assertions and preventing implicit filesystem fallback in synthetic readers. One initial write turn and one routine correction are available per assignment; any conditional third turn must satisfy the existing workflow rules. No live model request, credential access, browser acquisition, private-fixture publication, commit or push is authorized. Application-source responsibility changes: None.

## Solution

The four ordinary suites now inject [the extracted synthetic package builder](../../tests/helpers/m602-synthetic-package.ts). Its construction logic is unchanged apart from the repository variable name; its reader remains map-only and rejects unknown paths. The helper imports no test entry file and never reads retained private inputs. All behavioral test cases remain in ordinary regression.

The [explicit evidence entry](../../tests/evidence/m602-retained-inputs.evidence.ts) checks all six labels through the unchanged default base, repaired, prompt and reasoning loaders. Those loaders retain their exact manifest, instruction, schema and wire identities. The evidence entry also preserves the prompt/reasoning manifest assertions and all six original uncertainty wire length/hash pairs. Primary inspection accounted for all 21 distinct original schema/wire hash expectations from the case-schema and native-schema suites.

The registered `npm.cmd run test:evidence:m602` command invokes that entry explicitly. Its `.evidence.ts` filename keeps it outside ordinary test discovery. A prerequisite check identifies missing retained files before default authentication. The [developer reference](../DEVELOPMENT_REFERENCE.md#optional-m6-02-retained-input-checks) and [evaluation guide](../EVALUATION_GUIDE.md#optional-retained-input-authentication) explain prerequisites and the distinction from ordinary regression.

One bounded test-owner correction removed newly self-derived expected wire values: exact original identities are checked in the evidence suite, while ordinary instruction assertions retain independent public references. Test edits and npm registration had separate owners; all three write leases closed compliantly. Primary inspected the actual diffs and accepted the preserved assertion mapping.

## Verification and disposition

Against the corrected working tree based on the affected revision above:

- The four complete suites pass in the isolated copy without retained inputs: 5 case-schema, 6 native-schema, 10 judgment-profile and 77 generation checks; **98 passed, zero failures or skips**. Installed dependencies are reused; this is not clean-machine installation qualification.
- The registered optional npm command passes both historical checks with the originals. The same command exits 1 without them and identifies the missing relative path; neither check is skipped.
- Independent `npm run typecheck` passes.
- A preliminary isolated generation run overlapped the package-script update. Because producer identity includes `package.json`, that result was discarded; the complete 77-check generation suite was repeated successfully with the final package unchanged throughout. No assertion or integrity condition was relaxed.
- The complete maintained suite passes **1061 tests in 54 files**, with zero failures, cancellations, skips or TODOs. Existing client output and installed browser/dependencies were reused; application source is unchanged, so no rebuild was needed.
- Default Node test discovery in an isolated directory containing the evidence entry discovers zero tests and exits 0. The explicit npm command runs its two checks.
- All 224 protected application-source, evaluation and original retained files match their pre-change SHA-256 identities. Client output is unchanged and all three shared suite scratch directories are empty.
- Primary review accepts the actual diffs, preserved assertion mapping, terminal compliant leases, local link/configuration checks and `git diff --check`. The bug index and existing M6-02 progress record link this correction without changing completed roadmap status or historical evaluation outcomes.

No actual provider request, evaluation replay, dependency installation, commit or push was performed. Documentation impact: updated maintainer verification, evaluation navigation, bug tracking and the existing M6-02 progress summary.
