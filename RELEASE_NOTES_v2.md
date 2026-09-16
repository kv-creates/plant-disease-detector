# v2.0.0 — Perfect release

33 improvement commits. Production-ready, farmer-first, demo-offline.

## What shipped

- **Backend:** demo engine, GPT-4o + Claude 3.5, Pillow pipeline, rate limits,
  security headers, library + feedback APIs, 12 pytest tests, Docker.
- **Frontend:** glass header, hero, stepper, confidence-ring reports,
  history, samples, toasts, dark mode, EN/HI/MR, print/share/copy.
- **Docs/ops:** README v2, architecture, E2E, demo script, CI, community files.

## Verify

```bash
cd backend && pytest -q        # 12 passed
cd ../frontend && npm run build # clean build
```

## Run

```bash
cd backend && uvicorn app.main:app --reload --port 8000
cd frontend && npm install && npm run dev
```

No keys needed — demo mode works offline.
