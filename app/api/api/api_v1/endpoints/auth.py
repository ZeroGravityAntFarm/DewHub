from fastapi import APIRouter, Depends, HTTPException, status
from db.schemas import schemas
from fastapi.security import OAuth2PasswordRequestForm
from db.controller import authenticate_user, create_access_token
from db.session import SessionLocal
from datetime import timedelta
from sqlalchemy.orm import Session
from internal.auth import *

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db

    finally:
        db.close()

@router.post("/login", response_model=schemas.Token)
async def login_for_access_token(db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username, password, or account deactivated.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.name}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
