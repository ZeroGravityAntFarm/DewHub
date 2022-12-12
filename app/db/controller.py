from sqlalchemy.orm import Session
from db.models import models
from db.schemas import schemas
from internal.auth import verify_password, get_password_hash
from datetime import datetime, timedelta
from internal.auth import *
from jose import jwt

#Authenticate a user
def authenticate_user(db, username: str, password: str):
    user = get_user_auth(db, username)
    
    #Check if user exists
    if not user:
        return False
    
    #Check if account is active
    if not user.is_active:
        return False

    #Verify password against hashed password
    if not verify_password(password, user.hashed_password):
        return False

    return user


#Create a JWT access token
def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta

    else:
        expire = datetime.utcnow() + timedelta(minutes=15)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    return encoded_jwt


#Query user profile 
def get_user(db: Session, user_name: str):
    user = db.query(models.User).filter(models.User.name == user_name).first()
    user_data = db.query(*[c for c in models.User.__table__.c if c.name != 'hashed_password' and c.name != 'role' and c.name != 'email']).filter(models.User.name == user_name).first()

    if user:
        if user.prof_views != None:
            user.prof_views += 1
        else:
            user.prof_views = 1
        db.commit()

    return user_data


#Query user profile 
def get_user_auth(db: Session, user_name: str):
    user = db.query(models.User).filter(models.User.name == user_name).first()

    return user

#Get all users
def get_users(db: Session, skip: int = 0, limit: int = 100):

    return db.query(*[c for c in models.User.__table__.c if c.name != 'hashed_password' and c.name != 'role' and c.name != 'email']).offset(skip).limit(limit).all()


#Query user by email
def get_user_by_email(db: Session, email: str):

    return db.query(models.User).filter(models.User.email == email).first()


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


#Delete single map
def delete_map(db: Session, map_name: str, user: str):
    #Create a map object so we can find and delete the game variant it references
    map = db.query(models.Map).filter(models.Map.mapName == map_name and models.Map.owner_id == user.id).first()

    if map:
        #Wait for a valid map object to query its respective variant. 
        variant = db.query(models.Variant).filter(models.Variant.id == map.variant_id).first()
        if variant:
            if user:
                #Verify authenticated user is owner of requested map 
                if user.id == map.owner_id:
                    #Delete map and variant rows
                    db.delete(map)
                    db.delete(variant)

                    #Commit our changes to the database
                    db.commit()

                    return True, "Deleted successfully"
                else:
                    return False, "Unauthorized"
            else:
                return False, "User not found"
        else:
            return False, "Variant not found"
    else:
        return False, "Map not found"
    


#Get map file
def get_map_file(db: Session, map_name: str):
    map = db.query(models.Map).filter(models.Map.mapName == map_name).first()

    #This is bad and will run on every download. --v
    if map:
        if map.map_downloads != None:
            map.map_downloads += 1
        #This condition will never be met again after the first download. 
        else:
            map.map_downloads = 1
        db.commit()

    return map


#Get variant data
def get_variant(db: Session, map_name: str):
    map_query = db.query(models.Map).filter(models.Map.mapName == map_name).first()

    return db.query(*[c for c in models.Variant.__table__.c if c.name != 'variantFile']).filter(models.Variant.id == map_query.variant_id).first()


#Get variant file
def get_variant_file(db: Session, map_name: str):
    map_query = db.query(models.Map).filter(models.Map.mapName == map_name).first()

    return db.query(models.Variant).filter(models.Variant.id == map_query.variant_id).first()


#Get all maps for a specific user 
def get_user_maps(db: Session, user_name: str, skip: int = 0, limit: int = 100):
    #Lookup ID of requested user
    user = db.query(models.User).filter(models.User.name == user_name).first()

    return db.query(*[c for c in models.Map.__table__.c if c.name != 'mapFile' and c.name != 'id']).filter(models.Map.owner_id == user.id).offset(skip).limit(limit).all()


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