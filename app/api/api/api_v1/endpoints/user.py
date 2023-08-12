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


@router.delete("/users/{user_id}")
def get_me(user: str = Depends(get_current_user), db: Session = Depends(get_db)):
    status, msg = controller.delete_user(db, user)
    
    if status:
        return msg

    if status == False:
        return msg


@router.get("/users/")
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = controller.get_users(db, skip=skip, limit=limit)
    return users


@router.get("/usermaps/{user_name}")
def read_users_maps(user_name: str, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = controller.get_user_maps(db, skip=skip, limit=limit, user_name=user_name)
    return users

@router.get("/users/{user_id}")
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = controller.get_userId(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@router.get("/users/{user_name}")
def read_user_name(user_name: str, db: Session = Depends(get_db)):
    db_user = controller.get_user(db, user_name=user_name)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@router.get("/me", response_model=schemas.User)
def get_me(user: str = Depends(get_current_user)):
    return user


#Patch User Data
@router.patch("/users")
def patch_user(userName: str = Form(" "), userEmail: str = Form(...), db: Session = Depends(get_db), user: str = Depends(get_current_user)):
    newUser = controller.update_user(db, userName=userName, userEmail=userEmail, user=user)

    if newUser:
        return HTTPException(status_code=200, detail="Profile updated successfully!")
    
    else:
        raise HTTPException(status_code=400, detail="Failed to update profile")


#Patch User Password
@router.patch("/users/password")
def patch_user_password(userPassword: str = Form(...), db: Session = Depends(get_db), user: str = Depends(get_current_user)):
    newUser = controller.update_user_password(db, userPassword=userPassword, user=user)

    if newUser:
        return HTTPException(status_code=200, detail="Password updated successfully!")
    
    else:
        raise HTTPException(status_code=400, detail="Failed to update password")