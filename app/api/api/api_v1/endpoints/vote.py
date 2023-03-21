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

@router.get("/vote/{map_id}/")
def get_vote(map_id: int, db: Session = Depends(get_db)):
    if not map_id:
        raise HTTPException(status_code=400, detail="Missing map ID")

    mapUpVotes, mapDownVotes = controller.get_vote(db, map_id)

    return mapUpVotes, mapDownVotes

@router.post("/vote/{map_id}/{vote}")
def create_vote(map_id: int, vote: int, user: str = Depends(get_current_user), db: Session = Depends(get_db)):
    if not user:
        raise HTTPException(status_code=400, detail="Not Authenticated")

    if not map_id:
        raise HTTPException(status_code=400, detail="Missing map ID")
    
    if vote == 1:
        vote = True

    elif vote == 0:
        vote = False

    else: 
        raise HTTPException(status_code=400, detail="Expected 1 or 0")


    status, msg = controller.create_vote(db, map_id, user.id, vote)

    if status:
        return "Success!"

    if not status:
        return msg

