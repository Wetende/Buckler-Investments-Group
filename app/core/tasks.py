"""Background task runner using APScheduler."""
from __future__ import annotations

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
import logging

logger = logging.getLogger(__name__)

scheduler = AsyncIOScheduler()


def start_scheduler() -> None:
    """Start the APScheduler instance if not already running."""
    if not scheduler.running:
        scheduler.start()
        logger.info("APScheduler started")


# Example nightly maintenance job
@scheduler.scheduled_job(CronTrigger(hour=3, minute=0))
async def nightly_maintenance():  # pragma: no cover
    logger.info("Running nightly maintenance job")
