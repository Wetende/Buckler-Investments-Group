from typing import Sequence

import structlog

logger = structlog.get_logger(__name__)


async def send_email(to: Sequence[str], subject: str, body_html: str) -> bool:
    # Placeholder: integrate with SMTP provider
    logger.info("email.send", to=list(to), subject=subject, size=len(body_html))
    return True
