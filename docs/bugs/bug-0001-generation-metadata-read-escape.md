# BUG-0001 - Generation metadata read escapes bounded outcomes

- **Status:** Verified
- **Impact:** Admitted configuration data can throw during post-attempt metadata observation or alter serialized request controls and invocation parameters.
- **Responsible task or policy scope:** M3-02, primary coordinator.
- **ExecPlan:** [Shared generation stage](../plans/completed/m3-02-shared-generation-stage.md#m302-b-metadata-01--confirmed-post-attempt-observation-defect).
- **Affected revision and environment:** HEAD `5fc98d37e9e6fc6aeb357789704cd6c67ed5e241` plus the uncommitted M3-02 implementation; stage SHA-256 `FA131699955F793B3AFA1416770B5227734702D17F438BD24F5F1E0C1FE59DCC`; Node 24.20.0 on Windows.
- **Last updated:** 2026-09-10
- **Next action or blocker:** None for this defect. [M302-B-EXTENSION-01](../plans/completed/m3-02-shared-generation-stage.md#m302-b-extension-01--owner-authorized-correction) owns accepted fix evidence; the task plan owns later integration and closure status.

## Expected and actual behavior

The accepted [L3/L4 contract](../plans/completed/m3-02-shared-generation-stage.md#m302-literal-01--authored-runtime-contract) requires closed configuration admission, bounded stage outcomes and invocation provenance only when transport is actually attempted. Unexpected collaborator behavior must not escape as an arbitrary error.

A deeply frozen Proxy configuration passes descriptor-based configuration validation. After one transport thunk executes, `observe()` reads configuration metadata using property access. A throwing `adapterId` get trap escapes the initial response observation and then the catch path's provider observation. The stage promise rejects, so no normalized result or invocation reaches its caller.

## Reproduction and evidence

Use the repository's `generationFixture()` and `generationConfiguration()` in a read-only in-memory Node module. Wrap the frozen configuration in a Proxy whose `adapterId` get trap throws `METADATA_READ_SENTINEL` only after the transport thunk runs. Supply an ordinary non-Proxy adapter, exact request/configuration references, valid fit accounting and a valid completed proposal envelope. The transport thunk increments a counter, arms the trap and returns that envelope.

The independent B reviewer reproduced the failure. The primary independently ran the same bounded scenario under maintained README preparation and observed `admitted:true`, `transportCalls:1`, and escaped error `METADATA_READ_SENTINEL`. No real provider was invoked, no files were created, and no retained evaluation artifact was changed. The complete existing 60-test focused packet and strict TypeScript checks pass; they do not cover this observation fault.

## Investigation

The earlier B1 entry-boundary defect is independently resolved. Its correction rejects Proxy adapter roots to protect the final configuration-reference check, but the nested admitted configuration remains Proxy-capable. The confirmed fault is in the later metadata read and repeated observation during failure handling, not a second transport attempt.

The final B review also reproduced an ordinary frozen configuration with Proxy parameters over valid frozen data. A synthesized toJSON returns `{"unexpected":"PARAMETER_SERIALIZATION_SENTINEL"}`, changing both request controls and invocation serialization despite successful admission. Rejecting only a Proxy configuration root leaves this nested exposure. Configuration-root ordinary reads and parameter forwarding therefore need a bounded correction; accounting property-access faults currently fail fit, while no additional post-attempt getter exposure was found in binding/provider context.

Final review disposition is REVISE with Major B2 open and no other actionable finding. The owning ExecPlan preserves complete review evidence and allowance state. This record grants no new correction budget or implementation authority.

## Solution

The stage now captures detached metadata through strict invocation readers before preparation. Request controls and invocation parameters use the canonical fixed values; original configuration identity remains available for request/fit binding. Post-attempt observation reads only the safe snapshot. No dependencies or new production modules were added.

## Verification and disposition

2026-09-09: Confirmed independently by reviewer and primary; original B allowances were exhausted before the fix.

2026-09-10: The owner-approved guarded correction passed all 64 focused tests, independent primary strict checking and full critical PASS. The reviewer independently reproduced both original manifestations and additional failure-path cases, including revoked configuration, with no unsafe reads or altered parameter serialization. Primary accepted both the behavioral and structural result. Corrected stage SHA-256 is `F6CD1ECD6064DD0A2169B53D048A5772F64934091D083BB23ABB8F4033CAD20F`; input SHA-256 is `7E72D90728FFAB1F1A66F96179A7AB01C12866994CAAE9E426C1821DD62C93D3`. See the owning evidence for exact tests, lease receipts and limits. This verifies BUG-0001. M3-02 was still In progress at that fix checkpoint; the linked task plan records its subsequent closure. Actual provider behavior remains unproved.
