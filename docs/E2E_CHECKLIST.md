# E2E manual checklist (10 minutes)

- [ ] `backend`: `pytest -q` → 12+ passing
- [ ] `backend`: `uvicorn app.main:app` → `/docs` loads, `/api/v1/health` returns `demo_mode`
- [ ] `frontend`: `npm install && npm run build` succeeds with no warnings
- [ ] Home: hero renders, demo button works with no backend running
- [ ] Upload: drag-drop + browse + Enter/Esc keyboard paths
- [ ] Validation: `.txt` upload shows inline error (no `alert`)
- [ ] Analysis: stepper advances, skeletons show, result appears
- [ ] Report: severity badge, confidence ring, copy/share/print, 1–5 star rating
- [ ] Library: 6+ cards render offline even if API is down
- [ ] History: analyze → history tab shows entry → restore → export → clear
- [ ] Dark mode: toggle persists after reload, no white flash
- [ ] Mobile 360px: no horizontal scroll, 44px targets, readable type
- [ ] `prefers-reduced-motion`: animations collapse to instant
