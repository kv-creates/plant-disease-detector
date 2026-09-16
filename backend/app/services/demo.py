"""Offline demo engine — deterministic, dependency-free diagnosis.

Used when no LLM keys are configured (classrooms, offline demos, CI).
Clearly labeled as `demo` so UI can badge it and users are never misled.
"""

from __future__ import annotations

import hashlib

from app.models.schemas import (
    DiseaseDetectionRequest,
    DiseaseInfo,
    DiseaseSeverity,
)

_DEMO_DISEASES: list[dict] = [
    {
        "name": "Early Blight (Demo)",
        "scientific_name": "Alternaria solani",
        "description": (
            "Demo diagnosis: concentric brown rings typical of early blight. "
            "Enable an AI provider for a real vision analysis."
        ),
        "severity": DiseaseSeverity.moderate,
        "confidence": 0.78,
        "affected_area": "Lower leaves, progressing upward",
        "symptoms": [
            "Dark brown spots with concentric rings",
            "Yellowing halo around lesions",
            "Premature leaf drop in lower canopy",
        ],
        "treatment": (
            "Demo guidance only — remove affected leaves, improve air flow, "
            "avoid overhead watering, and consult your local extension officer "
            "before applying any fungicide."
        ),
        "prevention": (
            "Rotate crops, mulch to prevent soil splash, space plants for airflow, "
            "and sanitize tools between rows."
        ),
    },
    {
        "name": "Powdery Mildew (Demo)",
        "scientific_name": "Podosphaera xanthii",
        "description": (
            "Demo diagnosis: white powdery coating typical of powdery mildew. "
            "Enable an AI provider for a real vision analysis."
        ),
        "severity": DiseaseSeverity.mild,
        "confidence": 0.71,
        "affected_area": "Upper leaf surfaces and young shoots",
        "symptoms": [
            "White powdery patches on upper leaves",
            "Leaf curling at margins",
            "Stunted young growth",
        ],
        "treatment": (
            "Demo guidance only — prune affected growth, improve sunlight and "
            "airflow, and seek local advice before spraying."
        ),
        "prevention": (
            "Choose resistant varieties, avoid excess nitrogen, water at soil "
            "level, and monitor weekly."
        ),
    },
    {
        "name": "Healthy Leaf (Demo)",
        "scientific_name": None,
        "description": (
            "Demo diagnosis: no clear disease signatures detected. Leaf looks "
            "healthy in this offline sample."
        ),
        "severity": DiseaseSeverity.mild,
        "confidence": 0.66,
        "affected_area": "No significant affected area observed",
        "symptoms": ["Uniform green color", "No spots or wilting observed"],
        "treatment": "No treatment needed. Continue regular monitoring.",
        "prevention": (
            "Keep monitoring weekly, water at base, and maintain spacing."
        ),
    },
]


def pick_demo_disease(image_bytes: bytes) -> dict:
    digest = hashlib.sha256(image_bytes).hexdigest()
    idx = int(digest[:8], 16) % len(_DEMO_DISEASES)
    return _DEMO_DISEASES[idx]


def build_demo_disease(
    image_bytes: bytes, request: DiseaseDetectionRequest
) -> DiseaseInfo:
    base = pick_demo_disease(image_bytes)
    return DiseaseInfo(
        name=base["name"],
        scientific_name=base["scientific_name"],
        description=base["description"],
        severity=base["severity"],
        confidence=base["confidence"],
        affected_area=base["affected_area"],
        symptoms=list(base["symptoms"]),
        treatment=base["treatment"] if request.include_treatment else None,
        prevention=base["prevention"] if request.include_prevention else None,
    )
