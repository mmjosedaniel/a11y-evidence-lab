# ADR-0011: TypeScript as the initial application language

- **Status:** Accepted for evaluation
- **Decision date:** 2026-08-23

## Context

The planned application has several strongly structured boundaries: browser-scan evidence, immutable domain records, retrieval results, provider-neutral generation requests and responses, workflow state, persistence, and the local UI API. Using one application language across these boundaries can reduce duplicated contract definitions and make incompatible changes easier to detect before execution.

TypeScript is a static type checker for JavaScript and has first-class support in the React and Playwright ecosystems. Static checking can improve application-scale correctness and editor tooling, but its types do not validate runtime values received from scanners, model providers, local services, storage, imports, or untrusted page content.

## Considered options

1. Use TypeScript only for the UI and another language for the local service and workflow.
2. Use TypeScript as the primary language across application-owned UI, service, shared contracts, and browser-analysis code.
3. Use another primary application language and keep only unavoidable JavaScript integrations.
4. Defer the language decision until implementation begins.

## Decision

Use TypeScript as the primary application language for the initial evaluation implementation.

- Apply it to application-owned UI code, the local application service, shared domain contracts, provider and embedding adapters, retrieval integration, and the Playwright/axe-core module where the selected execution runtime supports the pinned dependencies.
- Require strict, independently executed type checking. A transpiler, build tool, test runner, or editor that accepts TypeScript syntax does not replace a successful compiler type check.
- Define application-owned, versioned domain contracts and runtime schemas. Validate and normalize every value crossing a process, HTTP, provider, scanner, storage, import, or other trust boundary before it enters domain logic.
- Keep React, Playwright, axe-core, Ollama, Chroma, model-provider SDK, and workflow-framework types outside canonical domain records. Integration-specific types terminate at their adapters.
- Keep credentials, filesystem access, process control, model management, persistence, and privileged networking in the local application service, never in browser-delivered UI code. A later isolated helper requires its own demonstrated need and topology decision.
- Pin and record the TypeScript compiler, JavaScript runtime, package manager, lockfile, and material dependency versions for every evaluation build.
- Evaluate type-checking reliability, runtime validation, cancellation, error normalization, process isolation, local-only networking, packaging, startup, recovery, and representative resource use on the reference PC.

This decision does not select Node.js or another JavaScript runtime, a package manager, build tool, desktop container, installer technology, runtime-schema library, web-service framework, or database driver. [ADR-0013](ADR-0013-langchain-as-initial-rag-integration.md) separately accepts LangChain's bounded evaluation role; this language decision does not accept LangGraph or LangSmith.

Promoting TypeScript to the release architecture requires successful evaluation of compiler and dependency pinning, runtime-schema coverage, supply-chain controls, native dependency and Windows packaging behavior, service lifecycle, diagnostics, zero-egress operation, and full-workload resource use.

## Consequences

- UI, service, browser-analysis, and contract code can share one language and compatible tooling while preserving explicit module boundaries.
- Static checking can catch incompatible contract changes before execution, but runtime validation remains mandatory because evaluated types are not a security or data-integrity boundary.
- Some operating-system integrations may require a native module, helper process, or separately owned service whose security and lifecycle must be evaluated.
- Chroma's TypeScript client uses a running Chroma service for the documented local setup, so TypeScript does not resolve Chroma's deployment, ownership, or packaging mode. That topology remains subject to ADR-0007 and OD-014.
- Replacing TypeScript later would affect application-owned implementation code but must not change the versioned domain schemas, stored evidence meaning, or provider-neutral behavior.

## Primary references

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro)
- [TypeScript runtime behavior and erased types](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch)
- [Playwright TypeScript support](https://playwright.dev/docs/test-typescript)
- [Chroma TypeScript getting started](https://docs.trychroma.com/docs/overview/getting-started)

## Related decisions and requirements

- [ADR-0001: Interchangeable generation providers](ADR-0001-interchangeable-generation-providers.md)
- [ADR-0007: Chroma as the initial local vector store](ADR-0007-chroma-as-initial-local-vector-store.md)
- [ADR-0008: Playwright as the initial browser automation technology](ADR-0008-playwright-as-initial-browser-automation.md)
- [ADR-0012: React as the initial user-interface library](ADR-0012-react-as-initial-user-interface-library.md)
- [ADR-0013: LangChain as the initial RAG integration baseline](ADR-0013-langchain-as-initial-rag-integration.md)
- [Evidence and review workflow requirements](../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md): `REQ-SCAN-*`
- [Generation provider execution requirements](../../requirements/generation-provider-and-model-lifecycle/GENERATION_PROVIDER_EXECUTION.md): `REQ-LLM-*`
- [Installation and model lifecycle requirements](../../requirements/generation-provider-and-model-lifecycle/INSTALLATION_AND_MODEL_LIFECYCLE.md): `REQ-INST-*`
- [Privacy and security requirements](../../requirements/quality-security-and-operations/PRIVACY_AND_SECURITY.md): `REQ-SEC-*`
- [Reliability, reproducibility, and operations requirements](../../requirements/quality-security-and-operations/RELIABILITY_REPRODUCIBILITY_AND_OPERATIONS.md): `REQ-QUAL-*`
