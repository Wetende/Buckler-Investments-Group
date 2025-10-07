from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent.parent
ENV_FILE_PATH = BASE_DIR / ".env"


class Settings(BaseSettings):
    """
    Application settings.

    These settings are loaded from the .env file.
    """
    DATABASE_URL: str = "postgresql+asyncpg://postgres:root@localhost:5432/buckler"
    SECRET_KEY: str = "a_very_secret_key"
    # Email settings
    MAIL_USERNAME: str = "your-email@example.com"
    MAIL_PASSWORD: str = "your-email-password"
    MAIL_FROM: str = "your-email@example.com"
    MAIL_PORT: int = 587
    MAIL_SERVER: str = "smtp.example.com"
    MAIL_STARTTLS: bool = True
    MAIL_SSL_TLS: bool = False

    # FX settings
    KES_PER_USD: float = 130.0

    # CORS
    # Comma-separated origins; set to specific hosts in production
    CORS_ALLOW_ORIGINS: str = "*"

    # Analytics/Webhooks
    ANALYTICS_WEBHOOK_URL: str | None = None

    # OAuth / Frontend
    GOOGLE_CLIENT_ID: str | None = None
    GOOGLE_CLIENT_SECRET: str | None = None
    GOOGLE_REDIRECT_URI: str | None = None
    FRONTEND_BASE_URL: str = "http://localhost:3000"
    # Optional admin UI base URL for redirects and CORS allowlisting
    ADMIN_URL: str | None = None

    model_config = SettingsConfigDict(
        env_file=ENV_FILE_PATH,
        extra="ignore",
    )


# Instantiate settings from .env
settings = Settings()
