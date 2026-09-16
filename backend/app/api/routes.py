from fastapi import APIRouter, File, UploadFile, HTTPException, Form
import logging
import time
import uuid

from app.core.config import settings
from app.models.schemas import (
    DiseaseDetectionRequest,
    DiseaseDetectionResponse,
    HealthCheckResponse,
    LLMProvider,
)
from app.services.image import sniff_mime
from app.services.llm_vision import llm_vision_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1", tags=["disease-detection"])

# Simple in-memory rate limiter (per-process). For multi-replica prod, use Redis.
_request_timestamps: list[float] = []


def _check_rate_limit() -> None:
    now = time.time()
    window = 60.0
    while _request_timestamps and _request_timestamps[0] < now - window:
        _request_timestamps.pop(0)
    if len(_request_timestamps) >= settings.rate_limit_per_minute:
        raise HTTPException(status_code=429, detail="Rate limit exceeded. Try again in a minute.")
    _request_timestamps.append(now)


def validate_image_upload(file: UploadFile, content: bytes) -> None:
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided.")
    if len(content) == 0:
        raise HTTPException(status_code=400, detail="Empty file uploaded.")
    if len(content) > settings.max_file_size:
        raise HTTPException(
            status_code=413,
            detail=f"File too large ({len(content)} bytes). Max is {settings.max_file_size_mb}MB.",
        )
    extension = file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else ""
    if extension not in settings.allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"File type .{extension or '?'} not allowed. Use: {', '.join(settings.allowed_extensions)}",
        )
    # Prefer Pillow verification downstream; do a cheap MIME sniff here.
    # Try libmagic if available, otherwise fall back to header sniffing so
    # Windows dev machines without libmagic still work.
    mime_type: str | None = None
    try:
        import magic  # type: ignore

        mime_type = magic.Magic(mime=True).from_buffer(content[:4096])
    except Exception:  # noqa: BLE001
        mime_type = sniff_mime(content)
    allowed_mimes = {"image/jpeg", "image/png", "image/webp"}
    if mime_type not in allowed_mimes:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid image content detected ({mime_type}). Upload JPEG, PNG, or WebP.",
        )


@router.post("/detect", response_model=DiseaseDetectionResponse)
async def detect_disease(
    file: UploadFile = File(...),
    provider: LLMProvider = Form(default=LLMProvider.openai),
    include_treatment: bool = Form(default=True),
    include_prevention: bool = Form(default=True),
):
    _check_rate_limit()
    content = await file.read()
    validate_image_upload(file, content)

    request = DiseaseDetectionRequest(
        provider=provider,
        include_treatment=include_treatment,
        include_prevention=include_prevention,
    )
    result = await llm_vision_service.detect_disease(content, request)
    if result.success and not result.detection_id:
        result.detection_id = f"det_{uuid.uuid4().hex[:12]}"
    if not result.success:
        logger.warning("detection failed provider=%s err=%s", provider, result.error)
    return result


@router.get("/health", response_model=HealthCheckResponse)
async def health_check():
    return HealthCheckResponse(
        status="healthy",
        version=settings.app_version,
        providers_available=llm_vision_service.get_available_providers(),
        demo_mode=llm_vision_service.is_demo_mode(),
    )


@router.get("/providers")
async def get_providers():
    providers = llm_vision_service.get_available_providers()
    return {
        "providers": providers,
        "demo_available": True,
        "demo_mode": len(providers) == 0,
        "default": settings.default_llm_provider,
    }


@router.get("/version")
async def get_version():
    return {"name": settings.app_name, "version": settings.app_version}
