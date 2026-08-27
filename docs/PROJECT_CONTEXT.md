# Project context

## Motivation

Automated accessibility tools can identify deterministic issues, but their output often stops at detection. Engineering teams still need to connect findings to authoritative guidance, understand the available evidence, identify where human judgment is required, and verify whether a change improved the result.

A11y Evidence Lab explores an evidence-centered workflow for that gap. The goal is not to build a generic document chatbot, but to connect browser findings, retrieved guidance, structured remediation proposals, human review, and before-and-after verification.

The primary MVP user is a frontend developer investigating findings from one trusted developer-selected public page and preparing remediation decisions one selected finding at a time. A QA engineer is the secondary user who can reproduce a finding and verify the later result. The single-user MVP does not introduce accounts, product roles, permissions, assignments, or collaboration features.

## Direction

The selected direction combines:

- Deterministic browser analysis as the source of findings and page evidence.
- Retrieval from a curated, versioned accessibility corpus.
- Grounded explanations and remediation proposals with citations.
- Explicit evidence-sufficiency, abstention, and manual-check requirements.
- User approval, editing, or rejection before a proposal becomes an accepted remediation plan.
- Rescanning and comparison to evaluate whether observed finding evidence improved, persisted, or regressed.

This structure makes the AI workflow observable and testable. Retrieval quality, answer quality, review outcomes, and regressions can be evaluated independently instead of relying on the apparent quality of a chat response.

The selected first portfolio slice accepts one developer-entered non-authenticated public HTTPS page per analysis as trusted input. The developer is responsible for choosing a page they are permitted to analyze; this portfolio application does not independently prove public reachability, ownership, or safety. One atomic provider-independent scan runs exactly `image-alt`, `label`, and `color-contrast`, and creates one independent finding for every returned violation node. Native axe `incomplete` observations remain separate from violations. A successful zero-finding result requires complete coverage of all three rules; navigation, scanner, validation, timeout, or persistence failure remains visible and is never reported as a truncated success. The user then selects one finding at a time for retrieval, evidence-sufficiency evaluation, proposal generation or abstention, human review, and later comparison. This fixed-cardinality rule suite and sequential child workflow add useful evidence variety without crawling, bulk generation, a queue, or workflow orchestration.

The three project-owned synthetic controlled profiles—`informative-image-alt`, `form-input-label`, and `text-contrast`—remain the frozen evaluation baseline for the three mappings, including controlled comparison outcomes. They are evaluation inputs, not user-submitted runtime page inputs. [OD-021](requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-021--trusted-operator-url-boundary-for-the-portfolio-mvp) records the current trusted-input scope and its relationship to OD-020 and OD-019. Authenticated targets, intentionally hostile pages, non-public destinations, link discovery, crawling, multi-page intake, broader rules, and bulk generation remain unsupported or excluded.

## Technical intent

The engineering objective is to demonstrate practical use of retrieval-augmented generation and LangChain in a cohesive, inspectable workflow. ADR-0013 accepts LangChain only as the initial evaluation baseline for two-step retrieval and generation integration. Deterministic scanning, evidence capture, review decisions, and comparison remain ordinary application-owned TypeScript modules. LangGraph is deferred until a demonstrated recovery or resume need makes plain application state insufficient. LangSmith and hosted tracing are deferred outside the MVP; content-safe local records and diagnostics are sufficient. The accepted architecture places structured generation behind an application-owned provider boundary so the evidence and review workflow is not tied to one model vendor, runtime, SDK, or API format. TypeScript and React remain initial application-language and client-interface evaluation baselines. React is a presentation layer over the local application API; durable records, runtime validation, credentials, provider calls, and browser automation remain outside browser-delivered code. Exact implementation packages remain unselected, and release framework or qualification decisions are Deferred.

The application remains local on the developer machine and must provide the complete path for curated-corpus preparation, embeddings, vector search, retrieval, review, comparison, and content-safe run records. Before analysis, the user explicitly chooses one global MVP generation mode: a separately downloaded local model through the selected runtime, or the Groq API as the first and only external provider. That immutable mode applies to every later eligible finding in the analysis; modes are never mixed, and neither falls back to the other. The provider-independent scan occurs without a model call, abstention invokes no provider, and actual invocation provenance exists only for a finding that reaches generation. Local mode is the recommended initial choice but is not selected implicitly. ADR-0014 fixes Groq model ID `openai/gpt-oss-20b` for MVP API evaluation without making it a release-qualified dependency or availability promise. Local model configurations must pass the reference-PC capacity gate before quality evaluation; models outside the existing computer's practical capacity are excluded rather than accommodated with more hardware or remote compute. Groq mode is an explicit data-egress choice with separate disclosure and consent, and it does not move scanning, evidence capture, corpus storage, retrieval, validation, review, or comparison out of the local application.

## Candidate architecture refinements

