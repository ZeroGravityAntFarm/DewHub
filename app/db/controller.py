from sqlalchemy.orm import Session
from db.models import models
from db.schemas import schemas


def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_name(db: Session, name: str):
    return db.query(models.User).filter(models.User.name == name).first()


def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()


def create_user(db: Session, user: schemas.UserCreate):
    fake_hashed_password = user.password + "notreallyhashed"
    db_user = models.User(email=user.email, name=user.name, hashed_password=fake_hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_maps(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Map).offset(skip).limit(limit).all()


def create_user_map(db: Session, map: schemas.MapCreate, user_id: int):
    db_map = models.Map(mapName=map.mapName, 
                        mapAuthor=map.mapAuthor,
                        mapDescription=map.mapDescription,
                        mapId=map.mapId,
                        mapScnrObjectCount=map.mapScnrObjectCount,
                        mapTotalObject=map.mapTotalObject,
                        mapFile=bytes(map.contents),
                        owner_id=user_id)
    db.add(db_map)
    db.commit()
    db.refresh(db_map)
    return db_map