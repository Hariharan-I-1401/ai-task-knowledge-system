from pydantic import BaseModel, HttpUrl
from typing import Optional

class StartupCreate(BaseModel):
    # Section 1 & 2: Basic Info & Overview from the FSV Form guidelines
    name: str
    website: str
    sector: str         # Fintech, AI, Blockchain, SaaS, DeepTech etc.
    stage: str          # Idea, MVP, Early Revenue, Growth Stage, Scaling
    problem_statement: str
    solution_overview: str
    
    # Section 5 & 7: Traction & Financial Requirements
    current_revenue: float
    funding_ask: float

class StartupResponse(StartupCreate):
    id: int
    deal_score: int
    
    class Config:
        from_attributes = True