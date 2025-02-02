from sqlalchemy.orm import Session
from fastapi import Request
from sqlalchemy import func
from db.models import models
from db.schemas import schemas
from internal.auth import verify_password, get_password_hash
from datetime import datetime, timedelta
from internal.auth import *
from jose import jwt
from sqlalchemy import or_, desc, asc
import shutil
import os
import json
import logging
import uvicorn
import hashlib

logger = logging.getLogger('uvicorn')


#Authenticate a user
def authenticate_user(db, username: str, password: str, client_host: str):
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
    
    user.last_login_ip = client_host
    user.last_login_time = datetime.utcnow()
    db.commit()

    return user


#Sync sqlalchemy models with database, creates missing tables
def sync_models():
    from db.session import Base
    from db.session import engine

    Base.metadata.create_all(engine)


#Query user profile 
def get_user_auth(db: Session, user_name: str):
    user = db.query(models.User).filter(models.User.name == user_name).first()

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
def get_user(db: Session, user_name: str, request: Request):
    user = db.query(models.User).filter(models.User.name == user_name).first()
    user_data = db.query(*[c for c in models.User.__table__.c if c.name != 'hashed_password' and c.name != 'role' and c.name != 'email' and c.name != 'last_login_ip']).filter(models.User.name == user_name).first()

    requestString = bytes(str(user_name) + request.client.host, 'utf-8')
    requestHash = hashlib.sha256(requestString).hexdigest()
    requestExists = db.query(models.Tracking).filter(models.Tracking.requestHash == requestHash).first() is not None

    if not requestExists:
        if user:
            if user.prof_views != None:
                user.prof_views += 1

            else:
                user.prof_views = 1

            newRequest = models.Tracking(requestHash=requestHash)
            db.add(newRequest)
            db.commit()

    return user_data


#Query user profile
def get_userId(db: Session, user_id: int):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    user_data = db.query(*[c for c in models.User.__table__.c if c.name != 'hashed_password' and c.name != 'role' and c.name != 'email' and c.name != 'last_login_ip']).filter(models.User.id == user_id).first()

    if user:
      return user_data


#Get all users
def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(*[c for c in models.User.__table__.c if c.name != 'hashed_password' and c.name != 'role' and c.name != 'email' and c.name != 'last_login_ip']).offset(skip).limit(limit).all()


#Query user by email
def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


#Create new user
def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = pwd_context.hash(user.password)
    db_user = models.User(email=user.email, name=user.name, hashed_password=hashed_password, rank="Recruit", about=" ")
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user


#Query user stats 
def get_user_stats(db: Session, user_id: int):

    map_count = db.query(models.Map).filter(models.Map.owner_id == user_id).filter(models.Map.notVisible == False).count()
    prefab_count = db.query(models.PreFab).filter(models.PreFab.owner_id == user_id).count()
    mod_count = db.query(models.Mod).filter(models.Mod.owner_id == user_id).filter(models.Mod.notVisible == False).count()


    user_stats = { 'maps': map_count, 
                   'prefabs': prefab_count,
                   'mods': mod_count }

    return user_stats


#Update user data
def update_user(db: Session, user: str, userName: str, userEmail: str, userAbout: str):
    user = db.query(models.User).filter(models.User.id == user.id).first()
    user.name = userName
    user.email = userEmail
    user.about = userAbout
    db.commit()

    return user


#Update user password
def update_user_password(db: Session, userPassword: int, user: str):
    user = db.query(models.User).filter(models.User.id == user.id).first()
    hashed_password = pwd_context.hash(userPassword)
    user.hashed_password = hashed_password
    db.commit()

    return user


