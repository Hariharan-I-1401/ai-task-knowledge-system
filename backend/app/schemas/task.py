from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: str = "Pending"  # Enforces structural filtering states: Pending or Completed
    assigned_to_id: int
    startup_id: Optional[int] = None

class TaskCreate(TaskBase):
    """Schema used during inbound payload creation."""
    pass

class TaskUpdate(BaseModel):
    """Schema used when toggling a task from Pending to Completed."""
    status: Optional[str] = None
    description: Optional[str] = None

class TaskResponse(TaskBase):
    """Enforces strict, secure formatting on what data goes back to the frontend."""
    id: int
    created_at: datetime

    class Config:
        from_attributes = True