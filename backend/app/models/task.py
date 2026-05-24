from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base
import datetime

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(String(1000), nullable=True)
    
    # 🟢 Link to the User (Who is doing the task)
    operator_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # 🟢 NEW: Link to the Startup (What the task is about) - satisfies Startup.tasks!
    startup_id = Column(Integer, ForeignKey("startups.id"), nullable=True)
    
    status = Column(String(50), default="Pending")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationship back to User
    assignee = relationship("User", back_populates="assigned_tasks")
    
    # 🟢 NEW: Relationship back to Startup
    startup = relationship("Startup", back_populates="tasks")