#Update a user's rank. Fired on any map, prefab, or mod create call. 
def update_rank(user_id: int, db: Session):

    ranks = {"Recruit": 0, 
         "Apprentice": 1,
         "Apprentice II": 2,
         "Private": 3,
         "Private II": 4,
         "Corporal": 5,
         "Corporal II": 6,
         "Sergeant": 7,
         "Sergeant II": 8,
         "Sergant III": 9,
         "Gunnery Sergeant": 10,
         "Gunnery Sergeant II": 11,
         "Gunnery Sergeant III": 12,
         "Gunnery Sergeant Master": 13,
         "Lieutenant": 14,
         "Lieutenant II": 15,
         "Lieutenant III": 16,
         "First Lieutenant": 17,
         "Captain": 18,
         "Captain II": 19,
         "Captain III": 20,
         "Staff Captain": 21,
         "Major": 22,
         "Major II": 23,
         "Major III": 24,
         "Field Major": 25,
         "Commander": 26,
         "Commander II": 27,
         "Commander III": 28,
         "Strike Commander": 29,
         "Colonel": 30,
         "Colonel II": 31,
         "Colonel III": 32,
         "Force Colonel": 33,
         "Brigadier": 34,
         "Brigadier II": 35,
         "Brigadier III": 36,
         "Brigadier General": 37,
         "General": 38,
         "General II": 39,
         "General III": 40,
         "Five Star General": 45,
         "Engineer": 50,
         "Architect": 75,
         "Precursor": 100,}

    #Get user contributions
    map_count = db.query(models.Map).filter(models.Map.owner_id == user_id).count()
    prefab_count = db.query(models.PreFab).filter(models.PreFab.owner_id == user_id).count()
    mod_count = db.query(models.Mod).filter(models.Mod.owner_id == user_id).count()

    #Get user profile from db
    user = db.query(models.User).filter(models.User.id == user_id).first()

    count = map_count + prefab_count + mod_count

    for title, level in ranks.items():
        if count >= level:
            user.rank = title
        
        else:
            break
    
    db.commit()


#Get all maps
def get_maps(db: Session, version: str):
    #return db.execute('SELECT mapdata.id, mapdata."mapName", mapdata."mapDescription", mapdata."mapAuthor", mapdata."mapId", mapdata."mapScnrObjectCount", mapdata."mapTotalObject", mapdata."mapBudgetCount", mapdata."mapBaseMap", mapdata."map_downloads", mapdata."map_rating", mapdata."mapTags", mapdata."owner_id", mapdata."variant_id", mapdata."mapUserDesc", mapdata."time_created", mapdata."time_updated", mapdata."upvote", mapdata."downvote" FROM mapdata').all()
    
    if version == "all":
        return db.query(*[c for c in models.Map.__table__.c if c.name != 'mapFile']).filter(models.Map.notVisible == False).all()
    
    else:
        return db.query(*[c for c in models.Map.__table__.c if c.name != 'mapFile']).filter(models.Map.notVisible == False).filter(func.lower(models.Map.gameVersion).contains(version)).all()


#Get all variants
def get_variants(db: Session):
    return db.query(*[c for c in models.Variant.__table__.c if c.name != 'variantFile']).all()


#Get all variants
def get_variant_id(db: Session, variant_id: int):
    return db.query(*[c for c in models.Variant.__table__.c if c.name != 'variantFile']).filter(models.Variant.id == variant_id).first()


#Get map data
def get_map(db: Session, map_id: int):
    return db.query(*[c for c in models.Map.__table__.c if c.name != 'mapFile']).filter(models.Map.id == map_id).first()


#Update map
def update_map(db: Session, map_id: int, user: str, mapUserDesc: str, mapTags: str, mapName: str, mapVisibility: bool):
    map = db.query(models.Map).filter(models.Map.id == map_id and models.Map.owner_id == user.id).first()

    map.mapName = mapName 
    map.mapTags = mapTags
    map.mapUserDesc = mapUserDesc
    map.notVisible = mapVisibility
    
    db.commit()

    return map


#Update mod
def update_mod(db: Session, mod_id: int, user: str, modUserDesc: str, modTags: str, modName: str, modVisibility: bool):
    mod = db.query(models.Mod).filter(models.Mod.id == mod_id and models.Mod.owner_id == user.id).first()

    mod.modName = modName 
    mod.modTags = modTags
    mod.modDescription = modUserDesc
    mod.notVisible = modVisibility
    
    db.commit()

    return mod


#Get all maps by newest first
def get_newest(db: Session):
    return db.query(*[c for c in models.Map.__table__.c if c.name != 'mapFile']).filter(models.Map.notVisible == False).order_by(desc(models.Map.time_created)).all()


#Get all maps by newest first
def get_most_downloaded(db: Session):
    return db.query(*[c for c in models.Map.__table__.c if c.name != 'mapFile']).filter(models.Map.notVisible == False).order_by(desc(models.Map.map_downloads)).all()


