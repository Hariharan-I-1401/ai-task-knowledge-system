from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# This is what we expect from the frontend
class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    operator_id: int
    startup_id: Optional[int] = None
    status: str = "Pending"

# This is what we send back to the frontend
class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    operator_id: int
    startup_id: Optional[int]
    status: str
    created_at: datetime

    class Config:
        from_attributes = True