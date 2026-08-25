# ADR-0014: Groq as the MVP external generation provider

- **Status:** Groq provider and explicit dual-mode boundary Accepted for the MVP; exact model configuration Accepted for evaluation
- **Decision date:** 2026-08-25

## Context

The MVP must demonstrate the same evidence-grounded generation contract through a local model and one deliberately selected external API. Adding multiple hosted providers, a provider registry, or provider-comparison infrastructure would not advance that portfolio goal. The external path must also preserve the product's synthetic-only data boundary and must never become an undeclared fallback from local execution.

Groq documents an API that is mostly compatible with OpenAI client libraries, but Groq remains the API provider and has its own endpoint, credential, data-handling, availability, and rate-limit conditions. Groq currently documents strict JSON Schema output for `openai/gpt-oss-20b`, which makes that exact model a focused candidate for the application's structured proposal contract. The `openai/` model namespace identifies the model family; it does not make an invocation of Groq's endpoint an OpenAI API request.

## Considered options

1. Keep external generation outside the MVP.
2. Add several hosted providers and compare them.
3. Add one fixed Groq adapter and one exact Groq evaluation model alongside the local adapter.

## Decision

Use Groq as the first and only external generation provider in the MVP. This provider, explicit per-run dual-mode choice, shared contract, egress boundary, and no-fallback policy are Accepted MVP architecture. The exact model configuration below is Accepted only for the fixed evaluation and is not release-qualified.

- The user makes an explicit choice for each generation run between the selected local adapter and the Groq adapter. There is no automatic fallback in either direction. A failed local run must never send data to Groq without a new explicit choice.
- Both adapters accept the same eligible application-owned input and must return the same normalized candidate-proposal result for application validation. The application generation stage owns its `proposal` or deterministic `abstention` branch; an evidence-sufficiency abstention invokes neither adapter. Provider objects do not become canonical evidence, review, or comparison records.
- Target Groq's documented `https://api.groq.com/openai/v1` API base through the fixed Groq adapter. Do not expose an arbitrary compatible-base-URL setting in the MVP.
- Use Groq model ID `openai/gpt-oss-20b` with strict Structured Outputs (`strict: true`) for the fixed MVP API evaluation. The schema must satisfy Groq's documented strict-mode constraints and the application must still validate the returned value at runtime.
- This exact model is an evaluation configuration, not a release-qualified dependency or a permanent availability promise. Check Groq's current model catalog, structured-output support, deprecation notices, and account limits before an evaluation run; changing the model requires a recorded decision.
- Send only the minimized synthetic finding evidence and the required curated guidance passages. Do not send raw or full HTML, screenshots, credentials, form values, private URLs, hidden page data, repository contents, or unrelated history.
- Keep the Groq API key in the local application service, loaded from an ignored local `.env` file or an equivalent local secret source. Never place it in browser-delivered code, tracked documentation, Git, logs, exports, or persisted run records.
- Record non-secret provenance: Groq as provider, adapter version, exact model ID, endpoint identity without credentials, generation parameters, request time, and usage or limit metadata returned by the service. Do not record the key or a reconstructable secret.
- Do not add Gemini, another hosted provider, arbitrary compatible endpoints, a provider registry, provider ranking, a leaderboard, or an automatic provider-selection policy to the MVP.

Groq's published free-plan row for `openai/gpt-oss-20b` showed 30 requests per minute, 1,000 requests per day, 8,000 tokens per minute, and 200,000 tokens per day on 2026-08-25. These are dated planning observations, not an entitlement or capacity guarantee: Groq states that the account limits page is authoritative and that exceptions may apply.

## Consequences

- The portfolio can demonstrate one local and one API-backed execution of the same bounded LangChain generation step without building multi-provider infrastructure.
- API mode intentionally introduces network availability, egress, credential, provider-retention, cost, model-lifecycle, and rate-limit constraints. The UI and run result must make the selected mode and any provider failure explicit.
- As documented on 2026-08-25, Groq says usage metadata is always retained and inference customer data is not retained by default, while inputs and outputs may still be temporarily logged for reliability and abuse investigations for up to 30 days unless Zero Data Retention is enabled. These provider-controlled conditions can change; synthetic minimization remains required regardless of them.
- OpenAI-compatible request syntax does not make Groq interchangeable by assumption. The one fixed adapter must be verified against the application contract.

## Primary references

- [Groq OpenAI compatibility](https://console.groq.com/docs/openai)
- [Groq Structured Outputs](https://console.groq.com/docs/structured-outputs)
- [Groq `openai/gpt-oss-20b` model page](https://console.groq.com/docs/model/openai/gpt-oss-20b)
- [Groq model catalog](https://console.groq.com/docs/models)
- [Groq model deprecations](https://console.groq.com/docs/deprecations)
- [Groq rate limits](https://console.groq.com/docs/rate-limits)
- [Groq security onboarding](https://console.groq.com/docs/production-readiness/security-onboarding)
- [Groq data handling](https://console.groq.com/docs/your-data)

## Related decisions and requirements

- [ADR-0001: Interchangeable generation providers](ADR-0001-interchangeable-generation-providers.md)
- [ADR-0013: LangChain as the initial RAG integration baseline](ADR-0013-langchain-as-initial-rag-integration.md)
- [ADR-0015: Localhost browser MVP execution](ADR-0015-localhost-browser-mvp-execution.md)
- [Generation provider execution requirements](../../requirements/generation-provider-and-model-lifecycle/GENERATION_PROVIDER_EXECUTION.md): `REQ-LLM-*`
- [Privacy and security requirements](../../requirements/quality-security-and-operations/PRIVACY_AND_SECURITY.md): `REQ-SEC-*`
- [Evaluation and acceptance requirements](../../requirements/evaluation-and-release/EVALUATION_AND_ACCEPTANCE.md): `REQ-EVAL-*`