#Get all maps by oldest first
def get_oldest(db: Session):
    return db.query(*[c for c in models.Map.__table__.c if c.name != 'mapFile']).filter(models.Map.notVisible == False).order_by(asc(models.Map.time_created)).all()


#Delete single map
def delete_map(db: Session, map_id: int, user: str):
    #Create a map object so we can find and delete the game variant it references
    map = db.query(models.Map).filter(models.Map.id == map_id and models.Map.owner_id == user.id).first()

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

                    #Update user's rank
                    update_rank(user.id, db)

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
    

#Delete user account (but not maps)
def delete_user(db: Session, user: str):
    user = db.query(models.User).filter(models.User.id == user.id).first()

    if user:
        db.delete(user)
        db.commit()

        return True, "Deleted successfully"

    else:
        return False, "User not found"


#Delete single prefab
def delete_prefab(db: Session, prefab_id: int, user: str):
    #Create a prefab object so we can find and delete
    prefab = db.query(models.PreFab).filter(models.PreFab.id == prefab_id and models.PreFab.owner_id == user.id).first()

    if prefab:
        if user:
            #Verify authenticated user is owner of requested map 
            if user.id == prefab.owner_id:
                #Delete map and variant rows
                db.delete(prefab)
                
                #Update user's rank
                update_rank(user.id, db)

                #Commit our changes to the database
                db.commit()

                return True, "Deleted successfully"

            else:
                return False, "Unauthorized"

        else:
            return False, "User not found"

    else:
        return False, "Prefab not found"


#Get prefab file
def get_prefab_file(db: Session, prefab_id: int):
    prefab = db.query(models.PreFab).filter(models.PreFab.id == prefab_id).first()

    #This is bad and will run on every download. --v
    if prefab:
        if prefab.downloads != None:
            prefab.downloads += 1

        #This condition will never be met again after the first download. 
        else:
            prefab.downloads = 1
        db.commit()

    return prefab


#Get map file
def get_map_file(db: Session, map_id: int, request: Request):
    map = db.query(models.Map).filter(models.Map.id == map_id).first()

    requestString = bytes(str(map_id) + request.client.host, 'utf-8')
    requestHash = hashlib.sha256(requestString).hexdigest()
    requestExists = db.query(models.Tracking).filter(models.Tracking.requestHash == requestHash).first() is not None

    if not requestExists:
        if map:
            if map.map_downloads != None:
                map.map_downloads += 1

            else:
                map.map_downloads = 1

            newRequest = models.Tracking(requestHash=requestHash)
            db.add(newRequest)
            db.commit()

    return map


#Get variant data
def get_variant(db: Session, map_id: int):
    map_query = db.query(models.Map).filter(models.Map.id == map_id).first()

    return db.query(*[c for c in models.Variant.__table__.c if c.name != 'variantFile']).filter(models.Variant.id == map_query.variant_id).first()


#Get variant file from map id
def get_variant_file(db: Session, map_id: int):
    map_query = db.query(models.Map).filter(models.Map.id == map_id).first()

    variant = db.query(models.Variant).filter(models.Variant.id == map_query.variant_id).first()

    if variant:
        if variant.downloads != None:
            variant.downloads += 1

        else:
            variant.downloads = 1

        db.commit()

    return variant


#Get variant file
def get_variant_id_file(db: Session, var_id: int):
    variant = db.query(models.Variant).filter(models.Variant.id == var_id).first()

    if variant:
        if variant.downloads != None:
            variant.downloads += 1

        else:
            variant.downloads = 1

        db.commit()

    return variant


#Get all maps for a specific user 
def get_user_maps(db: Session, user: str, skip: int = 0, limit: int = 100):
    return db.query(*[c for c in models.Map.__table__.c if c.name != 'mapFile']).filter(models.Map.owner_id == user.id).offset(skip).limit(limit).all()


#Get all maps for a specific user 
def get_user_maps_public(db: Session, user: str, skip: int = 0, limit: int = 100):
    return db.query(*[c for c in models.Map.__table__.c if c.name != 'mapFile']).filter(models.Map.owner_id == user.id).filter(models.Map.notVisible == False).offset(skip).limit(limit).all()


