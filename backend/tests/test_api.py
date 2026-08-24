import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["name"] == "Plant Disease Detector"


def test_health_check():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "providers_available" in data


def test_get_providers():
    response = client.get("/api/v1/providers")
    assert response.status_code == 200
    assert "providers" in response.json()


def test_detect_invalid_file():
    response = client.post(
        "/api/v1/detect",
        files={"file": ("test.txt", b"not an image", "text/plain")},
    )
    assert response.status_code == 400