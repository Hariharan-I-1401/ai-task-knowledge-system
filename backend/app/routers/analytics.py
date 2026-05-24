from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.startup import Startup
from app.models.task import Task
from app.schemas.analytics import DashboardSummaryResponse
from app.services.auth_service import get_current_user, RoleChecker

router = APIRouter(prefix="/analytics", tags=["Management Dashboard Engine"])

# Enforce secure role restriction so only Authorized Investment Admins can access metrics
admin_only = RoleChecker(allowed_roles=["Admin"])

@router.get("/summary", response_model=DashboardSummaryResponse)
def get_dashboard_metrics_summary(
    current_user: User = Depends(admin_only), 
    db: Session = Depends(get_db)
):
    """Calculates operational and transaction metrics summaries across the database ledger system."""
    try:
        # 1. Quantify total startups currently inside the venture intake table
        total_startups = db.query(Startup).count()

        # 2. Count active and completed audit tasks across the global operations queue
        pending_tasks = db.query(Task).filter(Task.status == "Pending").count()
        completed_tasks = db.query(Task).filter(Task.status == "Completed").count()

        # 3. Securely calculate conversion rate without risk of ZeroDivisionError
        total_tasks = pending_tasks + completed_tasks
        if total_tasks > 0:
            task_conversion_rate = round((completed_tasks / total_tasks) * 100, 1)
        else:
            task_conversion_rate = 0.0

        return {
            "total_startups": total_startups,
            "pending_tasks": pending_tasks,
            "completed_tasks": completed_tasks,
            "task_conversion_rate": task_conversion_rate
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to compile dashboard metrics aggregation graph: {str(e)}"
        )