from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import settings  # Securely imports your configuration settings

# Read the connection URL dynamically from your .env file
DATABASE_URL = settings.DATABASE_URL

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True  # Keeps your MySQL connections alive and prevents stale timeouts
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    """Dependency helper to manage database session lifecycles per request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()