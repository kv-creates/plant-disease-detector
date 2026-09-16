# Architecture

```mermaid
flowchart LR
  U[React + Vite + Tailwind] -->|multipart image <=10MB| V[FastAPI validation]
  V -->|Pillow verify + normalize| R{LLM keys?}
  R -- Yes --> O[GPT-4o / Claude 3.5 + retry + safe JSON]
  R -- No --> D[Demo engine: sha256 pick + library]
  O --> J[Structured DiseaseInfo]
  D --> J
  J --> U
  U --> H[(localStorage history)]
```

## Key decisions

- Pillow is source of truth for images; `python-magic` optional (Windows-safe).
- Demo mode is deterministic and labeled — never mistaken for live vision.
- Rate limit is in-process (60/min); use Redis/ingress for multi-replica prod.
- Frontend degrades gracefully: API down → demo diagnosis + toast.
- History never leaves the browser; feedback endpoint is a stub for review.
