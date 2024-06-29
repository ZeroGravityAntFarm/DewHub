from fastapi import APIRouter, HTTPException, Depends, Form
from db.schemas import schemas
from db import controller
from db.session import SessionLocal
from sqlalchemy.orm import Session
from internal.auth import get_current_user
from email.utils import parseaddr

router = APIRouter()

# Dependency
def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()

#Create a new user
@router.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    
    email = parseaddr(user.email)

    if email[0] and email[1] == None:
        raise HTTPException(status_code=400, detail="Invalid email address")
    
    if user.email.isspace():
        raise HTTPException(status_code=400, detail="Invalid email address")

    if user.name.isspace():
        raise HTTPException(status_code=400, detail="Empty username")
    
    #Check if email already registered
    db_user = controller.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    #Check if username already registered
    db_user = controller.get_user(db, user_name=user.name)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already exists")

    return controller.create_user(db=db, user=user)


#Delete a user
@router.delete("/users/{user_id}")
def get_me(user: str = Depends(get_current_user), db: Session = Depends(get_db)):
    status, msg = controller.delete_user(db, user)
    
    if status:
        return msg

    if status == False:
        return msg


#Get all users
@router.get("/users/")
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = controller.get_users(db, skip=skip, limit=limit)

    return users


#Get all maps by a user
@router.get("/usermaps/")
def read_users_maps(skip: int = 0, limit: int = 1000, db: Session = Depends(get_db), user: str = Depends(get_current_user)):
    maps = controller.get_user_maps(db, skip=skip, limit=limit, user=user)

    return maps 


#Get all mods by a user
@router.get("/usermods/")
def read_users_mods(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), user: str = Depends(get_current_user)):
    mods = controller.get_user_mods(db, skip=skip, limit=limit, user=user)

    return mods


#Get all prefabs by a user
@router.get("/userprefabs/")
def read_users_prefabs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), user: str = Depends(get_current_user)):
    prefabs = controller.get_user_prefabs(db, skip=skip, limit=limit, user=user)

    return prefabs


#Get single user by ID
@router.get("/users/{user_id}")
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = controller.get_userId(db, user_id=user_id)

    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    return db_user


#Get single user by name
@router.get("/users/{user_name}")
def read_user_name(user_name: str, db: Session = Depends(get_db)):
    db_user = controller.get_user(db, user_name=user_name)

    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    return db_user


#Get user that is currently authenticated
@router.get("/me", response_model=schemas.User)
def get_me(user: str = Depends(get_current_user)):
    return user


#Get single user stats
@router.get("/users/stats/{user_id}")
def read_user_stats(user_id: int, db: Session = Depends(get_db)):
    user_stats = controller.get_user_stats(db, user_id=user_id)

    if user_stats is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user_stats


#Update User Data
@router.patch("/users")
def patch_user(userName: str = Form(" "), userAbout: str = Form(" "), userEmail: str = Form(...), db: Session = Depends(get_db), user: str = Depends(get_current_user)):
    newUser = controller.update_user(db, userName=userName, userEmail=userEmail, userAbout=userAbout, user=user)

    if newUser:
        return HTTPException(status_code=200, detail="Profile updated successfully!")
    
    else:
        raise HTTPException(status_code=400, detail="Failed to update profile")


#Update User Password
@router.patch("/users/password")
def patch_user_password(userPassword: str = Form(...), db: Session = Depends(get_db), user: str = Depends(get_current_user)):
    newUser = controller.update_user_password(db, userPassword=userPassword, user=user)

    if newUser:
        return HTTPException(status_code=200, detail="Password updated successfully!")
    
    else:
        raise HTTPException(status_code=400, detail="Failed to update password")


#Create a new webhook
@router.post("/user/webhook")
def create_webhook(webhookname: str = Form(" "), webhooktype: str = Form(" "), webhookenabled: bool = Form(...), webhookurl: str = Form(...), db: Session = Depends(get_db), user: str = Depends(get_current_user)):
    userWebhooks = controller.create_webhook(db, webhookname=webhookname, webhooktype=webhooktype, webhookenabled=webhookenabled, webhookurl=webhookurl, user=user)

    if userWebhooks:
        return "Success"

    else:
        return "Update failed"


#Update a webhook
@router.patch("/user/webhook/{webhook_id}")
def update_webhook(webhook_id: int, webhookname: str = Form(" "), webhooktype: str = Form(" "), webhookenabled: bool = Form(...), db: Session = Depends(get_db), user: str = Depends(get_current_user)):
    userWebhooks = controller.update_webhook(db, webhookname=webhookname, webhooktype=webhooktype, webhookenabled=webhookenabled, user=user, webhook_id=webhook_id)
    
    if userWebhooks:
        return "Success"

    else:
        return "Update failed"


#Delete a webhook
@router.delete("/user/webhook/{webhook_id}")
def delete_webhook(webhook_id: int, db: Session = Depends(get_db), user: str = Depends(get_current_user)):
    status, msg = controller.delete_webhook(db, user=user, webhook_id=webhook_id)

    return msg


#Get my webhooks
@router.get("/user/webhook/")
def read_user_webhooks(db: Session = Depends(get_db), user: str = Depends(get_current_user)):
    user_webhooks = controller.get_user_webhooks(db, user=user)

    if user_webhooks is None:
        raise HTTPException(status_code=404, detail="No webhooks found")
    
    return user_webhooks