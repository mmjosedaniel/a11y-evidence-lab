# Accessibility finding and evidence capture assessment

## Authority, status, and scope

**Status:** Proposed architecture detail for the second workflow step, reframed on 2026-08-25 for the public-page boundary accepted by [ADR-0017](../decisions/ADR-0017-authorized-public-page-scan-boundary.md). This assessment owns no requirement IDs or statuses, authorizes no implementation, and selects no persistence or schema library.

Canonical behavior remains in [Evidence and review workflow requirements — Evidence and provenance](../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md#evidence-and-provenance). Accepted policy controls if it conflicts with this assessment.

## Recommendation: one page publication with independent findings

Step 1 supplies one complete, runtime-validated, transient observation for one attested authorized public HTTPS page and the exact rules `image-alt`, `label`, and `color-contrast`. Step 2 should publish:

- one immutable page-scan record;
- one independent finding record and one minimized source-evidence item for every in-envelope native violation node;
- one normalized projection for each finding;
- separate minimized records for native `incomplete` observations;
- the narrow same-target positive observations later requested for comparison; and
- one evidence-policy and omission summary.

The product lists every retained finding, grouped by rule if useful, but automatically processes none of them. One selected finding at a time may later enter retrieval, evidence-sufficiency evaluation, generation or abstention, and review. Findings from the same scan never share a combined prompt, proposal, confidence, review action, or comparison outcome.

If allowlisted evidence is missing, withheld, internally inconsistent, or represents an unsupported rule variant, keep the deterministic finding visible with an explicit insufficiency marker. Do not discard it or invent missing context. That finding may be ineligible for generation while another finding from the same scan remains eligible.

## Step boundary and ownership

`Step 1 transient page-scan observation -> Step 2 page scan + per-finding evidence -> selected finding -> Step 3 retrieval`

| Step 1 owns | Step 2 owns |
| --- | --- |
| Authorization, URL admission, browser/network execution, exact rule configuration, readiness, coverage, bounds, and cleanup | Durable page-scan publication and privacy-safe target identity |
| One transient native axe page result | Rule-specific allowlisting and sanitization |
| Runtime validation of the complete result envelope | One finding/evidence/projection set per violation node |
| Native violations, incomplete, passes, and inapplicable categories without reinterpretation | Separate minimized incomplete-observation records and requested positive observations |
| Tool and execution provenance | Omission/withholding facts, digests, and retrieval eligibility inputs |

Step 2 must reject a failed, truncated, stale, malformed, limit-exceeding, or materially coverage-incomplete Step 1 handoff. It must not turn it into a successful scan with fewer findings. The unredacted native result remains in memory only until Step 2 finishes or fails.

## Finding granularity and identity

One application finding corresponds to one native violation node under one of the three rules. A rule-level axe result may group nodes for transport or display, but it is not one combined remediation item.

The minimum identity separates addressability from later correlation:

- immutable scan ID;
- immutable finding ID unique within that scan;
- exact rule ID and native category;
- normalized final-page identity reference;
- bounded structured locator emitted or derived under the locator policy;
- bounded rule-specific target descriptor; and
- locator/descriptor-policy version.

The locator and descriptor are evidence, not a universal stable element key. They must not contain executable URLs, credentials, form values, arbitrary HTML, or an unbounded DOM path. Cross-scan correlation uses the exact safe locator plus the compatible rule-specific descriptor and returns `inconclusive` when the match is missing, ambiguous, or changed. No fuzzy fingerprint, AI matching, or full DOM snapshot is introduced.

If multiple native nodes normalize to the same safe locator/descriptor within one scan, retain independent finding IDs and an occurrence discriminator that is valid only inside that scan. Do not claim those occurrences can be correlated later.

## Common evidence allowlist

Every retained finding may contain only:

- scan, finding, rule-manifest, evidence-policy, sanitizer, and projection references;
- exact axe-core and adapter versions;
- native rule ID, result category, check identifiers, and scanner-reported impact without inventing an order;
- the bounded safe locator and target descriptor;
- allowlisted rule-specific facts below;
- exact viewport/browser/readiness/frame/coverage profile references;
- explicit `omitted`, `withheld`, `unsupported`, or `insufficient` reason codes; and
- a digest over the retained sanitized content, never over excluded secrets as an anonymization technique.

Exclude native `node.html`, full HTML, arbitrary element text, page source, DOM/accessibility-tree snapshots, screenshots, browser traces, network bodies/logs, cookies, storage, credentials, headers, input values, private URLs, and unrelated attributes. A public URL or publicly rendered string can still be sensitive; public reachability is not permission to persist or send it.

### `image-alt`

Retain element kind `img`, the native result/check identities, and allowlisted facts about text-alternative presence and the mechanism reported by the scanner. Exclude `src`, filenames, surrounding arbitrary text, and model-inferred purpose.

The scanner cannot establish whether an image is informative, functional, or decorative, or whether proposed wording is appropriate. If the minimized evidence cannot support the narrow missing-alternative observation, keep the finding visible and mark it ineligible for generation.

### `label`

Retain element kind, safe input type, native result/check identities, and bounded facts about the programmatic accessible-name or label-association mechanisms reported for that target. Never retain the current value, placeholder text as arbitrary page content, form submission data, or a user-entered name.

The `label` rule maps this product path to SC 4.1.2 only. Evidence does not establish label wording quality, instructions, complete success-criterion non-conformance, SC 3.3.2, or SC 1.3.1.

### `color-contrast`

Retain the native result/check identities and these axe-emitted fields when present and valid:

- `fgColor`;
- `bgColor`;
- `contrastRatio`;
- `expectedContrastRatio`;
- `fontSize`; and
- `fontWeight`.

Preserve the measured numeric ratio and raw expected-ratio string exactly; a versioned normalizer may parse the expected numeric component for later comparison. Capture must not recompute contrast or override the native result bucket. Missing or inconsistent material measurement evidence keeps the finding visible but blocks generation.

## Incomplete observations and positive observations

Native axe `incomplete` nodes are separate scanner observations requiring manual attention. They do not become violations, proposals, evidence-sufficiency states, or workflow failures. Retain only their safe rule/check/target descriptors and reason codes needed to explain the scanner limitation. For `color-contrast`, a scanner-supplied incomplete reason belongs only to this ScannerReviewObservation, never to a violation Finding.

A later comparison may request a narrow positive observation for one baseline finding's exact locator/descriptor under the same rule. Step 2 may retain that targeted `pass` observation and the rule-specific positive facts needed to show that the target was exercised. It must not retain a page-wide pass collection. If the target is absent, ambiguous, moved, or the evidence is insufficient, no positive observation is fabricated and comparison remains inconclusive.

## Conceptual record composition

This is documentation, not a database or TypeScript schema.

| Component | Minimum retained information | Purpose |
| --- | --- | --- |
| Page-scan publication | Scan and authorization IDs; normalized-requested and validated-final page references; attestation time/scope; redirect, browser, viewport, locale, scanner, exact three-rule, readiness, main-document/frame-exclusion and resource coverage, bounds, sanitizer, and configuration identities; execution/publication eligibility | Establishes one page-level source shared by the independent findings. |
| Finding | Finding and scan references; rule/category; safe locator/descriptor; source-evidence and projection references; insufficiency markers | Makes one violation node independently selectable and traceable. |
| Per-finding source evidence | Common and rule-specific allowlisted native facts; sanitizer/omission metadata; retained-content digest | Preserves what the scanner reported without the full native payload. |
| Normalized projection | Rule family, element kind, bounded observed-fact codes, rule-specific measurements, source reference, projection version/digest | Supplies privacy-safe display and retrieval input without becoming source truth. |
| Incomplete observation | Scan/rule/check references, safe target descriptor, reason, limitation, and coverage relationship | Keeps manual-review scanner output distinct from violations and failures. |
| Positive target observation | Later scan, baseline finding, rule, exact locator/descriptor-policy, native non-violation evidence, and limitation | Supports conservative same-target comparison without treating silence as resolution. |
| Evidence-policy summary | Policy/sanitizer versions and removed, transformed, withheld, unsupported, and insufficient categories | Makes minimization and lost context visible without copying removed values. |

The minimum lineage is:

`finding -> source evidence -> page scan -> authorization and normalized/final target -> exact scanner/profile`

and:

`finding -> normalized projection -> exact rule-to-guidance mapping`

## Handoff to retrieval and later steps

Step 3 receives references for one user-selected finding only: finding, source evidence, normalized projection, rule manifest/mapping, and eligible page scan. Opaque IDs remain lineage; they are not embedded. The page URL, selector, raw HTML, arbitrary text, and unallowlisted colors or names do not enter the retrieval query.

The page itself never enters the curated RAG corpus. Its minimized finding facts are query input only. The corpus remains the approved versioned W3C guidance pack.

An unknown rule, unsupported variant, withheld core fact, incomplete evidence, or conflicting mapping produces deterministic ineligibility/abstention downstream. It must not trigger web search, corpus expansion, raw-page prompting, or a best-effort generic proposal.

Generation and review reference one finding package without mutating it. Comparison uses baseline/later page scans plus per-finding evidence and an exact safe locator/descriptor match. Later-only findings remain visible, but the `new` comparison outcome stays deferred unless separately accepted.

## Privacy and public-demo boundary

Only the minimized local records needed to reopen the run should persist. The public-page URL, query string, target descriptors, text, accessible names, attributes, and before/after evidence may reveal sensitive or proprietary information even when reachable without authentication. Apply the accepted URL-retention policy, use content-safe diagnostics, and never treat digests as anonymization.

Groq may receive only the selected finding's explicitly disclosed minimized evidence after the global analysis provider mode is set and that finding passes evidence sufficiency. The scan collection, raw page, URL, unrelated findings, reviewer history, and native axe payload are not sent. Local generation remains available without hosted inference.

A public portfolio demonstration must use a separately approved non-sensitive public page or the project-owned controlled evaluation baseline and synthetic review history. It must not publish arbitrary scanned-page evidence merely because the target was public.

## Alternatives

| Alternative | Disposition |
| --- | --- |
| Persist the complete native axe result | Reject: it retains unnecessary content and couples records to a third-party schema. |
| Persist only normalized projections | Reject as source truth: it loses inspectable deterministic evidence. |
| Merge all nodes for one rule into one finding | Reject: unrelated targets need independent evidence, sufficiency, proposals, review, and comparison. |

## Assumptions, open questions, and risks

Assumptions:

- Runtime scans one authorized public HTTPS page with exactly the three accepted rules.
- Controlled synthetic cases remain the fixed evaluation baseline.
- One local user selects and processes one retained finding at a time.

Open implementation details include the exact safe-locator grammar, descriptor fields, numeric envelopes, URL-retention representation, sanitizer rules, digest algorithm, atomic file layout, and targeted-positive-observation procedure. These remain Proposed.

Risks include sensitive page content leaking through descriptors, different nodes collapsing to one locator, unsupported rule variants being over-generalized, a truncated list being presented as complete, and public findings being mistaken for broad WCAG or compliance conclusions.

## Explicit non-goals

- Raw-page storage or prompting, corpus ingestion of the scanned page, screenshots, DOM trees, accessibility trees, traces, or network capture.
- Fuzzy/AI element matching, general DOM fingerprints, de-duplication across pages, or historical analytics.
- Automatic processing of all findings, combined proposals, bulk review, queues, agents, or workflow engines.
- Authenticated/private pages, crawling, multiple URLs, broader rules, multiple scanners, or cross-browser equivalence.
- Automatic remediation, certification, compliance determination, or treating a native pass as proof that a target or page is accessible.

## Planning acceptance criteria

This step is adequately defined when:

1. one complete Step 1 page observation publishes one page-scan record and every in-envelope violation node as an independent finding;
2. incomplete observations remain distinct and visible;
3. common and rule-specific allowlists exclude raw page/browser payloads and entered values;
4. evidence insufficiency keeps a finding visible and blocks only its generation path;
5. Step 3 can build one privacy-safe query for a selected finding without the page URL, selector, raw text, or HTML;
6. the scanned page never enters the guidance corpus;
7. comparison can request a narrow exact-target positive observation and otherwise uses `inconclusive`; and
8. records preserve limitations and make no accessibility, conformance, certification, or automatic-fix claim.

## Primary sources

- [axe-core 4.13.0 API and result model](https://github.com/dequelabs/axe-core/blob/v4.13.0/doc/API.md)
- [axe-core 4.13.0 TypeScript result definitions](https://github.com/dequelabs/axe-core/blob/v4.13.0/axe.d.ts)
- [axe-core 4.13.0 contrast evaluator](https://github.com/dequelabs/axe-core/blob/v4.13.0/lib/checks/color/color-contrast-evaluate.js)
- [WCAG 2.2 SC 1.1.1](https://www.w3.org/TR/WCAG22/#non-text-content)
- [WCAG 2.2 SC 4.1.2](https://www.w3.org/TR/WCAG22/#name-role-value)
- [WCAG 2.2 SC 1.4.3](https://www.w3.org/TR/WCAG22/#contrast-minimum)

## Documentation navigation

- Previous workflow step: [Authorized deterministic web scan assessments](authorized-scan/README.md)
- Next workflow step: [Accessibility guidance retrieval assessments](guidance-retrieval/README.md)
- [ADR-0017: Authorized public-page scan boundary](../decisions/ADR-0017-authorized-public-page-scan-boundary.md)
- [Evidence and review workflow requirements](../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md)
- [Architecture index](../README.md)
- [Project documentation index](../../README.md)
