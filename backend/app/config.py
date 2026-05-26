from functools import lru_cache

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    database_url: str = "postgresql://postgres:postgres@localhost:5432/capacity_app"
    jwt_secret: str = "change-me"
    jwt_expires_minutes: int = 60 * 24
    cors_origins: list[str] = Field(default_factory=lambda: ["http://localhost:5173"])
    api_host: str = "0.0.0.0"
    api_port: int = 8000

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, value):
        if isinstance(value, list):
            return value
        if not value:
            return ["http://localhost:5173"]
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value



@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
