from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.startup import Startup
from app.services.auth_service import get_current_user
from app.services.ai_service import ai_service

# CRITICAL FIX: Named exactly 'router' so main.py can load it seamlessly
router = APIRouter(prefix="/search", tags=["AI Core Operations"])

@router.get("")
def execute_semantic_search(query: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Translates incoming conceptual queries into semantic vector space matching via FAISS."""
    if not query.strip():
        raise HTTPException(status_code=400, detail="Search query parameter string cannot be empty.")

    try:
        matched_ids = ai_service.search_similar_startups(query_text=query, top_k=6)
        if not matched_ids:
            return []

        startups = db.query(Startup).filter(Startup.id.in_(matched_ids)).all()
        startups_sorted = sorted(startups, key=lambda s: matched_ids.index(s.id))
        
        return [
            {
                "id": s.id,
                "name": s.name,
                "website": s.website,
                "sector": s.sector,
                "stage": s.stage,
                "solution_overview": s.solution_overview,
                "funding_ask": s.funding_ask,
                "current_revenue": s.current_revenue
            }
            for s in startups_sorted
        ]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Semantic search failed: {str(e)}"
        )