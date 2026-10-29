"""Application settings loaded from environment / .env file."""
from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # General
    app_name: str = "RUMES"
    debug: bool = False

    # Database. SQLite by default; point to PostgreSQL in production, e.g.:
    # DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/rumes
    database_url: str = "sqlite+aiosqlite:///./rumes.db"

    # Security — CHANGE THIS IN PRODUCTION!
    secret_key: str = "change-me-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24  # 24 hours

    # CORS — frontend origin(s)
    cors_origins: list[str] = ["http://localhost:3000", "http://localhost:5173"]

    # Uploads
    upload_dir: str = "./uploads"
    max_upload_size_mb: int = 32


@lru_cache
def get_settings() -> Settings:
    return Settings()
