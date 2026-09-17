from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_request_id_header_present():
    r = client.get("/")
    assert r.headers.get("X-Request-ID", "").startswith("req_")

def test_library_cache_header():
    r = client.get("/api/v1/diseases")
    assert r.status_code == 200
    assert "max-age=3600" in r.headers.get("Cache-Control", "")

def test_feedback_persists_and_returns():
    r = client.post("/api/v1/feedback", json={"rating": 4, "comment": "fast test"})
    assert r.status_code == 200
    assert r.json()["success"] is True