#Create new map entry
def create_user_map(db: Session, mapUserDesc: str, mapVisibility: bool, mapTags: str, map: schemas.MapCreate, user_id: int, variant_id: int):

    db_map = models.Map(mapName=map.mapName, 
                        mapAuthor=map.mapAuthor,
                        mapTags=mapTags,
                        mapDescription=map.mapDescription,
                        mapId=map.mapId,
                        mapScnrObjectCount=map.mapScnrObjectCount,
                        mapTotalObject=map.mapTotalObjectCount,
                        mapFile=bytes(map.contents),
                        notVisible=mapVisibility,
                        mapUserDesc=mapUserDesc,
                        variant_id=variant_id,
                        owner_id=user_id,
                        gameVersion=map.gameVersion,
                        map_downloads=0)
    db.add(db_map)
    db.execute("REFRESH MATERIALIZED VIEW mapdata")
    db.commit()
    db.refresh(db_map)

    #Update user's rank
    update_rank(user_id, db)

    #Get webhooks
    if not mapVisibility:
        webhooks = db.query(models.WebHook).filter(models.WebHook.webhooktype == "map" and models.WebHook.webhookenabled == True).all()
        
        return db_map, webhooks

    else:
        return db_map, None


#Get all mods for a specific user 
def get_user_mods(db: Session, user: str, skip: int = 0, limit: int = 100):
    return db.query(*[c for c in models.Mod.__table__.c if c.name != 'modFile']).filter(models.Mod.owner_id == user.id).offset(skip).limit(limit).all()


#Get all mods for a specific user 
def get_user_mods_public(db: Session, user: str, skip: int = 0, limit: int = 100):
    return db.query(*[c for c in models.Mod.__table__.c if c.name != 'modFile']).filter(models.Mod.owner_id == user.id).filter(models.Mod.notVisible == False).offset(skip).limit(limit).all()


#Case insensitive search for map name, author, or description
def search_mods(db: Session, search_text: str):
    mod_data = db.query(*[c for c in models.Mod.__table__.c]).filter(func.lower(models.Mod.modName).contains(search_text.lower()) | func.lower(models.Mod.modTags).contains(search_text.lower()) | func.lower(models.Mod.modAuthor).contains(search_text.lower()) | func.lower(models.Mod.modDescription).contains(search_text.lower())).filter(models.Mod.notVisible == False).all()

    if mod_data:
        return mod_data
    
    else:
        return None


#Create new mod entry
def create_user_mod(db: Session, modUserDescription: str, modTags: str, mod: schemas.ModCreate, user_id: int, modVisibility: bool):
    db_mod = models.Mod(modName=mod.modName, 
                        modAuthor=mod.modAuthor,
                        modTags=modTags,
                        modFileName=mod.modFile,
                        modFileSize=mod.modFileSize,
                        modDescription=mod.modDescription,
                        modUserDescription=modUserDescription,
                        modVersion=1,
                        notVisible=modVisibility,
                        time_updated=datetime.utcnow(),
                        owner_id=user_id,
                        gameVersion="0.7.1",
                        mod_downloads=0)
    db.add(db_mod)
    db.commit()
    db.refresh(db_mod)

    #Update user's rank
    update_rank(user_id, db)

    #Get webhooks
    if not modVisibility:
        webhooks = db.query(models.WebHook).filter(models.WebHook.webhooktype == "mod" and models.WebHook.webhookenabled == True).all()
        
        return db_mod, webhooks

    else:
        return db_mod, None


#Validate the owner for updating a .pak file
def validate_user_mod_file(db: Session, user_id: int, mod_id: int):
    mod = db.query(*[c for c in models.Mod.__table__.c if c.name != 'modFile']).filter(models.Mod.id == mod_id).filter(models.Mod.owner_id == user_id).first()

    if mod:
        return mod

    else:
        return False


#Update mod file size. We don't need user ID as calling function has already auth'd. 
#DO NOT USE THIS OUT OF THE ABOVE CONTEXT
def update_mod_size(db: Session, mod_id: int, newSize: int):
    mod = db.query(models.Mod).filter(models.Mod.id == mod_id).first()

    if mod:
        mod.modFileSize = newSize
        mod.modVersion += 1
        mod.time_updated=datetime.utcnow(),

        db.commit()

        return True

    else:
        return False


