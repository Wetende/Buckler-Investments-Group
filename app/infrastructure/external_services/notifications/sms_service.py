import structlog

logger = structlog.get_logger(__name__)


async def send_sms(phone_e164: str, message: str) -> bool:
    # Placeholder: integrate with SMS provider (e.g., Twilio)
    logger.info("sms.send", to=phone_e164, size=len(message))
    return True
