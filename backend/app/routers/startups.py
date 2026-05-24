import os
import re
from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.startup import Startup
from app.services.auth_service import get_current_user
from app.services.ai_service import index_startup_application

router = APIRouter(prefix="/startups", tags=["Startup Deal Intake"])

# Setup local storage directory safely for uploaded PDFs
UPLOAD_DIR = os.path.join(os.getcwd(), "storage", "pitch_decks")
os.makedirs(UPLOAD_DIR, exist_ok=True)

def sanitize_to_numeric(value_str: str) -> float:
    """
    Cleanses currency strings like '$1,000,000' or '1,000' 
    into a clean float value for database storage.
    """
    if not value_str:
        return 0.0
    # Strip away everything except digits and structural dots
    clean_digits = re.sub(r'[^\d.]', '', str(value_str))
    try:
        return float(clean_digits) if clean_digits else 0.0
    except ValueError:
        return 0.0

@router.post("/apply")
async def register_startup_application(
    startupName: str = Form(None),
    websiteUrl: str = Form(None),
    founderNames: str = Form(None),
    contactEmail: str = Form(None),
    contactNumber: str = Form(None),
    hqLocation: str = Form(None),
    problemStatement: str = Form(None),
    solutionOverview: str = Form(None),
    industrySector: str = Form(None),
    businessModel: str = Form(None),
    currentStage: str = Form(None),
    amountRaising: str = Form(None),
    useOfFunds: str = Form(None),
    pitch_deck: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # 🟢 TELEMETRY LOGS: See exactly what keys the frontend is dropping into the HTTP stream
    print("\n" + "="*50)
    print("      INCOMING DEAL INGESTION STREAM TELEMETRY")
    print("="*50)
    print(f"-> [AUTH INSTANCE ID]: {current_user.id} ({current_user.email})")
    print(f"-> [FORM STR KEY] startupName:     {startupName}")
    print(f"-> [FORM STR KEY] industrySector:  {industrySector}")
    print(f"-> [FORM STR KEY] amountRaising:   {amountRaising}")
    print(f"-> [FILE COMPONENT] pitch_deck:    {pitch_deck.filename if pitch_deck else 'MISSING'}")
    print("="*50 + "\n")

    # 1. GUARDRAIL CHECK: Prevent duplicate submission from the same user immediately
    existing_startup = db.query(Startup).filter(Startup.user_id == current_user.id).first()
    if existing_startup:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Application already submitted. You have already filed a venture entry."
        )

    # 2. Fallback verification checks to prevent empty string database failures
    s_name = startupName or "Unnamed Startup"
    
    # 3. File handling logic to save the pitch deck PDF to disk safely
    file_save_path = None
    if pitch_deck and pitch_deck.filename:
        file_extension = os.path.splitext(pitch_deck.filename)[1]
        saved_file_name = f"user_{current_user.id}_{s_name.replace(' ', '_')}_deck{file_extension}"
        file_save_path = os.path.join(UPLOAD_DIR, saved_file_name)
        
        try:
            with open(file_save_path, "wb") as buffer:
                content = await pitch_deck.read()
                buffer.write(content)
        except Exception as file_err:
            print(f"File Save Error: {str(file_err)}")
            file_save_path = None

    # 4. Clean financial tracking numbers safely
    cleaned_funding_ask = sanitize_to_numeric(amountRaising)

    # 5. Comprehensive fallback dictionary mapping possible column variants
    startup_data = {
        "name": s_name,
        "startup_name": s_name,
        "website": websiteUrl or "N/A",
        "website_url": websiteUrl or "N/A",
        "email": contactEmail or current_user.email,
        "contact_email": contactEmail or current_user.email,
        "phone": contactNumber or "N/A",
        "contact_number": contactNumber or "N/A",
        "location": hqLocation or "N/A",
        "hq_location": hqLocation or "N/A",
        "problem_statement": problemStatement or "N/A",
        "solution_overview": solutionOverview or "N/A",
        "sector": industrySector or "AI",
        "industry_sector": industrySector or "AI",
        "business_model": businessModel or "B2B",
        "stage": currentStage or "MVP",
        "current_stage": currentStage or "MVP",
        "funding_ask": cleaned_funding_ask,
        "amount_raising": cleaned_funding_ask,
        "use_of_funds": useOfFunds or "N/A",
        "pitch_deck_path": file_save_path or "N/A",
        "user_id": current_user.id
    }

    # Dynamic founder parameter mapping
    for key in ["founder_name", "founder_names", "founders"]:
        if hasattr(Startup, key):
            startup_data[key] = founderNames or "N/A"
            break

    # Only include keys that actually exist in the Startup database model
    final_data = {k: v for k, v in startup_data.items() if hasattr(Startup, k)}
    
    try:
        new_deal = Startup(**final_data)
        db.add(new_deal)
        db.commit()
        db.refresh(new_deal)
        
        # 6. Pipeline Vectorization Handshake
        ctx = f"{s_name} operating in {industrySector or 'AI'}. Problem: {problemStatement or 'N/A'} Solution: {solutionOverview or 'N/A'}"
        index_startup_application(startup_id=new_deal.id, text_content=ctx)
        
        return {"status": "success", "startup_id": new_deal.id}
        
    except Exception as e:
        db.rollback()
        print(f"Ingestion database script failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("", response_model=List[dict])
def get_all_pipeline_startups(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retrieves all incoming startup records from the database
    sorted by newest entries first. Restricted to Admin/Founder scopes.
    """
    if current_user.role.name not in ["Admin", "Founder"]:
        raise HTTPException(status_code=403, detail="Unauthorized access scope.")
        
    startups = db.query(Startup).order_by(Startup.id.desc()).all()
    
    output = []
    for s in startups:
        output.append({
            "id": s.id,
            "name": getattr(s, "name", None) or getattr(s, "startup_name", "Unnamed Venture"),
            "website": getattr(s, "website", None) or getattr(s, "website_url", "N/A"),
            "email": getattr(s, "email", None) or getattr(s, "contact_email", "N/A"),
            "phone": getattr(s, "phone", None) or getattr(s, "contact_number", "N/A"),
            "location": getattr(s, "location", None) or getattr(s, "hq_location", "N/A"),
            "sector": getattr(s, "sector", None) or getattr(s, "industry_sector", "AI"),
            "stage": getattr(s, "stage", None) or getattr(s, "current_stage", "MVP"),
            "funding_ask": float(getattr(s, "funding_ask", 0) or getattr(s, "amount_raising", 0) or 0),
            "problem_statement": getattr(s, "problem_statement", "N/A"),
            "solution_overview": getattr(s, "solution_overview", "N/A"),
            "pitch_deck_path": getattr(s, "pitch_deck_path", None)
        })
    return output


@router.get("/my-application")
def get_my_startup_application(
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    """
    Securely fetches the specific startup registration details for a user using their Auth Token.
    """
    startup = db.query(Startup).filter(Startup.user_id == current_user.id).first()
    
    if not startup:
        raise HTTPException(status_code=404, detail="No application found for this identity profile.")
    
    # Safely unpack model attributes regardless of custom schema names
    s_name = getattr(startup, "name", None) or getattr(startup, "startup_name", "Unnamed Venture")
    s_sector = getattr(startup, "sector", None) or getattr(startup, "industry_sector", "AI")
    s_ask = float(getattr(startup, "funding_ask", 0) or getattr(startup, "amount_raising", 0) or 0)
    s_stage = getattr(startup, "stage", None) or getattr(startup, "current_stage", "MVP")
    s_score = getattr(startup, "deal_score", 50)
    s_path = getattr(startup, "pitch_deck_path", "No file attached")
    
    # Pull out clean file name string for display if it's a structural file path
    filename = os.path.basename(s_path) if s_path and s_path != "N/A" else "Pitch_Deck.pdf"

    return {
        "name": s_name,
        "sector": s_sector,
        "funding_ask": s_ask,
        "stage": s_stage,
        "deal_score": s_score,
        "pitch_deck": filename
    }