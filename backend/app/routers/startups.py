import os
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.startup import Startup
from app.services.auth_service import get_current_user
from app.services.ai_service import index_startup_application

router = APIRouter(prefix="/startups", tags=["Startup Deal Intake"])

@router.post("/apply")
async def register_startup_application(
    startupName: str = Form(...),
    websiteUrl: str = Form(...),
    founderNames: str = Form(...),
    contactEmail: str = Form(...),
    amountRaising: str = Form(...),
    pitch_view_deck: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        new_deal = Startup(
            name=startupName,
            website=websiteUrl,
            founder_names=founderNames,
            email=contactEmail,
            funding_ask=float(amountRaising.replace('$', '').replace(',', '')),
            user_id=current_user.id
        )
        db.add(new_deal)
        db.commit()
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))