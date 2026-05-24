from pydantic import BaseModel

class DashboardSummaryResponse(BaseModel):
    total_startups: int       # Maps directly to "Venture Pipeline" card
    pending_tasks: int        # Maps directly to "Pending Audits" card
    completed_tasks: int      # Maps directly to "Completed Audits" card
    task_conversion_rate: float # Calculated percentage of total completed vs assigned workflow items

    class Config:
        from_attributes = True