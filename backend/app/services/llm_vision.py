"""LLM vision orchestration with safe parsing, retries, and demo fallback."""

from __future__ import annotations

import asyncio
import base64
import json
import logging
import re
import time

from app.core.config import settings
from app.models.schemas import (
    DiseaseDetectionRequest,
    DiseaseDetectionResponse,
    DiseaseInfo,
    DiseaseSeverity,
    LLMProvider,
)
from app.services.demo import build_demo_disease
from app.services.image import verify_and_normalize

logger = logging.getLogger(__name__)

OPENAI_MODEL = "gpt-4o"
ANTHROPIC_MODEL = "claude-3-5-sonnet-20241022"
REQUEST_TIMEOUT_S = 45.0
MAX_TOKENS = 1200


def _extract_json(text: str) -> dict:
    """Extract the first JSON object from model output, tolerating fences."""
    if not text or not text.strip():
        raise ValueError("Empty model response.")
    cleaned = text.strip()
    # Strip markdown fences like ```json ... ```
    cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"\s*```$", "", cleaned)
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        pass
    # Fall back to first {...} span.
    start = cleaned.find("{")
    end = cleaned.rfind("}")
    if start != -1 and end != -1 and end > start:
        return json.loads(cleaned[start : end + 1])
    raise ValueError("Model response was not valid JSON.")


def _coerce_disease(data: dict, request: DiseaseDetectionRequest) -> DiseaseInfo:
    severity_raw = str(data.get("severity", "moderate")).lower()
    if severity_raw not in ("mild", "moderate", "severe"):
        severity_raw = "moderate"
    try:
        confidence = float(data.get("confidence", 0.7))
    except (TypeError, ValueError):
        confidence = 0.7
    confidence = min(1.0, max(0.0, confidence))
    symptoms = data.get("symptoms") or ["Visual anomaly observed"]
    if isinstance(symptoms, str):
        symptoms = [symptoms]
    return DiseaseInfo(
        name=str(data.get("name") or "Unidentified condition"),
        scientific_name=data.get("scientific_name"),
        description=str(data.get("description") or "No description returned."),
        severity=DiseaseSeverity(severity_raw),
        confidence=confidence,
        affected_area=str(data.get("affected_area") or "Unspecified"),
        symptoms=[str(s) for s in symptoms][:12],
        treatment=data.get("treatment") if request.include_treatment else None,
        prevention=data.get("prevention") if request.include_prevention else None,
    )


