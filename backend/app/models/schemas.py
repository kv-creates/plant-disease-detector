from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum


class LLMProvider(str, Enum):
    openai = "openai"
    anthropic = "anthropic"


class DiseaseSeverity(str, Enum):
    mild = "mild"
    moderate = "moderate"
    severe = "severe"


class DiseaseDetectionRequest(BaseModel):
    provider: LLMProvider = LLMProvider.openai
    include_treatment: bool = True
    include_prevention: bool = True


class DiseaseInfo(BaseModel):
    name: str
    scientific_name: Optional[str] = None
    description: str
    severity: DiseaseSeverity
    confidence: float = Field(ge=0.0, le=1.0)
    affected_area: str
    symptoms: List[str]
    treatment: Optional[str] = None
    prevention: Optional[str] = None


class DiseaseDetectionResponse(BaseModel):
    success: bool
    disease: Optional[DiseaseInfo] = None
    error: Optional[str] = None
    processing_time_ms: float


class HealthCheckResponse(BaseModel):
    status: str
    version: str
    providers_available: List[str]