import os
from dotenv import load_dotenv

# Locate and pull values out of the .env file
load_dotenv()

class Settings:
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    JWT_SECRET: str = os.getenv("JWT_SECRET", "default_fallback_secret_key")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

settings = Settings()