class LLMVisionService:
    def __init__(self) -> None:
        self.openai_client = None
        self.anthropic_client = None
        self._init_clients()

    def _init_clients(self) -> None:
        if settings.openai_api_key:
            try:
                from openai import AsyncOpenAI

                self.openai_client = AsyncOpenAI(
                    api_key=settings.openai_api_key, timeout=REQUEST_TIMEOUT_S
                )
            except Exception as exc:  # noqa: BLE001
                logger.warning("OpenAI client init failed: %s", exc)
        if settings.anthropic_api_key:
            try:
                from anthropic import AsyncAnthropic

                self.anthropic_client = AsyncAnthropic(
                    api_key=settings.anthropic_api_key, timeout=REQUEST_TIMEOUT_S
                )
            except Exception as exc:  # noqa: BLE001
                logger.warning("Anthropic client init failed: %s", exc)

    def refresh_clients(self) -> None:
        self._init_clients()

    def _get_system_prompt(self, request: DiseaseDetectionRequest) -> str:
        prompt = (
            "You are an expert plant pathologist. Analyze the uploaded leaf image "
            "and identify any plant disease. Be conservative: if unsure, lower "
            "confidence and say so.\n"
            "Return: 1) disease common + scientific name, 2) description, "
            "3) severity (mild|moderate|severe), 4) confidence 0-1, "
            "5) affected area, 6) visible symptoms list"
        )
        if request.include_treatment:
            prompt += ", 7) practical treatment steps (non-prescriptive, advise local expert)"
        if request.include_prevention:
            prompt += ", 8) prevention measures"
        prompt += (
            "\nRespond with ONLY a JSON object:\n"
            '{"name": "string", "scientific_name": "string or null", '
            '"description": "string", "severity": "mild|moderate|severe", '
            '"confidence": 0.0-1.0, "affected_area": "string", '
            '"symptoms": ["string"], "treatment": "string or null", '
            '"prevention": "string or null"}'
        )
        return prompt

    def _encode_image(self, image_bytes: bytes) -> str:
        return base64.b64encode(image_bytes).decode("utf-8")

    async def _with_retry(self, fn, *, attempts: int = 2):
        last: Exception | None = None
        for attempt in range(1, attempts + 1):
            try:
                return await asyncio.wait_for(fn(), timeout=REQUEST_TIMEOUT_S + 10)
            except Exception as exc:  # noqa: BLE001
                last = exc
                logger.warning("LLM attempt %s/%s failed: %s", attempt, attempts, exc)
                if attempt < attempts:
                    await asyncio.sleep(0.8 * attempt)
        assert last is not None
        raise last

    async def detect_disease_openai(
        self, image_bytes: bytes, request: DiseaseDetectionRequest
    ) -> DiseaseInfo:
        if not self.openai_client:
            raise ValueError("OpenAI not configured. Set OPENAI_API_KEY or use demo mode.")
        base64_image = self._encode_image(image_bytes)

        async def _call():
            return await self.openai_client.chat.completions.create(
                model=OPENAI_MODEL,
                messages=[
                    {"role": "system", "content": self._get_system_prompt(request)},
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": "Analyze this leaf image for plant diseases."},
                            {
                                "type": "image_url",
                                "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"},
                            },
                        ],
                    },
                ],
                max_tokens=MAX_TOKENS,
                temperature=0.1,
            )

        response = await self._with_retry(_call)
        content = response.choices[0].message.content or ""
        return _coerce_disease(_extract_json(content), request)

    async def detect_disease_anthropic(
        self, image_bytes: bytes, request: DiseaseDetectionRequest
    ) -> DiseaseInfo:
        if not self.anthropic_client:
            raise ValueError("Anthropic not configured. Set ANTHROPIC_API_KEY or use demo mode.")
        base64_image = self._encode_image(image_bytes)

        async def _call():
            return await self.anthropic_client.messages.create(
                model=ANTHROPIC_MODEL,
                max_tokens=MAX_TOKENS,
                temperature=0.1,
                system=self._get_system_prompt(request),
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "image",
                                "source": {
                                    "type": "base64",
                                    "media_type": "image/jpeg",
                                    "data": base64_image,
                                },
                            },
                            {"type": "text", "text": "Analyze this leaf image for plant diseases."},
                        ],
                    }
                ],
            )

        response = await self._with_retry(_call)
        text = ""
        for block in response.content:
            if getattr(block, "type", "") == "text":
                text += getattr(block, "text", "")
        return _coerce_disease(_extract_json(text), request)

    async def detect_disease(
        self, image_bytes: bytes, request: DiseaseDetectionRequest
    ) -> DiseaseDetectionResponse:
        start = time.perf_counter()
        try:
            normalized, meta = verify_and_normalize(image_bytes)
        except Exception as exc:  # noqa: BLE001
            elapsed = (time.perf_counter() - start) * 1000
            return DiseaseDetectionResponse(
                success=False, error=str(exc), processing_time_ms=elapsed
            )

        provider_available = (
            (request.provider == LLMProvider.openai and self.openai_client)
            or (request.provider == LLMProvider.anthropic and self.anthropic_client)
        )
        # Demo fallback: deterministic and clearly labeled.
        if not provider_available:
            disease = build_demo_disease(normalized, request)
            elapsed = (time.perf_counter() - start) * 1000
            logger.info(
                "demo detection provider=%s bytes=%s meta=%s",
                request.provider, len(image_bytes), meta,
            )
            return DiseaseDetectionResponse(
                success=True,
                disease=disease,
                processing_time_ms=elapsed,
                provider=str(request.provider.value),
                demo=True,
            )

        try:
            if request.provider == LLMProvider.openai:
                disease = await self.detect_disease_openai(normalized, request)
            elif request.provider == LLMProvider.anthropic:
                disease = await self.detect_disease_anthropic(normalized, request)
            else:
                raise ValueError(f"Unsupported provider: {request.provider}")
            elapsed = (time.perf_counter() - start) * 1000
            return DiseaseDetectionResponse(
                success=True,
                disease=disease,
                processing_time_ms=elapsed,
                provider=str(request.provider.value),
                demo=False,
            )
        except Exception as exc:  # noqa: BLE001
            logger.exception("LLM detection failed")
            elapsed = (time.perf_counter() - start) * 1000
            return DiseaseDetectionResponse(
                success=False, error=str(exc), processing_time_ms=elapsed,
                provider=str(request.provider.value), demo=False,
            )

    def get_available_providers(self) -> list[str]:
        providers: list[str] = []
        if self.openai_client:
            providers.append("openai")
        if self.anthropic_client:
            providers.append("anthropic")
        return providers

    def is_demo_mode(self) -> bool:
        return len(self.get_available_providers()) == 0


llm_vision_service = LLMVisionService()
