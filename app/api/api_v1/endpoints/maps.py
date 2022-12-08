from fastapi import APIRouter, Depends
from db.schemas import schemas
from db import controller
from db.session import SessionLocal, engine
from sqlalchemy.orm import Session

router = APIRouter()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/maps/", response_model=list[schemas.MapQuery])
def read_maps(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    maps = controller.get_maps(db, skip=skip, limit=limit)
    return maps