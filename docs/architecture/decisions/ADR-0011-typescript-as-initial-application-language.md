# ADR-0011: TypeScript as the initial application language

- **Status:** Accepted for evaluation
- **Decision date:** 2026-08-23

## Context

The planned application has several strongly structured boundaries: browser-scan evidence, immutable domain records, retrieval results, provider-neutral generation requests and responses, workflow state, persistence, and the local UI API. Using one application language across these boundaries can reduce duplicated contract definitions and make incompatible changes easier to detect before execution.

TypeScript is a static type checker for JavaScript and has first-class support in the React and Playwright ecosystems. Static checking can improve application-scale correctness and editor tooling, but its types do not validate runtime values received from scanners, model providers, local services, storage, imports, or untrusted page content.

### MVP scope amendment recorded 2026-08-25

OD-015 narrows the runtime-contract work anticipated by the original decision. The MVP uses small TypeScript record definitions plus minimal runtime validation only where unknown data enters from axe-core, Groq, the selected local model runtime, or persisted JSON. ADR-0018 separately requires basic URL-syntax validation before target admission. The MVP does not require JSON Schema as a cross-system authority, code generation, a schema framework, migrations, multiple schema dialects, or a compatibility framework. TypeScript's erased compile-time types still do not validate those runtime values.

## Considered options

1. Use TypeScript only for the UI and another language for the local service and workflow.
2. Use TypeScript as the primary language across application-owned UI, service, shared contracts, and browser-analysis code.
3. Use another primary application language and keep only unavoidable JavaScript integrations.
4. Defer the language decision until implementation begins.

## Decision

Use TypeScript as the primary application language for the initial evaluation implementation.

- Apply it to application-owned UI code, the local application service, shared domain contracts, provider and embedding adapters, retrieval integration, and the Playwright/axe-core module where the selected execution runtime supports the pinned dependencies.
- Require strict, independently executed type checking. A transpiler, build tool, test runner, or editor that accepts TypeScript syntax does not replace a successful compiler type check.
- Define the minimum application-owned record types needed by the six-step workflow. Validate basic URL syntax before target admission, and runtime-validate and normalize native axe results, Groq responses, local-runtime responses, and canonical persisted JSON before they enter domain logic.
- Under [ADR-0021](ADR-0021-single-file-run-aggregate.md), persisted domain state is one top-level `run.json` type with nested finding data, not a family of independently versioned child contracts.
- Do not introduce JSON Schema or another schema language as a second canonical contract merely for the MVP. Provider-required JSON Schema may describe the Groq request boundary, but the application-owned TypeScript record meaning remains authoritative and the returned value is still validated.
- Keep React, Playwright, axe-core, Ollama, LangChain `MemoryVectorStore`, model-provider SDK, and workflow-framework types outside canonical domain records. Integration-specific types terminate at their adapters.
- Keep credentials, filesystem access, process control, model management, persistence, and privileged networking in the local application service, never in browser-delivered UI code. A later isolated helper requires its own demonstrated need and topology decision.
- Pin and record the TypeScript compiler, JavaScript runtime, package manager, lockfile, and material dependency versions used by the MVP evaluation.
- Evaluate strict type checking, URL admission plus the four external/persisted-data validation boundaries, normalized failures, loopback isolation, startup, recovery, and practical reference-PC capacity. Cancellation frameworks, packaging, migrations, and broader compatibility qualification remain deferred.

This decision does not select Node.js or another JavaScript runtime, a package manager, build tool, desktop container, installer technology, runtime-schema library, web-service framework, or database driver. [ADR-0013](ADR-0013-langchain-as-initial-rag-integration.md) separately accepts LangChain's bounded evaluation role; this language decision does not accept LangGraph or LangSmith.

This evaluation decision does not qualify TypeScript or its toolchain as a release dependency. Any future release architecture requires a separate decision based on the distribution and support scope then accepted.

## Consequences

- UI, service, browser-analysis, and contract code can share one language and compatible tooling while preserving explicit module boundaries.
- Static checking can catch incompatible contract changes before execution, but URL input and the four external/persisted-data boundaries still require runtime validation because erased types are not a security or data-integrity boundary.
- Some operating-system integrations may require a native module, helper process, or separately owned service whose security and lifecycle must be evaluated.
- ADR-0019 keeps the fixed corpus vectors as disposable in-process LangChain values, while ADR-0021 keeps the single canonical run aggregate application-owned. Neither framework type enters `run.json`.
- Replacing TypeScript later would affect application-owned implementation code but must not change record-version meaning, stored evidence meaning, or provider-neutral behavior.

## Primary references

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro)
- [TypeScript runtime behavior and erased types](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch)
- [Playwright TypeScript support](https://playwright.dev/docs/test-typescript)
- [LangChain JavaScript MemoryVectorStore](https://docs.langchain.com/oss/javascript/integrations/vectorstores/memory)

## Related decisions and requirements

- [ADR-0001: Interchangeable generation providers](ADR-0001-interchangeable-generation-providers.md)
- [ADR-0019: In-process exact vector search](ADR-0019-in-process-exact-vector-search.md)
- [ADR-0008: Playwright as the initial browser automation technology](ADR-0008-playwright-as-initial-browser-automation.md)
- [ADR-0012: React as the initial user-interface library](ADR-0012-react-as-initial-user-interface-library.md)
- [ADR-0013: LangChain as the initial RAG integration baseline](ADR-0013-langchain-as-initial-rag-integration.md)
- [ADR-0014: Groq as the MVP external generation provider](ADR-0014-groq-as-mvp-external-generation-provider.md)
- [ADR-0015: Localhost browser MVP execution](ADR-0015-localhost-browser-mvp-execution.md)
- [ADR-0021: Single-file run aggregate](ADR-0021-single-file-run-aggregate.md)
- [Evidence and review workflow requirements](../../requirements/EVIDENCE_AND_REVIEW_WORKFLOW.md): `REQ-SCAN-*`
- [Generation provider execution requirements](../../requirements/generation-provider-and-model-lifecycle/GENERATION_PROVIDER_EXECUTION.md): `REQ-LLM-*`
- [Installation and model lifecycle requirements](../../requirements/generation-provider-and-model-lifecycle/INSTALLATION_AND_MODEL_LIFECYCLE.md): `REQ-INST-*`
- [Privacy and security requirements](../../requirements/quality-security-and-operations/PRIVACY_AND_SECURITY.md): `REQ-SEC-*`
- [Reliability, reproducibility, and operations requirements](../../requirements/quality-security-and-operations/RELIABILITY_REPRODUCIBILITY_AND_OPERATIONS.md): `REQ-QUAL-*`
