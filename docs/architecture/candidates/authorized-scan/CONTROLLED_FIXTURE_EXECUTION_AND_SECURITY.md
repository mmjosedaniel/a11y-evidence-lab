# Controlled-fixture evaluation assessment

## Authority, status, and scope

**Status:** Proposed evaluation architecture assessment. Originally assessed on 2026-08-23, expanded to three scenarios on 2026-08-24, and refined on 2026-08-27 to remove a separate fixture-selection product workflow.

[ADR-0018](../../decisions/ADR-0018-trusted-operator-url-boundary.md) retains controlled fixtures as the deterministic evaluation baseline while accepting one trusted operator URL as the runtime product target. ADR-0008, ADR-0009, and ADR-0011 retain their evaluation-baseline scope; no fixture layout or technical detail becomes accepted by association.

This assessment owns no requirement or decision, does not authorize development, and does not define runtime URL intake. Canonical behavior remains in [Evidence and review workflow requirements](../../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md), while exact evaluation authority remains in its owning evaluation requirements. Its recommendation uses ordinary product records plus a manifest-case reference, preserving the controlled-fixture identity and correlation evidence required by `REQ-EVID-002` and `REQ-COMP-002` without creating a second product model.

## Recommendation

Use the project-owned synthetic states as evaluation/test configuration for the same scan and evidence-capture modules used by the product. Do not build a fixture selector, fixture authorization module, fixture-specific product API, separate workflow state machine, or second persistent fixture-record model.

The evaluation harness selects a frozen synthetic revision, supplies it to the scan module through test-only configuration, and associates the resulting ordinary scan records with the expected manifest entry. The manifest owns the expected result. The controlled run aggregate may reference the scenario, revision role, and stable fixture target key required for evaluation lineage, but those gold fields do not enter prompts, public-page evidence, or the product's runtime UI.

This shape demonstrates deterministic behavior without creating a second product:

`evaluation manifest -> controlled document configuration -> normal scan module -> normal evidence capture -> evaluation assertion`

The runtime product still starts from the operator-entered HTTPS URL. The controlled harness is evaluation infrastructure to be created only after development is authorized.

## Smallest deterministic evaluation set

The fixed portfolio evaluation covers exactly three rule families. Each logical scenario has one failing and one corrected state:

| Scenario profile | Failing revision | Corrected revision | Expected target observation |
| --- | --- | --- | --- |
| `informative-image-alt` | One informative synthetic image has no `alt` attribute. | The same image has a manually reviewed, context-appropriate alternative. | One `image-alt` violation, then a same-target native non-failing observation; WCAG 2.2 SC 1.1.1. |
| `form-input-label` | Visible text `Email address` is adjacent to one email input but is not associated and no other name source exists. | The same input has an explicit visible label associated through matching `for` and `id`. | One `label` violation, then a same-target native non-failing observation; WCAG 2.2 SC 4.1.2. |
| `text-contrast` | One normal-text target uses `#888888` on `#ffffff` at 16 CSS px and weight 400. | The same target uses `#767676` on `#ffffff` with the other profile values unchanged. | One `color-contrast` violation, then a same-target native non-failing observation; WCAG 2.2 SC 1.4.3. |

The six logical states do not require six projects or a product-facing selector. Physical file layout is an implementation detail. Each controlled state is static, synthetic, project-owned, publicly shareable, and contains no credentials, personal data, authentication, external resource, frame, or scripted interaction.

Each controlled scan should run the same exact three-rule scan module as the runtime path. The evaluation assertion focuses on the manifest's intended rule and target while also confirming that complete three-rule coverage was retained. It does not invoke a special one-rule scanner path.

Corrected observations prove only the applicable automated rule result under the frozen profile. They do not prove alt-text quality, label accuracy, text readability in all conditions, whole-page accessibility, or WCAG conformance.

## Evaluation configuration

Before evaluation, freeze:

- the controlled fixture content under one scenario and revision entry in the evaluation manifest;
- the expected target rule result and stable evaluation target key;
- the exact managed Chromium and axe-core identities;
- viewport, locale, color preferences, and other rule-relevant browser values; and
- the evidence shape and expected retained measurements.

The exact serialized values remain Proposed. A sufficient initial profile is:

| Concern | Proposed evaluation value |
| --- | --- |
| Browser | The same pinned Playwright-managed Chromium used by the scan module |
| Context | One fresh non-persistent context per scan |
| Viewport | 1280 by 720 |
| Locale and timezone | `en-US` and UTC |
| Color preferences | Light color scheme and no forced colors |
| State | No credentials, imported storage, personal profile, extension, or granted permission |
| Content | One selected immutable synthetic revision supplied by the evaluation harness |
| Networking | No external dependency; an unexpected external request fails the evaluation case |
| Readiness | Static content loaded and its evaluation marker available |
| Scanner | The same pinned axe adapter and axe-core version as the runtime scan module |
| Rules | Exactly `image-alt`, `label`, and `color-contrast` in one complete scan |
| Bounds | One document and one finite scan timeout |

These values make the synthetic cases reproducible; they are not a second browser-security architecture or a claim about hostile pages.

## Shared scan-module boundary

The evaluation harness may choose content differently from the runtime URL intake, but after target setup it calls the same scan module. That module:

1. creates the fresh managed-browser context;
2. waits for the configured simple readiness condition;
3. runs the exact three-rule axe scan;
4. validates complete per-rule result coverage;
5. returns every violation node and every native `incomplete` observation;
6. records the common browser/scanner/profile provenance; and
7. closes the page, context, and browser after success or failure.

