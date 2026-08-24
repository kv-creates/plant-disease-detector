from fastapi import APIRouter, File, UploadFile, HTTPException, Depends, Form
from fastapi.responses import JSONResponse
import magic

from app.core.config import settings
from app.models.schemas import (
    DiseaseDetectionRequest,
    DiseaseDetectionResponse,
    HealthCheckResponse,
    LLMProvider,
    DiseaseSeverity,
)
from app.services.llm_vision import llm_vision_service

router = APIRouter(prefix="/api/v1", tags=["disease-detection"])


def validate_image_file(file: UploadFile) -> bytes:
    if file.size and file.size > settings.max_file_size:
        raise HTTPException(
            status_code=413,
            detail=f"File size exceeds maximum allowed size of {settings.max_file_size} bytes",
        )

    extension = file.filename.split(".")[-1].lower() if file.filename else ""
    if extension not in settings.allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"File type not allowed. Allowed types: {', '.join(settings.allowed_extensions)}",
        )

    content = file.file.read()
    file.file.seek(0)

    mime = magic.Magic(mime=True)
    mime_type = mime.from_buffer(content)
    allowed_mimes = ["image/jpeg", "image/png", "image/webp"]
    if mime_type not in allowed_mimes:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type detected: {mime_type}",
        )

    return content


@router.post("/detect", response_model=DiseaseDetectionResponse)
async def detect_disease(
    file: UploadFile = File(...),
    provider: LLMProvider = Form(default=LLMProvider.openai),
    include_treatment: bool = Form(default=True),
    include_prevention: bool = Form(default=True),
):
    image_bytes = validate_image_file(file)

    request = DiseaseDetectionRequest(
        provider=provider,
        include_treatment=include_treatment,
        include_prevention=include_prevention,
    )

    result = await llm_vision_service.detect_disease(image_bytes, request)
    return result


@router.get("/health", response_model=HealthCheckResponse)
async def health_check():
    return HealthCheckResponse(
        status="healthy",
        version="1.0.0",
        providers_available=llm_vision_service.get_available_providers(),
    )


@router.get("/providers")
async def get_providers():
    return {"providers": llm_vision_service.get_available_providers()}