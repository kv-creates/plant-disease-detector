import io

from fastapi.testclient import TestClient
from PIL import Image

from app.main import app

client = TestClient(app)


def _leaf_bytes(fmt: str = "JPEG", size=(320, 240), color=(74, 160, 90)) -> bytes:
    buf = io.BytesIO()
    Image.new("RGB", size, color).save(buf, format=fmt)
    return buf.getvalue()


def test_root():
    r = client.get("/")
    assert r.status_code == 200
    body = r.json()
    assert body["name"] == "Plant Disease Detector"
    assert "health" in body


def test_health_check():
    r = client.get("/api/v1/health")
    assert r.status_code == 200
    data = r.json()
    assert data["status"] == "healthy"
    assert "providers_available" in data
    assert "demo_mode" in data


def test_get_providers():
    r = client.get("/api/v1/providers")
    assert r.status_code == 200
    body = r.json()
    assert "providers" in body
    assert body["demo_available"] is True


def test_version():
    r = client.get("/api/v1/version")
    assert r.status_code == 200
    assert r.json()["version"]


def test_diseases_library():
    r = client.get("/api/v1/diseases")
    assert r.status_code == 200
    body = r.json()
    assert body["count"] >= 8
    names = [d["name"] for d in body["diseases"]]
    assert "Early Blight" in names


def test_feedback_accepts_valid():
    r = client.post("/api/v1/feedback", json={"rating": 5, "comment": "Great demo"})
    assert r.status_code == 200
    assert r.json()["success"] is True


def test_feedback_rejects_bad_rating():
    r = client.post("/api/v1/feedback", json={"rating": 9})
    assert r.status_code == 422


def test_detect_invalid_file():
    r = client.post(
        "/api/v1/detect",
        files={"file": ("test.txt", b"not an image", "text/plain")},
    )
    assert r.status_code == 400


def test_detect_empty_file():
    r = client.post(
        "/api/v1/detect",
        files={"file": ("empty.jpg", b"", "image/jpeg")},
    )
    assert r.status_code in (400, 413)


def test_detect_demo_mode_returns_labeled_result():
    img = _leaf_bytes()
    r = client.post(
        "/api/v1/detect",
        files={"file": ("leaf.jpg", img, "image/jpeg")},
        data={"provider": "openai", "include_treatment": "true", "include_prevention": "true"},
    )
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["success"] is True
    assert body["disease"]["name"]
    assert body["disease"]["confidence"] >= 0
    assert "detection_id" in body
    # Without keys we must be in demo mode.
    assert body.get("demo") is True


def test_detect_rejects_oversize_extension():
    r = client.post(
        "/api/v1/detect",
        files={"file": ("leaf.bmp", _leaf_bytes(), "image/bmp")},
    )
    assert r.status_code == 400


def test_security_headers_present():
    r = client.get("/")
    assert r.headers.get("X-Content-Type-Options") == "nosniff"
    assert r.headers.get("X-Frame-Options") == "DENY"
