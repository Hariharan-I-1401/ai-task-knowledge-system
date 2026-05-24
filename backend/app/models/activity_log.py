from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
import datetime
from app.database import Base

class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(Integer, primary_key=True, index=True)
    action = Column(String(255), nullable=False)  # e.g., "USER_LOGIN", "STARTUP_SUBMISSION"
    details = Column(String(500), nullable=True)   # Description or contextual details
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    
    # Establish a clean relationship link to the performing user record
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    user = relationship("User", back_populates="activity_logs")