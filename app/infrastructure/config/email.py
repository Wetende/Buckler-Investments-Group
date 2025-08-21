"""
Email sending service for the Property Listing Platform.

This module configures fastapi-mail and provides a utility function for sending emails.
"""
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema
from pydantic import EmailStr

from .config import settings
from pathlib import Path

# Resolve template folder absolutely for serverless environments
TEMPLATE_FOLDER = str((Path(__file__).resolve().parents[2] / "app" / "templates" / "email").resolve())

conf = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=settings.MAIL_PASSWORD,
    MAIL_FROM=settings.MAIL_FROM,
    MAIL_PORT=settings.MAIL_PORT,
    MAIL_SERVER=settings.MAIL_SERVER,
    MAIL_STARTTLS=settings.MAIL_STARTTLS,
    MAIL_SSL_TLS=settings.MAIL_SSL_TLS,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True,
    TEMPLATE_FOLDER=TEMPLATE_FOLDER,
)

fm = FastMail(conf)

async def send_email(subject: str, recipients: list[EmailStr], body: str):
    """Sends an email using the configured fastapi-mail service."""
    message = MessageSchema(
        subject=subject,
        recipients=recipients,
        body=body,
        subtype="html",
    )
    await fm.send_message(message)