The same evidence-capture module then minimizes and persists ordinary Finding and ScannerReviewObservation records. The controlled run may carry its manifest-case reference and required fixture identity, but the scan module does not produce a fixture-specific Finding type, copy the expected outcome into scanner evidence, or create another storage hierarchy.

The evaluation harness separately joins the ordinary output to its manifest case and checks the expected observation. This join belongs to evaluation reporting, not to product behavior.

## Rule-specific retained evidence

| Profile | Minimum evaluation evidence |
| --- | --- |
| `informative-image-alt` | Native rule/check result, intended evaluation target key in the manifest, minimized image/alternative state, and the corrected same-target non-failing observation. |
| `form-input-label` | Native rule/check result, intended target key in the manifest, minimized input type/name-source/association facts without input value, and the corrected non-failing observation. |
| `text-contrast` | Native rule/check result, intended target key in the manifest, emitted foreground/background colors, measured and expected ratios, font size/weight, and corrected non-failing observation. |

The stable evaluation target key comes from the manifest and is retained only in the controlled evaluation lineage required by `REQ-EVID-002` and `REQ-COMP-002`. It never becomes the identity rule for a public-page Finding.

## Failure and valid-zero behavior

The controlled case fails when content setup, readiness, browser launch, scanner execution, result validation, evidence capture, timeout, or cleanup prevents a complete result. It must not publish a complete zero-Finding result or a silently partial result.

A native axe `incomplete` result is scanner evidence requiring review, not a scan failure. A corrected case with zero violations is valid only when all three rules and both returned collections validate as complete.

The MVP needs no automatic retry, fixture queue, concurrent execution, cancellation controller, worker, or resume state. A developer can rerun the evaluation command after inspecting a failure; no product retry feature follows from this assessment.

## Minimal evaluation sequence

1. The evaluation harness selects one frozen manifest case.
2. It supplies that synthetic revision and the shared scan configuration to the normal scan module.
3. The normal module runs all three supported rules and returns its ordinary transient result.
4. The normal evidence-capture module creates minimized ordinary records.
5. The harness compares those records with the frozen expected target observation.
6. Downstream retrieval, generation, review, and comparison evaluations consume the same ordinary records used by the product.

No UI fixture selector or fixture-specific authorization record is involved.

## Reproducibility and comparison

For each scenario, one failing and one corrected execution verifies the frozen expected observation. The corrected target supplies the narrow native non-failing evidence needed for deterministic `resolved` comparison. The contrast case retains the scanner-emitted measurement fields; the native axe bucket remains authoritative.

The compact manifest supports a deterministic demonstration, not statistical repeatability, provider ranking, security qualification, or generalized scanner correctness. Formal repeated-run evaluation remains deferred.

## Minimal controlled-content hygiene

Because the project owns the synthetic content, only inexpensive evaluation hygiene is needed:

- static content with no credentials, personal data, scripts, frames, form submission, or external resources;
- a fresh non-persistent context with no imported user state;
- no required external network access;
- a finite timeout and cleanup;
- raw scanner output remains transient until evidence capture minimizes it; and
- only synthetic approved content appears in portfolio demonstrations.

This is reproducibility configuration, not a hostile-content security boundary.

## Acceptance criteria

The controlled evaluation baseline is adequately defined when:

- the manifest contains only the failing and corrected states of the three accepted scenarios;
- the harness, not the product UI, selects a manifest case;
- every case exercises the same exact-three-rule scan and evidence-capture modules as the runtime path;
- failing and corrected cases produce the expected target violation and native non-failing observation;
- all three rules report complete coverage, even though the manifest assertion focuses on one intended target;
- contrast retains the required scanner-emitted measurements;
- expected outcomes remain in the evaluation manifest; the controlled run retains only its manifest reference and required scenario/revision/target lineage, and none of those gold fields enter prompts or public-page records;
- malformed, incomplete, timed-out, or failed work never appears as valid zero or complete;
- scanning works without LangChain or an LLM; and
- results make no accessibility, compliance, certification, hostile-page-safety, or broad-support claim.

## Open questions and explicit non-goals

Implementation planning still needs to choose the physical fixture layout, the test-only content-loading mechanism, and exact pinned profile values. Those choices do not justify a fixture selector or separate product domain.

Explicit non-goals include:

- a product-facing scenario or revision selector;
- a fixture-specific product API, authorization module, workflow state machine, persistence format, Finding type, or scan implementation;
- using fixture gold metadata as public-page evidence or model input;
- authenticated targets, crawler behavior, a fourth rule, broad WCAG coverage, concurrency, automatic remediation, or conformance claims; and
- production hostile-page qualification, packaging, or distribution.

## Primary sources

The shared browser and scanner sources are listed in [Technology selection — Primary sources](TECHNOLOGY_SELECTION.md#primary-sources).

- [W3C Understanding SC 1.1.1](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html)
- [W3C ACT rule: Form field has non-empty accessible name](https://www.w3.org/WAI/standards-guidelines/act/rules/e086e5/)
- [W3C Understanding SC 4.1.2](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html)
- [W3C Understanding SC 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- [axe-core 4.13.0 rule descriptions](https://github.com/dequelabs/axe-core/blob/v4.13.0/doc/rule-descriptions.md)
- [Playwright browser-context isolation](https://playwright.dev/docs/browser-contexts)

## Documentation navigation

- Deferred post-MVP research: [Authorized public-page execution and security](AUTHORIZED_PUBLIC_PAGE_EXECUTION_AND_SECURITY.md)
- Up: [Authorized deterministic web scan candidate assessments](README.md)
- Next workflow step: [Accessibility finding and evidence capture assessment](../ACCESSIBILITY_FINDING_EVIDENCE_CAPTURE_ASSESSMENT.md)
- [Architecture index](../../README.md)
- [Project documentation index](../../../README.md)
