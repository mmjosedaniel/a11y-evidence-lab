# Accessibility finding and evidence capture assessment

## Authority, status, and scope

**Status:** Proposed architecture detail for the controlled-fixture MVP. This assessment does not change any requirement or architecture-decision status, authorize implementation, select persistence technology, or enable live-target scanning.

**Assessment date:** 2026-08-24.

The authoritative requirement IDs, wording, and recorded statuses for this workflow step remain in [Evidence and review workflow requirements](../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#evidence-and-provenance). This supporting assessment owns no requirement IDs or statuses and cannot override an identified requirement or accepted ADR.

## Exact first portfolio slice

The first slice should use one project-owned controlled fixture with one informative product image and one axe rule:

- **Baseline revision:** the image has no `alt` attribute and the pinned `image-alt` rule reports one violation for one affected node.
- **Corrected revision:** the same logical image has a context-appropriate `alt` value and the same rule/profile records one narrow same-target non-failing observation.

This slice is intentionally smaller than a general evidence platform. It is enough to demonstrate the project’s distinguishing path:

`Playwright + axe-core -> deterministic evidence -> retrieval input -> RAG -> structured proposal -> human review -> rescan comparison`

The scanner cannot determine whether alternative text is contextually appropriate. That remains an explicit manual check, and disappearance of the automated finding must not be presented as proof that the page is accessible or conformant.

## Smallest sufficient boundary

The scan and evidence steps should remain separate ordinary application functions, even if they run sequentially in one TypeScript process:

`Step 1 transient native scan observation in memory -> Step 2 capture and publication record -> Step 3 retrieval-input assembly`

### Step 1 output consumed here

Step 1 owns authorization, browser/scanner execution, declared configuration, coverage, and execution status. It returns one runtime-validated **transient scan observation** containing the native axe result and the minimum provenance needed by Step 2. The unredacted native result is not a durable record and is never sent to the UI, retrieval system, or model.

Step 2 does not run the browser, reinterpret execution success, or independently discover frame coverage. It accepts only a successfully completed transient observation for the exact fixture and `image-alt` profile. A failed, timed-out, interrupted, partial, stale, or mismatched observation is rejected rather than turned into evidence.

### Step 2 responsibilities

Step 2 is the single logical owner of the evidence transformation:

1. Validate the expected native axe fields and bounds.
2. Apply the versioned evidence allowlist and sanitizer before any durable write.
3. Construct the scan-run publication record and one finding record for the affected baseline node.
4. Construct exactly one immutable sanitized source-evidence item for that finding. The first slice does not share or de-duplicate source-evidence items across findings.
5. Derive one versioned normalized finding projection from that source item.
6. Calculate the retained source-evidence digest, normalized-projection digest, and configuration digest using the selected canonical serialization.
7. For the corrected scan, retain only the narrow positive same-target observation defined below; do not retain all native pass nodes.
8. Construct one evidence publication bundle for local storage. The storage mechanism remains an open decision and does not change these logical responsibilities.

Sanitization, normalization, digest creation, and publication-record construction must not also occur in Step 1. Keeping one owner prevents two components from creating different “authoritative” evidence from the same scanner result. No message broker, worker protocol, event store, or separate evidence service is needed for this slice.

This approach reuses the Playwright and axe-core evaluation baselines recorded in [ADR-0008](../decisions/ADR-0008-playwright-as-initial-browser-automation.md) and [ADR-0009](../decisions/ADR-0009-axe-core-as-initial-accessibility-scanner.md). It does not promote either candidate to release adoption. The tagged [`axe-core` result definitions](https://github.com/dequelabs/axe-core/blob/v4.13.0/axe.d.ts) expose native result categories, rules, nodes, checks, targets, URL, timestamp, and engine metadata. The tagged [`axe-core` API documentation](https://github.com/dequelabs/axe-core/blob/v4.13.0/doc/API.md) states that `incomplete` results require further review. Those fields are source material, not a trusted persistence schema.

## First-slice allowlist

The `image-alt` evidence profile should retain only what the six-step demonstration needs:

- native rule ID and result category;
- scanner-reported impact without inventing an order;
- one structured affected-target locator and one fixture-owned, privacy-safe element key used only as a correlation input;
- element kind `img` and the derived fact `alt attribute missing` for the baseline violation;
- allowlisted axe check identifiers and a bounded failure summary;
- exact fixture, page-state, browser, scanner, rule-profile, sanitizer, and projection identities; and
- explicit omitted, truncated, withheld, or insufficient markers.

Native `node.html` is excluded by default. If the portfolio UI needs an excerpt to show where the evidence came from, the `image-alt` profile may retain one bounded sanitized excerpt containing only the `img` tag and the `alt` attribute state. It must remove `src`, URL data, arbitrary IDs and classes, inline style, event handlers, unrelated attributes, and surrounding text. The excerpt is supporting evidence, never executable markup or element identity.

The profile does not retain the whole page, screenshot, accessibility tree, browser trace, network log, cookie, storage, credential, form value, or arbitrary axe check `data`.

## Narrow corrected-scan observation

The corrected revision needs one **positive target observation** so comparison does not infer resolution merely because the violation disappeared. For the same `image-alt` rule and logical fixture image, retain:

- corrected scan-run and rule-profile references;
- native category `pass` for the selected node;
- the same structured locator and fixture-owned correlation input permitted by the profile;
- element kind `img` and derived fact `alt attribute present and non-empty`;
- source-result and sanitizer identities plus a retained-content digest; and
- a limitation stating that axe observed a structurally acceptable alternative, not that the wording is contextually appropriate.

This observation is an allowlisted component of the corrected scan publication record, not a general pass-retention feature and not an accessibility verdict. All other pass and inapplicable nodes remain unpersisted for the first slice.

## Conceptual evidence record

This is a documentation-level composition of the existing **Scan run**, **Finding**, **Evidence item**, and **Positive target observation** concepts in the [information and workflow lifecycle](../../requirements/INFORMATION_AND_WORKFLOW_LIFECYCLE.md), not a database schema or programming-language contract. Identifiers provide references, retained-content digests identify stored content, and correlation inputs only support later matching; they are not interchangeable.

| Component | Minimum retained information | Purpose |
| --- | --- | --- |
| Scan-run publication record | Schema version; scan-run, target, authorization, fixture/revision, page-state, time, viewport, browser, scanner, `image-alt` profile, coverage, sanitizer, and configuration references; execution and publication eligibility; configuration digest. | Establishes what authorized state was scanned and what actually ran. |
| Finding record | Finding, scan-run, rule-manifest, source-evidence, and normalized-projection references; native `violation` category; scanner impact; affected target; correlation-profile version and inputs. | Represents the one baseline node reported by `image-alt`. |
| Per-finding source-evidence item | Evidence, scan, and finding references; allowlisted native rule/node/check fields; structured target; derived missing-alt fact; optional minimal sanitized excerpt; sanitizer version; retained-content digest; omission markers. | Preserves what axe reported without storing the native payload or sharing one source item across findings. |
| Normalized finding projection | Projection version; finding and source-evidence references; rule `image-alt`; category `violation`; element kind `img`; normalized missing-text-alternative fact; deterministic ordering; projection digest. | Supplies stable, privacy-safe facts for display and later retrieval while remaining traceable to source evidence. |
| Positive target observation | Corrected scan and rule references; native `pass`; same-target correlation inputs; `img` and non-empty-alt derived facts; sanitizer identity; retained-content digest; limitation. | Allows the later comparison to distinguish a reported pass on the same target from silence or missing coverage. It is separate from a finding-owned evidence item. |
| Redaction summary | Evidence-policy and sanitizer versions; removed or transformed field categories; reason codes; retained-content digest. | Makes minimization inspectable without copying removed values. |

The minimum trace path is:

`finding -> per-finding source evidence -> scan run -> authorized fixture revision and declared state`

and:

`finding -> rule manifest -> exact scanner release and scanner guidance metadata`

Scanner metadata remains informative source context. It is not a substitute for retrieved W3C guidance.

## Handoff to retrieval and later steps

Step 2 publishes named references, not one flattened “RAG document.” Step 3 should assemble its privacy-safe retrieval input by resolving the **finding record**, **per-finding source-evidence item**, **normalized finding projection**, **rule manifest**, **approved scenario/rule-to-guidance mapping**, and the eligible **scan-run publication record**. The normalized projection supplies stable facts, but it is not sufficient lineage by itself. Step 3 owns the deterministic query representation and retrieval-run record.

The same records support the remaining steps without mutation:

- Generation cites the exact finding/evidence and retrieved passage references it receives; it cannot rewrite scanner evidence.
- Human review displays deterministic evidence, retrieved guidance, AI interpretation, and reviewer content as separate layers.
- Comparison uses the baseline finding and corrected positive target observation only after the scan pair passes its prerequisites. A valid pair with ambiguous same-target correlation is `inconclusive`; a material target, state, configuration, rule, evidence-semantic, or coverage mismatch is `not comparable`. Missing, failed, partial, or invalid source scans block comparison rather than becoming either classification.

## Privacy and public-demo boundary

The unredacted native result exists only in memory during Step 2 and is not written to logs, diagnostics, exports, temporary artifacts, vector storage, or traces. The evidence allowlist is applied before local persistence.

A public demo must use only the project-owned synthetic fixture and synthetic review history. Private sessions, real customer pages, credentials, proprietary markup, and personal data must never become demo evidence. Digests and fixture keys are not anonymization and must not be derived from sensitive raw values.

When the policy removes material evidence, record `withheld` or `insufficient`; do not reconstruct it with an LLM or weaken the policy to force a conclusion.

## Meaningful alternatives

| Alternative | Trade-off | Proposed disposition |
| --- | --- | --- |
| Store the complete native axe result | Simplifies initial extraction but retains unnecessary page content and couples persistence to an external tool schema. | Reject for the MVP. |
| Store only the normalized projection | Is very small but loses inspectable source evidence and weakens provenance. | Reject as the canonical evidence record; retain the small per-finding source item as well. |

## Assumptions and open questions

Assumptions:

- The first evaluation uses exactly the project-owned baseline and corrected fixture revisions described above, one main frame, one informative image, and the pinned `image-alt` profile.
- The fixture-owned element key is synthetic, non-sensitive, stable across the two revisions, and only one correlation input; it does not independently prove identity.
- The corrected fixture’s alternative text is reviewed manually because the scanner verifies structure, not contextual quality.

Open decisions remain limited to:

- the exact fixture content, stable correlation inputs, and accepted manual-check wording;
- canonical serialization, digest algorithm, schema compatibility, and local persistence;
- retention, deletion, export, and public-demo policies; and
- the exact rule-to-guidance mapping and small evaluation criteria.

## Explicit non-goals

- Live or authenticated pages, crawling, arbitrary local files, multiple fixtures, multiple rules, multiple scanners, or cross-browser equivalence.
- General DOM snapshots, screenshots, accessibility trees, HAR files, browser traces, or network capture.
- Shared evidence de-duplication, a universal DOM evidence model, generalized pass retention, fuzzy matching, or historical analytics.
- A worker service, queue, event-sourcing system, distributed pipeline, or production-scale storage design.
- Using LangChain, an LLM, embedding model, or vector store for deterministic capture, sanitization, correlation, or comparison.
- Automatic remediation, certification, compliance determination, or treating a passed rule as proof that the image or page is accessible.

## Acceptance criteria for this planning definition

This workflow step is defined adequately for later evaluation when:

1. Step 1 ends with one transient native observation, and Step 2 is the only owner of allowlisting, sanitization, source-evidence construction, normalization, digests, and publication-record construction.
2. The baseline creates one `image-alt` finding and exactly one minimal immutable source-evidence item, with traceability to the authorized fixture revision, declared state, scan time, exact tool/profile versions, affected target, and redaction summary.
3. The allowlist excludes the native payload and raw HTML; any displayed excerpt is bounded to the rule-approved `img`/`alt` representation and contains no URL, credential, private value, or executable markup.
4. The corrected scan retains exactly one narrow same-target `pass` observation with an explicit contextual-quality limitation, rather than all passing nodes.
5. Step 3 can construct a privacy-safe reproducible query from the named record references without embedding opaque IDs or requiring raw page content.
6. The baseline finding and corrected observation provide the evidence needed for a later conservative `resolved` classification when all pair prerequisites and unique correlation pass; ambiguity produces `inconclusive`, while material pair mismatch produces `not comparable`.
7. Evidence, guidance, generated interpretation, manual checks, and reviewer content remain separate and no record makes an accessibility, compliance, certification, or automatic-fix claim.
8. Persistence, retention, schema, and release technologies remain visibly undecided, so this Proposed assessment does not accidentally authorize implementation or accept them.

## Documentation navigation

- Previous workflow step: [Authorized deterministic web scan assessments](authorized-scan/README.md)
- Next workflow step: [Accessibility guidance retrieval assessments](guidance-retrieval/README.md)
- [Evidence and review workflow requirements](../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md)
- [Architecture index](../README.md)
- [Project documentation index](../../README.md)
