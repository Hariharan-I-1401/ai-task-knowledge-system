from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.user import User
from app.services.auth_service import get_current_user

# EXPLICIT ATTRIBUTE BINDING: Lowercase 'router' to match main.py layout expectations
router = APIRouter(prefix="/documents", tags=["Pitch Deck Repository Management"])

@router.get("")
def list_uploaded_documents(
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    """Retrieves metadata references for document files linked to venture accounts."""
    try:
        # Placeholder returning a clean response list before we implement direct disk writes
        return []
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to query local asset registry: {str(e)}"
        )