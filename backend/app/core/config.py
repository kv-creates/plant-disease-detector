from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    app_name: str = "Plant Disease Detector"
    api_version: str = "v1"
    debug: bool = True

    openai_api_key: Optional[str] = None
    anthropic_api_key: Optional[str] = None
    default_llm_provider: str = "openai"

    max_file_size: int = 10 * 1024 * 1024
    allowed_extensions: list[str] = ["jpg", "jpeg", "png", "webp"]

    cors_origins: list[str] = ["http://localhost:5173", "http://localhost:3000"]

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()