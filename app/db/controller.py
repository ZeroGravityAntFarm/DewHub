from sqlalchemy.orm import Session
from db.models import models
from db.schemas import schemas
from internal.auth import verify_password, get_password_hash
from datetime import datetime, timedelta
from internal.auth import *
from jose import jwt

def authenticate_user(db, username: str, password: str):
    user = get_user(db, username)
    if not user:
        return False

    if not verify_password(password, user.hashed_password):
        return False

    return user

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta

    else:
        expire = datetime.utcnow() + timedelta(minutes=15)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    return encoded_jwt

def get_user(db: Session, user_name: str):

    return db.query(models.User).filter(models.User.name == user_name).first()

def get_user_by_email(db: Session, email: str):

    return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_name(db: Session, name: str):

    return db.query(models.User).filter(models.User.name == name).first()

#Get all users
def get_users(db: Session, skip: int = 0, limit: int = 100):

    return db.query(models.User).offset(skip).limit(limit).all()

#Create new user
def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = pwd_context.hash(user.password)
    db_user = models.User(email=user.email, name=user.name, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user

#Get all maps
def get_maps(db: Session, skip: int = 0, limit: int = 100):

    return db.query(*[c for c in models.Map.__table__.c if c.name != 'mapFile']).offset(skip).limit(limit).all()

#Get map data
def get_map(db: Session, map_name: str):

    return db.query(*[c for c in models.Map.__table__.c if c.name != 'mapFile']).filter(models.Map.mapName == map_name).first()

#Get map file
def get_map_file(db: Session, map_name: str):

    return db.query(models.Map).filter(models.Map.mapName == map_name).first()

#Get variant data
def get_variant(db: Session, map_name: str):
    map_query = db.query(models.Map).filter(models.Map.mapName == map_name).first()

    return db.query(*[c for c in models.Variant.__table__.c if c.name != 'variantFile']).filter(models.Variant.id == map_query.variant_id).first()

#Get variant file
def get_variant_file(db: Session, map_name: str):
    map_query = db.query(models.Map).filter(models.Map.mapName == map_name).first()

    return db.query(models.Variant).filter(models.Variant.id == map_query.variant_id).first()

#Create new map entry
def create_user_map(db: Session, map: schemas.MapCreate, user_id: int, variant_id: int):
    db_map = models.Map(mapName=map.mapName, 
                        mapAuthor=map.mapAuthor,
                        mapDescription=map.mapDescription,
                        mapId=map.mapId,
                        mapScnrObjectCount=map.mapScnrObjectCount,
                        mapTotalObject=map.mapTotalObject,
                        mapFile=bytes(map.contents),
                        variant_id=variant_id,
                        owner_id=user_id)
    db.add(db_map)
    db.commit()
    db.refresh(db_map)

    return db_map

#Create new variant entry
def create_user_variant(db: Session, variant: schemas.VariantCreate, user_id: int):
    db_variant = models.Variant(variantName=variant.variantName, 
                        variantAuthor=variant.variantAuthor,
                        variantDescription=variant.variantDescription,
                        variantFile=bytes(variant.contents),
                        variantFileName=variant.variantFile,
                        owner_id=user_id)
    db.add(db_variant)
    db.commit()
    db.refresh(db_variant)

    return db_variant.id