"""Admin settings management routes."""
from __future__ import annotations

from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_async_session
from core.dependencies import require_admin
from models.system_setting import SystemSetting, WebsiteSetting
from schemas.settings import (
    SystemSettingCreateUpdate,
    WebsiteSettingCreateUpdate,
    SystemSettingResponse,
    WebsiteSettingResponse,
)
from models.user import User

router = APIRouter(prefix="/api/v1/admin/settings", tags=["Settings (Admin)"])

# ---------------- System Settings ----------------


@router.get("/system", response_model=List[SystemSettingResponse])
async def list_system_settings(
    session: AsyncSession = Depends(get_async_session),
    _: User = Depends(require_admin),
):
    res = await session.execute(select(SystemSetting))
    return res.scalars().all()


@router.post("/system", response_model=SystemSettingResponse)
async def create_or_update_system_setting(
    payload: SystemSettingCreateUpdate,
    session: AsyncSession = Depends(get_async_session),
    _: User = Depends(require_admin),
):
    if payload.id == 0:
        setting = SystemSetting(**payload.model_dump(exclude={"id"}))
        session.add(setting)
        await session.commit()
        await session.refresh(setting)
        return setting
    setting = await session.get(SystemSetting, payload.id)
    if not setting:
        raise HTTPException(404, "Setting not found")
    for field, value in payload.model_dump(exclude={"id"}).items():
        setattr(setting, field, value)
    await session.commit()
    await session.refresh(setting)
    return setting


@router.get("/system/{setting_id}/delete", response_model=dict)
async def delete_system_setting(
    setting_id: int,
    session: AsyncSession = Depends(get_async_session),
    _: User = Depends(require_admin),
):
    setting = await session.get(SystemSetting, setting_id)
    if not setting:
        raise HTTPException(404, "Setting not found")
    await session.delete(setting)
    await session.commit()
    return {"detail": "Deleted"}

# ---------------- Website Settings ----------------


@router.get("/website", response_model=List[WebsiteSettingResponse])
async def list_website_settings(
    session: AsyncSession = Depends(get_async_session),
    _: User = Depends(require_admin),
):
    res = await session.execute(select(WebsiteSetting))
    return res.scalars().all()


@router.post("/website", response_model=WebsiteSettingResponse)
async def create_or_update_website_setting(
    payload: WebsiteSettingCreateUpdate,
    session: AsyncSession = Depends(get_async_session),
    _: User = Depends(require_admin),
):
    if payload.id == 0:
        setting = WebsiteSetting(**payload.model_dump(exclude={"id"}))
        session.add(setting)
        await session.commit()
        await session.refresh(setting)
        return setting
    setting = await session.get(WebsiteSetting, payload.id)
    if not setting:
        raise HTTPException(404, "Setting not found")
    for field, value in payload.model_dump(exclude={"id"}).items():
        setattr(setting, field, value)
    await session.commit()
    await session.refresh(setting)
    return setting


@router.get("/website/{setting_id}/delete", response_model=dict)
async def delete_website_setting(
    setting_id: int,
    session: AsyncSession = Depends(get_async_session),
    _: User = Depends(require_admin),
):
    setting = await session.get(WebsiteSetting, setting_id)
    if not setting:
        raise HTTPException(404, "Setting not found")
    await session.delete(setting)
    await session.commit()
    return {"detail": "Deleted"}
