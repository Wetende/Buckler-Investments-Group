from __future__ import annotations

from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_async_session
from core.dependencies import require_admin
from models.notification_template import NotificationTemplate
from models.provider_config import ProviderConfig
from schemas.notifications import (
    NotificationTemplateCU,
    NotificationTemplateOut,
    ProviderConfigCU,
    ProviderConfigOut,
)


router = APIRouter(prefix="/api/v1/notifications", tags=["Notifications"])


@router.get("/templates", response_model=List[NotificationTemplateOut])
async def list_templates(session: AsyncSession = Depends(get_async_session), _: object = Depends(require_admin)):
    res = await session.execute(select(NotificationTemplate))
    return res.scalars().all()


@router.post("/templates", response_model=NotificationTemplateOut)
async def create_or_update_template(payload: NotificationTemplateCU, session: AsyncSession = Depends(get_async_session), _: object = Depends(require_admin)):
    if payload.id == 0:
        template = NotificationTemplate(**payload.model_dump(exclude={"id"}))
        session.add(template)
        await session.commit()
        await session.refresh(template)
        return template
    template = await session.get(NotificationTemplate, payload.id)
    if not template:
        raise HTTPException(404, "Template not found")
    for k, v in payload.model_dump(exclude={"id"}).items():
        setattr(template, k, v)
    await session.commit()
    await session.refresh(template)
    return template


@router.get("/templates/{template_id}/delete", response_model=dict)
async def delete_template(template_id: int, session: AsyncSession = Depends(get_async_session), _: object = Depends(require_admin)):
    template = await session.get(NotificationTemplate, template_id)
    if not template:
        raise HTTPException(404, "Template not found")
    await session.delete(template)
    await session.commit()
    return {"detail": "Deleted"}


@router.get("/providers", response_model=List[ProviderConfigOut])
async def list_providers(session: AsyncSession = Depends(get_async_session), _: object = Depends(require_admin)):
    res = await session.execute(select(ProviderConfig))
    return res.scalars().all()


@router.post("/providers", response_model=ProviderConfigOut)
async def create_or_update_provider(payload: ProviderConfigCU, session: AsyncSession = Depends(get_async_session), _: object = Depends(require_admin)):
    if payload.id == 0:
        provider = ProviderConfig(**payload.model_dump(exclude={"id"}))
        session.add(provider)
        await session.commit()
        await session.refresh(provider)
        return provider
    provider = await session.get(ProviderConfig, payload.id)
    if not provider:
        raise HTTPException(404, "Provider not found")
    for k, v in payload.model_dump(exclude={"id"}).items():
        setattr(provider, k, v)
    await session.commit()
    await session.refresh(provider)
    return provider


@router.get("/providers/{provider_id}/delete", response_model=dict)
async def delete_provider(provider_id: int, session: AsyncSession = Depends(get_async_session), _: object = Depends(require_admin)):
    provider = await session.get(ProviderConfig, provider_id)
    if not provider:
        raise HTTPException(404, "Provider not found")
    await session.delete(provider)
    await session.commit()
    return {"detail": "Deleted"}



