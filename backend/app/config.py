from functools import lru_cache
from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


BACKEND_DIR = Path(__file__).resolve().parent.parent


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=BACKEND_DIR / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    database_url: str = (
        "postgresql://postgres:postgres@localhost:5432/capacity_app"
    )
    jwt_secret: str = "change-me"
    jwt_expires_minutes: int = 60 * 24
    demo_user_id: str = "00000000-0000-0000-0000-000000000001"
    demo_user_email: str = "admin@example.com"
    demo_user_password: str = "Admin123!"
    demo_user_full_name: str = "Demo Admin"
    demo_user_role: str = "Admin"
    cors_origins_raw: str = Field(
        default="http://localhost:5173,http://127.0.0.1:5173,http://[::1]:5173"
    )
    api_host: str = "0.0.0.0"
    api_port: int = 8000

    @property
    def cors_origins(self) -> list[str]:
        return [
            origin.strip()
            for origin in self.cors_origins_raw.split(",")
            if origin.strip()
        ]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