#Get all mods
def get_mods(db: Session, skip: int = 0, limit: int = 100):
    return db.query(*[c for c in models.Mod.__table__.c if c.name != 'modFile']).filter(models.Mod.notVisible == False).offset(skip).limit(limit).all()


#Get single mod
def get_mod(db: Session, mod_id: int):
    return db.query(*[c for c in models.Mod.__table__.c if c.name != 'modFile']).filter(models.Mod.id == mod_id).first()


#Delete single mod
def delete_mod(db: Session, mod_id: int, user: str):
    #Create a mod object so we can find and delete
    mod = db.query(models.Mod).filter(models.Mod.id == mod_id and models.Mod.owner_id == user.id).first()

    if mod:
        if user:
            #Verify authenticated user is owner of requested mod 
            if user.id == mod.owner_id:

                #Delete mod images
                if os.path.exists("/app/static/mods/" + str(mod.id)):
                    shutil.rmtree("/app/static/mods/" + str(mod.id))
                
                else:
                    pass
                
                #Delete mod binaries
                if os.path.exists("/app/static/mods/pak/" + str(mod.id)):
                    shutil.rmtree("/app/static/mods/pak/" + str(mod.id))
                
                else:
                    return False, "Mod files not found"
                
                #Delete mod row
                db.delete(mod)

                #Update user's rank
                update_rank(user.id, db)

                #Commit our changes to the database
                db.commit()

                return True, "Deleted successfully"

            else:
                return False, "Unauthorized"

        else:
            return False, "User not found"

    else:
        return False, "Mod not found"


#Get mod file
def get_mod_file(db: Session, mod_id: int, request: Request):
    mod = db.query(models.Mod).filter(models.Mod.id == mod_id).first()

    if mod:
        if mod.mod_downloads != None:
            mod.mod_downloads += 1

        else:
            mod.mod_downloads = 1

        db.commit()

    return mod


#Get all mods by newest first
def get_newest_mods(db: Session):
    return db.query(*[c for c in models.Mod.__table__.c]).order_by(desc(models.Mod.time_created)).filter(models.Mod.notVisible == False).all()


#Get all maps by newest first
def get_oldest_mods(db: Session):
    return db.query(*[c for c in models.Mod.__table__.c]).order_by(asc(models.Mod.time_created)).filter(models.Mod.notVisible == False).all()


#Create new variant entry
def create_user_variant(db: Session, variant: schemas.VariantCreate, user_id: int):
    db_variant = models.Variant(variantName=variant.variantName, 
                        variantAuthor=variant.variantAuthor,
                        variantDescription=variant.variantDescription,
                        variantFile=bytes(variant.contents),
                        variantFileName=variant.variantFile,
                        downloads=0,
                        owner_id=user_id)
    db.add(db_variant)
    db.commit()
    db.refresh(db_variant)

    return db_variant.id


#Create new prefab
def create_prefab(db: Session, prefab: schemas.PreFabCreate, user_id: int, prefabDesc: str, prefabTags: str):
    prefab = models.PreFab(prefabName=prefab.prefabName,
                    prefabAuthor=prefab.prefabAuthor,
                    prefabDescription=prefabDesc,
                    prefabFile=bytes(prefab.contents),
                    prefabFileName=prefab.prefabFile,
                    prefabTags=prefabTags,
                    downloads=0,
                    owner_id=user_id)

    db.add(prefab)
    db.commit()
    db.refresh(prefab)

    #Update user's rank
    update_rank(user_id, db)

    return prefab


#Get all prefabs
def get_prefabs(db: Session, skip: int = 0, limit: int = 100):
    return db.query(*[c for c in models.PreFab.__table__.c if c.name != 'prefabFile']).offset(skip).limit(limit).all()


#Get all prefabs for a specific user 
def get_user_prefabs(db: Session, user: str, skip: int = 0, limit: int = 100):
    return db.query(*[c for c in models.PreFab.__table__.c if c.name != 'prefabFile']).filter(models.PreFab.owner_id == user.id).offset(skip).limit(limit).all()


