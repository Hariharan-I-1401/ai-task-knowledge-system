import traceback
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User, Role
from app.schemas.auth import UserRegister, UserLogin, Token
from app.services.auth_service import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["Authentication Operations"])

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register_user(user_data: UserRegister, db: Session = Depends(get_db)):
    try:
        # 1. Verify if user already exists in the database
        existing_user = db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="An account with this email address already exists."
            )

        # 2. Find matching system role profile id
        role = db.query(Role).filter(Role.name == user_data.role_name).first()
        if not role:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="Invalid system deployment role selection."
            )

        # 3. Encrypt raw password string safely
        hashed_pwd = hash_password(user_data.password)

        # 4. Instantiate and commit the new user record
        new_user = User(
            email=user_data.email,
            password_hash=hashed_pwd,
            role_id=role.id
        )
        db.add(new_user)
        db.commit()
        
        return {"message": "User profile successfully generated! You may now log in securely."}

    except HTTPException as http_ex:
        # Keep custom validation rejections (like existing email) working normally
        raise http_ex
        
    except Exception as e:
        # CRITICAL DEBUG LAYER: This intercepts silent 500 database execution failures
        print("\n" + "="*60)
        print("🚨 CRITICAL BACKEND REGISTRATION CRASH DETECTED 🚨")
        print(f"Error Message: {e}")
        print("="*60)
        traceback.print_exc()
        print("="*60 + "\n")
        
        # Pass a descriptive error trace back to the frontend alert component
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Internal Database Crash: {str(e)}"
        )


@router.post("/login", response_model=Token)
def login_user(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Incorrect username email or secure access password verification mismatch."
        )

    # Generate token with structural parameters bound inside
    access_token = create_access_token(data={"sub": user.email})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role.name
    }