**Status: Proposed research input; unaccepted.** A read-only review of the separate Voxleaf reference project identified candidate patterns for versioned serialized contracts, deterministic corpus derivation, identity-first cancellation, exact-profile evaluation and support states, optional-artifact acquisition, safe React projection, service ownership, component inventory, and release evidence. The proposed shapes and adoption gates are organized in [Candidate architecture](architecture/CANDIDATE_ARCHITECTURE.md), with implementation references and limitations in the [Voxleaf implementation-pattern assessment](architecture/candidates/VOXLEAF_IMPLEMENTATION_PATTERN_ASSESSMENT.md).

This research does not change an accepted architecture decision, select Tauri, Rust, NSIS, pnpm, Vite, or another runtime or packaging technology, qualify a model or provider, authorize implementation, or copy Voxleaf code. Its advanced worker, supervision, acquisition, and release patterns are deferred until the small portfolio slice demonstrates a concrete need. Only an open decision implicated by the next authorized stage can block that stage.

## MVP startup and deferred distribution

The portfolio MVP is a browser-delivered local application, not an installed desktop product. The developer starts one local application service and opens its loopback address in Chrome or Edge. Browser-delivered code remains an unprivileged interface; the service owns local files, model-runtime and Groq calls, the single-page browser scan, and other privileged operations. [ADR-0018](architecture/decisions/ADR-0018-trusted-operator-url-boundary.md) treats the submitted public HTTPS page as benign developer input for this portfolio scope. The scan uses a fresh non-persistent browser context without imported cookies or profile state, performs no crawling or page interaction, disables downloads, uses a simple timeout, and closes the page, context, and managed browser after success or failure. It does not provide a production security boundary against hostile pages, private-address targeting, redirect abuse, DNS rebinding, or malicious subresources; those controls are deferred until a demonstrated product need justifies them.

The MVP has no Windows installer, Start menu shortcut, desktop wrapper, embedded webview, or packaged model. Local model acquisition is an explicit download outside the repository after model size and storage impact are disclosed. The earlier Windows-installer direction in [ADR-0002](architecture/decisions/ADR-0002-windows-installation-and-model-acquisition.md) remains visible as decision history but is superseded for the MVP by [ADR-0015](architecture/decisions/ADR-0015-localhost-browser-mvp-execution.md); packaging may be reconsidered only after a demonstrated distribution need. [ADR-0014](architecture/decisions/ADR-0014-groq-as-mvp-external-generation-provider.md) owns the fixed Groq evaluation path, and [ADR-0016](architecture/decisions/ADR-0016-filesystem-run-persistence.md) owns the local run store.

## Product boundaries

- The product would support investigation and review; it would not certify accessibility or legal compliance.
- Deterministic evidence and cited guidance would remain distinguishable from model-generated interpretation.
- Every generated proposal would require human review, and findings that require contextual or subjective judgment would also require explicit manual checks.
- The runtime product would accept one developer-entered non-authenticated public HTTPS page per analysis as trusted input. The developer owns target authorization, and the MVP would make no claim that it proves reachability, authorization, or hostile-page safety.
- The scan would execute exactly `image-alt`, `label`, and `color-contrast`, retain every returned violation node, and distinguish a valid zero from native axe `incomplete` observations and coverage-incomplete/failed scanning.
- The fixed synthetic scenarios would remain evaluation inputs, not user-submitted runtime targets.
- The MVP would not accept authentication state; non-public destinations remain unsupported rather than technically rejected. It would not discover or follow links as scan targets, crawl, batch pages, broaden the rule set, or bulk-generate proposals.
- The MVP would serve one local user at a time and would not include accounts, roles, permissions, assignments, or collaboration workflows.
- Private pages, source code, and sensitive traces would not be exposed in a public demonstration.
- Automated source-code modification is outside the current concept.

## Current status

The project remains in idea exploration. No implementation has started. [OD-021](requirements/DELIVERY_READINESS_AND_OPEN_DECISIONS.md#od-021--trusted-operator-url-boundary-for-the-portfolio-mvp) narrows OD-020's production-style public-target security boundary while retaining one public HTTPS page, the exact three-rule scan, and the complete variable finding list; OD-019's three fixtures remain the evaluation baseline. The primary and secondary users, global Local/Groq analysis mode, Groq as the only external provider, no-fallback behavior, local browser startup, and no-installer boundary are accepted at their recorded scopes. [ADR-0018](architecture/decisions/ADR-0018-trusted-operator-url-boundary.md) records the proportional trusted-input scan boundary; ADR-0017 remains superseded decision history. The initial technology baselines—including TypeScript, React, and the bounded LangChain role—remain evaluation choices rather than release-qualified dependencies. LangGraph, LangSmith, hosted tracing, formal release qualification, desktop packaging, installer work, hostile-target isolation, and exhaustive scan-resource qualification are deferred. Implementation commands, package versions, and the capacity-screened local model configuration still require evaluation before development claims can be made.

## Documentation navigation

- [Documentation index](README.md)
- Next: [Project concept](PROJECT_CONCEPT.md)
