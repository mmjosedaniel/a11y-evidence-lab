# BUG-0002 - Successor manifest loses frozen bytes on Windows checkout

- **Status:** Verified
- **Impact:** The unchanged successor manifest fails its raw-byte trust anchor after Git converts its LF line endings to CRLF, blocking evaluation admission.
- **Responsible task:** M6-02
- **ExecPlan:** [Completion continuation](../plans/completed/m6-02-six-fixed-generation-executions.md#m602-cont-01--authorized-completion-campaign-and-readiness)
- **Affected revision:** `470e5746265ef32f46291d45fa46a4c989e532da`, Windows checkout; the manifest has no Git content diff.
- **Last updated:** 2026-09-23
- **Next action:** No further defect correction is required. Preserve the verified bytes and exact LF attributes; M6-02 later completed through its separately recorded native continuation; this fix alone does not prove task completion.

## Expected and actual behavior

[The frozen successor contract](../plans/completed/m6-02-six-fixed-generation-executions.md#immutable-manifest-and-identity) requires the exact 1175-byte LF manifest, SHA-256 `5ca8c1798647f3b949d016441f30d3c7d1f0055c4a55dabd574836d024513276`. The [loader](../../tests/helpers/m602-successor-evidence.ts) correctly authenticates raw bytes before parsing.

At pre-fix discovery, the working file was 1213 bytes with 38 CRLF line endings and SHA-256 `0513678238408479ca37d1db1e956bfaaa6c6c195bf30650d77e5db0ecff5a20`. `git ls-files --eol` reported `i/lf w/crlf attr/`. The pre-fix [.gitattributes](../../.gitattributes) pinned other frozen evaluation artifacts but omitted this manifest.

## Reproduction and evidence

Primary's read-only manifest preparation failed its exact expected hash assertion before any new campaign file or effect. A subsequent binary `git show HEAD:evaluation/m602-successor-v1.json` read reproduces the accepted 1175-byte hash. Comparing the committed bytes with the working file after an in-memory CRLF-to-LF comparison proves that checkout newlines are the only difference. This comparison wrote neither file.

All 430 inventory-protected files and the four retained successor qualification/case records still match their recorded hashes. This defect is separate from the earlier actual metadata prerequisite failure; it does not explain or change that historical result.

## Investigation

Confirmed cause: the missing per-path checkout rule permits Git newline conversion of a raw-hash-authenticated public manifest. A clean Git status does not establish byte identity. Current helper/test hashes also differ from older LF evidence, so that historical full-suite identity cannot be reused without current verification.

## Solution

Added exact LF rules for the successor and new completion manifests and restored only the successor manifest from authenticated committed bytes. Strict raw hashing and historical records remain unchanged. No global normalization, Git configuration change or input/model change occurred.

## Verification and disposition

Primary accepts [canonical setup evidence and S3 review](../plans/completed/m6-02-six-fixed-generation-executions.md#m602-cont-preflight-01--completion-binding-work-slice-packet) at HEAD `470e5746265ef32f46291d45fa46a4c989e532da` with the two-line working-tree attribute change. Restored bytes equal the 1175-byte Git blob and accepted SHA-256. Effective attributes and actual binary checkout filtering preserve both exact paths; an adjacent unlisted path retains CRLF conversion. Manifest authentication, strict TypeScript and all 216 current focused tests pass, with 430 protected files and earlier records preserved. Fresh critical review returns PASS without findings. No separate non-Windows checkout was executed. Completion-campaign qualification subsequently passed, but its first generation failed and stopped the campaign; bug verification does not close M6-02.
