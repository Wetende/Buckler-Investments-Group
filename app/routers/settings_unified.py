from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_async_session
from core.dependencies import require_admin
from models.system_setting import SystemSetting
from schemas.settings import SystemSettingsUpdate, SystemSettingsOut


router = APIRouter(prefix="/api/v1/settings", tags=["Settings"])


@router.get("/", response_model=SystemSettingsOut)
async def get_settings(session: AsyncSession = Depends(get_async_session), _: object = Depends(require_admin)):
    res = await session.execute(select(SystemSetting))
    settings = res.scalars().all()
    return SystemSettingsOut.from_settings(settings)


@router.post("/", response_model=SystemSettingsOut)
async def update_settings(payload: SystemSettingsUpdate, session: AsyncSession = Depends(get_async_session), _: object = Depends(require_admin)):
    # naive apply
    for item in payload.items:
        res = await session.execute(
            select(SystemSetting).where(SystemSetting.key == item.key)
        )
        setting = res.scalar_one_or_none()
        if setting is None:
            setting = SystemSetting(key=item.key, value=item.value)
            session.add(setting)
        else:
            setting.value = item.value
    await session.commit()
    res = await session.execute(select(SystemSetting))
    return SystemSettingsOut.from_settings(res.scalars().all())



