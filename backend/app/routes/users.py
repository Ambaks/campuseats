from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.auth import verify_token
import firebase_admin
from firebase_admin import auth
from fastapi import HTTPException, Depends, APIRouter
from app.schemas import UserCreate
from app.models import User
from app.database import get_db, SessionLocal

router = APIRouter()

@router.get("/profile", dependencies=[Depends(verify_token)])
async def get_profile(user=Depends(verify_token)):
    return {"message": "Welcome!", "user": user}

@router.post("/register")
async def create_user(user: UserCreate, db: Session = Depends(get_db)):
    """Registers user in Firebase Auth & PostgreSQL"""
    try:
        # Create user in Firebase Auth
        new_user = auth.create_user(email=user.email, password=user.password, display_name=user.username)

        # Store user in PostgreSQL
        db_user = User(uid=new_user.uid, email=user.email, username=user.username, role="buyer")
        db.add(db_user)
        db.commit()

        return {"message": "User registered successfully", "uid": new_user.uid}
    except auth.EmailAlreadyExistsError:
        raise HTTPException(status_code=400, detail="Email already registered")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))