#Get prefab data
def get_prefab(db: Session, prefab_id: int):
    return db.query(*[c for c in models.PreFab.__table__.c if c.name != 'prefabFile']).filter(models.PreFab.id == prefab_id).first()


#Get variant file
def get_prefab_file(db: Session, prefab_id: int):
    prefab = db.query(models.PreFab).filter(models.PreFab.id == prefab_id).first()

    if prefab:
        if prefab.downloads != None:
            prefab.downloads += 1

        else:
            prefab.downloads = 1

        db.commit()

    return prefab


#Case insensitive search for map name, author, or description
def search_maps(db: Session, search_text: str):
    map_data = db.query(*[c for c in models.Map.__table__.c if c.name != 'mapFile']).filter(func.lower(models.Map.mapName).contains(search_text.lower()) | func.lower(models.Map.mapTags).contains(search_text.lower()) | func.lower(models.Map.mapAuthor).contains(search_text.lower()) | func.lower(models.Map.mapDescription).contains(search_text.lower())).filter(models.Map.notVisible == False).all()

    if map_data:
        return map_data


#Case insensitive search for map name, author, or description
def search_variants(db: Session, search_text: str):
    variant_data = db.query(*[c for c in models.Variant.__table__.c]).filter(func.lower(models.Variant.variantName).contains(search_text.lower()) | func.lower(models.Variant.variantTags).contains(search_text.lower()) | func.lower(models.Variant.variantAuthor).contains(search_text.lower()) | func.lower(models.Variant.variantDescription).contains(search_text.lower())).all()

    if variant_data:
        return variant_data


#Returns map downvotes and upvotes
def get_vote(db: Session, map_id: int):
    mapUpVotes = db.query(*[c for c in models.Vote.__table__.c if c.name != 'id']).filter_by(mapId=map_id).filter_by(vote=True).count()
    mapDownVotes = db.query(*[c for c in models.Vote.__table__.c if c.name != 'id']).filter_by(mapId=map_id).filter_by(vote=False).count()

    if not mapUpVotes:
        mapUpVotes = 0

    if not mapDownVotes:
        mapDownVotes = 0

    return mapUpVotes, mapDownVotes


#Creates a downvote or upvote
def create_vote(db: Session, map_id: int, userId: int, vote: bool):
    voteExists = db.query(*[c for c in models.Vote.__table__.c if c.name != 'id']).filter_by(mapId=map_id).filter_by(userId=userId).first() is not None

    if not voteExists:
        voteObject = models.Vote(userId=userId,
                           mapId=map_id,
                           vote=vote)
        db.add(voteObject)
        db.execute("REFRESH MATERIALIZED VIEW mapdata")
        db.commit()
        db.refresh(voteObject)

        return True, voteObject
    
    return False, "You can only vote once!"



#Get all webhooks owned by a user
def get_user_webhooks(db: Session, user: str):
    webhooks = db.query(*[c for c in models.WebHook.__table__.c if c.name != 'webhookurl']).filter(models.WebHook.owner_id == user.id).all()

    if webhooks:
        return webhooks


#Create new webhook for user
def create_webhook(db: Session, webhookurl: str, webhookenabled: bool, webhooktype: str, webhookname: str, user: str):
    webhook = models.WebHook(webhookname=webhookname,
                owner_id=user.id,
                webhookurl=webhookurl,
                webhookenabled=webhookenabled,
                webhooktype=webhooktype)

    db.add(webhook)
    db.commit()
    db.refresh(webhook)

    if webhook:
        return webhook


#Delete Webhook
def delete_webhook(db: Session, webhook_id: int, user: str):
    webhook = db.query(models.WebHook).filter(models.WebHook.id == webhook_id and models.WebHook.owner_id == user.id).first()

    if webhook:
        db.delete(webhook)
        db.commit()

        return True, "Deleted Successfully"

    else:
        return False, "Webhook not found"


#Update webhook
def update_webhook(db: Session, webhook_id: int, webhookname: str, webhookenabled: bool, webhooktype: str, user: str):
    webhook = db.query(models.WebHook).filter(models.WebHook.id == webhook_id and models.WebHook.owner_id == user.id).first()

    webhook.webhookname = webhookname
    webhook.webhooktype = webhooktype
    webhook.webhookenabled = webhookenabled

    db.commit()

    return webhook