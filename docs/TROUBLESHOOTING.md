# Troubleshooting

## Backend won't start
- Use Python 3.10–3.12, `pip install -r backend/requirements.txt`.
- Port busy? `uvicorn app.main:app --port 8001`.

## 400 on upload
- Use JPG/PNG/WebP <=10MB. BMP/GIF/TIFF rejected with clear message.

## 429 rate limit
- Default 60/min per process. Wait a minute or raise `RATE_LIMIT_PER_MINUTE`.

## Frontend shows demo only
- Normal without keys. Add `OPENAI_API_KEY` in `backend/.env` for live vision.
