from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, startups, search, tasks, analytics, documents 
from app.routers import health

app = FastAPI(title="FSV Capital Institutional AI Knowledge Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Securely mount complete system operational paths
app.include_router(auth.router, prefix="/api")
app.include_router(startups.router, prefix="/api")
app.include_router(search.router, prefix="/api")
app.include_router(tasks.router, prefix="/api")
app.include_router(analytics.router, prefix="/api")
app.include_router(documents.router, prefix="/api")
app.include_router(health.router, prefix="/api") 

@app.get("/")
def read_root():
    return {"status": "Operational", "engine": "FastAPI Vector Hub"}