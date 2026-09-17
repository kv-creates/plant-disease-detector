# Performance budget

- Frontend build <900KB initial (see `vite.config.js` warning limit).
- Images normalized to <=1568px JPEG q88 server-side.
- Demo path p95 <1.2s (900ms staged + render).
- API `X-Process-Time-ms` header on every response; aim p95 <400ms demo.
- Skeletons + lazy images keep CLS low; test with Lighthouse mobile.
