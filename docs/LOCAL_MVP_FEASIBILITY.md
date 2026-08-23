# Local MVP feasibility

## Status

These are candidate tools for the future MVP, not final technology decisions or implemented behavior.

Assessment date: 2026-08-23. This is a preliminary assessment based on published model artifacts and a hardware snapshot; representative benchmarks are required once development begins.

## Local feasibility

The current computer is expected to have enough capacity to run the complete A11y Evidence Lab MVP locally.

Hardware and available-storage snapshot used for this assessment:

- **32 GB of RAM**
- **Intel Core Ultra 7 255HX** with 20 cores
- **NVIDIA RTX 5060 Laptop GPU with 8 GB of VRAM**
- Approximately **513 GB of free disk space**

Ollama supports NVIDIA GPU acceleration on Windows, so the RTX GPU can help with both embeddings and text generation. See the [Ollama documentation for Windows](https://ollama.com/blog/windows-preview).

| Component | Candidate model or tool | Feasibility |
| --- | --- | --- |
| Embeddings | `embeddinggemma` | Easily viable. The published Ollama artifact is approximately 622 MB, and the model has 300 million parameters. See the [model page](https://ollama.com/library/embeddinggemma). |
| Vector database | Chroma | Easily viable; resource usage should be small for the initial corpus. |
| Initial generative model | `qwen3:4b` | Easily viable; the published Ollama artifact is approximately 2.5 GB. |
| Higher-quality generative model | `qwen3:8b` | Viable and recommended as the main candidate; the published Ollama artifact is approximately 5.2 GB. It should perform well with a moderate context size. |
| Optional local reranker | Small reranking model | Viable, but unnecessary for the first version. |
| Browser scanning | Playwright and axe-core | Easily viable. |

The published Qwen3 artifact sizes support this recommendation: the 4B model is approximately 2.5 GB, while the 8B model is approximately 5.2 GB. See the [Qwen3 models on Ollama](https://ollama.com/library/qwen3).

Large models such as Qwen3 30B or 32B should not be expected to run efficiently on this computer. Their published artifacts occupy approximately 19–20 GB before accounting for runtime memory, and good performance would require substantially more VRAM. A 14B model might run by using system RAM in addition to VRAM, but it would be considerably slower and is unlikely to add enough value for the MVP.

## Initial recommendation

No additional hardware is expected to be required for the initial MVP. Start with `embeddinggemma`, then evaluate `qwen3:4b` against `qwen3:8b`. The proposed RAG workflow, LangChain, LangGraph, Chroma, and Playwright-based analysis are expected to fit within the computer's current capacity, subject to benchmark validation.

## Documentation navigation

- Previous: [Project concept](PROJECT_CONCEPT.md)
- [Documentation index](README.md)
