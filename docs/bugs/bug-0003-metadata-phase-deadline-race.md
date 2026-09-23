# BUG-0003 - Metadata can outlive its phase deadline

- **Status:** Verified
- **Impact:** A late Local metadata response can be accepted after its ten-second phase limit when the overall generation deadline is later. The overall operation deadline still applies.
- **Responsible task or policy scope:** M6-02, primary coordinator.
- **ExecPlan:** [Reasoning integration](../plans/completed/m6-02-six-fixed-generation-executions.md#m602-resolve-integration-02--regression-complete-and-review-blocker).
- **Affected revision and environment:** HEAD470e5746265ef32f46291d45fa46a4c989e532da plus the reasoning integration working tree; Node24.20.0 on Windows. Source/test fingerprint is recorded in the ExecPlan.
- **Last updated:** 2026-09-22 UTC
- **Next action or blocker:** Resolved under the [authorized correction and accepted review](../plans/completed/m6-02-six-fixed-generation-executions.md#m602-deadline-pass--corrected-integration-and-live-admission); no remaining defect follow-up.

## Expected and actual behavior

The accepted reasoning contract limits each metadata exchange to the remaining overall budget and at most10000ms. An expired exchange must not publish success even if its timer callback is delayed. The current [HTTP exchange](../../src/server/generation/ollama-generation-http.ts) uses a supplied overall expiry as the absolute deadline while shortening only its timer to10000ms. Its terminal wall-clock check can consequently accept an overdue response.

## Reproduction and evidence

The independent consolidated S3 reviewer used the existing manuallySettledNativeHarness with requestOllamaGenerationMetadata, a300000ms operation expiry, and mocked Date.now. Advance elapsed time to10001ms before delivering a complete response and all terminal events, without delivering the timer callback. The configured native timeout is10000ms, but the actual result is `{ok:true,cleanup:'complete'}`. Expected result is a metadata failure. This reproduction uses only in-memory resources, with no runtime/provider/credential request.

The review returned REVISE with one Major finding, RES-REV-01, and no other material finding. All1,035 existing regression tests pass; that does not cover or refute this race. No link to the historical model-output failures is established.

## Solution

Implemented: capture exchange entry time and bound metadata's effective absolute deadline by both entry+10000 and any earlier overall expiry. Reuse the same deadline for pre-dispatch, timer and terminal checks. Preserve legacy fallback behavior, the overall chat budget, error classification and cleanup semantics. The focused four-case fake-clock regression verifies timely success, phase and outer expiry, and rejection before further metadata/chat dispatch. The existing HTTP owner and transport test suffice; no new runtime machinery is needed.

## Verification and disposition

Primary accepted the exact source correction at SHA2562d5369353a20e7277f085503e4f3b5d01ed4b65f81b709ec52aa6b0bb4d7b83f and unchanged accepted regression at99975bdda155424afc55b8f0d457011b7d4ac2ca7ec2a1fdd537496e234aa230. Separate guarded Red reproduced both late success and onward dispatch; Green passes184 affected tests and independent strict checking. The sole critical correction review returns PASS after independently reproducing rejection at10000/10001ms, timely success, shorter/legacy expiry and unchanged180second reasoning-chat completion. Prior1035-test integrated evidence and unchanged build remain reusable. This verifies the defect only; actual capacity and six-case acceptance remain separate M6-02 obligations.
