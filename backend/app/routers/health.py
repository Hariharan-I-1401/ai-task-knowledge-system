from fastapi import APIRouter, Depends
from sqlalchemy import text  # 🟢 added this explicit import
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.ai_service import ai_service

router = APIRouter(prefix="/health", tags=["System Diagnostics"])

@router.get("")
def check_system_health(db: Session = Depends(get_db)):
    """
    Performs live structural diagnostics on MySQL database connections 
    and local vector embedding layers.
    """
    diagnostics = {
        "status": "healthy",
        "mysql_database": "connected",
        "ai_embedding_engine": "online",
        "vector_pool_records": len(ai_service.vector_db)
    }
    
    # 1. Test database reachability safely using text() wrap structures
    try:
        db.execute(text("SELECT 1"))  # 🟢 FIXED: Explicitly declared as text
    except Exception as e:
        diagnostics["status"] = "unhealthy"
        diagnostics["mysql_database"] = f"disconnected: {str(e)}"
        
    # 2. Test local AI model presence
    try:
        if not ai_service.model:
            raise ValueError("Model initialization sequence offline.")
    except Exception as e:
        diagnostics["status"] = "unhealthy"
        diagnostics["ai_embedding_engine"] = f"fault: {str(e)}"
        
    return diagnostics