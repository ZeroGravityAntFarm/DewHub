from fastapi import APIRouter, HTTPException, Depends
from db.schemas import schemas
from db import controller
from db.session import SessionLocal
from sqlalchemy.orm import Session
from internal.auth import get_current_user

router = APIRouter()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    #Check if email already registered
    db_user = controller.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    #Check if username already registered
    db_user = controller.get_user(db, name=user.name)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already exists")

    return controller.create_user(db=db, user=user)


@router.get("/users/")
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = controller.get_users(db, skip=skip, limit=limit)
    return users


@router.get("/usermaps/{user_name}")
def read_users_maps(user_name: str, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = controller.get_user_maps(db, skip=skip, limit=limit, user_name=user_name)
    return users


@router.get("/users/{user_name}")
def read_user(user_name: str, db: Session = Depends(get_db)):
    db_user = controller.get_user(db, user_name=user_name)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@router.get("/me", response_model=schemas.User)
def get_me(user: str = Depends(get_current_user)):
    return user
