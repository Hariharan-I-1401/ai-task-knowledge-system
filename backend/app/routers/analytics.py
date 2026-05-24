from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
import pandas as pd
from fastapi.responses import StreamingResponse
import io

# Import models
from app.models.startup import Startup
from app.models.task import Task
from app.models.user import User

router = APIRouter(tags=["Analytics"])

@router.get("/admin/stats")
def get_admin_dashboard_stats(db: Session = Depends(get_db)):
    # 1. Count Total Startups
    total_startups = db.query(Startup).count()
    
    # 2. Count Total Tasks
    total_tasks = db.query(Task).count()
    
    # 3. Count Completed Tasks
    completed_tasks = db.query(Task).filter(Task.status == "Completed").count()
    
    # 4. Calculate Task Completion Rate
    completion_rate = 0
    if total_tasks > 0:
        completion_rate = round((completed_tasks / total_tasks) * 100)
        
    # 5. Count Total Users
    total_users = db.query(User).count()
    
    # 6. Sector Distribution
    # Queries the database to count startups grouped by their sector
    sector_counts = db.query(Startup.sector, func.count(Startup.id)).group_by(Startup.sector).all()
    sector_distribution = {sector: count for sector, count in sector_counts}
    
    return {
        "total_startups": total_startups,
        "total_tasks": total_tasks,
        "completed_tasks": completed_tasks,
        "task_completion_rate": completion_rate,
        "total_users": total_users,
        "sector_distribution": sector_distribution
    }

@router.get("/analytics/export")
def export_startups_to_excel(db: Session = Depends(get_db)):
    # 1. Fetch all startup data records from the database layer
    startups = db.query(Startup).all()
    
    # 2. Convert to an extended list of dictionaries mapping every profile data element
    data = []
    for s in startups:
        # Resolve funding metrics to a clean value safely
        funding_ask_val = getattr(s, "funding_ask", 0) or getattr(s, "amount_raising", 0) or 0
        try:
            funding_ask_val = float(funding_ask_val)
        except (ValueError, TypeError):
            funding_ask_val = 0.0

        data.append({
            "Startup Name": getattr(s, "name", None) or getattr(s, "startup_name", "Unnamed Venture"),
            "Website URL": getattr(s, "website", None) or getattr(s, "website_url", "N/A"),
            "Founder Names": getattr(s, "founder_names", "N/A"),
            "Contact Email": getattr(s, "email", None) or getattr(s, "contact_email", "N/A"),
            "Contact Number": getattr(s, "phone", None) or getattr(s, "contact_number", "N/A"),
            "HQ Location": getattr(s, "location", None) or getattr(s, "hq_location", "N/A"),
            "Problem Statement": getattr(s, "problem_statement", "N/A"),
            "Solution Overview": getattr(s, "solution_overview", "N/A"),
            "Industry Sector": getattr(s, "sector", None) or getattr(s, "industry_sector", "AI"),
            "Business Model": getattr(s, "business_model", "B2B"),
            "Current Stage": getattr(s, "stage", None) or getattr(s, "current_stage", "MVP"),
            "Funding Ask Amount ($)": funding_ask_val,
            "Use of Funds": getattr(s, "use_of_funds", "N/A"),
            "Pitch Deck Saved Location": getattr(s, "pitch_deck_path", "N/A"),
            "Associated User ID": getattr(s, "user_id", "N/A"),
            "Created At": str(getattr(s, "created_at", "N/A"))
        })
    
    # 3. Create Pandas DataFrame and save to stream memory buffer
    df = pd.DataFrame(data)
    stream = io.BytesIO()
    with pd.ExcelWriter(stream, engine='openpyxl') as writer:
        df.to_excel(writer, index=False, sheet_name='Startups Pipeline Log')
    
    stream.seek(0)
    
    # 4. Return the file download downstream stream packet
    return StreamingResponse(
        stream,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=FSV_Startup_Pipeline.xlsx"}
    )