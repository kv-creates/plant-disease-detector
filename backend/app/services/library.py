"""Curated disease library — static, offline-friendly reference data."""

from __future__ import annotations

from app.models.schemas import DiseaseLibraryItem, DiseaseSeverity

LIBRARY: list[DiseaseLibraryItem] = [
    DiseaseLibraryItem(
        id="early-blight",
        name="Early Blight",
        scientific_name="Alternaria solani",
        severity_hint=DiseaseSeverity.moderate,
        symptoms=["Concentric brown rings", "Yellow halo", "Lower-leaf drop"],
        prevention="Rotate crops, mulch, water at base, sanitize tools.",
        treatment_hint="Remove affected leaves, improve airflow, consult extension officer.",
    ),
    DiseaseLibraryItem(
        id="late-blight",
        name="Late Blight",
        scientific_name="Phytophthora infestans",
        severity_hint=DiseaseSeverity.severe,
        symptoms=["Water-soaked lesions", "White mold underside", "Rapid collapse"],
        prevention="Certified seed, spacing, avoid wet foliage overnight.",
        treatment_hint="Urgent: isolate plants and seek expert diagnosis.",
    ),
    DiseaseLibraryItem(
        id="powdery-mildew",
        name="Powdery Mildew",
        scientific_name="Podosphaera xanthii",
        severity_hint=DiseaseSeverity.mild,
        symptoms=["White powder patches", "Leaf curl", "Stunted shoots"],
        prevention="Resistant varieties, sun + airflow, base watering.",
        treatment_hint="Prune lightly, improve light, monitor weekly.",
    ),
    DiseaseLibraryItem(
        id="leaf-spot",
        name="Leaf Spot",
        scientific_name="Cercospora spp.",
        severity_hint=DiseaseSeverity.moderate,
        symptoms=["Circular brown spots", "Gray centers", "Shot-hole tearing"],
        prevention="Clean debris, drip irrigation, balanced nutrition.",
        treatment_hint="Remove spots early, avoid overhead watering.",
    ),
    DiseaseLibraryItem(
        id="rust",
        name="Rust",
        scientific_name="Puccinia spp.",
        severity_hint=DiseaseSeverity.moderate,
        symptoms=["Orange pustules underside", "Yellow flecks above", "Premature drop"],
        prevention="Resistant seed, morning watering, weed control.",
        treatment_hint="Remove heavily infected leaves, consult local advice.",
    ),
    DiseaseLibraryItem(
        id="mosaic-virus",
        name="Mosaic Virus",
        scientific_name="Mosaic virus complex",
        severity_hint=DiseaseSeverity.severe,
        symptoms=["Mottled light/dark mosaic", "Distorted growth", "Stunting"],
        prevention="Control aphids/whiteflies, disinfect tools, clean seed.",
        treatment_hint="No cure — rogue infected plants, control vectors.",
    ),
    DiseaseLibraryItem(
        id="bacterial-spot",
        name="Bacterial Spot",
        scientific_name="Xanthomonas spp.",
        severity_hint=DiseaseSeverity.moderate,
        symptoms=["Small water-soaked spots", "Halo lesions", "Fruit spotting"],
        prevention="Pathogen-free seed, drip lines, crop rotation.",
        treatment_hint="Copper guidance only via extension officer.",
    ),
    DiseaseLibraryItem(
        id="healthy",
        name="Healthy Leaf",
        scientific_name=None,
        severity_hint=DiseaseSeverity.mild,
        symptoms=["Uniform green", "Firm texture", "No lesions"],
        prevention="Weekly scouting, base watering, balanced feeding.",
        treatment_hint="No treatment — keep monitoring.",
    ),
]


def get_library() -> list[DiseaseLibraryItem]:
    return list(LIBRARY)
