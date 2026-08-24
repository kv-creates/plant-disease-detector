import base64
import time
import httpx
from typing import Optional
from PIL import Image
import io

from app.core.config import settings
from app.models.schemas import (
    DiseaseInfo,
    DiseaseSeverity,
    DiseaseDetectionRequest,
    DiseaseDetectionResponse,
    LLMProvider,
)


class LLMVisionService:
    def __init__(self):
        self.openai_client = None
        self.anthropic_client = None
        self._init_clients()

    def _init_clients(self):
        if settings.openai_api_key:
            from openai import AsyncOpenAI
            self.openai_client = AsyncOpenAI(api_key=settings.openai_api_key)

        if settings.anthropic_api_key:
            from anthropic import AsyncAnthropic
            self.anthropic_client = AsyncAnthropic(api_key=settings.anthropic_api_key)

    def _encode_image(self, image_bytes: bytes) -> str:
        return base64.b64encode(image_bytes).decode("utf-8")

    def _get_system_prompt(self, request: DiseaseDetectionRequest) -> str:
        prompt = """You are an expert plant pathologist. Analyze the uploaded leaf image and identify any plant diseases.
        Provide a detailed, accurate diagnosis with the following information:
        1. Disease name (common and scientific)
        2. Detailed description of the disease
        3. Severity level (mild, moderate, severe)
        4. Confidence score (0.0 to 1.0)
        5. Affected area of the leaf
        6. Visible symptoms"""
        
        if request.include_treatment:
            prompt += "\n7. Recommended treatment options"
        if request.include_prevention:
            prompt += "\n8. Prevention measures"
        
        prompt += """
        Respond in JSON format with the exact structure:
        {
            "name": "string",
            "scientific_name": "string or null",
            "description": "string",
            "severity": "mild|moderate|severe",
            "confidence": 0.0-1.0,
            "affected_area": "string",
            "symptoms": ["string"],
            "treatment": "string or null",
            "prevention": "string or null"
        }"""
        return prompt

    async def detect_disease_openai(
        self, image_bytes: bytes, request: DiseaseDetectionRequest
    ) -> DiseaseInfo:
        if not self.openai_client:
            raise ValueError("OpenAI client not configured. Set OPENAI_API_KEY in environment.")

        base64_image = self._encode_image(image_bytes)

        response = await self.openai_client.chat.completions.create(
            model="gpt-4-vision-preview",
            messages=[
                {
                    "role": "system",
                    "content": self._get_system_prompt(request),
                },
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
            max_tokens=1000,
            temperature=0.1,
        )

        import json
        content = response.choices[0].message.content
        data = json.loads(content)

        return DiseaseInfo(
            name=data["name"],
            scientific_name=data.get("scientific_name"),
            description=data["description"],
            severity=DiseaseSeverity(data["severity"]),
            confidence=data["confidence"],
            affected_area=data["affected_area"],
            symptoms=data["symptoms"],
            treatment=data.get("treatment") if request.include_treatment else None,
            prevention=data.get("prevention") if request.include_prevention else None,
        )

    async def detect_disease_anthropic(
        self, image_bytes: bytes, request: DiseaseDetectionRequest
    ) -> DiseaseInfo:
        if not self.anthropic_client:
            raise ValueError("Anthropic client not configured. Set ANTHROPIC_API_KEY in environment.")

        base64_image = self._encode_image(image_bytes)

        response = await self.anthropic_client.messages.create(
            model="claude-3-opus-20240229",
            max_tokens=1000,
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

        import json
        content = response.content[0].text
        data = json.loads(content)

        return DiseaseInfo(
            name=data["name"],
            scientific_name=data.get("scientific_name"),
            description=data["description"],
            severity=DiseaseSeverity(data["severity"]),
            confidence=data["confidence"],
            affected_area=data["affected_area"],
            symptoms=data["symptoms"],
            treatment=data.get("treatment") if request.include_treatment else None,
            prevention=data.get("prevention") if request.include_prevention else None,
        )

    async def detect_disease(
        self, image_bytes: bytes, request: DiseaseDetectionRequest
    ) -> DiseaseDetectionResponse:
        start_time = time.time()

        try:
            if request.provider == LLMProvider.openai:
                disease = await self.detect_disease_openai(image_bytes, request)
            elif request.provider == LLMProvider.anthropic:
                disease = await self.detect_disease_anthropic(image_bytes, request)
            else:
                raise ValueError(f"Unsupported provider: {request.provider}")

            processing_time = (time.time() - start_time) * 1000

            return DiseaseDetectionResponse(
                success=True,
                disease=disease,
                processing_time_ms=processing_time,
            )

        except Exception as e:
            processing_time = (time.time() - start_time) * 1000
            return DiseaseDetectionResponse(
                success=False,
                error=str(e),
                processing_time_ms=processing_time,
            )

    def get_available_providers(self) -> list[str]:
        providers = []
        if self.openai_client:
            providers.append("openai")
        if self.anthropic_client:
            providers.append("anthropic")
        return providers


llm_vision_service = LLMVisionService()