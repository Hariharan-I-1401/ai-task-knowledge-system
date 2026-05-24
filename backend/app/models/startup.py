from sqlalchemy import Column, Integer, String, Text, Numeric, ForeignKey, DateTime
from sqlalchemy.orm import relationship
import datetime
from app.database import Base

class Startup(Base):
    __tablename__ = "startups"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    # Section 1 & 2: Basic Info & Overview
    name = Column(String(100), nullable=False)
    website = Column(String(255))
    sector = Column(String(50), nullable=False) # Fintech, AI, Blockchain, etc.
    stage = Column(String(50), nullable=False)  # Idea, MVP, Early Revenue, Growth
    problem_statement = Column(Text, nullable=False)
    solution_overview = Column(Text, nullable=False)
    
    # Section 5 & 7: Traction & Funding Ask
    current_revenue = Column(Numeric(15, 2), default=0.00)
    funding_ask = Column(Numeric(15, 2), nullable=False)
    deal_score = Column(Integer, default=0) # Optional Smart Scoring (0-100)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    founder = relationship("User", back_populates="startup")
    documents = relationship("Document", back_populates="startup")
    tasks = relationship("Task", back_populates="startup")