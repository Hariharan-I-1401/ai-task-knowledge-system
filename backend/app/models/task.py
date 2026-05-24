from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
import datetime
from app.database import Base

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    startup_id = Column(Integer, ForeignKey("startups.id"), nullable=True)
    file_name = Column(String(255), nullable=False)
    file_path = Column(String(550), nullable=False)
    uploaded_at = Column(DateTime, default=datetime.datetime.utcnow)

    startup = relationship("Startup", back_populates="documents")


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=False)
    description = Column(Text)
    status = Column(String(50), default="Pending") # Pending, Completed
    assigned_to = Column(Integer, ForeignKey("users.id"))
    startup_id = Column(Integer, ForeignKey("startups.id"))
    
    # FIXED: Added the explicit column schema definition required by your router order queries!
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)

    assignee = relationship("User", back_populates="assigned_tasks")
    startup = relationship("Startup", back_populates="tasks")