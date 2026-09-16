# API examples

## Health

```bash
curl http://localhost:8000/api/v1/health
```

```json
{ "status": "healthy", "version": "2.0.0", "providers_available": [], "demo_mode": true }
```

## Detect (demo, no keys)

```bash
curl -X POST http://localhost:8000/api/v1/detect \
  -F "file=@leaf.jpg;type=image/jpeg" \
  -F "provider=openai" -F "include_treatment=true" -F "include_prevention=true"
```

Success returns `success:true`, `disease:{...}`, `demo:true`, `detection_id`.

## Errors

| Status | Cause | Fix |
|---|---|---|
| 400 | bad extension/MIME | use jpg/jpeg/png/webp |
| 413 | >10MB | compress image |
| 429 | >60 req/min | wait a minute |
| 422 | bad feedback rating | rating 1–5 |
```

## Library & feedback

```bash
curl http://localhost:8000/api/v1/diseases
curl -X POST http://localhost:8000/api/v1/feedback \
  -H "Content-Type: application/json" -d '{"rating":5,"comment":"great demo"}'
```
