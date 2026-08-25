# Agent instructions

## Language

Everything in this repository must be written in English. This includes documentation, filenames, source code, tests, comments, identifiers, commit messages, logs, and user-facing text.

## Repository stage

This repository is in the idea-exploration stage. During this stage, limit changes to research and documentation that clarify the product scope, requirements, architecture options, risks, assumptions, or decisions.

Do not add code, tests, dependencies, scripts, workflows, fixtures, infrastructure, or implementation scaffolding unless the user explicitly decides to begin development.

Treat all described product behavior and technology choices as proposals unless a document explicitly records them as decisions. If development is authorized, update the project status and these instructions before adding implementation files.

## Required context and task routing

Before making changes:

- Inspect Git status and preserve unrelated user changes.
- Read `docs/README.md` as the authority map and task router.
- Read each target document completely and load only the requirements modules, architecture records, feasibility evidence, or product-context documents that the task route identifies as applicable.
- Read `docs/PROJECT_REQUIREMENTS.md` when changing the main goal, shared requirement semantics, requirement status, traceability, module ownership, development authorization, or a decision that affects multiple modules.
- Read `docs/PROJECT_CONCEPT.md` and `docs/PROJECT_CONTEXT.md` when changing product purpose, direction, workflow, boundaries, users, or public positioning.
- Read `docs/architecture/README.md`, `docs/architecture/CANDIDATE_ARCHITECTURE.md`, and the applicable records in `docs/architecture/decisions/` when evaluating or changing architecture. Read a candidate assessment only when its evidence is relevant to the task.
- Read `docs/LOCAL_MVP_FEASIBILITY.md` and the applicable requirement and decision records when evaluating tools, models, runtimes, packaging, hardware, or local capacity.

Do not load every requirements module by default. Follow the task router, then follow direct links to the authorities affected by the change.

## Documentation rules

- Keep the repository minimal. Update the existing document or module whose declared responsibility owns the information; create another document only for a distinct responsibility that cannot remain coherent in an existing authority.
- Clearly distinguish ideas, decisions, assumptions, and implemented behavior.
- Keep architecture documentation under `docs/architecture/` and index it from `docs/architecture/README.md`.
- Record accepted significant architectural decisions in `docs/architecture/decisions/` and link each record from its `README.md`; keep speculative alternatives in explicitly Proposed candidate documents.
- Do not present the future product as an accessibility certification tool.
- After moving or renaming documents, update affected indexes and references and verify that relative links resolve.

## Public content

- Keep tracked documentation professional and project-focused.
- Do not copy private or ignored working material into tracked files unless explicitly requested.
- Do not include credentials, private data, proprietary material, or personal conversation history.
- Verify time-sensitive technical claims against primary sources and include direct links.

## Git operations

- Do not commit, publish, or push changes without explicit user authorization.
