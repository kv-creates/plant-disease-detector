"""Secondary endpoints: disease library and feedback loop stub."""

from __future__ import annotations

import logging

from fastapi import APIRouter

from app.models.schemas import FeedbackRequest, FeedbackResponse
from app.services.library import get_library
from app.services.feedback_store import append_feedback

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1", tags=["library-feedback"])


@router.get("/diseases")
async def list_diseases():
    return {"count": len(get_library()), "diseases": [d.model_dump() for d in get_library()]}


@router.post("/feedback", response_model=FeedbackResponse)
async def submit_feedback(payload: FeedbackRequest):
    logger.info(
        "feedback rating=%s detection=%s provider=%s comment_len=%s",
        payload.rating, payload.detection_id, payload.provider,
        len(payload.comment or ""),
    )
    append_feedback(payload.model_dump())
    return FeedbackResponse(success=True, message="Thanks — feedback recorded for review.")
